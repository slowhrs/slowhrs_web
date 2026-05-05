"use client";

import React from "react";
import Image from "next/image";

export default function AccessSection() {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="access">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10">
        <div className="max-w-[600px]">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-4 flex items-center gap-2">
            {/* // Application */}
            <span className="text-brand-red">// Application</span>
          </div>
          <h2 className="font-serif italic font-normal text-[2.5rem] md:text-[4rem] text-brand-ink leading-none mb-6">
            Access Is Not A Newsletter. It Is The List.
          </h2>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 max-w-[45ch] leading-[1.6] uppercase">
            Request access to events, drops, castings, and private archive updates.
          </p>
        </div>

        {/* Tier indicator — replaces HP/heart row */}
        <div className="hidden lg:flex flex-col items-end gap-2 opacity-80">
          <div className="font-mono text-[10px] tracking-[0.2em] text-brand-ink/60 uppercase">
            Tier 01 / Guest
          </div>
          <div className="font-mono text-[14px] tracking-[0.1em] text-brand-ink/40">
            ▮▯▯▯
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 lg:gap-16 relative z-10">
        
        {/* Left Panel - Digital Access Card Widget */}
        <div className="relative group perspective-1000">
          
          {/* Subtle Sticker Accent */}
          <div className="absolute -top-6 -right-6 z-20 w-[90px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rotate-12 drop-shadow-[0_0_12px_rgba(230,0,22,0.3)]">
            <Image src="/assets/widgets/Access.png" alt="Access?" width={100} height={100} className="w-full h-auto pixel" />
          </div>

          <div className="border border-brand-border bg-[#050505] relative overflow-hidden transition-transform duration-700 transform-gpu group-hover:-translate-y-2 group-hover:rotate-x-2 group-hover:-rotate-y-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            
            {/* Card Header */}
            <div className="bg-[#111] p-4 border-b border-brand-border flex justify-between items-center">
              <div className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">
                DIGITAL IDENTITY CARD
              </div>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-brand-ink/20"></div>
                <div className="w-1.5 h-1.5 bg-brand-ink/20"></div>
                <div className="w-1.5 h-1.5 bg-brand-ink/20"></div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <div className="mb-8 opacity-80 mix-blend-screen w-[100px]">
                <Image src="/assets/logos/logo_main.png" alt="SLOWHRS" width={150} height={34} className="w-full h-auto" />
              </div>
              
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[7px] tracking-[0.3em] text-brand-ink/30 uppercase">MEMBER ID</span>
                  <span className="font-mono text-[14px] tracking-[0.1em] text-brand-ink uppercase">SH-00024</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[7px] tracking-[0.3em] text-brand-ink/30 uppercase">STATUS</span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-brand-red uppercase border border-brand-red/30 bg-brand-red/5 px-2 py-1 self-start">
                    PENDING
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[7px] tracking-[0.3em] text-brand-ink/30 uppercase">CITY</span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-brand-ink/80 uppercase">LOS ANGELES</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[7px] tracking-[0.3em] text-brand-ink/30 uppercase">ACCESS</span>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-brand-ink/60 uppercase">EVENTS / DROPS / CASTINGS</span>
                </div>
              </div>

              {/* Hologram / Barcode Detail */}
              <div className="mt-10 pt-6 border-t border-brand-border/40 flex items-center justify-between opacity-50">
                <div className="h-[20px] flex gap-[2px] items-end">
                  {[...Array(20)].map((_, i) => {
                    const h = ((i * 17) % 100) + 10;
                    const o = ((i * 11) % 10) / 10 + 0.2;
                    return (
                      <div key={i} className="bg-brand-ink w-[2px]" style={{ height: `${h}%`, opacity: o }}></div>
                    );
                  })}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="relative">
          {status === "success" ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center animate-fade-in border border-brand-border bg-[#050505] p-10">
              <div className="font-serif italic text-[2.5rem] text-brand-red mb-4">Access Request Sent.</div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-brand-ink/50 uppercase mb-6">We will review the file.</div>
              {/* Ticket reward visual — only appears in success state */}
              <div className="w-[80px] mb-6 opacity-80">
                <Image src="/assets/icons/slowhrs_ticket.png" alt="Ticket" width={80} height={80} className="w-full h-auto pixel" />
              </div>
              <button 
                onClick={() => setStatus("idle")}
                className="border-b border-brand-ink/30 pb-1 font-mono text-[9px] tracking-[0.2em] text-brand-ink/60 hover:text-brand-ink transition-colors uppercase"
              >
                RETURN
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">Name</label>
                  <input required type="text" className="bg-transparent border-b border-brand-border p-3 px-1 font-mono text-[16px] md:text-[12px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="Full name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">Instagram</label>
                  <input required type="text" className="bg-transparent border-b border-brand-border p-3 px-1 font-mono text-[16px] md:text-[12px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="@handle" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">Phone or Email</label>
                <input required type="text" className="bg-transparent border-b border-brand-border p-3 px-1 font-mono text-[12px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="Contact vector" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">What do you do?</label>
                <input required type="text" className="bg-transparent border-b border-brand-border p-3 px-1 font-mono text-[12px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="Profession / Craft" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">What do you bring to the room?</label>
                <textarea required rows={3} className="bg-transparent border-b border-brand-border p-3 px-1 font-mono text-[12px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors resize-none" placeholder="Energy, network, vision..."></textarea>
              </div>

              <div className="mt-6 flex flex-col items-start gap-6">
                <button 
                  disabled={status === "submitting"}
                  type="submit" 
                  className="w-full sm:w-auto border border-brand-ink/30 bg-black px-8 py-4 transition-all duration-300 hover:border-brand-ink hover:bg-brand-ink hover:text-black text-brand-ink flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase whitespace-nowrap font-bold">
                    {status === "submitting" ? "PROCESSING..." : "REQUEST ACCESS"}
                  </span>
                </button>
                
                <div className="font-mono text-[8px] md:text-[9px] tracking-[0.1em] text-brand-ink/40 uppercase max-w-[45ch]">
                  Applications are reviewed manually. Location and priority access move through approved channels.
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
