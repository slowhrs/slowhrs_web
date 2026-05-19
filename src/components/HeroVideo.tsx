"use client";

import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

type HeroVideoProps = {
  className?: string;
  style?: CSSProperties;
  heroLayer?: string;
  onPlayingChange?: (playing: boolean) => void;
};

const POSTER_SRC = "/assets/videos/hero-poster.jpg";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

function pickHeroSrc(): string {
  const mobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;
  const probe = document.createElement("video");
  const webm =
    probe.canPlayType('video/webm; codecs="vp9"') !== "" ||
    probe.canPlayType("video/webm") !== "";
  if (mobile) {
    return webm
      ? "/assets/videos/hero-mobile.webm"
      : "/assets/videos/hero-mobile.mp4";
  }
  return webm
    ? "/assets/videos/hero-desktop.webm"
    : "/assets/videos/hero-recap.mp4";
}

function forcePlay(video: HTMLVideoElement | null) {
  if (!video || prefersReducedMotion()) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  void video.play().catch(() => {
    // Autoplay blocked — poster stays painted via the bg-image fallback.
  });
}

function avoidBlackTail(video: HTMLVideoElement) {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return;
  if (video.duration - video.currentTime <= 0.25) {
    video.currentTime = 0;
    forcePlay(video);
  }
}

const HeroVideo = forwardRef<HTMLVideoElement, HeroVideoProps>(function HeroVideo(
  { className, style, heroLayer, onPlayingChange },
  forwardedRef
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [posterOnly] = useState(() => prefersReducedMotion());
  const [heroSrc, setHeroSrc] = useState<string | null>(null);
  const [posterBgVisible, setPosterBgVisible] = useState(true);

  const markPlaying = useCallback(() => {
    setPosterBgVisible(false);
    onPlayingChange?.(true);
  }, [onPlayingChange]);

  useLayoutEffect(() => {
    if (posterOnly) return;
    setHeroSrc(pickHeroSrc());
  }, [posterOnly]);

  useLayoutEffect(() => {
    if (posterOnly || !heroSrc) return;
    forcePlay(videoRef.current);
  }, [posterOnly, heroSrc]);

  const bindVideo = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
      if (node && !posterOnly) {
        forcePlay(node);
      }
    },
    [forwardedRef, posterOnly]
  );

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

  if (!heroSrc) {
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
      ref={bindVideo}
      src={heroSrc}
      autoPlay
      loop
      muted
      playsInline
      poster={POSTER_SRC}
      preload="auto"
      data-hero-video={heroLayer}
      onLoadedMetadata={(event) => forcePlay(event.currentTarget)}
      onCanPlay={(event) => forcePlay(event.currentTarget)}
      onLoadedData={(event) => forcePlay(event.currentTarget)}
      onPlaying={(event) => {
        markPlaying();
        forcePlay(event.currentTarget);
      }}
      onTimeUpdate={(event) => avoidBlackTail(event.currentTarget)}
      className={className}
      style={{
        ...(posterBgVisible ? posterStyle : { backgroundColor: "#050505" }),
        ...style,
      }}
    />
  );
});

export default HeroVideo;
