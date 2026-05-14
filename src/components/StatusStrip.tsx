"use client";

import { useEffect, useState } from "react";

/**
 * Aggregate attendee count from SLOWHRS Partiful events (2024–2026).
 * Block Party 2025: 5,000+ | Destroy Lonely WYA: ~1,200 | NYE Jsta Party: ~800
 * ACT III Finale: ~500 | The Green Room: ~400 | Vogue Safari: ~300
 * Casting / Selection / Socials: ~300+ across multiple events
 * Source: Partiful RSVPs, YouTube recap data, LA Weekly coverage.
 */
const TOTAL_ATTENDED = 8500;

export default function StatusStrip() {
  const [count, setCount] = useState(0);

  // Animated counter on mount
  useEffect(() => {
    const duration = 2200;
    const steps = 60;
    const increment = TOTAL_ATTENDED / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), TOTAL_ATTENDED);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-[3] border-t border-brand-border bg-black/65 backdrop-blur-md grid grid-cols-2 md:grid-cols-4">
      <div className="p-4 md:p-5 border-r border-brand-border border-b md:border-b-0 relative group">
        <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-brand-red rounded-full shadow-[0_0_8px_var(--red)] animate-blink"></div>
        <div className="font-mono text-[9px] tracking-[0.3em] text-brand-ink-faint uppercase mb-1.5">
          NEXT EVENT
        </div>
        <div className="font-serif italic font-medium text-2xl text-brand-red">
          LOADING
        </div>
      </div>
      
      <div className="p-4 md:p-5 border-b md:border-b-0 md:border-r border-brand-border relative">
        <div className="font-mono text-[9px] tracking-[0.3em] text-brand-ink-faint uppercase mb-1.5">
          ATTENDED
        </div>
        <div className="font-serif italic font-medium text-2xl text-brand-ink">
          {count.toLocaleString()}+
        </div>
      </div>

      <div className="p-4 md:p-5 border-r border-brand-border relative">
        <div className="font-mono text-[9px] tracking-[0.3em] text-brand-ink-faint uppercase mb-1.5">
          DROPS
        </div>
        <div className="font-serif italic font-medium text-2xl text-brand-ink">
          3
        </div>
      </div>

      <div className="p-4 md:p-5 relative">
        <div className="font-mono text-[9px] tracking-[0.3em] text-brand-ink-faint uppercase mb-1.5">
          ARCHIVE
        </div>
        <div className="font-serif italic font-medium text-2xl text-brand-ink">
          OPEN
        </div>
      </div>
    </div>
  );
}
