"use client";

import React from "react";
import Image from "next/image";

const ARCHIVE_ITEMS = [
  {
    id: "block_party",
    title: "Block Party // 2025",
    subtitle: "LA's biggest crew run · Hosted by hardlyeverhome, waseelwav, lovechildww",
    category: "Events",
    date: "2025",
    type: "video",
    src: "/assets/events/block_party.mp4",
    duration: "02:14"
  },
  {
    id: "fast_life",
    title: "Fast Life Campaign // 2024",
    subtitle: "Clothing reel · Fall drop",
    category: "Drops",
    date: "2024",
    type: "video",
    src: "/assets/drops/fast_life_reel.mp4",
    duration: "00:45"
  },
  {
    id: "destroy_lonely",
    title: "Destroy Lonely // 03.14.25",
    subtitle: "WYA Trap Rave · Where You At LA",
    category: "Nightlife",
    date: "03.14.25",
    type: "video",
    src: "/assets/events/destroy_lonely.mp4",
    duration: "01:30"
  },
  {
    id: "nye",
    title: "NYE // Jsta Party",
    subtitle: "New Years recap · 12.31.24",
    category: "Events",
    date: "12.31.24",
    type: "video",
    src: "/assets/events/newyears.mp4",
    duration: "01:15"
  },
  {
    id: "dsrpt",
    title: "Eric Bellinger × DSRPT Noise Lab",
    subtitle: "Performance recap · Spring 24",
    category: "Performance",
    date: "2024",
    type: "video",
    src: "/assets/drops/christmas_drop.mp4",
    duration: "00:42"
  },
  {
    id: "kehlani",
    title: "Kehlani // 2024",
    subtitle: "Headline recap · Members + 1 only",
    category: "Headline",
    date: "2024",
    type: "video",
    src: "/assets/events/block_party.mp4",
    duration: "02:14"
  }
];

export default function ArchiveSection() {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="archive">

      {/* Ambient Sticker — Folder */}
      <div className="absolute top-16 right-8 md:right-16 w-[100px] md:w-[140px] opacity-[0.08] pointer-events-none rotate-[8deg] z-0">
        <Image src="/assets/icons/slowhrs_folder.png" alt="" width={140} height={140} className="w-full h-auto" aria-hidden="true" />
      </div>
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10 reveal">
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

        <div className="flex flex-col md:items-end gap-2 max-w-[300px] reveal reveal-d2">
          <div className="font-serif italic text-[1.2rem] text-brand-ink/80 text-left md:text-right">
            Some rooms are filmed. Some rooms become files. The archive is the proof.
          </div>
          {/* CD sticker accent */}
          <div className="hidden md:block w-[60px] mt-4 opacity-70 rotate-[-12deg] drop-shadow-[0_0_10px_rgba(230,0,22,0.3)] mix-blend-screen">
            <Image src="/assets/icons/CD.png" alt="SLOWHRS Archive CD" title="Archive Media" width={60} height={60} className="w-full h-auto pixel animate-[spin_12s_linear_infinite]" />
          </div>
        </div>
      </div>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {ARCHIVE_ITEMS.map((item, i) => (
          <div key={item.id} className={`group relative border border-brand-border bg-[#050505] overflow-hidden flex flex-col h-[380px] md:h-[450px] reveal reveal-d${Math.min(i + 1, 5)}`}>
            
            {/* File Header: category in red mono 9px, date right-aligned in mono 9px */}
            <div className="flex items-center justify-between p-3 border-b border-brand-border bg-[#0a0a0a] z-20">
              <span className="font-mono text-[9px] tracking-[0.2em] text-brand-red uppercase">{item.category}</span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-brand-ink/30 uppercase">{item.date}</span>
            </div>

            {/* Media Area */}
            <div className="relative flex-grow bg-black overflow-hidden flex items-center justify-center">
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
              <div className="absolute inset-0 w-full h-full bg-[#111] md:group-hover:opacity-0 transition-opacity duration-500 flex items-center justify-center">
                 <span className="font-mono text-[9px] tracking-[0.3em] text-brand-ink/20 uppercase">▶</span>
              </div>
              
              {/* CRT Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(255,255,255,0)_50%)] bg-[length:100%_4px] opacity-20 z-20"></div>
            </div>

            {/* File Info Footer: title in italic serif, subtitle below */}
            <div className="p-5 border-t border-brand-border bg-[#050505] z-20 flex flex-col gap-3 transition-colors group-hover:bg-[#0a0a0a]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] tracking-[0.2em] text-brand-red uppercase border border-brand-red/30 bg-brand-red/5 px-2 py-0.5">
                  {item.category}
                </span>
                <span className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">
                  {item.duration}
                </span>
              </div>
              <h3 className="font-serif italic text-[1.4rem] text-brand-ink leading-tight truncate">
                {item.title}
              </h3>
              <p className="font-mono text-[7px] tracking-[0.1em] text-brand-ink/40 uppercase truncate">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Archive CTA */}
      <div className="mt-12 flex justify-center reveal reveal-d3">
        <button className="border border-brand-ink/20 px-8 py-4 font-mono text-[9px] tracking-[0.2em] text-brand-ink/60 hover:text-brand-ink hover:border-brand-ink/60 transition-colors uppercase flex items-center gap-2">
          View Full Archive <span className="font-serif italic text-[1rem]">→</span>
        </button>
      </div>

    </section>
  );
}
