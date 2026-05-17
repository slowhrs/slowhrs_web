"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ENTRY_VIDEOS } from "@/lib/constants";
import ScrollReveal from "@/components/ScrollReveal";
import LazyVideo from "@/components/LazyVideo";

/* ── Event data for "next up" / "the room recently" ── */
interface HeroEvent {
  name: string;
  date: string;
  location: string;
  video: string;
  partifulUrl: string | null;
  isUpcoming: boolean;
}

const posterFor = (src: string) => src.replace(/\.mp4$/, ".jpg");

const EVENTS: HeroEvent[] = [
  {
    name: "VOGUE SAFARI: CONTENT PRE GAME",
    date: "05.08.25",
    location: "Los Angeles",
    video: "/assets/events/destroy_lonely.mp4",
    partifulUrl: "https://partiful.com/e/1G8p2pfAqQsOiV4y3aHO",
    isUpcoming: true,
  },
  {
    name: "Block Party",
    date: "08.12.25",
    location: "Mid-City, Los Angeles",
    video: "/assets/events/block_party.mp4",
    partifulUrl: null,
    isUpcoming: true,
  },
  {
    name: "Holiday Capsule Shoot",
    date: "12.20.24",
    location: "Hollywood, Los Angeles",
    video: "/assets/drops/christmas_drop.mp4",
    partifulUrl: null,
    isUpcoming: false,
  },
];

interface HomepageHeroProps {
  videoSrc?: string;
}

export default function HomepageHero({ videoSrc }: HomepageHeroProps) {
  const video = videoSrc || ENTRY_VIDEOS[0];
  const hasUpcoming = EVENTS.some((e) => e.isUpcoming);
  const displayEvents = hasUpcoming
    ? EVENTS.filter((e) => e.isUpcoming).slice(0, 3)
    : EVENTS.slice(0, 3);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO — full-bleed video, 100vh
          ═══════════════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Ambient glow — bottom-left red drift */}
        <div
          className="ambient-glow"
          style={{ bottom: "-20%", left: "-10%" }}
        />

        {/* Video background — full brightness */}
        <video
          src={video}
          poster={posterFor(video)}
          muted
          playsInline
          loop
          autoPlay
          preload="auto"
          onCanPlay={(event) => {
            event.currentTarget.muted = true;
            event.currentTarget.defaultMuted = true;
            event.currentTarget.play().catch(() => {});
          }}
          onLoadedData={(event) => {
            event.currentTarget.muted = true;
            event.currentTarget.defaultMuted = true;
            event.currentTarget.play().catch(() => {});
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Bottom 30% gradient mask */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0) 70%, rgba(5,5,5,0.85) 100%)",
          }}
        />

        {/* ── Bottom-left content stack ── */}
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-12 pb-12 md:pb-16">
          {/* Wordmark — entrance */}
          <h1
            className="font-display italic text-ink leading-none"
            style={{
              fontSize: "clamp(4rem, 12vw, 8rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              fontWeight: 400,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition:
                "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            slowhrs
          </h1>

          {/* Tagline — staggered */}
          <p
            className="font-serif italic text-ink-dim"
            style={{
              fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)",
              marginTop: "0.75rem",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              transition:
                "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            a private creative society.
          </p>

          {/* Location — staggered */}
          <p
            className="font-mono uppercase text-red"
            style={{
              fontSize: "10px",
              letterSpacing: "0.3em",
              marginTop: "1.25rem",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(8px)",
              transition:
                "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            los angeles.
          </p>
        </div>

        {/* ── Bottom-right CTAs ── */}
        <div
          className="absolute bottom-12 right-6 md:right-12 z-10 flex flex-col items-end gap-3"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
          }}
        >
          <Link
            href="/membership"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim hover:text-red border-b border-transparent hover:border-red transition-colors pb-0.5 cta-breathe"
          >
            get on the list ↗
          </Link>
          <Link
            href="/inquire?subject=event-recap"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim hover:text-red border-b border-transparent hover:border-red transition-colors pb-0.5"
          >
            we filmed your event ↗
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NEXT UP / THE ROOM RECENTLY — ~80vh dark section
          ═══════════════════════════════════════════════ */}
      <section className="relative bg-bg min-h-[80vh] py-24 md:py-32 px-6 md:px-12 overflow-hidden">
        {/* Ambient glow — top-right */}
        <div
          className="ambient-glow"
          style={{ top: "-20%", right: "-15%" }}
        />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <ScrollReveal>
            <h2
              className="font-display italic text-ink mb-16"
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 300,
              }}
            >
              {hasUpcoming ? "next up." : "the room recently."}
            </h2>
          </ScrollReveal>

          {/* Event tiles — 3-up grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayEvents.map((event, i) => (
              <ScrollReveal key={event.name} delay={i * 150}>
                <EventTile event={event} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Event tile sub-component ── */
function EventTile({ event }: { event: HeroEvent }) {
  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-sm hover-lift light-sweep">
      <LazyVideo
        src={event.video}
        poster={event.video.replace(/\.mp4$/, ".jpg")}
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-500"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 50%, rgba(5,5,5,0.9) 100%)",
        }}
      />

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 p-5 z-10">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red">
          {event.date}
        </span>
        <h3
          className="font-display italic text-ink mt-2 leading-tight"
          style={{
            fontSize: "clamp(1rem, 1.5vw, 1.4rem)",
            fontWeight: 300,
          }}
        >
          {event.name}
        </h3>
        <p className="font-mono text-[9px] tracking-[0.2em] text-ink-dim mt-2 uppercase">
          {event.location}
        </p>

        {/* CTA */}
        <div className="mt-3">
          {event.isUpcoming && event.partifulUrl ? (
            <a
              href={event.partifulUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint hover:text-red transition-colors border-b border-ink-faint/30 hover:border-red pb-0.5"
            >
              rsvp ↗
            </a>
          ) : (
            <Link
              href="/events"
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-faint hover:text-red transition-colors border-b border-ink-faint/30 hover:border-red pb-0.5"
            >
              view recap →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
