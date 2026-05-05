"use client";

import MemberCard from "@/components/membership/MemberCard";
import ApplicationForm from "@/components/membership/ApplicationForm";
import Footer from "@/components/Footer";

const TIERS = [
  { tier: "Cast", hearts: 2, req: "1 event attended" },
  { tier: "Crew", hearts: 3, req: "3 events attended" },
  { tier: "Inner Circle", hearts: 4, req: "6 events attended" },
];

export default function MembershipPage() {
  return (
    <>
      <main className="min-h-screen pt-[52px]">
        <section className="max-w-[1200px] mx-auto px-5 md:px-12 py-20 md:py-32">
          {/* Hero */}
          <div className="mb-20">
            <h1
              className="font-serif italic text-brand-ink leading-[1.1]"
              style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)" }}
            >
              access is not a newsletter.<br />it is the list.
            </h1>
            <p className="font-mono text-[11px] tracking-[0.15em] text-brand-ink/35 uppercase mt-6 max-w-[50ch]">
              the more rooms you&apos;re in, the more hearts you earn.
            </p>
          </div>

          {/* Card + Application */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <MemberCard />
            <ApplicationForm />
          </div>

          {/* Tier breakdown */}
          <div className="mt-20 pt-12 border-t border-brand-border/30">
            <div className="flex flex-col gap-3 max-w-[500px]">
              {TIERS.map((t) => (
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
