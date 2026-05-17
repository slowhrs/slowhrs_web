"use client";

import { useRef, useEffect, useState } from "react";

type LazyVideoProps = {
  src: string;
  poster: string;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  priority?: boolean;
};

export function LazyVideo({
  src,
  poster,
  className = "",
  threshold = 0.25,
  rootMargin = "100px",
  priority = false,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (priority || shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [priority, shouldLoad, threshold, rootMargin]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay can still be blocked; the poster remains visible.
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    playObserver.observe(video);
    return () => playObserver.disconnect();
  }, [shouldLoad]);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload={priority ? "auto" : "metadata"}
      autoPlay={priority}
      onLoadedData={() => setHasLoaded(true)}
      className={`${className} ${hasLoaded ? "opacity-100" : "opacity-90"} transition-opacity duration-500`}
      style={{
        backgroundColor: "var(--asphalt)",
        backgroundImage: `url(${poster})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}

export default LazyVideo;
