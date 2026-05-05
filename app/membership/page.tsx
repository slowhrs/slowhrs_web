"use client";

import Footer from "@/components/Footer";


export default function MembershipPage() {
  return (
    <>
      <main className="min-h-screen pt-[52px] md:pt-[52px]">
        <section className="max-w-[1200px] mx-auto px-5 md:px-12 py-20 md:py-32">
          {/* Hero line */}
          <div className="mb-20">
            <h1
              className="font-serif italic text-brand-ink leading-[1.1]"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
            >
              access is not a newsletter.<br />it is the list.
            </h1>
            <p className="font-mono text-[11px] tracking-[0.1em] text-brand-ink/40 uppercase mt-6 max-w-[50ch]">
              the more rooms you&apos;re in, the more hearts you earn.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Card placeholder — CSS-rendered card built in Step 7 */}
            <div className="flex items-start justify-center">
              <div className="w-full max-w-[480px] aspect-[16/10] border border-brand-red/30 bg-[#0a0a0a] flex flex-col justify-between p-8 relative overflow-hidden"
                style={{ animation: "cardBreathe 4s ease-in-out infinite" }}
              >
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[8px] tracking-[0.3em] text-brand-ink/40 uppercase">SLOWHRS</span>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/30">SH-00024</span>
                </div>
                <div className="text-center">
                  <p className="font-serif italic text-[1.8rem] text-brand-ink/60">Pending Member.</p>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-brand-ink/40 uppercase">Guest</span>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((i) => (
                      <svg key={i} width="14" height="13" viewBox="0 0 14 13" className={i === 0 ? "text-brand-red" : "text-brand-ink/20"}>
                        <path d="M7 1.5l1.7 3.5 3.8.6-2.75 2.7.65 3.7L7 10.4 3.6 12l.65-3.7L1.5 5.6l3.8-.6L7 1.5z" fill="currentColor" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Application form placeholder — built in Step 7 */}
            <div>
              <h2 className="font-serif italic text-[1.5rem] text-brand-ink mb-8">apply</h2>
              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                {["name", "@instagram", "email", "city", "what do you do?", "what do you bring to the room?"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field}
                    className="bg-transparent border-b border-brand-ink/20 py-3 font-mono text-[13px] italic text-brand-ink placeholder:text-brand-ink/20 focus:outline-none focus:border-brand-red transition-colors"
                  />
                ))}
                <button
                  type="submit"
                  className="self-start font-mono text-[12px] tracking-[0.1em] text-brand-ink/60 hover:text-brand-ink transition-colors mt-4"
                >
                  request access →
                </button>
              </form>
            </div>
          </div>

          {/* Tier explanation */}
          <div className="mt-20 pt-12 border-t border-brand-border/30">
            <div className="flex flex-col gap-3 max-w-[500px]">
              {[
                { tier: "Cast", hearts: 2, req: "1 event attended" },
                { tier: "Crew", hearts: 3, req: "3 events attended" },
                { tier: "Inner Circle", hearts: 4, req: "6 events attended" },
              ].map((t) => (
                <div key={t.tier} className="flex items-center gap-4">
                  <span className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/40 w-[160px]">{t.req}</span>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/60">→</span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-brand-ink/80 uppercase">{t.tier}</span>
                  <span className="font-mono text-[10px] text-brand-red">{"♥".repeat(t.hearts)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
