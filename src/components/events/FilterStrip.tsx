"use client";

import { useEffect, useRef, useState } from "react";
import { FILTER_CATEGORIES } from "./events.data";
import type { EventCategory } from "./events.data";
import styles from "./FilterStrip.module.css";

interface FilterStripProps {
  active: string;
  onChange: (category: string) => void;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

export default function FilterStrip({ active, onChange, sentinelRef }: FilterStripProps) {
  const [visible, setVisible] = useState(false);

  // Only show after scrolling past the hero (sentinel)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show filter strip when sentinel leaves viewport (scrolled past hero)
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelRef]);

  return (
    <div className={`${styles.strip} ${visible ? styles.stripVisible : ""}`}>
      <div className={styles.inner}>
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`${styles.btn} ${active === cat ? styles.btnActive : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
