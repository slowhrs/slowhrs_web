'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { verifyAdminAction } from '@/lib/auth';

export async function markAttendance(memberId: string, eventId: string) {
  await verifyAdminAction();
  const supabase = createAdminClient();
  await supabase.from('attendances').insert({ member_id: memberId, event_id: eventId });
  revalidatePath('/admin/attendance');
  revalidatePath('/admin/members');
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
  return { success: true };
}
