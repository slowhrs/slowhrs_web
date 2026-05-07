"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ENTRY_VIDEOS } from "@/lib/constants";

interface HomepageHeroProps {
  videoSrc?: string;
}

export default function HomepageHero({ videoSrc }: HomepageHeroProps) {
  const video = videoSrc || ENTRY_VIDEOS[0];

  return (
    <>
      {/* Full-bleed hero */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Video background */}
        <video
          src={video}
          muted
          playsInline
          loop
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Bottom gradient mask */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 70%, rgba(5,5,5,0.85) 100%)",
          }}
        />

        {/* Overlay content — bottom-left */}
        <div className="absolute bottom-0 left-0 z-10 p-6 md:p-12 pb-12 md:pb-16">
          <h1 className="leading-none mb-2">
            <span className="sr-only">slowhrs</span>
            <Image 
              src="/assets/logos/logo_main.png" 
              alt="SLOWHRS" 
              width={600} 
              height={150} 
              className="w-[60vw] max-w-[400px] min-w-[200px] h-auto object-contain drop-shadow-[0_0_30px_rgba(230,0,22,0.3)]" 
              priority
            />
          </h1>
          <p
            className="font-serif italic text-ink mt-3"
            style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)" }}
          >
            a private creative society.
          </p>
          <p
            className="font-mono uppercase text-red mt-5"
            style={{
              fontSize: "10px",
              letterSpacing: "0.3em",
            }}
          >
            los angeles.
          </p>
        </div>

        {/* Bottom-right CTAs */}
        <div className="absolute bottom-12 right-6 md:right-12 z-10 flex flex-col items-end gap-3">
          <Link
            href="/membership"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim hover:text-red hover:border-b hover:border-red transition-colors pb-0.5"
          >
            on the list ↗
          </Link>
          <Link
            href="/inquire?subject=event-recap"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim hover:text-red hover:border-b hover:border-red transition-colors pb-0.5"
          >
            we filmed your event ↗
          </Link>
        </div>
      </section>

      {/* Next up section */}
      <section className="relative bg-bg py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <h2
            className="font-display italic text-ink mb-12"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
          >
            next up.
          </h2>

          {/* Placeholder — will be replaced with Supabase fetch */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "VOGUE SAFARI: CONTENT PRE GAME",
                date: "05.08.25",
                location: "Los Angeles",
                video: "/assets/events/block_party.mp4",
              },
              {
                name: "Block Party",
                date: "08.12.25",
                location: "Mid-City, Los Angeles",
                video: "/assets/events/block_party.mp4",
              },
              {
                name: "Runway · Spring Show",
                date: "04.25.25",
                location: "Los Angeles",
                video: "/assets/videos/hero-recap.mp4",
              },
            ].map((event) => (
              <div
                key={event.name}
                className="group relative aspect-[4/5] overflow-hidden rounded-sm"
              >
                <video
                  src={event.video}
                  muted
                  playsInline
                  loop
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-500"
                  onMouseEnter={(e) =>
                    (e.target as HTMLVideoElement).play().catch(() => {})
                  }
                  onMouseLeave={(e) =>
                    (e.target as HTMLVideoElement).pause()
                  }
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent 50%, rgba(5,5,5,0.9) 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 p-5 z-10">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red">
                    {event.date}
                  </span>
                  <h3
                    className="font-display italic text-ink mt-2 leading-tight"
                    style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}
                  >
                    {event.name}
                  </h3>
                  <p className="font-mono text-[9px] tracking-[0.2em] text-ink-dim mt-2 uppercase">
                    {event.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
