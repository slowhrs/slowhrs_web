import 'server-only';
import type { MemberProfile } from '@/lib/auth/member';
import { createAdminClient } from '@/lib/supabase/admin';

export type AttendanceStatus = 'intended' | 'attended' | 'no_show';

export type DashboardEvent = {
  id: string;
  name: string;
  date: string;
  location: string | null;
  blurb: string | null;
  partiful_url: string | null;
};

export type DashboardRsvp = {
  status: AttendanceStatus | null;
  rsvpd_at: string | null;
};

export type DashboardDrop = {
  id: string;
  title: string;
  note: string;
  href: string;
};

export type DashboardBroadcast = {
  subject: string;
  body: string;
  sent_at: string | null;
};

export type DashboardData = {
  nextEvent: DashboardEvent | null;
  rsvp: DashboardRsvp | null;
  attendedEvents: DashboardEvent[];
  memberFirstDrops: DashboardDrop[];
  latestBroadcast: DashboardBroadcast | null;
  joinedAt: string | null;
};

type AttendanceRow = {
  status?: AttendanceStatus | null;
  rsvpd_at?: string | null;
  marked_at?: string | null;
  events?: DashboardEvent | DashboardEvent[] | null;
};

const EMPTY_DASHBOARD_DATA: DashboardData = {
  nextEvent: null,
  rsvp: null,
  attendedEvents: [],
  memberFirstDrops: [],
  latestBroadcast: null,
  joinedAt: null,
};

function eventFromJoin(value: AttendanceRow['events']): DashboardEvent | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

async function getNextEvent(supabase: ReturnType<typeof createAdminClient>) {
  const { data, error } = await supabase
    .from('events')
    .select('id, name, date, location, blurb, partiful_url')
    .eq('is_public', true)
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[dashboard] next event fetch failed:', error);
    return null;
  }

  return (data ?? null) as DashboardEvent | null;
}

async function getRsvp(
  supabase: ReturnType<typeof createAdminClient>,
  member: MemberProfile,
  eventId: string
): Promise<DashboardRsvp | null> {
  const { data, error } = await supabase
    .from('attendances')
    .select('status, rsvpd_at, marked_at')
    .eq('member_id', member.user_id)
    .eq('event_id', eventId)
    .maybeSingle();

  if (!error) {
    const row = data as AttendanceRow | null;
    return row
      ? {
          status: row.status ?? 'attended',
          rsvpd_at: row.rsvpd_at ?? row.marked_at ?? null,
        }
      : null;
  }

  console.error('[dashboard] rsvp state fetch failed:', error);
  return null;
}

async function getAttendedEvents(
  supabase: ReturnType<typeof createAdminClient>,
  member: MemberProfile
): Promise<DashboardEvent[]> {
  const selectClause = 'status, rsvpd_at, marked_at, events(id, name, date, location, blurb, partiful_url)';
  const { data, error } = await supabase
    .from('attendances')
    .select(selectClause)
    .eq('member_id', member.user_id)
    .eq('status', 'attended')
    .order('marked_at', { ascending: false })
    .limit(4);

  if (!error) {
    return ((data ?? []) as AttendanceRow[])
      .map((row) => eventFromJoin(row.events))
      .filter((event): event is DashboardEvent => Boolean(event));
  }

  console.error('[dashboard] attended events fetch failed:', error);
  const fallback = await supabase
    .from('attendances')
    .select('marked_at, events(id, name, date, location, blurb, partiful_url)')
    .eq('member_id', member.user_id)
    .order('marked_at', { ascending: false })
    .limit(4);

  if (fallback.error) {
    console.error('[dashboard] attended events fallback failed:', fallback.error);
    return [];
  }

  return ((fallback.data ?? []) as AttendanceRow[])
    .map((row) => eventFromJoin(row.events))
    .filter((event): event is DashboardEvent => Boolean(event));
}

async function getLatestBroadcast(
  supabase: ReturnType<typeof createAdminClient>
): Promise<DashboardBroadcast | null> {
  const { data, error } = await supabase
    .from('broadcasts')
    .select('subject, body, sent_at')
    .not('sent_at', 'is', null)
    .order('sent_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[dashboard] broadcast fetch failed:', error);
    return null;
  }

  return (data ?? null) as DashboardBroadcast | null;
}

export async function getDashboardData(member: MemberProfile): Promise<DashboardData> {
  let supabase: ReturnType<typeof createAdminClient>;

  try {
    supabase = createAdminClient();
  } catch (error) {
    console.error('[dashboard] admin client unavailable:', error);
    return { ...EMPTY_DASHBOARD_DATA, joinedAt: member.created_at };
  }

  const nextEvent = await getNextEvent(supabase);
  const [rsvp, attendedEvents, latestBroadcast] = await Promise.all([
    nextEvent ? getRsvp(supabase, member, nextEvent.id) : Promise.resolve(null),
    getAttendedEvents(supabase, member),
    getLatestBroadcast(supabase),
  ]);

  return {
    nextEvent,
    rsvp,
    attendedEvents,
    memberFirstDrops: [],
    latestBroadcast,
    joinedAt: member.created_at,
  };
}
