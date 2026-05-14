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
 * Video that lazy-loads its src when near the viewport,
 * auto-plays when visible, and pauses when scrolled away.
 */
export default function LazyVideo({
  src,
  className = "",
  loop = true,
  rootMargin = "400px",
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // First time: set src and load
          if (!loaded) {
            el.src = src;
            el.load();
            setLoaded(true);
          }
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, rootMargin, loaded]);

  return (
    <video
      ref={ref}
      muted
      playsInline
      loop={loop}
      preload="none"
      className={className}
    />
  );
}
