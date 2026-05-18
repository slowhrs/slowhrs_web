import type { EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const ALLOWED_OTP_TYPES = new Set<EmailOtpType>([
  'email',
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
]);

function safeNextPath(value: string | null): string {
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

function parseOtpType(value: string | null): EmailOtpType | null {
  if (!value || !ALLOWED_OTP_TYPES.has(value as EmailOtpType)) return null;
  return value as EmailOtpType;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get('token_hash');
  const type = parseOtpType(searchParams.get('type'));
  const next = safeNextPath(searchParams.get('next'));

  if (tokenHash && type) {
    try {
      const supabase = await createServerClient();
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });

      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      console.error('[auth/confirm] token verification failed:', {
        message: error.message,
        type,
      });
    } catch (error) {
      console.error('[auth/confirm] verification unavailable:', error);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in?stale=1`);
}
