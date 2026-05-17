"use client";

import Image from "next/image";
import LazyVideo from "@/components/LazyVideo";

const DJ_MOTE_URL = "https://www.djmote.com/eventViewFromInviteLink?type=event_promoter&promoter_link_token=RLtkvbYxZcA7-wQQ5VoJzZYW8W2sdCql9DsmpTmaK5b6Oi4G0Z00qvjAYodsaVq-&organization_id=26&uuid=70ae9369-dff5-4088-b935-3c549b7b7243";

const posterFor = (src: string) => src.replace(/\.mp4$/, ".jpg");

export default function EventsSection() {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="events">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10 reveal">
        <div className="max-w-[600px]">
          <h2 className="font-serif italic font-normal text-[2.5rem] md:text-[3.5rem] text-brand-ink leading-none mb-4">
            the room recently.
          </h2>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 max-w-[45ch] leading-[1.6] uppercase">
            documented in the archive.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-10 relative z-10">
        
        {/* Featured Event Card */}
        <div className="flex flex-col border border-brand-border-2 bg-[#0a0a0a]/80 backdrop-blur-md group transition-colors hover:border-brand-ink/30 relative overflow-hidden reveal reveal-d1">
          
          <div className="relative aspect-video w-full overflow-hidden bg-black border-b border-brand-border">
            <LazyVideo
              src="/assets/events/block_party.mp4"
              poster="/assets/events/block_party.jpg"
              className="w-full h-full object-cover brightness-[0.78] contrast-110 saturate-125 transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
            <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-brand-red uppercase">
              <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-blink shadow-[0_0_8px_var(--red)]"></div>
              REC
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col flex-1">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="font-mono text-[8px] tracking-[0.2em] text-brand-red border border-brand-red px-2 py-1 uppercase bg-brand-red/5">next room</span>
            </div>
            <h3 className="font-serif italic text-[2rem] text-brand-ink leading-none mb-4">dj battles — moteoff</h3>
            <div className="grid grid-cols-2 gap-4 mb-8 font-mono text-[9px] tracking-[0.1em] text-brand-ink/50 uppercase">
              <div><span className="block text-brand-ink/30 mb-1">TYPE</span>4 djs. 4 rounds. 1 winner.</div>
              <div><span className="block text-brand-ink/30 mb-1">DATE</span><span className="text-brand-ink opacity-60">may 29</span></div>
            </div>
            <div className="mt-auto pt-6 border-t border-brand-border flex items-center justify-between">
              <a href={DJ_MOTE_URL} target="_blank" rel="noopener noreferrer" className="brand-action font-mono text-[10px] tracking-[0.2em] text-brand-ink uppercase flex items-center gap-2 transition-colors hover:text-brand-red">reserve on dj mote ↗</a>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase hidden sm:block">CAPACITY</span>
                <div className="w-[40px] sm:w-[60px] h-[2px] bg-brand-border overflow-hidden"><div className="w-[100%] h-full bg-brand-red"></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Smaller Archive Cards list */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end mb-2 reveal reveal-d2">
            <div className="font-mono text-[9px] tracking-[0.2em] text-brand-ink/40 uppercase">PREVIOUS ROOMS</div>
            <div className="font-mono text-[8px] tracking-[0.1em] text-brand-ink/30 uppercase hidden sm:block">Some rooms are documented. Some are not.</div>
          </div>

          {[
            { title: "Destroy Lonely // WYA Trap Rave", date: "03.14.26", status: "recap", video: "/assets/events/destroy_lonely.mp4" },
            { title: "PJ Party // private room", date: "2026", status: "recap", video: "/assets/events/recaps/pj_party.mp4" },
            { title: "Runway // Act I", date: "2026", status: "recap", video: "/assets/events/recaps/fashion_show_recap.mp4" }
          ].map((event, i) => (
            <div key={i} className={`flex gap-4 p-4 border border-brand-border bg-black/40 hover:bg-[#0a0a0a] transition-colors cursor-pointer group reveal reveal-d${i + 2}`}>
              <div className="w-[80px] h-[80px] md:w-[120px] md:h-[80px] shrink-0 bg-[#111] overflow-hidden relative border border-brand-border/50">
                {event.video ? (
                  <>
                    <LazyVideo
                      src={event.video}
                      poster={posterFor(event.video)}
                      className="w-full h-full object-cover brightness-90 contrast-110 saturate-125 transition-all duration-500"
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#111]"><span className="w-2 h-[1px] bg-brand-ink/20"></span></div>
                )}
                <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-brand-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-blink"></div>
              </div>
              <div className="flex flex-col justify-center py-1 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">{event.date}</div>
                  <div className="font-mono text-[7px] tracking-[0.2em] text-brand-ink/40 uppercase border border-brand-ink/20 px-1.5 py-0.5">{event.status}</div>
                </div>
                <h4 className="font-serif italic text-[1.2rem] md:text-[1.4rem] text-brand-ink leading-tight">{event.title}</h4>
              </div>
            </div>
          ))}
          <div className="mt-4 font-mono text-[9px] tracking-[0.1em] text-brand-ink/30 uppercase sm:hidden">No energy, no entry.</div>
        </div>
      </div>

      {/* Listkeeper: half-cropped bottom-right, no border, no box, no caption */}
      <div className="hidden lg:block absolute bottom-0 right-0 z-[5] w-[140px] overflow-hidden opacity-60 mix-blend-screen contrast-125 pointer-events-none" style={{ clipPath: 'inset(0 0 0 0)' }}>
        <Image src="/assets/characters/TheListkeeper.png" alt="The Listkeeper Character Graphic - SLOWHRS Private Archive" title="The Listkeeper" width={140} height={200} className="w-full h-auto translate-y-[30%]" />
      </div>
    </section>
  );
}
