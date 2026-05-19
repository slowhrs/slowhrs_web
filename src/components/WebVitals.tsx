"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * v2.4-4-velocity: log Core Web Vitals to the console in development and
 * forward them to Vercel's analytics endpoint when the env var is set. This
 * is a passive instrument — it does not influence rendering and adds zero
 * weight to the critical path beyond what Next.js already ships.
 */
export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "production") {
      const value =
        metric.name === "CLS" ? metric.value.toFixed(3) : Math.round(metric.value);
      console.log(`[web-vital] ${metric.name}=${value} (${metric.rating})`);
      return;
    }

    if (typeof window === "undefined" || !navigator.sendBeacon) return;
    const url = process.env.NEXT_PUBLIC_VITALS_URL;
    if (!url) return;
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
    });
    try {
      navigator.sendBeacon(url, body);
    } catch {
      // never block rendering on analytics
    }
  });

  return null;
}
