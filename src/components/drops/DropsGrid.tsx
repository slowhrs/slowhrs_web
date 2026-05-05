"use client";

import { motion, AnimatePresence } from "motion/react";
import { DROPS } from "./drops.data";
import type { Drop } from "./drops.data";
import DropTile from "./DropTile";
import styles from "./DropsGrid.module.css";

interface DropsGridProps {
  onSelect: (drop: Drop) => void;
}

export default function DropsGrid({ onSelect }: DropsGridProps) {
  return (
    <section className={styles.gridSection}>
      <div className={styles.grid}>
        <AnimatePresence mode="popLayout">
          {DROPS.map((drop, i) => (
            <motion.div
              key={drop.id}
              className={styles.cell}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <DropTile drop={drop} onClick={onSelect} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
