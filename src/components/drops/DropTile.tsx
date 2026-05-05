"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Drop } from "./drops.data";
import { STATUS_STICKERS } from "./drops.data";
import styles from "./DropTile.module.css";

interface DropTileProps {
  drop: Drop;
  onClick: (drop: Drop) => void;
}

export default function DropTile({ drop, onClick }: DropTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

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

  const sticker = STATUS_STICKERS[drop.status];
  const isGone = drop.status === "gone";

  return (
    <div
      ref={tileRef}
      className={`${styles.tile} ${isGone ? styles.tileGone : ""}`}
      data-video-tile
      onClick={() => onClick(drop)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(drop); }}
      aria-label={`View ${drop.name}`}
    >
      {/* Video */}
      <div className={styles.mediaWrap}>
        <video
          ref={videoRef}
          src={drop.videoSrc}
          muted
          playsInline
          loop
          preload="metadata"
          className={`${styles.video} ${isInView ? styles.videoVisible : ""}`}
        />

        {/* Status sticker overlay */}
        {sticker.src && (
          <div className={styles.stickerWrap}>
            <Image
              src={sticker.src}
              alt={sticker.label}
              width={120}
              height={120}
              className={styles.sticker}
            />
          </div>
        )}

        {/* Red corner mark */}
        <div className={styles.cornerMark} aria-hidden="true" />
      </div>

      {/* Info strip */}
      <div className={styles.infoStrip}>
        <div className={styles.infoLeft}>
          <h3 className={styles.name}>{drop.name}</h3>
          <p className={styles.collection}>{drop.collection}</p>
        </div>
        <span className={`${styles.price} ${isGone ? styles.priceGone : ""}`}>
          {drop.price}
        </span>
      </div>
    </div>
  );
}
