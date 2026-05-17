'use server';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';
import { isApprovedMember } from '@/lib/auth/member';

const SignInSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
});

export async function requestMagicLink(formData: FormData) {
  const parsed = SignInSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { success: false, error: 'enter a valid email.' };
  }

  const { email } = parsed.data;
  const isMember = await isApprovedMember(email);
  if (!isMember) {
    return {
      success: true,
      message: 'if this email is on the list, a link is on the way.',
    };
  }

  const supabase = await createServerClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://slowhrs.com';
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin.replace(/\/$/, '')}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error('[signIn] OTP send failed:', error);
    return { success: false, error: 'something went wrong. try again.' };
  }

  return { success: true, message: 'check your inbox. link expires in 1 hour.' };
}
