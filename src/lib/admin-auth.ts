import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'sh_admin';

function getAdminSecret(): string {
  return process.env.ADMIN_PASSWORD || 'default_insecure_secret_do_not_use_in_prod';
}

export async function generateAdminHash(): Promise<string> {
  const secret = getAdminSecret();
  const encoder = new TextEncoder();
  
  // Use Web Crypto API for Edge compatibility (middleware.ts)
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode('admin_authenticated')
  );
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyAdminAuth(token?: string): Promise<boolean> {
  let tokenToCheck = token;
  if (!tokenToCheck) {
    const cookieStore = await cookies();
    tokenToCheck = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  }
  
  if (!tokenToCheck) return false;

  const expectedHash = await generateAdminHash();
  
  // Note: timingSafeEqual is not available in Edge.
  // Standard string comparison is slightly vulnerable to timing attacks, 
  // but acceptable for this use-case given Web Crypto limits.
  return tokenToCheck === expectedHash;
}

export async function setAdminCookie() {
  const cookieStore = await cookies();
  const hash = await generateAdminHash();
  
  cookieStore.set(ADMIN_COOKIE_NAME, hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
