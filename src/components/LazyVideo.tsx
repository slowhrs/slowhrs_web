"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  poster: string;
  className?: string;
  /**
   * Threshold for the play/pause observer. The load observer always uses a
   * generous 200px rootMargin so the video is ready by the time it scrolls
   * into view.
   */
  threshold?: number;
  rootMargin?: string;
  /**
   * Force-load on mount (bypass the load observer). Use sparingly — only the
   * single most important above-the-fold video on a page should use this.
   */
  priority?: boolean;
};

/**
 * v2.4-4-velocity LazyVideo: two-observer pattern.
 *  1. Load observer (rootMargin 200px) flips `shouldLoad` so the <video>
 *     gets a real `src` and `preload="metadata"`.
 *  2. Play observer (threshold 0.25) plays/pauses the video as it enters
 *     and leaves the viewport.
 * Poster is always painted as a CSS background so the box never flashes
 * empty, and reduced-motion visitors get the poster forever.
 */
export function LazyVideo({
  src,
  poster,
  className = "",
  threshold = 0.25,
  rootMargin = "0px",
  priority = false,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setIsReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const playIfAllowed = useCallback(() => {
    const video = videoRef.current;
    if (!video || isReducedMotion) return;
    // iOS Safari requires muted + playsInline before .play() resolves.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.play().catch(() => {
      // Autoplay blocked — poster background stays painted, no console noise.
    });
  }, [isReducedMotion]);

  // Observer #1 — flip shouldLoad when the element approaches the viewport.
  useEffect(() => {
    if (priority || shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          loadObserver.disconnect();
        }
      },
      { threshold: 0, rootMargin: "200px" }
    );

    loadObserver.observe(video);
    return () => loadObserver.disconnect();
  }, [priority, shouldLoad]);

  // Observer #2 — play when ≥25% on screen, pause when leaving.
  useEffect(() => {
    if (!shouldLoad || isReducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playIfAllowed();
        } else {
          video.pause();
        }
      },
      { threshold, rootMargin }
    );

    playObserver.observe(video);
    return () => playObserver.disconnect();
  }, [isReducedMotion, playIfAllowed, rootMargin, shouldLoad, threshold]);

  // Kick playback as soon as we have data, in case the play observer already
  // fired before metadata arrived.
  useEffect(() => {
    if (!shouldLoad || isReducedMotion) return;
    playIfAllowed();
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
      preload={shouldLoad ? "metadata" : "none"}
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
