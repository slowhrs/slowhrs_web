// One-off prod validator for the magic-link interstitial.
//
// Approach (no service-role key required):
//   1. Use the anon client to call signInWithOtp({ shouldCreateUser: false })
//      for slowhrs@gmail.com. Supabase will mint a fresh recovery_token in
//      auth.users for that email. (We do not care about the email Supabase
//      sends -- we read the token straight from the DB via the caller's
//      Supabase MCP.)
//   2. The caller (this script's invoker) then queries
//      `SELECT recovery_token FROM auth.users WHERE email='slowhrs@gmail.com'`
//      via the Supabase MCP and pastes it back in via env TOKEN_HASH.
//   3. The script then exercises the new /auth/confirm flow on production:
//        a. GET /auth/confirm?token_hash=...&type=magiclink&next=/dashboard
//           -> expect 200 + HTML form with method=POST (no /verify call).
//        b. POST /auth/confirm with that body -> expect 303 to /dashboard
//           plus a sb-*-auth-token Set-Cookie.
//        c. GET /dashboard with those cookies -> expect 200 + member content.

import { createClient } from '@supabase/supabase-js';

const SITE = process.env.VALIDATE_SITE || 'https://slowhrs.com';
const EMAIL = process.env.VALIDATE_EMAIL || 'slowhrs@gmail.com';
const MODE = process.env.MODE || 'request'; // 'request' or 'verify'

function need(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`missing env: ${name}`);
    process.exit(2);
  }
  return v;
}

const SUPABASE_URL = need('NEXT_PUBLIC_SUPABASE_URL');
const ANON_KEY = need('NEXT_PUBLIC_SUPABASE_ANON_KEY');

function summarizeHeaders(h) {
  const out = {};
  for (const [k, v] of h.entries()) {
    if (
      /^(content-type|location|cache-control|set-cookie|x-vercel-id|x-robots-tag)$/i.test(
        k
      )
    ) {
      out[k] = v.length > 240 ? v.slice(0, 240) + '…' : v;
    }
  }
  return out;
}

async function requestPhase() {
  const anon = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`[validate] requesting magic link for ${EMAIL}…`);
  const { data, error } = await anon.auth.signInWithOtp({
    email: EMAIL,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${SITE}/auth/confirm?next=/dashboard`,
    },
  });
  if (error) {
    console.error('[validate] signInWithOtp failed:', error);
    process.exit(1);
  }
  console.log('[validate] signInWithOtp accepted', data);
  console.log(
    '[validate] NEXT STEP: read recovery_token via Supabase MCP, then run MODE=verify TOKEN_HASH=... node scripts/validate-magiclink.mjs'
  );
}

async function verifyPhase() {
  const tokenHash = need('TOKEN_HASH');
  console.log(
    `[validate] using token_hash=${tokenHash.slice(0, 10)}… site=${SITE}`
  );

  const confirmUrl = new URL('/auth/confirm', SITE);
  confirmUrl.searchParams.set('token_hash', tokenHash);
  confirmUrl.searchParams.set('type', 'magiclink');
  confirmUrl.searchParams.set('next', '/dashboard');

  console.log('[validate] GET', confirmUrl.toString());
  const getRes = await fetch(confirmUrl, { redirect: 'manual' });
  console.log('[validate] GET status:', getRes.status);
  console.log('[validate] GET headers:', summarizeHeaders(getRes.headers));
  const html = await getRes.text();
  if (getRes.status !== 200) {
    console.error('[validate] FAIL: GET did not return 200 interstitial');
    process.exit(1);
  }
  if (!/method="POST"/i.test(html) || !/name="token_hash"/i.test(html)) {
    console.error('[validate] FAIL: GET HTML missing POST form / token_hash');
    console.error(html.slice(0, 800));
    process.exit(1);
  }
  console.log('[validate] OK: interstitial HTML rendered with POST form');

  console.log('[validate] POST /auth/confirm with token_hash…');
  const body = new URLSearchParams();
  body.set('token_hash', tokenHash);
  body.set('type', 'magiclink');
  body.set('next', '/dashboard');
  const postRes = await fetch(new URL('/auth/confirm', SITE), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    redirect: 'manual',
  });
  console.log('[validate] POST status:', postRes.status);
  console.log('[validate] POST headers:', summarizeHeaders(postRes.headers));
  const setCookie = postRes.headers.get('set-cookie') || '';
  const location = postRes.headers.get('location') || '';
  if (![302, 303, 307].includes(postRes.status)) {
    console.error('[validate] FAIL: POST did not redirect, body:');
    console.error((await postRes.text()).slice(0, 800));
    process.exit(1);
  }
  if (!location.endsWith('/dashboard')) {
    console.error('[validate] FAIL: POST redirected to', location);
    process.exit(1);
  }
  if (!/sb-[\w-]+-auth-token/i.test(setCookie)) {
    console.error(
      '[validate] FAIL: POST did not set sb-*-auth-token cookie. set-cookie=',
      setCookie.slice(0, 400)
    );
    process.exit(1);
  }
  console.log('[validate] OK: POST set supabase auth cookie + 303 -> /dashboard');

  console.log('[validate] following redirect to /dashboard with new cookies…');
  const cookiePairs = setCookie
    .split(/,\s*(?=[A-Za-z0-9_-]+=)/)
    .map((c) => c.split(';')[0].trim())
    .filter(Boolean);
  const cookieHeader = cookiePairs.join('; ');
  const dashRes = await fetch(new URL('/dashboard', SITE), {
    headers: { Cookie: cookieHeader },
    redirect: 'manual',
  });
  console.log('[validate] /dashboard status:', dashRes.status);
  console.log('[validate] /dashboard headers:', summarizeHeaders(dashRes.headers));
  const dashHtml = await dashRes.text();
  if (dashRes.status !== 200) {
    console.error('[validate] FAIL: /dashboard not 200 with session cookie');
    console.error(dashHtml.slice(0, 1000));
    process.exit(1);
  }
  const hasMemberCard =
    /member id/i.test(dashHtml) ||
    /the room/i.test(dashHtml) ||
    /welcome/i.test(dashHtml);
  if (!hasMemberCard) {
    console.error('[validate] FAIL: /dashboard did not render member content');
    console.error(dashHtml.slice(0, 1500));
    process.exit(1);
  }
  console.log('[validate] OK: /dashboard rendered with member content');
  console.log('[validate] DONE — interstitial flow works end-to-end');
}

(async () => {
  if (MODE === 'request') {
    await requestPhase();
  } else if (MODE === 'verify') {
    await verifyPhase();
  } else {
    console.error('MODE must be request or verify');
    process.exit(2);
  }
})().catch((e) => {
  console.error('[validate] unexpected error', e);
  process.exit(1);
});
