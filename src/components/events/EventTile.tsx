"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

export interface EventData {
  id: string;
  name: string;
  date: string;
  location: string | null;
  blurb: string | null;
  partiful_url: string | null;
  cover_video: string | null;
  produced_by_slowhrs: boolean;
  is_upcoming: boolean;
}

interface EventTileProps {
  event: EventData;
  isFirst?: boolean;
}

const posterFor = (src: string) => src.replace(/\.mp4$/, ".jpg");

function formatDate(dateStr: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  }).formatToParts(new Date(dateStr));
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.month}.${byType.day}.${byType.year}`;
}

export default function EventTile({ event }: EventTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          // Trigger content reveal after a brief moment
          setTimeout(() => setIsVisible(true), 200);
        } else {
          video.pause();
          setIsVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full snap-start overflow-hidden"
    >
      {/* Video */}
      {event.cover_video && (
        <>
          <video
            ref={videoRef}
            src={event.cover_video}
            poster={posterFor(event.cover_video)}
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Bottom gradient for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 65%, rgba(5,5,5,0.85) 100%)",
            }}
          />
        </>
      )}

      {/* Content — bottom-left, with reveal motion */}
      <div
        className="absolute bottom-0 left-0 z-10 p-6 md:p-12 pb-12 md:pb-16 max-w-[600px]"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition:
            "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red">
          {formatDate(event.date)}
        </span>
        <h2
          className="font-display italic text-ink mt-3 leading-none"
          style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 300 }}
        >
          {event.name}
        </h2>
        {event.blurb && (
          <p className="font-serif italic text-ink-dim text-lg mt-4 max-w-[480px] leading-relaxed">
            {event.blurb}
          </p>
        )}
        <div className="mt-6">
          {event.is_upcoming && event.partiful_url ? (
            <a
              href={event.partiful_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-dim hover:text-red transition-colors border-b border-ink-faint hover:border-red pb-0.5"
            >
              reserve access ↗
            </a>
          ) : (
            <Link
              href={`/events#${event.id}`}
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-dim hover:text-red transition-colors border-b border-ink-faint hover:border-red pb-0.5"
            >
              {event.is_upcoming ? "request access ↗" : "event passed"}
            </Link>
          )}
        </div>
      </div>

      {/* Produced by SLOWHRS — bottom-right, fade with content */}
      {event.produced_by_slowhrs && (
        <span
          className="absolute bottom-8 right-6 md:right-12 z-10 font-mono text-[9px] tracking-[0.25em] text-ink-faint uppercase"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
          }}
        >
          filmed by slowhrs
        </span>
      )}

      {/* Ambient bottom glow — appears when tile is in view */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-20"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(230,0,22,0.4), transparent)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 1.5s ease-in-out",
        }}
      />
    </section>
  );
}
