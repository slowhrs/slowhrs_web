"use client";

import Image from "next/image";

export default function EventsSection() {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="events">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10">
        <div className="max-w-[600px]">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-4 flex items-center gap-2">
            PRIVATE CALENDAR
          </div>
          <h2 className="font-serif italic font-normal text-[2.5rem] md:text-[4rem] text-brand-ink leading-none mb-6">
            The Room Moves After Dark
          </h2>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 max-w-[45ch] leading-[1.6] uppercase">
            Runway, nightlife, castings, and private recaps. Location details move through approved channels.
          </p>
        </div>

        {/* Small floating Listkeeper accent - Treated as an access file artifact */}
        <div className="hidden lg:flex flex-col items-center gap-2 border border-brand-border/40 p-2 bg-black/40">
          <div className="font-mono text-[7px] tracking-[0.2em] text-brand-ink/30 uppercase w-full text-left border-b border-brand-border/40 pb-1 mb-1">
            FILE_04: LISTKEEPER
          </div>
          <div className="relative w-[70px] opacity-60 mix-blend-screen grayscale contrast-125">
            <Image 
              src="/assets/characters/TheListkeeper.png" 
              alt="The Listkeeper" 
              width={70} 
              height={100} 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-10 relative z-10">
        
        {/* Featured Event Card */}
        <div className="flex flex-col border border-brand-border-2 bg-[#0a0a0a]/80 backdrop-blur-md group transition-colors hover:border-brand-ink/30 relative overflow-hidden">
          
          {/* Subtle Sticker Accent */}
          <div className="absolute top-4 right-4 z-20 w-[90px] opacity-0 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none rotate-12 drop-shadow-[0_0_12px_rgba(230,0,22,0.3)]">
            <Image src="/assets/widgets/Onthelist.png" alt="On the list?" width={100} height={100} className="w-full h-auto pixel" />
          </div>

          <div className="relative aspect-video w-full overflow-hidden bg-black border-b border-brand-border">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover filter brightness-[0.7] contrast-125 saturate-100 transition-transform duration-1000 group-hover:scale-105"
            >
              <source src="/assets/events/block_party.mp4" type="video/mp4" />
            </video>
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
            
            <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-brand-red uppercase">
              <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-blink shadow-[0_0_8px_var(--red)]"></div>
              REC
            </div>
            <div className="absolute bottom-4 right-4 font-pixel text-[14px] text-brand-ink/70">
              [CAM 01]
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col flex-1">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="font-mono text-[8px] tracking-[0.2em] text-brand-red border border-brand-red px-2 py-1 uppercase bg-brand-red/5">
                ARCHIVE PROCESSING
              </span>
            </div>
            
            <h3 className="font-serif italic text-[2rem] text-brand-ink leading-none mb-4">
              SLOWHRS PRIVATE CALENDAR
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8 font-mono text-[9px] tracking-[0.1em] text-brand-ink/50 uppercase">
              <div>
                <span className="block text-brand-ink/30 mb-1">TYPE</span>
                Event Recap / City Archive
              </div>
              <div>
                <span className="block text-brand-ink/30 mb-1">LOCATION</span>
                <span className="text-brand-ink opacity-60">Los Angeles</span>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-brand-border flex items-center justify-between">
              <button className="font-mono text-[10px] tracking-[0.2em] text-brand-ink uppercase flex items-center gap-2 transition-colors hover:text-brand-red">
                <Image src="/assets/icons/slowhrs_ticket.png" alt="Ticket" width={16} height={16} className="pixel opacity-70" />
                VIEW RECAP
              </button>
              
              <div className="flex items-center gap-3">
                <span className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase hidden sm:block">CAPACITY</span>
                <div className="w-[40px] sm:w-[60px] h-[2px] bg-brand-border overflow-hidden">
                  <div className="w-[100%] h-full bg-brand-red"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smaller Archive Cards list */}
        <div className="flex flex-col gap-4">
          
          <div className="flex justify-between items-end mb-2">
            <div className="font-mono text-[9px] tracking-[0.2em] text-brand-ink/40 uppercase">
              PREVIOUS ROOMS
            </div>
            <div className="font-mono text-[8px] tracking-[0.1em] text-brand-ink/30 uppercase hidden sm:block">
              Some rooms are documented. Some are not.
            </div>
          </div>

          {[
            {
              title: "DESTROY LONELY CLUB",
              date: "03.14.25",
              status: "ARCHIVE LIVE",
              video: "/assets/events/destroy_lonely.mp4"
            },
            {
              title: "JSTAPARTY NYE",
              date: "12.31.24",
              status: "CAMERA READY ONLY",
              video: "/assets/events/newyears.mp4"
            },
            {
              title: "SECRET WAREHOUSE",
              date: "11.10.24",
              status: "MEMBERS FIRST",
              video: null
            }
          ].map((event, i) => (
            <div key={i} className="flex gap-4 p-4 border border-brand-border bg-black/40 hover:bg-[#0a0a0a] transition-colors cursor-pointer group">
              <div className="w-[80px] h-[80px] md:w-[120px] md:h-[80px] shrink-0 bg-[#111] overflow-hidden relative border border-brand-border/50">
                {event.video ? (
                  <>
                    <video 
                      muted 
                      loop 
                      playsInline 
                      className="w-full h-full object-cover filter brightness-75 contrast-110 saturate-0 group-hover:saturate-100 transition-all duration-500 hidden md:block"
                      onMouseOver={e => (e.target as HTMLVideoElement).play()}
                      onMouseOut={e => {
                        const v = e.target as HTMLVideoElement;
                        v.pause();
                        v.currentTime = 0;
                      }}
                    >
                      <source src={event.video} type="video/mp4" />
                    </video>
                    {/* Mobile fallback poster behavior (static image extraction or just CSS poster) */}
                    <div className="md:hidden w-full h-full bg-[#1a1a1a] flex flex-col justify-center items-center">
                       <span className="font-mono text-[7px] text-brand-ink/20">[REC_FILE]</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center font-mono text-[8px] text-brand-ink/20 gap-1">
                    <span className="w-2 h-[1px] bg-brand-ink/20"></span>
                    NO FOOTAGE
                    <span className="w-2 h-[1px] bg-brand-ink/20"></span>
                  </div>
                )}
                {/* Red dot indicator on hover */}
                <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-brand-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-blink"></div>
              </div>

              <div className="flex flex-col justify-center py-1 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">
                    {event.date}
                  </div>
                  <div className="font-mono text-[7px] tracking-[0.2em] text-brand-ink/40 uppercase border border-brand-ink/20 px-1.5 py-0.5">
                    {event.status}
                  </div>
                </div>
                <h4 className="font-serif italic text-[1.2rem] md:text-[1.4rem] text-brand-ink leading-tight">
                  {event.title}
                </h4>
              </div>
            </div>
          ))}

          <div className="mt-4 font-mono text-[9px] tracking-[0.1em] text-brand-ink/30 uppercase sm:hidden">
            No energy, no entry.
          </div>
        </div>
      </div>
    </section>
  );
}
