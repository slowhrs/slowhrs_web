"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const STATUS_LINES = [
  "BOOTING SLOWHRS_",
  "INSERTING TAPE_",
  "TRACKING SIGNAL_",
  "CHECKING THE LIST_",
  "ACCESS FILE FOUND_"
];

// Total time the loader is on-screen (ms). Kept short so clicks land fast.
const VISIBLE_MS = 1100;
// Pointer-events go off this much sooner so the nav is reachable even mid-fade.
const POINTER_RELEASE_MS = 350;
// Fade-out duration (must match the CSS transition-duration).
const FADE_MS = 380;
const SESSION_KEY = "slowhrs:booted";

export default function Loader() {
  const [phase, setPhase] = useState<"hidden" | "showing" | "fading" | "gone">(
    "hidden"
  );
  const [statusIdx, setStatusIdx] = useState(0);
  const [timecode, setTimecode] = useState("12:45:00:00");

  const dismiss = useCallback(() => {
    setPhase((current) => (current === "showing" ? "fading" : current));
  }, []);

  useEffect(() => {
    let booted = false;
    try {
      booted = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      booted = false;
    }

    // Defer to a microtask so we never call setState in the same tick as the
    // effect body (eslint rule react-hooks/set-state-in-effect).
    const raf = window.requestAnimationFrame(() => {
      if (booted) {
        setPhase("gone");
        return;
      }
      setPhase("showing");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
    });

    const fadeTimer = window.setTimeout(() => {
      setPhase((p) => (p === "showing" ? "fading" : p));
    }, VISIBLE_MS);
    const goneTimer = window.setTimeout(() => {
      setPhase("gone");
    }, VISIBLE_MS + FADE_MS);

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onEscape);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(goneTimer);
      window.removeEventListener("keydown", onEscape);
    };
  }, [dismiss]);

  useEffect(() => {
    if (phase !== "showing") return;
    const interval = window.setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % STATUS_LINES.length);
    }, 320);
    const glitch = window.setInterval(() => {
      const r = () => String(Math.floor(Math.random() * 60)).padStart(2, "0");
      setTimecode(`${r()}:${r()}:${r()}:${r()}`);
    }, 60);
    return () => {
      window.clearInterval(interval);
      window.clearInterval(glitch);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "showing") return;
    const pointerTimer = window.setTimeout(() => {
      const overlay = document.getElementById("slowhrs-boot");
      if (overlay) overlay.style.pointerEvents = "none";
    }, POINTER_RELEASE_MS);
    return () => window.clearTimeout(pointerTimer);
  }, [phase]);

  if (phase === "hidden" || phase === "gone") return null;

  const isFading = phase === "fading";

  return (
    <div
      id="slowhrs-boot"
      role="presentation"
      onClick={dismiss}
      className={`fixed inset-0 z-[10000] flex flex-col justify-center items-center bg-black p-8 transition-opacity duration-[380ms] ease-out ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      style={{ cursor: "pointer" }}
    >
      <div className="absolute top-5 left-5 font-mono text-[9px] tracking-[0.22em] text-brand-red uppercase flex items-center gap-1.5">
        <div className="w-2 h-2 bg-brand-red rounded-full shadow-[0_0_6px_var(--red)] animate-blink"></div>
        REC
      </div>
      <div className="absolute top-5 right-5 font-mono text-[16px] tracking-[0.1em] text-brand-ink-dim">
        {timecode}
      </div>

      <div className="w-[min(380px,75vw)] mb-6 drop-shadow-[0_0_30px_rgba(230,0,22,0.5)] animate-flicker">
        <Image
          src="/assets/logos/logo_main.png"
          alt="SLOWHRS"
          title="SLOWHRS System Boot"
          width={380}
          height={86}
          priority
          className="w-full h-auto"
        />
      </div>

      <div className="font-mono text-[18px] md:text-[22px] tracking-[0.18em] text-brand-ink-dim uppercase text-center h-[1.2em] mb-5 leading-none">
        {STATUS_LINES[statusIdx]}
      </div>

      <div className="w-[min(320px,70vw)] h-3 border border-brand-red p-0.5 flex gap-0.5 bg-black">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-brand-red shadow-[0_0_4px_var(--red)]"
            style={{
              animation: `slowhrs-boot-fade 0.08s ease forwards ${i * 0.05}s`,
              opacity: 0,
            }}
          ></div>
        ))}
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.32em] uppercase text-brand-ink-dim/70">
        tap to enter ↗
      </p>

      <style jsx>{`
        @keyframes slowhrs-boot-fade {
          to {
            opacity: 1;
          }
        }
      `}</style>

      <div className="absolute w-[22px] h-[22px] border border-brand-red opacity-60 top-3.5 left-3.5 border-r-0 border-b-0"></div>
      <div className="absolute w-[22px] h-[22px] border border-brand-red opacity-60 top-3.5 right-3.5 border-l-0 border-b-0"></div>
      <div className="absolute w-[22px] h-[22px] border border-brand-red opacity-60 bottom-3.5 left-3.5 border-r-0 border-t-0"></div>
      <div className="absolute w-[22px] h-[22px] border border-brand-red opacity-60 bottom-3.5 right-3.5 border-l-0 border-t-0"></div>
    </div>
  );
}
