'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendApplicationReceipt } from '@/lib/resend';

const ApplySchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  instagram: z.string().optional(),
  city: z.string().optional(),
  what_you_do: z.string().optional(),
  why_apply: z.string().min(1),
});

export async function submitApplication(formData: FormData) {
  const raw = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    instagram: formData.get('instagram') as string || undefined,
    city: formData.get('city') as string || 'Los Angeles',
    what_you_do: formData.get('what_you_do') as string || undefined,
    why_apply: formData.get('why_apply') as string,
  };

  const parsed = ApplySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'missing required fields.' };
  }

  const { full_name, email, instagram, city, what_you_do, why_apply } = parsed.data;

  try {
    const supabase = createAdminClient();

    // Check for existing application
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return { success: false, error: 'you\'ve already applied. we\'ll be in touch.' };
    }

    const { error: dbError } = await supabase.from('applications').insert({
      full_name,
      email,
      instagram: instagram || null,
      city: city || 'Los Angeles',
      what_you_do: what_you_do || null,
      why_apply,
    });

    if (dbError) {
      console.error('[apply] db error:', dbError);
      return { success: false, error: 'something went wrong. try again.' };
    }

    // Send receipt email
    await sendApplicationReceipt(email, full_name.split(' ')[0].toLowerCase());

    return { success: true };
  } catch (err) {
    console.error('[apply] error:', err);
    return { success: false, error: 'something went wrong. try again.' };
  }
}
