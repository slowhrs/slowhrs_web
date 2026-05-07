'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { sendBroadcast } from '@/lib/resend';
import { revalidatePath } from 'next/cache';

export async function composeBroadcast(formData: FormData) {
  const subject = formData.get('subject') as string;
  const body = formData.get('body') as string;
  const recipientTier = formData.get('recipient_tier') as string;

  if (!subject || !body || !recipientTier) {
    throw new Error('Missing fields');
  }

  const supabase = createAdminClient();

  // Get members at or above tier
  let query = supabase.from('members').select('user_id, full_name');

  switch (recipientTier) {
    case 'architects':
      query = query.eq('is_architect', true);
      break;
    case 'inner+':
      query = query.or('is_architect.eq.true,and(hearts.gte.5,is_contributor.eq.true)');
      break;
    case 'regular+':
      query = query.or('is_architect.eq.true,and(hearts.gte.5,is_contributor.eq.true),hearts.gte.3');
      break;
    case 'room+':
      query = query.gte('hearts', 1);
      break;
    default: // 'all'
      break;
  }

  const { data: members } = await query;
  if (!members || members.length === 0) {
    throw new Error('No members in this tier');
  }

  // Get emails from auth
  const userIds = members.map((m: { user_id: string }) => m.user_id);
  const emails: string[] = [];

  for (const uid of userIds) {
    const { data } = await supabase.auth.admin.getUserById(uid);
    if (data?.user?.email) emails.push(data.user.email);
  }

  if (emails.length === 0) throw new Error('No valid emails found');

  const sentCount = await sendBroadcast(emails, subject, body);

  // Record broadcast
  await supabase.from('broadcasts').insert({
    subject,
    body,
    recipient_tier: recipientTier,
    sent_at: new Date().toISOString(),
    sent_count: sentCount,
  });

  revalidatePath('/admin/broadcasts');
  return { success: true, sentCount };
}
