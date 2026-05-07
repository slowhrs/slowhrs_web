"use client";

import { useRef, useEffect } from "react";
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

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}.${dd}.${yy}`;
}

export default function EventTile({ event }: EventTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
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
            muted
            playsInline
            loop
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

      {/* Content — bottom-left */}
      <div className="absolute bottom-0 left-0 z-10 p-6 md:p-12 pb-12 md:pb-16 max-w-[600px]">
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
              rsvp on partiful ↗
            </a>
          ) : (
            <Link
              href={`/events#${event.id}`}
              className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink-dim hover:text-red transition-colors border-b border-ink-faint hover:border-red pb-0.5"
            >
              view recap ↗
            </Link>
          )}
        </div>
      </div>

      {/* Produced by SLOWHRS — bottom-right */}
      {event.produced_by_slowhrs && (
        <span className="absolute bottom-8 right-6 md:right-12 z-10 font-mono text-[9px] tracking-[0.25em] text-ink-faint uppercase">
          filmed by slowhrs
        </span>
      )}


    </section>
  );
}
