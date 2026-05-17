import { getUpcomingMemberEvents, requireMember } from '@/lib/auth/member';
import Link from 'next/link';

const TIER_META = {
  tier_02: {
    label: 'the room',
    marker: 'tier 02',
    note: 'approved access. calendar first, room rules always.',
  },
  tier_03: {
    label: 'the regular',
    marker: 'tier 03',
    note: 'seen in the room. priority notes and tighter invites.',
  },
  tier_04: {
    label: 'the inner room',
    marker: 'tier 04',
    note: 'trusted contributor. closer access when the room gets small.',
  },
  tier_05: {
    label: 'the architects',
    marker: 'tier 05',
    note: 'invite-only tier. helps shape what happens next.',
  },
} as const;

export default async function DashboardPage() {
  const member = await requireMember();
  const events = await getUpcomingMemberEvents();
  const firstName = member.full_name.split(' ')[0].toLowerCase();
  const tier = TIER_META[member.status];

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden border border-border bg-[#050505] p-6 md:p-9">
        <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_18%_10%,rgba(230,0,22,0.22),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(237,237,235,0.07),transparent_24%)]" />
        <div className="relative z-10 space-y-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red">approved</p>
            <span className="border border-red/35 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-red">
              {tier.marker}
            </span>
          </div>

          <h2 className="font-serif text-[3rem] italic leading-none md:text-[5rem]">
            {firstName},<br />
            you are in {tier.label}.
          </h2>

          <p className="max-w-[46ch] font-mono text-[10px] uppercase leading-[1.8] tracking-[0.13em] text-ink-dim">
            {tier.note}
          </p>

          <div className="grid gap-4 font-mono text-[10px] uppercase tracking-[0.18em] md:grid-cols-3">
            <div className="border border-border bg-black/45 p-4">
              <p className="text-ink-dim">member id</p>
              <p className="mt-2 text-lg tracking-normal text-ink">{member.member_id}</p>
            </div>
            <div className="border border-border bg-black/45 p-4">
              <p className="text-ink-dim">tier</p>
              <p className="mt-2 text-lg tracking-normal text-ink">{tier.label}</p>
            </div>
            <div className="border border-border bg-black/45 p-4">
              <p className="text-ink-dim">events went</p>
              <p className="mt-2 text-lg tracking-normal text-ink">{member.events_attended}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 border border-border bg-black/25 p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-red">member calendar</p>
            <h3 className="mt-2 font-serif text-3xl italic lowercase">on the calendar.</h3>
          </div>
          <Link href="/events" className="brand-action border border-red/40 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-red hover:bg-red hover:text-bg">
            view archive ↗
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="font-serif text-lg italic text-ink-dim">
            quiet right now. next signal arrives by email.
          </p>
        ) : (
          <ul className="space-y-5">
            {events.map((event) => (
              <li key={event.id} className="border-b border-border pb-5 last:border-b-0 last:pb-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-red">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    timeZone: 'America/Los_Angeles',
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <h4 className="mt-2 font-serif text-2xl italic">{event.name}</h4>
                {event.blurb && (
                  <p className="mt-2 font-serif text-sm italic text-ink-dim">{event.blurb}</p>
                )}
                {event.partiful_url && (
                  <a
                    href={event.partiful_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-red transition-colors hover:text-red-bright"
                  >
                    rsvp ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border-t border-border pt-8">
        <p className="max-w-[60ch] font-serif text-sm italic text-ink-faint">
          the room is small. do not send this outside it. if your tier or event count looks wrong, reply to the approval email and we will fix the ledger.
        </p>
      </section>
    </div>
  );
}
