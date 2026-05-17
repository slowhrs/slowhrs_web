import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ApprovedMemberStatus } from '@/lib/auth/member';

const APPROVED_STATUSES: ApprovedMemberStatus[] = ['tier_02', 'tier_03', 'tier_04', 'tier_05'];

export async function isApprovedMember(email: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('applications')
    .select('status')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  return Boolean(data && APPROVED_STATUSES.includes(data.status as ApprovedMemberStatus));
}
