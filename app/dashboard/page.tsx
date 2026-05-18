import { rsvpToEventForm } from '@/app/actions/rsvp';
import { requireMember } from '@/lib/auth/member';
import { getDashboardData } from '@/lib/data/dashboard';
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

function formatDate(value: string | null | undefined) {
  if (!value) return 'not filed';

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value)).toLowerCase();
}

function formatSignalDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
  }).format(new Date(value)).toLowerCase();
}

export default async function DashboardPage() {
  const member = await requireMember();
  const data = await getDashboardData(member);
  const firstName = member.full_name.split(' ')[0].toLowerCase();
  const tier = TIER_META[member.status];
  const rsvpLocked = data.rsvp?.status === 'intended' || data.rsvp?.status === 'attended';

  return (
    <div className="space-y-5 md:space-y-8">
      <section className="relative overflow-hidden border border-border bg-[#050505]">
        <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_12%_8%,rgba(230,0,22,0.26),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(237,237,235,0.08),transparent_24%)]" />
        <div className="relative z-10 grid gap-6 p-5 md:grid-cols-[1.2fr_0.8fr] md:p-8">
          <div className="flex min-h-[360px] flex-col justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="border border-red/40 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-red">
                name on door
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-faint">
                {tier.marker}
              </span>
            </div>

            <div className="py-12 md:py-16">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-red">
                approved access
              </p>
              <h1 className="mt-4 font-serif text-[4.2rem] italic leading-[0.85] text-ink md:text-[7rem]">
                {firstName}.
              </h1>
              <p className="mt-6 max-w-[46ch] font-mono text-[10px] uppercase leading-[1.8] tracking-[0.13em] text-ink-dim">
                the room knows your name. keep the link quiet, watch the signal, move when the door opens.
              </p>
            </div>

            <p className="font-serif text-sm italic text-ink-faint">
              joined {formatDate(data.joinedAt)}
            </p>
          </div>

          <aside className="border border-border bg-black/55 p-5 md:p-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-red">member card</p>
            <div className="mt-8 space-y-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">holder</p>
                <p className="mt-2 font-serif text-3xl italic text-ink">{member.full_name.toLowerCase()}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 font-mono uppercase tracking-[0.18em]">
                <div className="border border-border bg-bg/70 p-3">
                  <p className="text-[8px] text-ink-faint">member id</p>
                  <p className="mt-2 text-sm text-ink">{member.member_id}</p>
                </div>
                <div className="border border-border bg-bg/70 p-3">
                  <p className="text-[8px] text-ink-faint">tier</p>
                  <p className="mt-2 text-sm text-ink">{tier.label}</p>
                </div>
                <div className="border border-border bg-bg/70 p-3">
                  <p className="text-[8px] text-ink-faint">events</p>
                  <p className="mt-2 text-sm text-ink">{member.events_attended}</p>
                </div>
                <div className="border border-border bg-bg/70 p-3">
                  <p className="text-[8px] text-ink-faint">status</p>
                  <p className="mt-2 text-sm text-red">inside</p>
                </div>
              </div>
              <p className="border-t border-border pt-5 font-serif text-sm italic leading-relaxed text-ink-dim">
                {tier.note}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="border border-border bg-black/35 p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-red">next signal</p>
              <h2 className="mt-3 font-serif text-4xl italic leading-none text-ink md:text-5xl">
                {data.nextEvent ? data.nextEvent.name.toLowerCase() : 'quiet right now.'}
              </h2>
            </div>
            <span className="border border-ink/15 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.22em] text-ink-faint">
              {data.nextEvent ? formatSignalDate(data.nextEvent.date) : 'no open door'}
            </span>
          </div>

          {data.nextEvent ? (
            <div className="mt-7 space-y-5">
              {data.nextEvent.blurb && (
                <p className="max-w-[58ch] font-serif text-lg italic leading-relaxed text-ink-dim">
                  {data.nextEvent.blurb.toLowerCase()}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <form action={rsvpToEventForm}>
                  <input type="hidden" name="event_id" value={data.nextEvent.id} />
                  <button
                    disabled={rsvpLocked}
                    className="brand-action border border-red/45 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.24em] text-red transition-colors hover:bg-red hover:text-bg disabled:cursor-not-allowed disabled:border-ink/15 disabled:text-ink-faint disabled:hover:bg-transparent"
                  >
                    {rsvpLocked ? 'rsvp filed' : 'rsvp intended'}
                  </button>
                </form>
                {data.nextEvent.partiful_url && (
                  <a
                    href={data.nextEvent.partiful_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint transition-colors hover:text-red"
                  >
                    external invite ↗
                  </a>
                )}
              </div>

              <p className="font-mono text-[8px] uppercase leading-[1.7] tracking-[0.16em] text-ink-faint">
                {data.rsvp?.status
                  ? `ledger says ${data.rsvp.status}.`
                  : 'tap once. the door list updates after the rsvp migration is live.'}
              </p>
            </div>
          ) : (
            <p className="mt-7 max-w-[48ch] font-serif text-lg italic text-ink-dim">
              next room arrives by email. nothing to force.
            </p>
          )}
        </article>

        <article className="border border-border bg-[#050505] p-5 md:p-7">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-red">evidence</p>
          <h2 className="mt-3 font-serif text-4xl italic leading-none text-ink">proof of room.</h2>
          {data.attendedEvents.length > 0 ? (
            <ul className="mt-7 space-y-4">
              {data.attendedEvents.map((event) => (
                <li key={event.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-red">
                    {formatDate(event.date)}
                  </p>
                  <p className="mt-2 font-serif text-xl italic text-ink">{event.name.toLowerCase()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-7 font-serif text-base italic leading-relaxed text-ink-dim">
              no filed attendance yet. when the room stamps your name, it lands here.
            </p>
          )}
        </article>
      </section>

      {data.memberFirstDrops.length > 0 && (
        <section className="border border-border bg-black/25 p-5 md:p-7">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-red">early access</p>
            <h2 className="mt-3 font-serif text-4xl italic leading-none text-ink">members first.</h2>
          </div>
          <ul className="mt-7 grid gap-4 md:grid-cols-2">
            {data.memberFirstDrops.map((drop) => (
              <li key={drop.id} className="border border-border bg-bg/70 p-4">
                <p className="font-serif text-2xl italic text-ink">{drop.title.toLowerCase()}</p>
                <p className="mt-2 font-mono text-[8px] uppercase leading-[1.7] tracking-[0.16em] text-ink-dim">
                  {drop.note}
                </p>
                <Link
                  href={drop.href}
                  className="mt-4 inline-flex font-mono text-[9px] uppercase tracking-[0.22em] text-red"
                >
                  open file ↗
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid gap-5 md:grid-cols-2">
        <article className="border border-border bg-black/30 p-5 md:p-7">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-red">transmission</p>
          {data.latestBroadcast ? (
            <div className="mt-5 space-y-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-faint">
                sent {formatDate(data.latestBroadcast.sent_at)}
              </p>
              <h2 className="font-serif text-3xl italic leading-none text-ink">
                {data.latestBroadcast.subject.toLowerCase()}
              </h2>
              <p className="line-clamp-4 font-serif text-base italic leading-relaxed text-ink-dim">
                {data.latestBroadcast.body.toLowerCase()}
              </p>
            </div>
          ) : (
            <p className="mt-5 font-serif text-base italic leading-relaxed text-ink-dim">
              no broadcast on the wire. inbox stays quiet until there is something real.
            </p>
          )}
        </article>

        <article className="border border-border bg-[#050505] p-5 md:p-7">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-red">footer</p>
          <p className="mt-5 max-w-[52ch] font-serif text-base italic leading-relaxed text-ink-dim">
            the room is small. do not send this outside it. if your tier, attendance, or rsvp state looks wrong, reply to the approval email and the ledger gets checked.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 font-mono text-[9px] uppercase tracking-[0.22em]">
            <Link href="/events" className="text-red transition-colors hover:text-red-bright">
              archive ↗
            </Link>
            <Link href="/" className="text-ink-faint transition-colors hover:text-red">
              front door ↗
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
