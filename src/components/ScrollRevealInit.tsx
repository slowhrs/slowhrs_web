"use client";

import { useEffect } from "react";

/**
 * Global IntersectionObserver for scroll-reveal animations.
 * Targets all elements with `.reveal` or `.reveal-left` classes
 * and adds `.visible` when they enter the viewport.
 */
export default function ScrollRevealInit() {
  useEffect(() => {
    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // Fire once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    // Observe all reveal targets
    const targets = document.querySelectorAll(".reveal, .reveal-left");
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null; // Render nothing — side-effect only
}
