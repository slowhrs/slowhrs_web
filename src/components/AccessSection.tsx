"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { submitApplication } from "@/app/actions/apply";

export default function AccessSection() {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [memberId, setMemberId] = React.useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus("submitting");
    setErrorMsg(null);
    setMemberId(null);

    const formData = new FormData(formRef.current);

    try {
      const result = await submitApplication(formData);
      if (result.success) {
        setStatus("success");
        if (result.member_id) setMemberId(result.member_id);
        formRef.current.reset();
      } else {
        setStatus("error");
        setErrorMsg(result.error || "something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("connection error. try again.");
    }
  };

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="access">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10 reveal">
        <div className="max-w-[600px]">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-4 flex items-center gap-2">
            <span className="text-brand-red">{"// Application"}</span>
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
        <div className="relative group perspective-1000 reveal reveal-d1">
          
          {/* Access Card */}
          <div className="border border-brand-border bg-black relative">
            <div className="aspect-[1.586/1] relative">
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                
                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-[8px] tracking-[0.3em] text-brand-ink/40 uppercase">SH Access Key</div>
                    <div className="font-mono text-[18px] tracking-[0.15em] text-brand-ink mt-1">0001</div>
                  </div>
                  <div className="w-[80px] opacity-70">
                    <Image src="/assets/widgets/Access.png" alt="SLOWHRS Access Granted" title="Access Granted" width={100} height={100} className="w-full h-auto pixel" />
                  </div>
                </div>
                
                {/* Card Body — shimmer line */}
                <div className="flex-1 flex items-center">
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-brand-ink/20 to-transparent"></div>
                </div>
                
                {/* Card Footer */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="font-mono text-[7px] tracking-[0.2em] text-brand-ink/30 uppercase mb-1">Status</div>
                    <div className="font-mono text-[11px] tracking-[0.2em] text-brand-red uppercase">Pending</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="font-mono text-[7px] tracking-[0.2em] text-brand-ink/30 uppercase mb-1">Location</div>
                    <div className="font-mono text-[11px] tracking-[0.15em] text-brand-ink/60">Los Angeles</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Widget: ticket stub, bottom-left */}
          <div className="absolute -bottom-6 -left-4 z-20 w-[70px] opacity-60 pointer-events-none rotate-[-8deg] drop-shadow-[0_0_10px_rgba(230,0,22,0.4)] mix-blend-screen">
            <Image src="/assets/icons/slowhrs_ticket.png" alt="SLOWHRS Access Ticket" title="Access Ticket" width={70} height={70} className="w-full h-auto pixel" />
          </div>
          <div className="absolute -top-5 -right-3 z-20 w-[80px] opacity-70 pointer-events-none rotate-[10deg] drop-shadow-[0_0_10px_rgba(230,0,22,0.4)] mix-blend-screen">
            <Image src="/assets/widgets/Onthelist.png" alt="SLOWHRS On The List" title="On The List" width={80} height={80} className="w-full h-auto pixel" />
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="reveal reveal-d2">
          {status === "success" ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="font-serif italic text-[2.5rem] text-brand-red mb-4">On The List.</div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-brand-ink/50 uppercase mb-6">
                {memberId ? `Application ${memberId} received. We review weekly.` : "Application received. We review weekly."}
              </div>
              <button 
                onClick={() => { setStatus("idle"); setMemberId(null); }}
                className="border-b border-brand-ink/30 pb-1 font-mono text-[9px] tracking-[0.2em] text-brand-ink/60 hover:text-brand-ink transition-colors uppercase"
              >
                RETURN
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">Name</label>
                  <input name="full_name" required type="text" className="bg-transparent border-b border-brand-border p-3 px-1 font-mono text-[16px] md:text-[12px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="Full name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">Instagram</label>
                  <input name="instagram" required type="text" className="bg-transparent border-b border-brand-border p-3 px-1 font-mono text-[16px] md:text-[12px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="@handle" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">Email</label>
                <input name="email" required type="email" className="bg-transparent border-b border-brand-border p-3 px-1 font-mono text-[12px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="email@example.com" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">What do you do?</label>
                <input name="what_you_do" required type="text" className="bg-transparent border-b border-brand-border p-3 px-1 font-mono text-[12px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors" placeholder="Profession / Craft" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase ml-1">What do you bring to the room?</label>
                <textarea name="why_apply" required rows={3} className="bg-transparent border-b border-brand-border p-3 px-1 font-mono text-[12px] tracking-[0.1em] text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors resize-none" placeholder="Energy, network, vision..."></textarea>
              </div>

              {errorMsg && (
                <p className="font-mono text-[11px] text-brand-red">{errorMsg}</p>
              )}

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
