import { getUpcomingMemberEvents, requireMember } from '@/lib/auth/member';

const TIER_LABELS = {
  tier_02: 'the room',
  tier_03: 'the regular',
  tier_04: 'the inner room',
  tier_05: 'the architects',
} as const;

export default async function DashboardPage() {
  const member = await requireMember();
  const events = await getUpcomingMemberEvents();
  const firstName = member.full_name.split(' ')[0].toLowerCase();

  return (
    <div className="space-y-16">
      <section className="space-y-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red">approved</p>
        <h2 className="font-serif text-[3rem] italic leading-none md:text-[5rem]">
          {firstName},<br />
          you are in {TIER_LABELS[member.status]}.
        </h2>

        <div className="grid gap-4 font-mono text-[10px] uppercase tracking-[0.18em] md:grid-cols-3">
          <div className="border border-border bg-black/35 p-4">
            <p className="text-ink-dim">id</p>
            <p className="mt-2 text-lg tracking-normal text-ink">{member.member_id}</p>
          </div>
          <div className="border border-border bg-black/35 p-4">
            <p className="text-ink-dim">tier</p>
            <p className="mt-2 text-lg tracking-normal text-ink">{TIER_LABELS[member.status]}</p>
          </div>
          <div className="border border-border bg-black/35 p-4">
            <p className="text-ink-dim">hearts</p>
            <p className="mt-2 text-lg tracking-normal text-ink">manual</p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="font-serif text-3xl italic lowercase">on the calendar.</h3>
        {events.length === 0 ? (
          <p className="font-serif text-lg italic text-ink-dim">
            quiet right now. next signal arrives by email.
          </p>
        ) : (
          <ul className="space-y-5">
            {events.map((event) => (
              <li key={event.id} className="border-b border-border pb-5">
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
                    className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-red"
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
        <p className="font-serif text-sm italic text-ink-faint">
          the room is small. do not send this outside it.
        </p>
      </section>
    </div>
  );
}
