"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";

interface EventPhotoCarouselProps {
  /** Array of photo paths */
  photos: string[];
  /** Autoplay frame interval in ms. Defaults to a VHS-style ~900ms flipbook cadence. */
  interval?: number;
  /** Alt text prefix */
  alt?: string;
  /** Additional className */
  className?: string;
}

/**
 * VHS-flipbook autoplay carousel.
 *
 * Cycles frames continuously like a looping video, but built from stills.
 * - Pauses when offscreen (IntersectionObserver) to save mobile battery.
 * - Pauses on hover (desktop) so a viewer can study a frame.
 * - Respects `prefers-reduced-motion: reduce` — stays on frame 1, manual nav still works.
 * - Click anywhere on the frame advances to the next photo.
 * - Only mounts the current frame plus the next 1-2 to avoid eating bandwidth on a 17-frame gallery.
 */
export default function EventPhotoCarousel({
  photos,
  interval = 900,
  alt = "SLOWHRS Event",
  className = "",
}: EventPhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  // Default to onscreen so the first autoplay tick fires immediately; the IntersectionObserver
  // (when present) will pause us once it confirms the card is actually scrolled out of view.
  const [isOnscreen, setIsOnscreen] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const total = photos.length;
  const safeInterval = Math.max(500, interval);

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const goBack = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setIsReducedMotion(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsOnscreen(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsOnscreen(entry.isIntersecting);
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (total <= 1) return;
    if (isReducedMotion) return;
    if (!isOnscreen) return;
    if (isHovering) return;

    const timer = window.setInterval(advance, safeInterval);
    return () => window.clearInterval(timer);
  }, [total, safeInterval, isReducedMotion, isOnscreen, isHovering, advance]);

  /**
   * Sliding mount window: only render the currently-visible frame plus a small lookahead/lookbehind.
   * Keeps a 17-frame gallery from hammering mobile bandwidth on first paint while ensuring the next
   * frame is already loaded by the time we crossfade.
   */
  const mounted = useMemo(() => {
    const set = new Set<number>();
    set.add(current);
    if (total > 1) set.add((current + 1) % total);
    if (total > 2) set.add((current + 2) % total);
    if (total > 1) set.add((current - 1 + total) % total);
    return set;
  }, [current, total]);

  const counterLabel = useMemo(() => {
    const prefix = isReducedMotion ? "still" : isHovering ? "hold" : "auto";
    return `${prefix} ${String(current + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;
  }, [current, total, isReducedMotion, isHovering]);

  const handleFrameClick = () => {
    if (total <= 1) return;
    advance();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (total <= 1) return;
    if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") {
      event.preventDefault();
      advance();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goBack();
    }
  };

  if (total === 0) return null;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-black select-none ${className}`}
      role="region"
      aria-label={`${alt} contact sheet — ${total} frames, autoplay`}
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleFrameClick}
      onKeyDown={handleKeyDown}
      tabIndex={total > 1 ? 0 : -1}
      style={{ cursor: total > 1 ? "pointer" : "default" }}
    >
      {photos.map((src, i) => {
        if (!mounted.has(i)) return null;
        const isCurrent = i === current;
        const isNext = i === (current + 1) % total;
        return (
          <Image
            key={src}
            src={src}
            alt={`${alt} — frame ${i + 1} of ${total}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-500 ease-out ${
              isCurrent ? "opacity-100" : "opacity-0"
            }`}
            priority={i < 2}
            fetchPriority={isCurrent || isNext ? "high" : "auto"}
            draggable={false}
          />
        );
      })}

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(255,255,255,0)_50%)] bg-[length:100%_4px] opacity-15 z-10" />

      <div
        className="absolute bottom-3 right-3 z-20 font-mono text-[8px] tracking-[0.2em] text-brand-ink/55 uppercase bg-black/65 px-2 py-1 backdrop-blur-[1px] border border-brand-ink/10"
        aria-live="polite"
      >
        {counterLabel}
      </div>

      {total > 1 && (
        <div className="absolute bottom-3 left-3 z-20 flex gap-1">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setCurrent(i);
              }}
              aria-label={`Jump to frame ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              className={`h-[6px] transition-all duration-300 ${
                i === current
                  ? "bg-brand-red w-[14px] shadow-[0_0_4px_var(--red)]"
                  : "bg-brand-ink/20 w-[6px] hover:bg-brand-ink/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
