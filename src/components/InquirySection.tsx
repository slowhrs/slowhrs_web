"use client";

import Image from "next/image";
import React from "react";

const INQUIRY_TYPES = [
  { id: "shoot", label: "Shoot my event", helper: "We document private rooms.", placeholder: "Event date, location, expected capacity..." },
  { id: "production", label: "Production / recap", helper: "Full service post-production & reels.", placeholder: "Current footage volume, preferred style, timeline..." },
  { id: "collab", label: "Collab", helper: "Brand and creative alignments.", placeholder: "Brand details, vision, alignment pitch..." },
  { id: "vendor", label: "Vendor", helper: "Pop-ups, supplies, and installations.", placeholder: "What do you provide? Previous venues..." },
  { id: "model", label: "Model / casting", helper: "For runway and lookbook archives.", placeholder: "Measurements, agency (if any), portfolio link..." },
  { id: "dj", label: "DJ / performer", helper: "Set the energy for the room.", placeholder: "Soundcloud mix, typical genres, past rooms..." },
  { id: "sponsorship", label: "Sponsorship", helper: "Backing the culture.", placeholder: "Company, budget tier, alignment goals..." },
  { id: "general", label: "General", helper: "Direct line to the operators.", placeholder: "What's the signal?" }
];

export default function InquirySection() {
  const [selectedType, setSelectedType] = React.useState(INQUIRY_TYPES[0]);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="inquiry">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative z-10">
        <div className="max-w-[600px]">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-4 flex items-center gap-2">
            INQUIRY / DIRECT LINE
          </div>
          <h2 className="font-serif italic font-normal text-[2.5rem] md:text-[4rem] text-brand-ink leading-none mb-6">
            Inquiries
          </h2>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 max-w-[50ch] leading-[1.6] uppercase">
            Direct line. Reviewed within 48 hours.
          </p>
        </div>

        {/* Camcorder Accent — one allowed instance */}
        <div className="hidden lg:flex flex-col items-end gap-3 opacity-80 mix-blend-screen">
          <Image 
            src="/assets/icons/vhscam_live.png" 
            alt="SLOWHRS VHS Camcorder Live Recording Indicator"
            title="Recording Live"
            width={40} 
            height={40} 
            className="pixel"
          />
        </div>
      </div>

      <div className="relative z-10 bg-[#0a0a0a] border border-brand-border overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-border bg-black/40">
          <div className="font-mono text-[9px] tracking-[0.2em] text-brand-ink/40 uppercase">
            INQUIRY TERMINAL
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-brand-ink/20"></div>
            <div className="w-2 h-2 rounded-full bg-brand-ink/20"></div>
            <div className="w-2 h-2 rounded-full bg-brand-red/50"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-0">
          
          {/* Left Panel - Selectors */}
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-brand-border bg-[#050505]">
            <h3 className="font-serif italic text-[1.5rem] text-brand-ink mb-6">
              What do you need from SLOWHRS?
            </h3>
            
            <div className="flex flex-col gap-2">
              {INQUIRY_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={`text-left px-4 py-3 font-mono text-[9px] tracking-[0.2em] uppercase transition-all duration-300 border-l-2 ${
                    selectedType.id === type.id 
                      ? "border-brand-red bg-brand-red/5 text-brand-red" 
                      : "border-transparent text-brand-ink/50 hover:bg-white/5 hover:text-brand-ink"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="p-6 md:p-10 bg-[#080808] relative">
            
            {status === "success" ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="font-serif italic text-[2.5rem] text-brand-red mb-4">Transmission Sent.</div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-brand-ink/50 uppercase">We will review the signal.</div>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-8 border-b border-brand-ink/30 pb-1 font-mono text-[9px] tracking-[0.2em] text-brand-ink/60 hover:text-brand-ink transition-colors uppercase"
                >
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fade-in">
                
                <div className="flex items-start gap-4 mb-2 pb-4 border-b border-brand-border/40">
                  <div className="mt-1 w-1.5 h-1.5 bg-brand-red"></div>
                  <div>
                    <div className="font-mono text-[10px] tracking-[0.2em] text-brand-ink uppercase mb-1">
                      {selectedType.label}
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.1em] text-brand-ink/40 uppercase">
                      {selectedType.helper}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">Name</label>
                    <input required type="text" className="bg-transparent border border-brand-border p-3 font-mono text-[16px] md:text-[11px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="Operator name" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">Instagram</label>
                    <input required type="text" className="bg-transparent border border-brand-border p-3 font-mono text-[16px] md:text-[11px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="@handle" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">Email or Phone</label>
                    <input required type="text" className="bg-transparent border border-brand-border p-3 font-mono text-[11px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="Contact vector" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">Date / Project / Request</label>
                    <input required type="text" className="bg-transparent border border-brand-border p-3 font-mono text-[11px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="When & Where" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">Budget or Details</label>
                  <textarea required rows={3} className="bg-transparent border border-brand-border p-3 font-mono text-[11px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors resize-none" placeholder={selectedType.placeholder}></textarea>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-brand-border/40">
                  <div className="font-mono text-[8px] md:text-[9px] tracking-[0.1em] text-brand-ink/30 uppercase max-w-[40ch]">
                    Use real details. The room moves faster when the signal is clear. No spam. No mass forms. Just the right request to the right room.
                  </div>
                  
                  <button 
                    disabled={status === "submitting"}
                    type="submit" 
                    className="w-full sm:w-auto shrink-0 border border-brand-red/40 bg-brand-red/5 px-8 py-4 transition-all duration-300 hover:border-brand-red hover:bg-brand-red/10 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <span className="font-mono text-[10px] tracking-[0.25em] text-brand-red uppercase whitespace-nowrap">
                      {status === "submitting" ? "TRANSMITTING..." : "SEND INQUIRY"}
                    </span>
                    <span className="font-serif italic text-[1.2rem] text-brand-red leading-none">→</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
