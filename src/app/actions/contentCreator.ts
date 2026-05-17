'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendInquiryNotification } from '@/lib/resend';

const ContentCreatorSchema = z.object({
  instagram: z.string().min(2).max(80),
  contentType: z.string().min(2).max(240),
});

function cleanInstagram(value: string) {
  const trimmed = value.trim();
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
}

export async function submitContentCreatorCasting(formData: FormData) {
  const parsed = ContentCreatorSchema.safeParse({
    instagram: formData.get('instagram'),
    contentType: formData.get('contentType'),
  });

  if (!parsed.success) {
    return { success: false, error: 'drop your ig and what content you make.' };
  }

  const instagram = cleanInstagram(parsed.data.instagram);
  const contentType = parsed.data.contentType.trim();
  const name = `content creator ${instagram}`;
  const email = 'casting@slowhrs.com';
  const details = `CONTENT CREATOR APPLICATION\n\ninstagram: ${instagram}\ncontent type: ${contentType}`;

  try {
    const supabase = createAdminClient();
    const { error: dbError } = await supabase.from('inquiries').insert({
      category: 'content_creator',
      name,
      email,
      instagram,
      details,
    });

    if (dbError) {
      console.error('[content-creator] supabase insert failed:', JSON.stringify(dbError));
      return { success: false, error: 'could not save it. try again.' };
    }

    try {
      await sendInquiryNotification({
        category: 'content creator',
        name,
        email,
        instagram,
        details,
      });
    } catch (emailErr) {
      console.error('[content-creator] notification failed:', emailErr);
    }

    return { success: true };
  } catch (err) {
    console.error('[content-creator] unexpected error:', err);
    return { success: false, error: 'connection slipped. try again.' };
  }
}
