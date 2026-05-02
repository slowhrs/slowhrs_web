"use client";

import Image from "next/image";

export default function UpdatesSection() {
  const feedItems = [
    { title: "ACT III ARCHIVE PROCESSING", date: "TODAY 03:00AM", status: "PROCESSING", category: "RECAP", isLocked: false },
    { title: "NEXT DROP LOADING", date: "12.01.25", status: "MEMBERS ONLY", category: "UNIFORM", isLocked: true },
    { title: "CASTING WINDOW OPEN", date: "11.20.25", status: "PUBLIC", category: "CASTING", isLocked: false },
    { title: "PRIVATE CALENDAR UPDATED", date: "11.15.25", status: "ACCESS REQUIRED", category: "EVENTS", isLocked: true },
    { title: "RUNWAY FILM EXPORTING", date: "11.02.25", status: "ARCHIVE LIVE", category: "FILM", isLocked: false }
  ];

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="updates">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10">
        <div className="max-w-[600px]">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-4 flex items-center gap-2">
            UPDATES / TRANSMISSION
          </div>
          <h2 className="font-serif italic font-normal text-[2.5rem] md:text-[4rem] text-brand-ink leading-none mb-6">
            The Feed Is Always Moving
          </h2>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 max-w-[45ch] leading-[1.6] uppercase">
            Drops, castings, recaps, and private calendar notes. Some files stay locked until access is approved.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 relative z-10">
        
        {/* Left Side - Microcopy & Terminal Info */}
        <div className="flex flex-col gap-6">
          <div className="p-6 border border-brand-border bg-black/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-brand-border/40"></div>
            <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-brand-ink/40 uppercase mb-4">
              <div className="w-1.5 h-1.5 bg-brand-ink/40 rounded-full animate-blink"></div>
              TERMINAL FEED
            </div>
            
            <p className="font-serif italic text-[1.4rem] text-brand-ink/90 leading-snug mb-6">
              Some signals are public. Some only move through the list.
            </p>
            
            <p className="font-mono text-[9px] tracking-[0.1em] text-brand-ink/50 uppercase">
              If it says locked, you are early or outside.
            </p>

            {/* Locked Sticker Accent - Appears here instead of directly on a feed item so it doesn't break feed flow */}
            <div className="absolute -bottom-6 -right-4 z-20 w-[120px] opacity-80 pointer-events-none rotate-[-15deg] drop-shadow-[0_0_12px_rgba(230,0,22,0.4)] mix-blend-screen">
              <Image src="/assets/widgets/locked.png" alt="Locked" width={120} height={120} className="w-full h-auto pixel" />
            </div>
          </div>
        </div>

        {/* Right Side - Transmission Feed */}
        <div className="flex flex-col gap-4">
          <div className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/30 uppercase mb-2 flex justify-between">
            <span>TRANSMISSION_LOG</span>
            <span>STATUS</span>
          </div>

          <div className="flex flex-col border border-brand-border bg-black/20">
            {feedItems.map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 border-b border-brand-border/50 hover:bg-[#0a0a0a] transition-colors group cursor-pointer relative overflow-hidden">
                
                {/* CSS CRT Scanline Hover Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(255,255,255,0)_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>

                <div className="flex flex-col gap-2 relative z-10 mb-4 sm:mb-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">{item.date}</span>
                    <span className="font-mono text-[7px] tracking-[0.2em] text-brand-ink/30 uppercase border border-brand-ink/20 px-1 py-0.5">{item.category}</span>
                  </div>
                  <h4 className={`font-serif italic text-[1.4rem] md:text-[1.8rem] leading-tight ${item.isLocked ? 'text-brand-ink/50' : 'text-brand-ink group-hover:text-brand-red transition-colors'}`}>
                    {item.title}
                  </h4>
                </div>

                <div className="relative z-10 self-start sm:self-center">
                  <div className={`font-mono text-[8px] tracking-[0.2em] px-2 py-1 uppercase ${item.isLocked ? 'bg-transparent border border-brand-ink/20 text-brand-ink/40' : 'bg-brand-red/10 border border-brand-red/30 text-brand-red'}`}>
                    {item.status}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
