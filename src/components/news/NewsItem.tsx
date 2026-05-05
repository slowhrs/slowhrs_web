"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { NewsEntry } from "./news.data";
import styles from "./NewsItem.module.css";

interface NewsItemProps {
  entry: NewsEntry;
  index: number;
}

export default function NewsItem({ entry, index }: NewsItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsRevealed(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.article
      ref={itemRef}
      className={`${styles.item} ${entry.locked ? styles.itemLocked : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isRevealed ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className={styles.dateLine}>
        <span className={styles.date}>{entry.date}</span>
        <span className={styles.tag}>{entry.tag}</span>
      </div>

      <h3 className={styles.headline}>{entry.headline}</h3>

      {entry.locked ? (
        <p className={styles.lockedText}>members only</p>
      ) : (
        <p className={styles.body}>{entry.body}</p>
      )}
    </motion.article>
  );
}
