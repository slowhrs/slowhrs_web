'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { verifyAdminAction } from '@/lib/admin-auth';

export async function markAttendance(memberId: string, eventId: string) {
  await verifyAdminAction();
  const supabase = createAdminClient();
  const markedAt = new Date().toISOString();
  const { error } = await supabase.from('attendances').upsert(
    {
      member_id: memberId,
      event_id: eventId,
      status: 'attended',
      marked_at: markedAt,
    },
    { onConflict: 'member_id,event_id' }
  );

  if (error) {
    console.error('[admin/attendance] status upsert failed:', error);
    await supabase.from('attendances').insert({ member_id: memberId, event_id: eventId });
  }

  revalidatePath('/admin/attendance');
  revalidatePath('/admin/members');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function unmarkAttendance(memberId: string, eventId: string) {
  await verifyAdminAction();
  const supabase = createAdminClient();
  await supabase
    .from('attendances')
    .delete()
    .match({ member_id: memberId, event_id: eventId });
  revalidatePath('/admin/attendance');
  revalidatePath('/admin/members');
  revalidatePath('/dashboard');
  return { success: true };
}
