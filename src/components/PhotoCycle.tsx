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
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} ${i + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          priority={i === 0}
        />
      ))}
    </div>
  );
}
