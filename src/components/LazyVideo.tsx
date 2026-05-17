"use client";

import { useCallback, useRef, useEffect, useState } from "react";

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
  const [shouldLoad, setShouldLoad] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setIsReducedMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  const playIfAllowed = useCallback(() => {
    const video = videoRef.current;
    if (!video || isReducedMotion) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.play().catch(() => {
      // Autoplay can still be blocked; the poster remains visible.
    });
  }, [isReducedMotion]);

  useEffect(() => {
    if (!shouldLoad || isReducedMotion) return;
    playIfAllowed();
  }, [isReducedMotion, playIfAllowed, shouldLoad]);

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

    if (isReducedMotion) return;

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playIfAllowed();
        } else {
          video.pause();
        }
      },
      { threshold: 0.15, rootMargin: "120px" }
    );

    playObserver.observe(video);
    return () => playObserver.disconnect();
  }, [isReducedMotion, playIfAllowed, shouldLoad]);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      poster={poster}
      muted
      disablePictureInPicture
      loop
      playsInline
      preload="auto"
      autoPlay={shouldLoad && !isReducedMotion}
      onCanPlay={playIfAllowed}
      onLoadedMetadata={playIfAllowed}
      onLoadedData={() => {
        setHasLoaded(true);
        playIfAllowed();
      }}
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
