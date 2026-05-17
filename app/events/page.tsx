import { createAdminClient } from "@/lib/supabase/admin";
import type { EventData } from "@/components/events/EventTile";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SLOWHRS | Events",
  description: "The room. The recap. The RSVP. Private events in Los Angeles.",
};

// Fallback events when DB is empty or unavailable
const FALLBACK_EVENTS: EventData[] = [
  {
    id: "fallback-djmote",
    name: "DJ Battles — Moteoff",
    date: "2026-05-29T21:00:00-07:00",
    location: "Mid-City, Los Angeles",
    blurb: "4 djs. 4 rounds. the crowd decides.",
    partiful_url: "https://www.djmote.com/eventViewFromInviteLink?type=event_promoter&promoter_link_token=RLtkvbYxZcA7-wQQ5VoJzZYW8W2sdCql9DsmpTmaK5b6Oi4G0Z00qvjAYodsaVq-&organization_id=26&uuid=70ae9369-dff5-4088-b935-3c549b7b7243",
    cover_video: "/assets/events/block_party.mp4",
    produced_by_slowhrs: true,
    is_upcoming: true,
  },
  {
    id: "fallback-1",
    name: "VOGUE SAFARI: CONTENT PRE GAME",
    date: "2026-05-08T19:00:00-07:00",
    location: "Los Angeles",
    blurb: "luxury safari editorial. models, creatives, cameras. come ready.",
    partiful_url: null,
    cover_video: "/assets/events/block_party.mp4",
    produced_by_slowhrs: true,
    is_upcoming: false,
  },
  {
    id: "fallback-3",
    name: "Destroy Lonely · WYA Trap Rave",
    date: "2026-03-14T22:30:00-07:00",
    location: "Los Angeles",
    blurb: "we shot the room. destroy lonely on stage. crew on the floor.",
    partiful_url: null,
    cover_video: "/assets/events/destroy_lonely.mp4",
    produced_by_slowhrs: false,
    is_upcoming: false,
  },
  {
    id: "fallback-4",
    name: "NYE Recap",
    date: "2024-12-31T22:00:00-08:00",
    location: "Los Angeles",
    blurb: "the last night of the year. the crew was there. here's the tape.",
    partiful_url: null,
    cover_video: "/assets/events/newyears.mp4",
    produced_by_slowhrs: true,
    is_upcoming: false,
  },
  {
    id: "fallback-5",
    name: "Fast Life Campaign",
    date: "2026-11-20T14:00:00-08:00",
    location: "Hollywood, Los Angeles",
    blurb: "the fall clothing reel. shot on hollywood blvd.",
    partiful_url: null,
    cover_video: "/assets/drops/fast_life_reel.mp4",
    produced_by_slowhrs: true,
    is_upcoming: false,
  },
  {
    id: "fallback-6",
    name: "Runway · Spring Show",
    date: "2026-04-25T20:00:00-07:00",
    location: "Los Angeles",
    blurb: "the runway. one night. members in the front row.",
    partiful_url: null,
    cover_video: "/assets/videos/hero-recap.mp4",
    produced_by_slowhrs: true,
    is_upcoming: false,
  },
  {
    id: "fallback-7",
    name: "Holiday Capsule Shoot",
    date: "2024-12-20T16:00:00-08:00",
    location: "Hollywood, Los Angeles",
    blurb: "the christmas capsule. three looks. shot on film. one night only.",
    partiful_url: null,
    cover_video: "/assets/drops/christmas_drop.mp4",
    produced_by_slowhrs: true,
    is_upcoming: false,
  },
  {
    id: "fallback-8",
    name: "SS26 Runway Promo",
    date: "2026-04-20T20:00:00-07:00",
    location: "Los Angeles",
    blurb: "campaign reel. pre-show. runway energy loading.",
    partiful_url: null,
    cover_video: "/assets/events/recaps/fashion_show_promo.mp4",
    produced_by_slowhrs: true,
    is_upcoming: false,
  },
  {
    id: "fallback-9",
    name: "PJ Party",
    date: "2026-02-14T22:00:00-08:00",
    location: "Los Angeles",
    blurb: "private gathering. invited only. filmed after hours.",
    partiful_url: null,
    cover_video: "/assets/events/recaps/pj_party.mp4",
    produced_by_slowhrs: true,
    is_upcoming: false,
  },
  {
    id: "fallback-10",
    name: "Warehouse Sessions",
    date: "2025-09-14T22:00:00-07:00",
    location: "Los Angeles",
    blurb: "90 warehouse. private set. city archive.",
    partiful_url: null,
    cover_video: "/assets/events/recaps/warehouse_sessions.mp4",
    produced_by_slowhrs: true,
    is_upcoming: false,
  },
  {
    id: "fallback-11",
    name: "Eric Bellinger × DSRPT",
    date: "2025-07-18T22:00:00-07:00",
    location: "Noise Lab",
    blurb: "performance file. restricted room.",
    partiful_url: null,
    cover_video: "/assets/events/recaps/dsrpt_noiselab.mp4",
    produced_by_slowhrs: false,
    is_upcoming: false,
  },
  {
    id: "fallback-12",
    name: "Code: Devastation",
    date: "2025-06-06T22:00:00-07:00",
    location: "Los Angeles",
    blurb: "private ops. restricted access. evidence filed.",
    partiful_url: null,
    cover_video: "/assets/events/recaps/code_devastation.mp4",
    produced_by_slowhrs: true,
    is_upcoming: false,
  },
];

