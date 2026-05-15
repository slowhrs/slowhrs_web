"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { ENTRY_VIDEOS } from "@/lib/constants";

gsap.registerPlugin(useGSAP);

interface CinemaEntryProps {
  onComplete: () => void;
}

export default function CinemaEntry({ onComplete }: CinemaEntryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const monoRef = useRef<HTMLSpanElement>(null);
  const stepInRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const [timeStr, setTimeStr] = useState("");
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Pick random video on mount
  const videoSrc = useRef(
    ENTRY_VIDEOS[Math.floor(Math.random() * ENTRY_VIDEOS.length)]
  );

  // Live LA timecode — HH:MM:SS PT
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }) + " PT"
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Lock body scroll during entry
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Wipe transition — click anywhere or auto-advance
  const doWipe = useCallback(() => {
    if (!wipeRef.current) return;
    tlRef.current?.kill();
    gsap
      .timeline()
      .set(wipeRef.current, { display: "block", y: "100%" })
      .to(wipeRef.current, {
        y: "0%",
        duration: 0.6,
        ease: "power3.inOut",
      })
      .to(wipeRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          localStorage.setItem("slowhrs_visited", new Date().toISOString());
          onComplete();
        },
      });
  }, [onComplete]);

  // Main GSAP timeline — 4 seconds, skippable after 1
  useGSAP(
    () => {
      const tl = gsap.timeline();
      tlRef.current = tl;

      // t=0.0s — mono text fades in bottom-left
      if (monoRef.current) {
        tl.fromTo(
          monoRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          0
        );
      }

      // t=0.5s — cursive logo center-screen
      if (logoRef.current) {
        tl.fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power4.out",
          },
          0.5
        );
      }

      // t=1.0s — skip button appears
      if (skipRef.current) {
        tl.to(skipRef.current, { opacity: 1, duration: 0.2 }, 1.0);
      }

      // t=2.0s — recap reel ramps in behind logo
      if (videoRef.current) {
        const v = videoRef.current;
        v.play().catch(() => {});
        tl.to(v, { opacity: 0.3, duration: 1 }, 2.0);
      }

      // t=3.0s — logo glows red, reel brightens, "step in" appears
      if (logoRef.current) {
        tl.to(
          logoRef.current,
          {
            filter:
              "brightness(1) drop-shadow(0 0 40px rgba(230,0,22,0.8))",
            duration: 1,
          },
          3.0
        );
      }
      if (videoRef.current) {
        tl.to(videoRef.current, { opacity: 0.8, duration: 1 }, 3.0);
      }
      if (stepInRef.current) {
        tl.fromTo(
          stepInRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          3.0
        );
      }

      // t=4.5s — auto-advance
      tl.call(doWipe, [], 4.5);

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef, dependencies: [doWipe] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      onClick={doWipe}
      role="button"
      tabIndex={0}
      aria-label="Enter SLOWHRS"
    >
      {/* Video background */}
      <video
        ref={videoRef}
        src={videoSrc.current}
        muted
        playsInline
        loop
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-0"
      />

      {/* Cursive logo — center */}
      <Image
        ref={logoRef}
        src="/assets/logos/logo_main.png"
        alt="SLOWHRS"
        title="SLOWHRS Cinematic Entry"
        width={280}
        height={80}
        priority
        className="relative z-10 opacity-0 w-[200px] md:w-[280px] h-auto object-contain"
        style={{
          filter: "drop-shadow(0 0 40px rgba(230,0,22,0.5))",
        }}
      />

      {/* Bottom-left mono */}
      <span
        ref={monoRef}
        className="absolute bottom-8 left-8 z-10 font-mono text-[11px] tracking-[0.15em] opacity-0"
        style={{ color: "rgba(237,237,235,0.55)" }}
      >
        by invitation. los angeles.
      </span>

      {/* Top-right timecode */}
      <span
        className="absolute top-8 right-8 z-10 font-mono text-[11px] tracking-[0.15em] tabular-nums"
        style={{ color: "rgba(237,237,235,0.4)" }}
      >
        {timeStr}
      </span>

      {/* Skip — hidden until 1.0s */}
      <button
        ref={skipRef}
        onClick={(e) => {
          e.stopPropagation();
          doWipe();
        }}
        className="absolute top-16 right-8 z-20 font-mono text-[10px] tracking-[0.15em] opacity-0 hover:text-red transition-colors"
        style={{ color: "rgba(237,237,235,0.4)" }}
      >
        skip ↗
      </button>

      {/* Bottom-center "step in" */}
      <span
        ref={stepInRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 font-mono text-[12px] tracking-[0.25em] text-red opacity-0"
      >
        step in →
      </span>

      {/* Wipe overlay */}
      <div
        ref={wipeRef}
        className="fixed inset-0 z-[10000] bg-black hidden"
        style={{ transform: "translateY(100%)" }}
      />
    </div>
  );
}
