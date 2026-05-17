import { createAdminClient } from "@/lib/supabase/admin";
import EventTile from "@/components/events/EventTile";
import type { EventData } from "@/components/events/EventTile";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SLOWHRS | Events",
  description: "The room. The recap. The RSVP. Private events in Los Angeles.",
};

// Fallback events when DB is empty or unavailable
const FALLBACK_EVENTS: EventData[] = [
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
    id: "fallback-2",
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
];

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

    return data as EventData[];
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

  return (
    <main
      className="bg-bg pt-[52px] md:pt-[52px]"
      style={{ scrollSnapType: "y mandatory" }}
    >
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
      {events.map((event, i) => (
        <EventTile key={event.id} event={event} isFirst={i === 0} />
      ))}
      <Footer />
    </main>
  );
}
