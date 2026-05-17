'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { verifyAdminAction } from '@/lib/admin-auth';
import { revalidatePath } from 'next/cache';

export async function sendChatMessage(
  userId: string,
  memberName: string,
  instagram: string | null,
  content: string,
  channel: string
) {
  if (!content.trim() || content.length > 500) {
    return { success: false, error: 'message too long or empty.' };
  }

  const supabase = createAdminClient();

  // Verify user is actually a member
  const { data: member } = await supabase
    .from('members')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (!member) {
    return { success: false, error: 'not a member.' };
  }

  const { error } = await supabase.from('chat_messages').insert({
    user_id: userId,
    member_name: memberName,
    instagram: instagram || null,
    content: content.trim(),
    channel,
  });

  if (error) {
    console.error('[chat] insert error:', error);
    return { success: false, error: 'failed to send.' };
  }

  return { success: true };
}

export async function pinMessage(messageId: string) {
  await verifyAdminAction();
  const supabase = createAdminClient();
  await supabase
    .from('chat_messages')
    .update({ is_pinned: true, pinned_at: new Date().toISOString() })
    .eq('id', messageId);
  revalidatePath('/community');
  return { success: true };
}

export async function unpinMessage(messageId: string) {
  await verifyAdminAction();
  const supabase = createAdminClient();
  await supabase
    .from('chat_messages')
    .update({ is_pinned: false, pinned_at: null })
    .eq('id', messageId);
  revalidatePath('/community');
  return { success: true };
}

export async function deleteMessage(messageId: string, userId?: string) {
  const supabase = createAdminClient();

  // If userId provided, verify they own the message (member self-delete)
  if (userId) {
    const { data: msg } = await supabase
      .from('chat_messages')
      .select('user_id')
      .eq('id', messageId)
      .single();

    if (!msg || msg.user_id !== userId) {
      return { success: false, error: 'not your message.' };
    }
  } else {
    // Admin delete
    await verifyAdminAction();
  }

  await supabase
    .from('chat_messages')
    .update({ is_deleted: true })
    .eq('id', messageId);

  return { success: true };
}
