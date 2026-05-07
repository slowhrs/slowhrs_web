import { createAdminClient } from "@/lib/supabase/admin";
import EventTile from "@/components/events/EventTile";
import type { EventData } from "@/components/events/EventTile";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "SLOWHRS | events",
  description: "the room. the recap. the rsvp.",
};

// Fallback events when DB is empty or unavailable
const FALLBACK_EVENTS: EventData[] = [
  {
    id: "fallback-1",
    name: "VOGUE SAFARI: CONTENT PRE GAME",
    date: "2025-05-08T19:00:00-07:00",
    location: "Los Angeles",
    blurb: "luxury safari editorial. models, creatives, cameras. come ready.",
    partiful_url: "https://partiful.com/e/1G8p2pfAqQsOiV4y3aHO",
    cover_video: "/assets/events/block_party.mp4",
    produced_by_slowhrs: true,
    is_upcoming: true,
  },
  {
    id: "fallback-2",
    name: "Block Party",
    date: "2025-08-12T21:00:00-07:00",
    location: "Mid-City, Los Angeles",
    blurb: "crew run. hosts in the room. doors at 9.",
    partiful_url: null,
    cover_video: "/assets/events/block_party.mp4",
    produced_by_slowhrs: true,
    is_upcoming: true,
  },
  {
    id: "fallback-3",
    name: "Destroy Lonely · WYA Trap Rave",
    date: "2025-03-14T22:30:00-07:00",
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
    date: "2024-11-20T14:00:00-08:00",
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
    date: "2025-04-25T20:00:00-07:00",
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
      {events.map((event, i) => (
        <EventTile key={event.id} event={event} isFirst={i === 0} />
      ))}
      <Footer />
    </main>
  );
}
