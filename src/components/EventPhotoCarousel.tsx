"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface EventPhotoCarouselProps {
  /** Array of photo paths */
  photos: string[];
  /** Autoplay interval in ms */
  interval?: number;
  /** Alt text prefix */
  alt?: string;
  /** Additional className */
  className?: string;
}

/**
 * Autoplay crossfade slideshow for event photos.
 * 4s per photo by default. Respects prefers-reduced-motion.
 * Photo counter overlay in bottom-right.
 */
export default function EventPhotoCarousel({
  photos,
  interval = 4000,
  alt = "SLOWHRS Event",
  className = "",
}: EventPhotoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (photos.length <= 1 || isPaused) return;

    // Respect reduced motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const timer = setInterval(advance, interval);
    return () => clearInterval(timer);
  }, [photos.length, interval, isPaused, advance]);

  if (photos.length === 0) return null;

  return (
    <div
      className={`relative overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label={`${alt} photo gallery — ${photos.length} photos`}
      aria-roledescription="carousel"
    >
      {/* Photo Layers */}
      {photos.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} — photo ${i + 1} of ${photos.length}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
        />
      ))}

      {/* Scanline overlay for VHS feel */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(255,255,255,0)_50%)] bg-[length:100%_4px] opacity-15 z-10" />

      {/* Photo Counter */}
      <div className="absolute bottom-3 right-3 z-20 font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase bg-black/60 px-2 py-1">
        {String(current + 1).padStart(2, "0")}/{String(photos.length).padStart(2, "0")}
      </div>

      {/* Manual Navigation Dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-3 z-20 flex gap-1">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`View photo ${i + 1}`}
              className={`w-[6px] h-[6px] transition-all duration-300 ${
                i === current
                  ? "bg-brand-red shadow-[0_0_4px_var(--red)]"
                  : "bg-brand-ink/20 hover:bg-brand-ink/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
