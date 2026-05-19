"use client";

import { forwardRef, useEffect, useRef, useState, type CSSProperties } from "react";

type HeroVideoProps = {
  className?: string;
  style?: CSSProperties;
};

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

const POSTER_SRC = "/assets/videos/hero-poster.jpg";

// Decide once on the client whether to skip the actual <video> entirely:
// reduce-motion users and save-data / 2g visitors get the poster only.
function isPosterOnlyClient(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
  const connection = (
    navigator as Navigator & { connection?: NetworkInformationLike }
  ).connection;
  return Boolean(
    connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g"
  );
}

function forcePlay(video: HTMLVideoElement | null) {
  if (!video) return;
  // iOS Safari only allows muted + playsInline autoplay; set both before play.
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  void video.play().catch(() => {
    // Autoplay can be blocked. Poster stays painted via the bg-image fallback.
  });
}

const HeroVideo = forwardRef<HTMLVideoElement, HeroVideoProps>(function HeroVideo(
  { className, style },
  forwardedRef
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [posterOnly, setPosterOnly] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePosterMode = () => setPosterOnly(isPosterOnlyClient());

    updatePosterMode();
    motionQuery.addEventListener("change", updatePosterMode);
    return () => motionQuery.removeEventListener("change", updatePosterMode);
  }, []);

  useEffect(() => {
    if (posterOnly) return;
    forcePlay(videoRef.current);
  }, [posterOnly]);

  const setVideoRef = (node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  // Poster is painted as a CSS background on both branches so the first
  // pixel on screen is always the poster — no flash of asphalt.
  const posterStyle: CSSProperties = {
    backgroundImage: `url(${POSTER_SRC})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor: "#050505",
  };

  if (posterOnly) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{ ...posterStyle, ...style }}
      />
    );
  }

  return (
    <video
      ref={setVideoRef}
      autoPlay
      loop
      muted
      playsInline
      poster={POSTER_SRC}
      preload="auto"
      onCanPlay={(event) => forcePlay(event.currentTarget)}
      onLoadedData={(event) => forcePlay(event.currentTarget)}
      className={className}
      style={{ ...posterStyle, ...style }}
    >
      <source
        src="/assets/videos/hero-mobile.webm"
        type="video/webm"
        media="(max-width: 767px)"
      />
      <source
        src="/assets/videos/hero-mobile.mp4"
        type="video/mp4"
        media="(max-width: 767px)"
      />
      <source
        src="/assets/videos/hero-desktop.webm"
        type="video/webm"
        media="(min-width: 768px)"
      />
      <source
        src="/assets/videos/hero-recap.mp4"
        type="video/mp4"
        media="(min-width: 768px)"
      />
    </video>
  );
});

export default HeroVideo;
