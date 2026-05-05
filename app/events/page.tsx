"use client";

import { useRef, useState } from "react";
import CinemaHero from "@/components/events/CinemaHero";
import FilterStrip from "@/components/events/FilterStrip";
import EventsGrid from "@/components/events/EventsGrid";
import EventLightbox from "@/components/events/EventLightbox";
import Footer from "@/components/Footer";
import type { Event } from "@/components/events/events.data";

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxEvent, setLightboxEvent] = useState<Event | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <main className="min-h-screen">
        {/* Zone 1: Cinema Hero */}
        <CinemaHero />

        {/* Sentinel — IntersectionObserver target for filter strip reveal */}
        <div ref={sentinelRef} className="h-0" aria-hidden="true" />

        {/* Filter strip — appears after scroll past hero */}
        <FilterStrip
          active={activeFilter}
          onChange={setActiveFilter}
          sentinelRef={sentinelRef}
        />

        {/* Zone 2: Curated Grid */}
        <EventsGrid activeFilter={activeFilter} onSelect={setLightboxEvent} />

        {/* Zone 3: Detail Lightbox */}
        <EventLightbox
          event={lightboxEvent}
          onClose={() => setLightboxEvent(null)}
        />
      </main>
      <Footer />
    </>
  );
}
