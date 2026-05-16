import Image from "next/image";
import { FLYERS } from "@/lib/data/flyers";

export default function UpcomingEvents() {
  if (FLYERS.length === 0) return null;

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="upcoming">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10 reveal">
        <div className="max-w-[600px]">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-4 flex items-center gap-2">
            UPCOMING / RSVP
          </div>
          <h2 className="font-serif italic font-normal text-[2.5rem] md:text-[3.5rem] text-brand-ink leading-none mb-4">
            next rooms.
          </h2>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 max-w-[45ch] leading-[1.6] uppercase">
            capacity restricted. arrive early or message for list.
          </p>
        </div>
      </div>

      {/* Flyer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {FLYERS.map((flyer, i) => (
          <div key={flyer.id} className={`group border border-brand-border bg-[#050505] overflow-hidden flex flex-col reveal reveal-d${Math.min(i + 1, 4)}`}>
            
            {/* Flyer Image */}
            <div className="relative aspect-[3/4] bg-black overflow-hidden">
              <Image
                src={flyer.image}
                alt={`${flyer.title} — SLOWHRS Event Flyer`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Date Badge */}
              <div className="absolute top-4 right-4 z-10 font-mono text-[9px] tracking-[0.2em] text-black uppercase bg-brand-red px-3 py-1.5 font-bold">
                {flyer.date}
              </div>
            </div>

            {/* Info */}
            <div className="p-5 border-t border-brand-border flex flex-col gap-3 flex-1">
              <h3 className="font-serif italic text-[1.3rem] text-brand-ink leading-tight">
                {flyer.title}
              </h3>
              <p className="font-mono text-[8px] tracking-[0.1em] text-brand-ink/50 uppercase leading-relaxed">
                {flyer.description}
              </p>
              
              {flyer.rsvpUrl ? (
                <a
                  href={flyer.rsvpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto font-mono text-[9px] tracking-[0.2em] uppercase text-brand-red border border-brand-red/30 px-4 py-2.5 text-center hover:bg-brand-red/10 transition-colors"
                >
                  RSVP ↗
                </a>
              ) : (
                <a
                  href="#inquiry"
                  className="mt-auto font-mono text-[9px] tracking-[0.2em] uppercase text-brand-ink/60 border border-brand-ink/20 px-4 py-2.5 text-center hover:border-brand-ink/40 transition-colors"
                >
                  REQUEST ACCESS
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
