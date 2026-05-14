"use client";


import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import StatusStrip from "./StatusStrip";

/**
 * Ordered by visual impact — best openers first.
 * block_party is the biggest crowd energy, destroy_lonely is the rave,
 * hero-recap is the brand reel, newyears is the atmosphere,
 * fast_life is the clothing, christmas_drop is the shorter filler.
 */
const HERO_VIDEOS = [
  "/assets/events/block_party.mp4",
  "/assets/events/destroy_lonely.mp4",
  "/assets/videos/hero-recap.mp4",
  "/assets/events/newyears.mp4",
  "/assets/drops/fast_life_reel.mp4",
  "/assets/drops/christmas_drop.mp4",
];

const CLIP_DURATION = 8000; // 8s per clip before crossfade

export default function HeroLobby() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);

  const advance = useCallback(() => {
    setIsFading(true);

    // After crossfade completes, swap layers
    setTimeout(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % HERO_VIDEOS.length;
        return next;
      });
      setNextIdx((prev) => (prev + 1) % HERO_VIDEOS.length);
      setIsFading(false);
    }, 1200); // match CSS transition duration
  }, []);

  // Auto-advance timer
  useEffect(() => {
    timerRef.current = setInterval(advance, CLIP_DURATION);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [advance]);

  // Ensure videos play when src changes
  useEffect(() => {
    activeVideoRef.current?.play().catch(() => {});
  }, [activeIdx]);

  useEffect(() => {
    nextVideoRef.current?.play().catch(() => {});
  }, [nextIdx]);

  return (
    <section className="relative min-h-[calc(100vh-26px)] overflow-hidden grid grid-rows-[1fr_auto] p-0">
      {/* ── Background Video Layers ── */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Active layer (bottom) */}
        <video
          ref={activeVideoRef}
          key={`active-${activeIdx}`}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.65] contrast-[1.05] saturate-[1.1] transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: isFading ? 0 : 1 }}
        >
          <source src={HERO_VIDEOS[activeIdx]} type="video/mp4" />
        </video>

        {/* Next layer (top — fades in during crossfade) */}
        <video
          ref={nextVideoRef}
          key={`next-${nextIdx}`}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.65] contrast-[1.05] saturate-[1.1] transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: isFading ? 1 : 0 }}
        >
          <source src={HERO_VIDEOS[nextIdx]} type="video/mp4" />
        </video>

        {/* Gradient masks */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85 z-[1]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(230,0,22,0.12)_0%,transparent_55%)] z-[1]"></div>
      </div>

      {/* ── Video Progress Indicator ── */}
      <div className="absolute bottom-[82px] left-5 md:left-12 z-[5] flex items-center gap-2">
        {HERO_VIDEOS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              setIsFading(true);
              setTimeout(() => {
                setActiveIdx(i);
                setNextIdx((i + 1) % HERO_VIDEOS.length);
                setIsFading(false);
              }, 300);
              timerRef.current = setInterval(advance, CLIP_DURATION);
            }}
            aria-label={`Play video ${i + 1}`}
            className="group relative h-[3px] transition-all duration-300"
            style={{ width: i === activeIdx ? 32 : 12 }}
          >
            <div className={`absolute inset-0 transition-colors duration-300 ${
              i === activeIdx ? "bg-brand-red shadow-[0_0_6px_var(--red)]" : "bg-brand-ink/25 group-hover:bg-brand-ink/50"
            }`} />
          </button>
        ))}
        <span className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/30 uppercase ml-2">
          {String(activeIdx + 1).padStart(2, "0")}/{String(HERO_VIDEOS.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-[3] px-6 pt-[9rem] pb-12 md:px-12 md:pt-[11rem] flex flex-col justify-end min-h-[calc(100vh-26px-80px)]">
        
        {/* Tagline */}
        <p className="font-serif italic font-normal text-[clamp(1.4rem,3vw,2.2rem)] text-brand-ink max-w-[26ch] leading-[1.25] mb-4 reveal reveal-d1">
          a private creative society.
        </p>

        {/* Location */}
        <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-10 flex items-center gap-2.5 reveal reveal-d2">
          los angeles.
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-start gap-4 font-mono text-[11px] tracking-[0.25em] uppercase text-brand-ink-dim reveal reveal-d3">
          <Link href="#access" className="hover:text-brand-red transition-colors border-b border-transparent hover:border-brand-red pb-0.5 cta-breathe">
            get on the list ↗
          </Link>
          <Link href="#inquiry" className="hover:text-brand-red transition-colors border-b border-transparent hover:border-brand-red pb-0.5">
            we filmed your event ↗
          </Link>
          <div className="flex flex-wrap gap-6 mt-4">
            <Link href="#events" className="text-[10px] text-brand-ink-dim/60 hover:text-brand-ink transition-colors">
              View Events
            </Link>
            <Link href="#drops" className="text-[10px] text-brand-ink-dim/60 hover:text-brand-ink transition-colors">
              Shop Drops
            </Link>
          </div>
        </div>
      </div>

      <StatusStrip />
    </section>
  );
}
