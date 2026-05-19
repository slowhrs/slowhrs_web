"use client";


import Link from "next/link";
import { useState, useEffect, useRef, type CSSProperties } from "react";
import HeroVideo from "./HeroVideo";
import StatusStrip from "./StatusStrip";

/**
 * Keep the optimized recap first so the initial mobile hero uses the smallest
 * tuned sources. The rest stay mounted behind it and keep playing so opacity
 * changes never reveal a cold/frozen video.
 */
const HERO_RECAP_VIDEO = "/assets/videos/hero-recap.mp4";

const HERO_VIDEOS = [
  HERO_RECAP_VIDEO,
  "/assets/events/block_party.mp4",
  "/assets/events/destroy_lonely.mp4",
  "/assets/events/newyears.mp4",
  "/assets/drops/fast_life_reel.mp4",
  "/assets/drops/christmas_drop.mp4",
];

const CLIP_DURATION = 8000; // 8s per clip before crossfade
const HERO_FALLBACK_POSTER = "/assets/videos/hero-poster.jpg";
const posterFor = (src: string) =>
  src === HERO_RECAP_VIDEO ? HERO_FALLBACK_POSTER : src.replace(/\.mp4$/, ".jpg");

function playVideo(video: HTMLVideoElement | null) {
  if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.play().catch(() => {});
}

function avoidBlackTail(video: HTMLVideoElement) {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return;
  if (video.duration - video.currentTime <= 0.25) {
    video.currentTime = 0;
    playVideo(video);
  }
}

export default function HeroLobby() {
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  // Auto-advance timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, CLIP_DURATION);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Keep every mounted hero layer moving. Hidden opacity layers are still
  // intentionally playing so a future crossfade never reveals a frozen frame.
  useEffect(() => {
    const playAll = () => {
      videoRefs.current.forEach((video) => playVideo(video));
    };

    playAll();
    const playTimer = window.setInterval(playAll, 1000);
    return () => window.clearInterval(playTimer);
  }, []);

  const renderVideoLayer = (
    src: string,
    index: number
  ) => {
    const posterSrc = posterFor(src);
    const isActive = index === activeIdx;
    const className = "absolute inset-0 w-full h-full object-cover bg-cover bg-center filter brightness-[0.65] contrast-[1.05] saturate-[1.1] transition-opacity duration-[1200ms] ease-in-out";
    const style: CSSProperties = {
      opacity: isActive ? 1 : 0,
      backgroundImage: `url(${posterSrc})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundColor: "#050505",
    };

    if (src === HERO_RECAP_VIDEO) {
      return (
        <HeroVideo
          ref={(node) => {
            videoRefs.current[index] = node;
          }}
          key={src}
          className={className}
          style={style}
          heroLayer={`hero-${index}`}
        />
      );
    }

    return (
      <video
        ref={(node) => {
          videoRefs.current[index] = node;
        }}
        key={src}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        poster={posterSrc}
        preload="auto"
        data-hero-video={`hero-${index}`}
        onCanPlay={(event) => playVideo(event.currentTarget)}
        onLoadedData={(event) => playVideo(event.currentTarget)}
        onTimeUpdate={(event) => avoidBlackTail(event.currentTarget)}
        className={className}
        style={style}
      />
    );
  };

  return (
    <section className="relative min-h-[calc(100vh-26px)] overflow-hidden grid grid-rows-[1fr_auto] p-0">
      {/* ── Background Video Layers ── */}
      <div
        className="absolute inset-0 z-0 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${posterFor(HERO_VIDEOS[activeIdx])})`,
          backgroundColor: "#050505",
        }}
      >
        {HERO_VIDEOS.map((src, index) => renderVideoLayer(src, index))}

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
              setActiveIdx(i);
              timerRef.current = setInterval(() => {
                setActiveIdx((prev) => (prev + 1) % HERO_VIDEOS.length);
              }, CLIP_DURATION);
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
            get on the list <span className="hidden md:inline">↗</span>
          </Link>
          <Link href="#inquiry" className="hover:text-brand-red transition-colors border-b border-transparent hover:border-brand-red pb-0.5">
            we filmed your event <span className="hidden md:inline">↗</span>
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
