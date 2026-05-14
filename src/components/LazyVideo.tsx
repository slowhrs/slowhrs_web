"use client";

import { useRef, useEffect, useState } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
  loop?: boolean;
  /** Distance from viewport to start loading (px) */
  rootMargin?: string;
}

/**
 * Video that only loads + plays when scrolled into view.
 * Pauses when scrolled out. Saves bandwidth on mobile.
 */
export default function LazyVideo({
  src,
  className = "",
  loop = true,
  rootMargin = "200px",
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <video
      ref={ref}
      src={isVisible ? src : undefined}
      muted
      playsInline
      loop={loop}
      preload="none"
      className={className}
    />
  );
}
