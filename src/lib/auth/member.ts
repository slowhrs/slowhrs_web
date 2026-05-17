import 'server-only';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';

export type ApprovedMemberStatus = 'tier_02' | 'tier_03' | 'tier_04' | 'tier_05';

export type MemberProfile = {
  email: string;
  full_name: string;
  member_id: string;
  status: ApprovedMemberStatus;
  hearts_earned?: number;
};

export type MemberDashboardEvent = {
  id: string;
  name: string;
  date: string;
  blurb: string | null;
  partiful_url: string | null;
};

const APPROVED_STATUSES: ApprovedMemberStatus[] = ['tier_02', 'tier_03', 'tier_04', 'tier_05'];

export async function getMember(): Promise<MemberProfile | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('applications')
    .select('email, full_name, member_id, status')
    .eq('email', user.email.toLowerCase())
    .single();

  if (error || !data || !APPROVED_STATUSES.includes(data.status as ApprovedMemberStatus)) {
    return null;
  }

  return data as MemberProfile;
}

export async function requireMember(): Promise<MemberProfile> {
  const member = await getMember();
  if (!member) redirect('/sign-in');
  return member;
}

export async function isApprovedMember(email: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('applications')
    .select('status')
    .eq('email', email.toLowerCase().trim())
    .single();

  return Boolean(data && APPROVED_STATUSES.includes(data.status as ApprovedMemberStatus));
}

export async function getUpcomingMemberEvents(): Promise<MemberDashboardEvent[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('events')
    .select('id, name, date, blurb, partiful_url')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(5);

  return (data ?? []) as MemberDashboardEvent[];
}
