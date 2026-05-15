"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const STATUS_LINES = [
  "BOOTING SLOWHRS_",
  "INSERTING TAPE_",
  "TRACKING SIGNAL_",
  "CHECKING THE LIST_",
  "ACCESS FILE FOUND_"
];

export default function Loader() {
  const [isOut, setIsOut] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [timecode, setTimecode] = useState('12:45:00:00');

  useEffect(() => {
    // Cycle through status lines
    const interval = setInterval(() => {
      setStatusIdx((prev) => (prev + 1) % STATUS_LINES.length);
    }, 450);

    // Glitch timecode — rapidly cycle random numbers
    const glitchInterval = setInterval(() => {
      const r = () => String(Math.floor(Math.random() * 60)).padStart(2, '0');
      setTimecode(`${r()}:${r()}:${r()}:${r()}`);
    }, 60);

    // Simple timer to remove the boot loader after a short delay
    const timer = setTimeout(() => {
      setIsOut(true);
    }, 2500);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, []);

  if (isOut) return null;

  return (
    <div className={`fixed inset-0 bg-black z-[10000] flex flex-col justify-center items-center p-8 transition-opacity duration-500`}>
      {/* HUD Info */}
      <div className="absolute top-5 left-5 font-mono text-[9px] tracking-[0.22em] text-brand-red uppercase flex items-center gap-1.5">
        <div className="w-2 h-2 bg-brand-red rounded-full shadow-[0_0_6px_var(--red)] animate-blink"></div>
        REC
      </div>
      <div className="absolute top-5 right-5 font-mono text-[16px] tracking-[0.1em] text-brand-ink-dim">
        {timecode}
      </div>

      {/* Main Boot Mark */}
      <div className="w-[min(380px,75vw)] mb-6 drop-shadow-[0_0_30px_rgba(230,0,22,0.5)] animate-flicker">
        <Image 
          src="/assets/logos/logo_main.png" 
          alt="SLOWHRS"
          title="SLOWHRS System Boot"
          width={380} 
          height={86} 
          className="w-full h-auto"
        />
      </div>

      <div className="font-mono text-[22px] tracking-[0.18em] text-brand-ink-dim uppercase text-center h-[1.2em] mb-5 leading-none">
        {STATUS_LINES[statusIdx]}
      </div>

      {/* Loading Bar */}
      <div className="w-[min(320px,70vw)] h-4 border border-brand-red p-0.5 flex gap-0.5 bg-black">
        {[...Array(16)].map((_, i) => (
          <div 
            key={i} 
            className="flex-1 bg-brand-red shadow-[0_0_4px_var(--red)]"
            style={{ 
              animation: `fade-in 0.1s ease forwards ${i * 0.1}s`,
              opacity: 0
            }}
          ></div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          to { opacity: 1; }
        }
      `}</style>

      {/* Corner Brackets */}
      <div className="absolute w-[22px] h-[22px] border border-brand-red opacity-60 top-3.5 left-3.5 border-r-0 border-b-0"></div>
      <div className="absolute w-[22px] h-[22px] border border-brand-red opacity-60 top-3.5 right-3.5 border-l-0 border-b-0"></div>
      <div className="absolute w-[22px] h-[22px] border border-brand-red opacity-60 bottom-3.5 left-3.5 border-r-0 border-t-0"></div>
      <div className="absolute w-[22px] h-[22px] border border-brand-red opacity-60 bottom-3.5 right-3.5 border-l-0 border-t-0"></div>
    </div>
  );
}
