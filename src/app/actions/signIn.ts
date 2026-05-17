'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { isApprovedMember } from '@/lib/auth/member-admin';

const SignInSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  next: z.string().optional(),
});

function safeNextPath(value: string | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard';
  }

  return value;
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
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://slowhrs.com';
  const redirectUrl = new URL('/auth/callback', origin.replace(/\/$/, ''));
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
    return { success: false, error: 'something went wrong. try again.' };
  }

  return { success: true, message: 'check your inbox. link expires in 1 hour.' };
}
