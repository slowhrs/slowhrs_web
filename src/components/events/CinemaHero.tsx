"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HERO_EVENTS } from "./events.data";
import styles from "./CinemaHero.module.css";

const CYCLE_MS = 8000;
const FADE_MS = 600;

export default function CinemaHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = HERO_EVENTS[currentIndex];

  // Detect mobile + reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);

    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(rm.matches);
    const rmHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    rm.addEventListener("change", rmHandler);

    return () => {
      mq.removeEventListener("change", handler);
      rm.removeEventListener("change", rmHandler);
    };
  }, []);

  // Auto-cycle (desktop only, 2+ videos)
  const advanceCycle = useCallback(() => {
    if (isMobile || HERO_EVENTS.length < 2) return;
    setCurrentIndex((prev) => (prev + 1) % HERO_EVENTS.length);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile || HERO_EVENTS.length < 2) return;

    timerRef.current = setInterval(advanceCycle, CYCLE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isMobile, advanceCycle]);

  // Play current video, pause others
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === currentIndex) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [currentIndex]);

  const fadeVariants = reducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: FADE_MS / 1000 } },
        exit: { opacity: 0, transition: { duration: FADE_MS / 1000 } },
      };

  const textVariants = reducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } },
        exit: { opacity: 0, y: -4, transition: { duration: 0.3 } },
      };

  return (
    <section className={styles.hero}>
      {/* REC indicator */}
      <div className={styles.recDot}>
        <span className="animate-blink-fast" aria-hidden="true">●</span>
        <span>REC</span>
      </div>

      {/* Video layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className={styles.videoWrap}
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <video
            ref={(el) => { videoRefs.current[currentIndex] = el; }}
            src={current.videoSrc}
            muted
            playsInline
            loop
            preload={currentIndex <= 1 ? "auto" : "metadata"}
            className={styles.video}
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom gradient */}
      <div className={styles.gradient} />

      {/* Title overlay */}
      <div className={styles.titleWrap}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + "-text"}
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <h2 className={styles.title}>{current.name}</h2>
            <p className={styles.meta}>
              {current.venue} · {current.date}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cycle indicators (desktop only, 2+ videos) */}
      {!isMobile && HERO_EVENTS.length >= 2 && (
        <div className={styles.indicators}>
          {HERO_EVENTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`${styles.indicator} ${i === currentIndex ? styles.indicatorActive : ""}`}
              aria-label={`Go to event ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
