"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import type { Drop } from "./drops.data";
import { STATUS_STICKERS } from "./drops.data";
import styles from "./DropLightbox.module.css";

interface DropLightboxProps {
  drop: Drop | null;
  onClose: () => void;
}

export default function DropLightbox({ drop, onClose }: DropLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (drop) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [drop]);

  // Esc to close
  useEffect(() => {
    if (!drop) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [drop, onClose]);

  // Play video
  useEffect(() => {
    if (drop && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [drop]);

  const motionProps = reducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
        exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
      };

  return (
    <AnimatePresence>
      {drop && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.content}
            {...motionProps}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.close} onClick={onClose} aria-label="Close">
              ×
            </button>

            {/* Video */}
            <div className={styles.videoSection}>
              <video
                ref={videoRef}
                src={drop.videoSrc}
                muted
                playsInline
                loop
                preload="auto"
                className={styles.video}
              />
              {/* Sticker on video */}
              {STATUS_STICKERS[drop.status].src && (
                <div className={styles.videoSticker}>
                  <Image
                    src={STATUS_STICKERS[drop.status].src!}
                    alt={STATUS_STICKERS[drop.status].label}
                    width={160}
                    height={160}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className={styles.sidebar}>
              <span className={styles.collection}>{drop.collection}</span>
              <h2 className={styles.title}>{drop.name}</h2>
              <span className={`${styles.price} ${drop.status === "gone" ? styles.priceGone : ""}`}>
                {drop.price}
              </span>
              <p className={styles.description}>{drop.description}</p>

              <div className={styles.detailsList}>
                {drop.details.map((d, i) => (
                  <p key={i} className={styles.detailLine}>{d}</p>
                ))}
              </div>

              {/* CTA */}
              {drop.status === "available" && (
                <button className={styles.cta}>inquire</button>
              )}
              {drop.status === "members_first" && (
                <p className={styles.membersNote}>members have first access</p>
              )}
              {drop.status === "gone" && (
                <p className={styles.goneNote}>this piece is gone</p>
              )}

              <span className={styles.statusTag}>
                {drop.status === "gone" ? "sold out" : drop.status === "members_first" ? "members first" : "available"}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
