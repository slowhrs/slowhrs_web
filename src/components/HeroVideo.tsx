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

function prefersPosterOnly() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  return Boolean(
    connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g"
  );
}

function playVideo(video: HTMLVideoElement | null) {
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.play().catch(() => {});
}

const HeroVideo = forwardRef<HTMLVideoElement, HeroVideoProps>(function HeroVideo(
  { className, style },
  forwardedRef
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [posterOnly, setPosterOnly] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePosterMode = () => setPosterOnly(prefersPosterOnly());

    updatePosterMode();
    motionQuery.addEventListener("change", updatePosterMode);

    return () => motionQuery.removeEventListener("change", updatePosterMode);
  }, []);

  useEffect(() => {
    if (!posterOnly) playVideo(videoRef.current);
  }, [posterOnly]);

  const setVideoRef = (node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  if (posterOnly) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{
          ...style,
          backgroundImage: `url(${POSTER_SRC})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
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
      preload="metadata"
      onCanPlay={(event) => playVideo(event.currentTarget)}
      onLoadedData={(event) => playVideo(event.currentTarget)}
      className={className}
      style={style}
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
