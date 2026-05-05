"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Event } from "./events.data";
import styles from "./EventLightbox.module.css";

interface EventLightboxProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventLightbox({ event, onClose }: EventLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (event) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [event]);

  // Esc to close
  useEffect(() => {
    if (!event) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [event, onClose]);

  // Play video when lightbox opens
  useEffect(() => {
    if (event && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [event]);

  const motionProps = reducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
        exit: { opacity: 0, scale: 0.97, transition: { duration: 0.25 } },
      };

  return (
    <AnimatePresence>
      {event && (
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
            {/* Close button */}
            <button className={styles.close} onClick={onClose} aria-label="Close">
              ×
            </button>

            {/* Video */}
            <div className={styles.videoSection}>
              <video
                ref={videoRef}
                src={event.videoSrc}
                controls
                playsInline
                loop
                preload="auto"
                className={styles.video}
              />
            </div>

            {/* Metadata sidebar */}
            <div className={styles.sidebar}>
              <h2 className={styles.title}>{event.name}</h2>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>{event.date}</span>
                <span className={styles.metaDivider}>·</span>
                <span className={styles.metaLabel}>{event.venue}</span>
              </div>
              <p className={styles.caption}>{event.caption}</p>
              <div className={styles.credits}>
                <p className={styles.creditLine}>directed — tk</p>
                <p className={styles.creditLine}>camera — tk</p>
                <p className={styles.creditLine}>edit — tk</p>
              </div>
              <span className={styles.category}>{event.category}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
