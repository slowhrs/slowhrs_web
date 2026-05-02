"use client";

import React from "react";
import Image from "next/image";

// Simulated archive database
const ARCHIVE_ITEMS = [
  {
    id: "runway_01",
    title: "ACT III: THE FINALE",
    category: "RUNWAY",
    date: "10.28.25",
    type: "video",
    src: "/assets/media/block_party.mp4", // Using the real block party video as a runway/event stand-in
    icon: "/assets/icons/CD.png",
    duration: "02:14"
  },
  {
    id: "drop_fw25",
    title: "FW25 UNIFORM DROP",
    category: "DROPS",
    date: "09.15.25",
    type: "video",
    src: "/assets/media/Clothing_reel.mp4", // Real clothing reel
    icon: "/assets/icons/slowhrs_folder.png",
    duration: "00:45"
  },
  {
    id: "casting_la",
    title: "OPEN CASTING - LA",
    category: "CASTING",
    date: "08.02.25",
    type: "image",
    src: "/assets/images/placeholder.jpg", // We don't have a specific casting image, we'll use CSS fallback
    icon: "/assets/icons/archive_pixel_border.png",
    size: "45MB"
  },
  {
    id: "bts_film",
    title: "SHORT FILM: BEHIND THE SCENES",
    category: "BEHIND THE SCENES",
    date: "07.20.25",
    type: "image",
    src: "/assets/images/placeholder.jpg",
    icon: "/assets/icons/savedisk.png",
    size: "1.2GB"
  },
  {
    id: "nightlife_04",
    title: "THE WAREHOUSE SHOW",
    category: "NIGHTLIFE",
    date: "06.10.25",
    type: "video",
    src: "/assets/media/block_party.mp4", // Re-using to show grid population without loading too many huge files
    icon: "/assets/icons/CD.png",
    duration: "01:30"
  },
  {
    id: "reel_02",
    title: "SUMMER CAPSULE ARCHIVE",
    category: "CLOTHING REELS",
    date: "05.05.25",
    type: "video",
    src: "/assets/media/Clothing_reel.mp4",
    icon: "/assets/icons/slowhrs_folder.png",
    duration: "00:59"
  }
];

export default function ArchiveSection() {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="archive">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10">
        <div className="max-w-[600px]">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-4 flex items-center gap-2">
            ARCHIVE / EVIDENCE
          </div>
          <h2 className="font-serif italic font-normal text-[2.5rem] md:text-[4rem] text-brand-ink leading-none mb-6">
            Proof The Room Happened
          </h2>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 max-w-[50ch] leading-[1.6] uppercase">
            Runway, nightlife, castings, drops, behind the scenes, and clothing reels filed from the city after dark.
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-2 max-w-[300px]">
          <div className="font-serif italic text-[1.2rem] text-brand-ink/80 text-left md:text-right">
            Some rooms are filmed. Some rooms become files. The archive is the proof.
          </div>
        </div>
      </div>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {ARCHIVE_ITEMS.map((item) => (
          <div key={item.id} className="group relative border border-brand-border bg-[#050505] overflow-hidden flex flex-col h-[380px] md:h-[450px]">
            
            {/* File Header */}
            <div className="flex items-center justify-between p-3 border-b border-brand-border bg-[#0a0a0a] z-20">
              <div className="flex items-center gap-2">
                <Image src={item.icon} alt="Icon" width={14} height={14} className="opacity-70 pixel mix-blend-screen" />
                <span className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/50 uppercase">{item.id}.dat</span>
              </div>
              <span className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/30 uppercase">{item.date}</span>
            </div>

            {/* Media Area */}
            <div className="relative flex-grow bg-black overflow-hidden flex items-center justify-center">
              
              {/* CSS Fallback for missing images/posters to avoid heavy loads */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none z-10">
                <div className="font-mono text-[10px] tracking-[0.4em] text-brand-ink uppercase rotate-[-90deg] origin-center translate-y-8">
                  FILE_{item.category}
                </div>
              </div>

              {item.type === "video" ? (
                <>
                  {/* Desktop Hover Video (Hidden on mobile to save bandwidth/battery) */}
                  <video 
                    src={item.src} 
                    muted 
                    playsInline 
                    loop 
                    className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-60 transition-opacity duration-700 blur-[2px] group-hover:blur-0 grayscale group-hover:grayscale-0"
                    onMouseOver={e => e.currentTarget.play()}
                    onMouseOut={e => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  {/* Static Placeholder for Mobile and Desktop Rest State */}
                  <div className="absolute inset-0 w-full h-full bg-[#111] md:group-hover:opacity-0 transition-opacity duration-500 flex items-center justify-center">
                     <span className="font-mono text-[9px] tracking-[0.3em] text-brand-ink/20 uppercase border border-brand-ink/10 px-3 py-1 bg-black/50 backdrop-blur-sm">
                       [REC_FILE]
                     </span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 w-full h-full bg-[#0a0a0a] flex items-center justify-center">
                  <span className="font-mono text-[9px] tracking-[0.3em] text-brand-ink/20 uppercase border border-brand-ink/10 px-3 py-1 bg-black/50">
                    [DATA_RESTRICTED]
                  </span>
                </div>
              )}
              
              {/* CRT Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(255,255,255,0)_50%)] bg-[length:100%_4px] opacity-20 z-20"></div>
            </div>

            {/* File Info Footer */}
            <div className="p-5 border-t border-brand-border bg-[#050505] z-20 flex flex-col gap-3 transition-colors group-hover:bg-[#0a0a0a]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] tracking-[0.2em] text-brand-red uppercase border border-brand-red/30 bg-brand-red/5 px-2 py-0.5">
                  {item.category}
                </span>
                <span className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">
                  {item.duration || item.size}
                </span>
              </div>
              <h3 className="font-serif italic text-[1.4rem] text-brand-ink leading-tight truncate">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Archive CTA */}
      <div className="mt-12 flex justify-center">
        <button className="border border-brand-ink/20 px-8 py-4 font-mono text-[9px] tracking-[0.2em] text-brand-ink/60 hover:text-brand-ink hover:border-brand-ink/60 transition-colors uppercase flex items-center gap-2">
          DECRYPT FULL ARCHIVE <span className="font-serif italic text-[1rem]">→</span>
        </button>
      </div>

    </section>
  );
}
