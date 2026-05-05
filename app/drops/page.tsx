"use client";

import Footer from "@/components/Footer";


export default function DropsPage() {
  return (
    <>
      <main className="min-h-screen pt-[52px] md:pt-[52px]">
        <section className="max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32">
          <div className="mb-20">
            <h1
              className="font-serif italic text-brand-ink leading-none mb-6"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              drops
            </h1>
            <p className="font-mono text-[11px] tracking-[0.1em] text-brand-ink/50 uppercase max-w-[50ch] leading-relaxed">
              for the room, from the room
            </p>
          </div>

          {/* Placeholder — replaced with showroom grid in Step 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: "Fast Life Hoodie", price: "$120", video: "/assets/drops/fast_life_reel.mp4" },
              { name: "Holiday Capsule Tee", price: "$65", video: "/assets/drops/christmas_drop.mp4" },
            ].map((drop) => (
              <div key={drop.name} className="group border border-brand-border bg-[#0a0a0a] overflow-hidden">
                <div className="relative aspect-[3/4] bg-black">
                  <video
                    src={drop.video}
                    muted
                    playsInline
                    loop
                    preload="metadata"
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                </div>
                <div className="p-5 flex justify-between items-end">
                  <h3 className="font-serif italic text-[1.4rem] text-brand-ink">{drop.name}</h3>
                  <span className="font-mono text-[11px] tracking-[0.1em] text-brand-ink/50">{drop.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
