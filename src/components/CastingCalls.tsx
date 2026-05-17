import Image from "next/image";
import Link from "next/link";
import { CASTING_CALLS } from "@/lib/data/casting";

export default function CastingCalls() {
  if (CASTING_CALLS.length === 0) return null;

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="casting">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10 reveal">
        <div className="max-w-[600px]">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-4 flex items-center gap-2">
            CASTING / OPEN CALL
          </div>
          <h2 className="font-serif italic font-normal text-[2.5rem] md:text-[3.5rem] text-brand-ink leading-none mb-4">
            we need faces.
          </h2>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 max-w-[50ch] leading-[1.6] uppercase">
            models. creatives. performers. apply through the casting link below.
          </p>
        </div>
      </div>

      {/* Casting Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {CASTING_CALLS.map((casting, i) => (
          <div key={casting.id} className={`group border bg-[#050505] overflow-hidden flex flex-col reveal reveal-d${Math.min(i + 1, 5)} ${
            casting.isOpen ? 'border-brand-red/40 shadow-[0_0_24px_rgba(230,0,22,0.08)]' : 'border-brand-border opacity-75'
          }`}>
            
            {/* Casting Image */}
            <div className="relative aspect-[4/5] bg-black overflow-hidden">
              <Image
                src={casting.image}
                alt={`${casting.title} — SLOWHRS Casting Call`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {!casting.isOpen && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
                  <div className="relative h-24 w-24 rotate-45 opacity-90">
                    <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-brand-red shadow-[0_0_12px_rgba(230,0,22,0.75)]" />
                    <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-brand-red shadow-[0_0_12px_rgba(230,0,22,0.75)]" />
                  </div>
                </div>
              )}
              
              {/* Ref Code */}
              <div className="absolute top-4 left-4 z-10 font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">
                {casting.ref}
              </div>
              
              {/* Date */}
              <div className="absolute top-4 right-4 z-10 font-mono text-[9px] tracking-[0.2em] text-brand-red uppercase font-bold">
                {casting.date}
              </div>
            </div>

            {/* Info */}
            <div className="p-5 border-t border-brand-border flex flex-col gap-3 flex-1">
              <h3 className="font-serif italic text-[1.2rem] text-brand-ink leading-tight">
                {casting.title}
              </h3>
              <p className="font-mono text-[8px] tracking-[0.1em] text-brand-ink/50 uppercase leading-relaxed">
                {casting.description}
              </p>
              
              {casting.isOpen ? (
                <Link
                  href={`/#inquiry?subject=casting&ref=${casting.ref}`}
                  className="brand-action mt-auto font-mono text-[9px] tracking-[0.2em] uppercase text-brand-red border border-brand-red/30 px-4 py-2.5 text-center hover:bg-brand-red hover:text-black transition-colors"
                >
                  APPLY FOR CASTING
                </Link>
              ) : (
                <div className="mt-auto font-mono text-[9px] tracking-[0.2em] uppercase text-brand-ink/35 border border-brand-ink/10 px-4 py-2.5 text-center">
                  casting closed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
