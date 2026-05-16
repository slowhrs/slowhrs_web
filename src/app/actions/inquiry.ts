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

  const { category, name, email, instagram, dateOrProject, details } = parsed.data;

  try {
    const supabase = createAdminClient();

    // DB schema (0001_initial.sql): category, name, email, instagram, details, status
    // NOTE: column is 'details' not 'message'. no 'date_or_project' column exists.
    const { error: dbError } = await supabase.from('inquiries').insert({
      category,
      name,
      email,
      instagram: instagram || null,
      details,
    });

    if (dbError) {
      console.error('[inquiry] supabase insert failed:', JSON.stringify(dbError));
      return { success: false, error: 'failed to save inquiry. try again.' };
    }

    // Send notification email to owner
    try {
      await sendInquiryNotification({ category, name, email, instagram, details });
    } catch (emailErr) {
      // DB write succeeded — don't fail the user if email fails
      console.error('[inquiry] resend notification failed:', emailErr);
    }

    return { success: true };
  } catch (err) {
    console.error('[inquiry] unexpected error:', err);
    return { success: false, error: 'something went wrong. try again.' };
  }
}
