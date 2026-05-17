'use server';

import { revalidatePath } from 'next/cache';
import { verifyAdminAction } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ApprovedMemberStatus } from '@/lib/auth/member';

const MEMBER_STATUSES: ApprovedMemberStatus[] = ['tier_02', 'tier_03', 'tier_04', 'tier_05'];

export async function updateMemberAdminFields(formData: FormData) {
  await verifyAdminAction();

  const id = formData.get('id');
  const status = formData.get('status');
  const eventsAttendedRaw = formData.get('events_attended');

  if (typeof id !== 'string' || id.length === 0) {
    return { success: false, error: 'missing member id' };
  }

  if (typeof status !== 'string' || !MEMBER_STATUSES.includes(status as ApprovedMemberStatus)) {
    return { success: false, error: 'invalid tier' };
  }

  const events_attended = Number(eventsAttendedRaw);
  if (!Number.isInteger(events_attended) || events_attended < 0) {
    return { success: false, error: 'invalid attended count' };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('applications')
    .update({
      status,
      events_attended,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('[admin/member] update failed:', error);
    return { success: false, error: 'member update failed' };
  }

  revalidatePath('/admin/members');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateMemberAdminFieldsForm(formData: FormData) {
  const result = await updateMemberAdminFields(formData);
  if (!result.success) {
    console.error('[admin/member] form update failed:', result.error);
  }
}
