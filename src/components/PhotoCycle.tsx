"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PhotoCycleProps {
  images: string[];
  interval?: number;
  className?: string;
  alt?: string;
}

/**
 * Auto-cycling photo slideshow that cross-fades between images.
 * Looks like a looping video but made from static photos.
 */
export default function PhotoCycle({
  images,
  interval = 2000,
  className = "",
  alt = "SLOWHRS Campaign",
}: PhotoCycleProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const advance = () => {
      setCurrent((prev) => (prev + 1) % images.length);
    };
    const firstAdvance = window.setTimeout(advance, 700);
    const timer = setInterval(advance, interval);
    return () => {
      window.clearTimeout(firstAdvance);
      clearInterval(timer);
    };
  }, [images.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} — Slide ${i + 1} of ${images.length}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          priority={i < 2}
        />
      ))}
    </div>
  );
}
