"use client";

import { useEffect, useRef, useState } from "react";
import type { Event } from "./events.data";
import styles from "./EventTile.module.css";

interface EventTileProps {
  event: Event;
  onClick: (event: Event) => void;
}

export default function EventTile({ event, onClick }: EventTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // IntersectionObserver: play video when in view
  useEffect(() => {
    const el = tileRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Aspect ratio class
  const aspectClass =
    event.width === "wide" ? styles.aspectWide : styles.aspectTall;

  return (
    <div
      ref={tileRef}
      className={`${styles.tile} ${isInView && !reducedMotion ? styles.tileRevealed : ""}`}
      data-video-tile
      onClick={() => onClick(event)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(event); }}
      aria-label={`View ${event.name}`}
    >
      <div className={`${styles.mediaWrap} ${aspectClass}`}>
        {/* Video */}
        <video
          ref={videoRef}
          src={event.videoSrc}
          muted
          playsInline
          loop
          preload="metadata"
          className={`${styles.video} ${isInView ? styles.videoVisible : ""}`}
        />

        {/* Red corner mark */}
        <div className={styles.cornerMark} aria-hidden="true" />
      </div>

      {/* Metadata strip */}
      <div className={styles.metaStrip}>
        <h3 className={styles.name}>{event.name}</h3>
        <p className={styles.venue}>
          {event.venue} · {event.date}
        </p>
      </div>
    </div>
  );
}
