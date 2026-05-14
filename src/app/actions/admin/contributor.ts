'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { verifyAdminAction } from '@/lib/auth';

export async function toggleContributor(memberId: string, value: boolean) {
  await verifyAdminAction();
  const supabase = createAdminClient();
  await supabase.from('members').update({ is_contributor: value }).eq('user_id', memberId);
  revalidatePath('/admin/members');
  return { success: true };
}

export async function toggleArchitect(memberId: string, value: boolean) {
  await verifyAdminAction();
  const supabase = createAdminClient();
  await supabase.from('members').update({ is_architect: value }).eq('user_id', memberId);
  revalidatePath('/admin/members');
  return { success: true };
}
