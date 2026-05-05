"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { EVENTS } from "./events.data";
import type { Event } from "./events.data";
import EventTile from "./EventTile";
import styles from "./EventsGrid.module.css";

interface EventsGridProps {
  activeFilter: string;
  onSelect: (event: Event) => void;
}

export default function EventsGrid({ activeFilter, onSelect }: EventsGridProps) {
  const filtered = useMemo(() => {
    if (activeFilter === "all") return EVENTS;
    return EVENTS.filter((e) => e.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className={styles.gridSection}>
      <div className={styles.grid}>
        <AnimatePresence mode="popLayout">
          {filtered.map((event) => (
            <motion.div
              key={event.id}
              className={`${styles.cell} ${styles[`cell_${event.width}`]}`}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              <EventTile event={event} onClick={onSelect} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
