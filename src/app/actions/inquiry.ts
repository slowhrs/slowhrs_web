'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendInquiryNotification } from '@/lib/resend';

const InquirySchema = z.object({
  category: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  instagram: z.string().optional(),
  dateOrProject: z.string().optional(),
  details: z.string().min(1),
});

export async function submitInquiry(formData: FormData) {
  const raw = {
    category: formData.get('category') as string,
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    instagram: formData.get('instagram') as string || undefined,
    dateOrProject: formData.get('dateOrProject') as string || undefined,
    details: formData.get('details') as string,
  };

  const parsed = InquirySchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: 'missing required fields.' };
  }

  const { category, name, email, instagram, details } = parsed.data;

  try {
    // Insert into Supabase
    const supabase = createAdminClient();
    const { error: dbError } = await supabase.from('inquiries').insert({
      category,
      name,
      email,
      instagram: instagram || null,
      details,
    });

    if (dbError) {
      console.error('[inquiry] db error:', dbError);
      return { success: false, error: 'failed to save inquiry. try again.' };
    }

    // Send notification email
    await sendInquiryNotification({ category, name, email, instagram, details });

    return { success: true };
  } catch (err) {
    console.error('[inquiry] error:', err);
    return { success: false, error: 'something went wrong. try again.' };
  }
}
