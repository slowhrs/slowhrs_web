'use server';

import { z } from 'zod';
import { isApprovedMember } from '@/lib/auth/member-admin';
import { createServerClient } from '@/lib/supabase/server';

const VerifyOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  code: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, 'code must be 6 digits'),
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

export type VerifyOtpResult =
  | { ok: true; next: string }
  | { ok: false; error: string };

export async function verifyMemberOtp(formData: FormData): Promise<VerifyOtpResult> {
  const parsed = VerifyOtpSchema.safeParse({
    email: formData.get('email'),
    code: formData.get('code'),
    next: formData.get('next') || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: 'enter a valid email and 6-digit code.' };
  }

  const { email, code } = parsed.data;
  const next = safeNextPath(parsed.data.next);

  const isMember = await isApprovedMember(email);
  if (!isMember) {
    return { ok: false, error: 'that code did not work. request a fresh link.' };
  }

  try {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (error) {
      console.error('[verifyOtp] code verification failed:', {
        message: error.message,
      });
      return { ok: false, error: 'that code did not work. request a fresh link.' };
    }

    return { ok: true, next };
  } catch (err) {
    console.error('[verifyOtp] unexpected error:', err);
    return { ok: false, error: 'something went wrong. try again.' };
  }
}
