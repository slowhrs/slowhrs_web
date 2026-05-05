"use client";

import Footer from "@/components/Footer";


export default function EventsPage() {
  return (
    <>
      <main className="min-h-screen pt-[52px] md:pt-[52px]">
        <section className="max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32">
          {/* Hero — will be a pinned video in Step 3 */}
          <div className="mb-20">
            <h1
              className="font-serif italic text-brand-ink leading-none mb-6"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              events
            </h1>
            <p className="font-mono text-[11px] tracking-[0.1em] text-brand-ink/50 uppercase max-w-[50ch] leading-relaxed">
              the room moves after dark
            </p>
          </div>

          {/* Placeholder grid — replaced with asymmetric video grid in Step 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Block Party", date: "oct 2025", video: "/assets/events/block_party.mp4" },
              { title: "Destroy Lonely", date: "mar 2025", video: "/assets/events/destroy_lonely.mp4" },
              { title: "New Years", date: "dec 2024", video: "/assets/events/newyears.mp4" },
            ].map((event) => (
              <div key={event.title} className="group border border-brand-border bg-[#0a0a0a] overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <video
                    src={event.video}
                    muted
                    playsInline
                    loop
                    preload="metadata"
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                </div>
                <div className="p-5">
                  <p className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/30 uppercase mb-2">{event.date}</p>
                  <h3 className="font-serif italic text-[1.4rem] text-brand-ink">{event.title}</h3>
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
