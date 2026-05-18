'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { isApprovedMember } from '@/lib/auth/member-admin';

const SignInSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  next: z.string().optional(),
});

function safeNextPath(value: string | undefined): string {
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

function getMemberAuthOrigin(): string {
  const configuredOrigin = normalizeProductionOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (configuredOrigin) return configuredOrigin;

  return 'https://slowhrs.com';
}

function normalizeProductionOrigin(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

export async function requestMagicLink(formData: FormData) {
  const parsed = SignInSchema.safeParse({
    email: formData.get('email'),
    next: formData.get('next') || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: 'enter a valid email.' };
  }

  const { email } = parsed.data;
  const next = safeNextPath(parsed.data.next);
  const isMember = await isApprovedMember(email);
  if (!isMember) {
    return {
      success: true,
      message: 'if this email is on the list, a link is on the way.',
    };
  }

  const supabase = await createServerClient();
  const redirectUrl = new URL('/auth/callback', getMemberAuthOrigin());
  redirectUrl.searchParams.set('next', next);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl.toString(),
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error('[signIn] OTP send failed:', error);
    if (error.status === 429 || /rate limit|security purposes/i.test(error.message)) {
      return {
        success: false,
        error: 'too many login emails. wait a minute, then try again.',
        retryAfter: 60,
      };
    }

    return { success: false, error: 'something went wrong. try again.' };
  }

  return { success: true, message: 'check your inbox. link expires in 1 hour.' };
}