const posterFor = (src: string) => src.replace(/\.mp4$/, ".jpg");

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}.${String(d.getFullYear()).slice(-2)}`;
}

async function getEvents(): Promise<EventData[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("events")
      .select("id, name, date, location, blurb, partiful_url, cover_video, produced_by_slowhrs, is_upcoming")
      .eq("is_public", true)
      .order("date", { ascending: false })
      .limit(12);

    if (error || !data || data.length === 0) {
      return FALLBACK_EVENTS;
    }

    const merged = new Map(FALLBACK_EVENTS.map((event) => [event.name, event]));
    for (const event of data as EventData[]) {
      if (!merged.has(event.name)) {
        merged.set(event.name, event);
      }
    }

    return [...merged.values()].sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)));
  } catch {
    return FALLBACK_EVENTS;
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  if (events.length === 0) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center pt-[52px]">
        <div className="text-center">
          <p className="font-serif italic text-ink-dim text-lg">
            no events yet.
          </p>
          <a
            href="https://instagram.com/slowhrstv"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-faint hover:text-red transition-colors mt-4 inline-block"
          >
            follow @slowhrstv ↗
          </a>
        </div>
      </main>
    );
  }

  const nextEvent = events.find((event) => event.is_upcoming) || events[0];
  const archiveEvents = events.filter((event) => event.id !== nextEvent.id);

  return (
    <main className="min-h-screen bg-bg pt-[52px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            events.filter(e => e.is_upcoming).map(event => ({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": event.name,
              "startDate": event.date,
              "location": {
                "@type": "Place",
                "name": event.location,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": event.location
                }
              },
              "description": event.blurb || event.name,
              "organizer": {
                "@type": "Organization",
                "name": event.produced_by_slowhrs ? "SLOWHRS" : "Partner",
                "url": "https://slowhrs.com"
              }
            }))
          )
        }}
      />
      <section className="relative overflow-hidden border-b border-border px-5 py-16 md:px-12 md:py-24">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,rgba(230,0,22,0.18),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_25%)]" />
        <div className="relative z-10 mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[0.9fr_1.4fr]">
          <div className="flex flex-col justify-between border border-border bg-black/45 p-6 md:p-8">
            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-red">
                Archive / Evidence Room
              </p>
              <h1 className="font-serif text-[3rem] italic leading-none text-ink md:text-[5rem]">
                view archive.
              </h1>
              <p className="mt-6 max-w-[42ch] font-mono text-[10px] uppercase leading-[1.8] tracking-[0.12em] text-ink-dim">
                boxes of proof, RSVP passes, runway reels, nightlife files, and rooms that already happened.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 font-mono uppercase tracking-[0.2em]">
              <div className="border border-border bg-bg/80 p-3">
                <p className="text-[8px] text-ink-faint">files</p>
                <p className="mt-2 text-xl text-red">{events.length}</p>
              </div>
              <div className="border border-border bg-bg/80 p-3">
                <p className="text-[8px] text-ink-faint">city</p>
                <p className="mt-2 text-xl text-ink">LA</p>
              </div>
              <div className="border border-border bg-bg/80 p-3">
                <p className="text-[8px] text-ink-faint">status</p>
                <p className="mt-2 text-xl text-red">REC</p>
              </div>
            </div>
          </div>

          {nextEvent && (
            <div className="group relative min-h-[520px] overflow-hidden border border-red/35 bg-black">
              {nextEvent.cover_video && (
                <video
                  src={nextEvent.cover_video}
                  poster={posterFor(nextEvent.cover_video)}
                  muted
                  playsInline
                  loop
                  autoPlay
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover brightness-90 contrast-110 saturate-125 transition-transform duration-1000 group-hover:scale-[1.03]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20" />
              <div className="absolute left-5 top-5 border border-red bg-red px-3 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-bg">
                next room
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red">{formatDate(nextEvent.date)}</p>
                <h2 className="mt-3 font-serif text-[2.4rem] italic leading-none text-ink md:text-[4rem]">{nextEvent.name}</h2>
                <p className="mt-4 max-w-[48ch] font-serif text-lg italic leading-relaxed text-ink-dim">{nextEvent.blurb}</p>
                {nextEvent.partiful_url && (
                  <a href={nextEvent.partiful_url} target="_blank" rel="noopener noreferrer" className="brand-action mt-6 inline-flex border border-red/50 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.25em] text-red hover:bg-red hover:text-bg">
                    reserve access ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-12 md:py-16">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-red">file boxes</p>
            <h2 className="mt-2 font-serif text-[2.4rem] italic leading-none text-ink">rooms on record.</h2>
          </div>
          <p className="hidden max-w-[34ch] text-right font-mono text-[9px] uppercase leading-[1.7] tracking-[0.12em] text-ink-faint md:block">
            some are recaps. some are passes. all are evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {archiveEvents.map((event, index) => (
            <article key={`${event.id}-${event.name}`} className="group relative overflow-hidden border border-border bg-[#050505]">
              <div className="flex items-center justify-between border-b border-border bg-black/60 px-4 py-3">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-red">file {String(index + 1).padStart(2, "0")}</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-faint">{formatDate(event.date)}</span>
              </div>
              <div className="relative aspect-video overflow-hidden bg-black">
                {event.cover_video && (
                  <video
                    src={event.cover_video}
                    poster={posterFor(event.cover_video)}
                    muted
                    playsInline
                    loop
                    autoPlay
                    preload="metadata"
                    className="h-full w-full object-cover brightness-90 contrast-110 saturate-125 transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
                <div className="absolute left-3 top-3 h-2 w-2 animate-blink rounded-full bg-red shadow-[0_0_10px_var(--red)]" />
              </div>
              <div className="min-h-[190px] p-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="border border-ink/15 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.2em] text-ink-faint">{event.location || "Los Angeles"}</span>
                  <span className="border border-red/25 bg-red/5 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.2em] text-red">{event.is_upcoming ? "open" : "event passed"}</span>
                </div>
                <h3 className="font-serif text-[1.6rem] italic leading-none text-ink">{event.name}</h3>
                <p className="mt-3 line-clamp-3 font-mono text-[8px] uppercase leading-[1.7] tracking-[0.1em] text-ink-dim">{event.blurb}</p>
                {event.partiful_url ? (
                  <a href={event.partiful_url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex font-mono text-[9px] uppercase tracking-[0.22em] text-red hover:text-ink">
                    RSVP PASS ↗
                  </a>
                ) : (
                  <span className="mt-5 inline-flex font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
                    archived
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
