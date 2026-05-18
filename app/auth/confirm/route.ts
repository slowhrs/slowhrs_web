import type { EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/route';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_OTP_TYPES = new Set<EmailOtpType>([
  'email',
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
]);

const STALE_REDIRECT_PATH = '/sign-in?stale=1';

function safeNextPath(value: string | null | undefined): string {
  if (!value) return '/dashboard';
  if (!value.startsWith('/') || value.startsWith('//')) return '/dashboard';

  try {
    const url = new URL(value, 'https://slowhrs.com');
    const path = `${url.pathname}${url.search}${url.hash}`;
    if (url.pathname === '/' || url.pathname === '/events') return path;
    if (url.pathname === '/dashboard' || url.pathname.startsWith('/dashboard/')) return path;
  } catch {
    return '/dashboard';
  }

  return '/dashboard';
}

function parseOtpType(value: string | null | undefined): EmailOtpType | null {
  if (!value || !ALLOWED_OTP_TYPES.has(value as EmailOtpType)) return null;
  return value as EmailOtpType;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

function renderInterstitial({
  tokenHash,
  type,
  next,
  supabaseUrl,
}: {
  tokenHash: string;
  type: EmailOtpType;
  next: string;
  supabaseUrl: string | undefined;
}): string {
  const safeToken = escapeHtml(tokenHash);
  const safeType = escapeHtml(type);
  const safeNext = escapeHtml(next);
  const preconnect = supabaseUrl
    ? `<link rel="preconnect" href="${escapeHtml(supabaseUrl)}" crossorigin>`
    : '';

  // Form auto-submits via JS on real browsers. Link prefetchers / antivirus
  // scanners only do GET and don't execute JS, so they can't consume the
  // one-time token_hash. Visible button is the no-JS fallback.
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta name="referrer" content="no-referrer">
<title>entering the room — slowhrs</title>
${preconnect}
<style>
  :root { color-scheme: dark; }
  html, body { margin: 0; padding: 0; background: #050505; color: #ededeb; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  body { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
  .card { width: 100%; max-width: 480px; border: 1px solid #1f1f1d; background: #050505; padding: 36px 28px; position: relative; overflow: hidden; }
  .card::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 18% 8%, rgba(230,0,22,0.22), transparent 32%); opacity: 0.45; pointer-events: none; }
  .card::after { content: ""; position: absolute; inset-inline: 0; top: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(230,0,22,0.7), transparent); pointer-events: none; }
  .content { position: relative; z-index: 1; }
  .eyebrow { font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: #e60016; margin: 0; }
  h1 { font-family: Georgia, "Times New Roman", serif; font-style: italic; font-weight: 400; font-size: 2.4rem; line-height: 1; margin: 18px 0 0; color: #ededeb; }
  p.copy { margin-top: 18px; font-size: 10px; line-height: 1.8; letter-spacing: 0.14em; text-transform: uppercase; color: #9b9b97; max-width: 32ch; }
  form { margin-top: 28px; }
  button { width: 100%; background: transparent; border: 1px solid rgba(230,0,22,0.45); color: #e60016; padding: 14px 18px; font: inherit; font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; cursor: pointer; transition: background 120ms ease, color 120ms ease; }
  button:hover, button:focus-visible { background: #e60016; color: #050505; outline: none; }
  .foot { margin-top: 22px; font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; color: #6a6a66; }
  .foot a { color: #e60016; text-decoration: none; }
  noscript p { color: #e60016; }
</style>
</head>
<body>
  <div class="card">
    <div class="content">
      <p class="eyebrow">members only</p>
      <h1>entering the room.</h1>
      <p class="copy">verifying your one-time link. tap below if it does not advance on its own.</p>
      <form id="enter" method="POST" action="/auth/confirm">
        <input type="hidden" name="token_hash" value="${safeToken}">
        <input type="hidden" name="type" value="${safeType}">
        <input type="hidden" name="next" value="${safeNext}">
        <button type="submit">enter the room -&gt;</button>
      </form>
      <noscript><p class="foot">javascript is disabled. tap the button above to enter.</p></noscript>
      <p class="foot">trouble? <a href="/sign-in/code">enter your 6-digit code instead</a>.</p>
    </div>
  </div>
  <script>
    // Auto-submit so legit browsers go straight through. Bots/prefetchers
    // never run this and therefore never consume the one-time token.
    (function () {
      var form = document.getElementById('enter');
      if (!form) return;
      // Defer one tick so the page paints before navigating away.
      window.setTimeout(function () { form.submit(); }, 30);
    })();
  </script>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = parseOtpType(searchParams.get('type'));
  const next = safeNextPath(searchParams.get('next'));

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${origin}${STALE_REDIRECT_PATH}`, 303);
  }

  const html = renderInterstitial({
    tokenHash,
    type,
    next,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  });

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer',
    },
  });
}

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error('[auth/confirm] failed to parse form body:', error);
    return NextResponse.redirect(`${origin}${STALE_REDIRECT_PATH}`, 303);
  }

  const tokenHash = formData.get('token_hash');
  const typeValue = formData.get('type');
  const nextValue = formData.get('next');

  const tokenHashStr = typeof tokenHash === 'string' ? tokenHash : null;
  const type = parseOtpType(typeof typeValue === 'string' ? typeValue : null);
  const next = safeNextPath(typeof nextValue === 'string' ? nextValue : null);

  if (!tokenHashStr || !type) {
    return NextResponse.redirect(`${origin}${STALE_REDIRECT_PATH}`, 303);
  }

  const redirectResponse = NextResponse.redirect(`${origin}${next}`, 303);

  try {
    const supabase = createRouteHandlerClient(request, redirectResponse);
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHashStr,
      type,
    });

    if (!error) {
      return redirectResponse;
    }

    console.error('[auth/confirm] token verification failed:', {
      message: error.message,
      type,
    });
  } catch (error) {
    console.error('[auth/confirm] verification unavailable:', error);
  }

  return NextResponse.redirect(`${origin}${STALE_REDIRECT_PATH}`, 303);
}
