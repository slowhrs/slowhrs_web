import { createAdminClient } from "@/lib/supabase/admin";
import type { EventData } from "@/components/events/EventTile";
import EventPhotoCarousel from "@/components/EventPhotoCarousel";
import Footer from "@/components/Footer";
import { EVENT_PHOTO_SETS, getPhotoUrls } from "@/lib/data/eventPhotos";

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
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }).formatToParts(new Date(dateStr));
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.month}.${byType.day}.${byType.year}`;
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
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_18%_18%,rgba(230,0,22,0.24),transparent_28%),radial-gradient(circle_at_82%_0%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(135deg,rgba(230,0,22,0.08),transparent_35%,rgba(237,237,235,0.03))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.025)_50%,rgba(255,255,255,0)_50%)] bg-[length:100%_5px] opacity-20" />
        <div className="relative z-10 mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[0.9fr_1.4fr]">
          <div className="flex flex-col justify-between border border-border bg-black/55 p-6 shadow-[0_0_60px_rgba(230,0,22,0.08)] md:p-8">
            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.35em] text-red">
                slowhrs files / evidence room
              </p>
              <h1 className="font-serif text-[3rem] italic leading-none text-ink md:text-[5rem]">
                archive room.
              </h1>
              <p className="mt-6 max-w-[42ch] font-mono text-[10px] uppercase leading-[1.8] tracking-[0.12em] text-ink-dim">
                not a gallery. a black-box log of rooms, runway smoke, flyers, passes, and the clips that prove the night existed.
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
            <div className="group relative min-h-[560px] overflow-hidden border border-red/40 bg-black shadow-[0_0_80px_rgba(230,0,22,0.13)]">
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
                next room / may 29
              </div>
              <div className="absolute right-5 top-5 border border-ink/20 bg-black/70 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.25em] text-ink-dim">
                crowd decides
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
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-red">case boxes</p>
            <h2 className="mt-2 font-serif text-[2.4rem] italic leading-none text-ink">the footage has receipts.</h2>
          </div>
          <p className="hidden max-w-[34ch] text-right font-mono text-[9px] uppercase leading-[1.7] tracking-[0.12em] text-ink-faint md:block">
            tapes, flyers, rooms, rejects, wins. everything filed after dark.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {archiveEvents.map((event, index) => (
            <article key={`${event.id}-${event.name}`} className="group relative overflow-hidden border border-border bg-[#050505] transition-all duration-300 hover:-translate-y-1 hover:border-red/35 hover:shadow-[0_24px_70px_rgba(230,0,22,0.11)]">
              <div className="flex items-center justify-between border-b border-border bg-black/60 px-4 py-3">
                <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-red">case {String(index + 1).padStart(2, "0")}</span>
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
                <div className="absolute bottom-3 right-3 border border-ink/15 bg-black/70 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.2em] text-ink-faint">
                  filed
                </div>
              </div>
              <div className="min-h-[190px] p-5">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="border border-ink/15 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.2em] text-ink-faint">{event.location || "Los Angeles"}</span>
                  <span className="border border-red/25 bg-red/5 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.2em] text-red">{event.is_upcoming ? "open" : "event passed"}</span>
                </div>
                <h3 className="font-serif text-[1.6rem] italic leading-none text-ink">{event.name}</h3>
                <p className="mt-3 line-clamp-3 font-mono text-[8px] uppercase leading-[1.7] tracking-[0.1em] text-ink-dim">{event.blurb}</p>
                {event.partiful_url ? (
                  <a href={event.partiful_url} target="_blank" rel="noopener noreferrer" className="brand-action mt-5 inline-flex border border-red/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-red hover:bg-red hover:text-bg">
                    claim pass ↗
                  </a>
                ) : (
                  <span className="mt-5 inline-flex font-mono text-[9px] uppercase tracking-[0.22em] text-ink-faint">
                    sealed in archive
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-black/35 px-5 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-red">photo evidence</p>
              <h2 className="mt-2 font-serif text-[2.4rem] italic leading-none text-ink">still frames, moving proof.</h2>
            </div>
            <p className="hidden max-w-[34ch] text-right font-mono text-[9px] uppercase leading-[1.7] tracking-[0.12em] text-ink-faint md:block">
              contact sheets from private rooms, shoots, and runway files. no clean version.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {EVENT_PHOTO_SETS.map((set, index) => (
              <article key={set.archiveId} className="overflow-hidden border border-border bg-[#050505]">
                <div className="flex items-center justify-between border-b border-border bg-bg/80 px-3 py-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-red">photo box {String(index + 1).padStart(2, "0")}</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-faint">{set.count} frames</span>
                </div>
                <div className="relative aspect-[4/5]">
                  <EventPhotoCarousel
                    photos={getPhotoUrls(set)}
                    interval={1900 + index * 200}
                    alt={set.alt}
                    className="absolute inset-0 h-full w-full"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                </div>
                <div className="border-t border-border p-4">
                  <h3 className="font-serif text-[1.2rem] italic leading-tight text-ink">{set.title}</h3>
                  <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-faint">autoplay evidence file</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
