import 'server-only';
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type ApprovedMemberStatus = 'tier_02' | 'tier_03' | 'tier_04' | 'tier_05';

export type MemberProfile = {
  user_id: string;
  email: string;
  full_name: string;
  member_id: string;
  status: ApprovedMemberStatus;
  events_attended: number;
  created_at: string | null;
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

  const { data, error } = await supabase
    .from('applications')
    .select('email, full_name, member_id, status, events_attended, created_at')
    .eq('email', user.email.toLowerCase())
    .maybeSingle();

  if (error || !data || !APPROVED_STATUSES.includes(data.status as ApprovedMemberStatus)) {
    return null;
  }

  return {
    ...(data as Omit<MemberProfile, 'user_id'>),
    user_id: user.id,
  };
}

export async function requireMember(): Promise<MemberProfile> {
  const member = await getMember();
  if (!member) redirect('/sign-in');
  return member;
}

export async function getUpcomingMemberEvents(): Promise<MemberDashboardEvent[]> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('events')
    .select('id, name, date, blurb, partiful_url')
    .eq('is_public', true)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(5);

  return (data ?? []) as MemberDashboardEvent[];
}
