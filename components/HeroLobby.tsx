import Image from "next/image";
import StatusStrip from "./StatusStrip";

export default function HeroLobby() {
  return (
    <section className="relative min-h-[calc(100vh-26px)] overflow-hidden flex flex-col p-0">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505]">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover filter brightness-[0.45] contrast-[1.1] saturate-[1.05]"
        >
          <source src="/assets/videos/hero-recap.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Cinematic Overlay - Bottom heavy for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/95"></div>
      </div>

      {/* Security HUD - Top Left */}
      <div className="absolute top-[80px] md:top-[100px] left-5 md:left-8 z-[4] flex items-center gap-2 font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-brand-red uppercase">
        <div className="w-2 h-2 bg-brand-red rounded-full shadow-[0_0_8px_var(--red)] animate-blink"></div>
        REC
      </div>

      {/* Security HUD - Top Right */}
      <div className="absolute top-[80px] md:top-[100px] right-5 md:right-8 z-[4] font-mono text-[14px] md:text-[16px] tracking-[0.1em] text-brand-ink/70">
        12:45:00:00
      </div>

      {/* Corner Brackets (Camera Frame) */}
      <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] border border-white/20 z-[2] top-[70px] md:top-[90px] left-4 md:left-6 border-r-0 border-b-0"></div>
      <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] border border-white/20 z-[2] top-[70px] md:top-[90px] right-4 md:right-6 border-l-0 border-b-0"></div>
      <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] border border-white/20 z-[2] bottom-6 left-4 md:left-6 border-r-0 border-t-0 hidden md:block"></div>
      <div className="absolute w-[40px] md:w-[60px] h-[40px] md:h-[60px] border border-white/20 z-[2] bottom-6 right-4 md:right-6 border-l-0 border-t-0 hidden md:block"></div>

      {/* Main Content Area */}
      <div className="relative z-[3] px-5 md:px-12 pt-[12rem] md:pt-[14rem] pb-10 flex flex-col justify-end flex-1 w-full max-w-[1400px] mx-auto">
        
        {/* Eyebrow */}
        <div className="font-mono text-[8px] md:text-[10px] tracking-[0.3em] text-brand-red uppercase mb-6 md:mb-8 flex items-center gap-2">
          PRIVATE CREATIVE SOCIETY · LOS ANGELES
        </div>

        {/* Wordmark Logo */}
        <div className="w-full max-w-[90vw] md:max-w-[800px] mb-8 md:mb-10 drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <Image 
            src="/assets/logos/logo_main.png" 
            alt="SLOWHRS" 
            width={800} 
            height={180} 
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Hook */}
        <div className="font-mono text-[10px] md:text-[12px] tracking-[0.25em] md:tracking-[0.35em] text-brand-ink uppercase mb-6 flex items-center gap-4">
          ONLY FOR THOSE WHO DESIRE A FAST LIFE
          <div className="hidden md:block flex-1 h-[1px] bg-brand-ink/15 max-w-[120px]"></div>
        </div>

        {/* Support Body */}
        <p className="font-serif italic font-normal text-[1.2rem] md:text-[1.8rem] text-brand-ink/80 max-w-[30ch] leading-[1.3] mb-10 md:mb-12">
          Fashion, film, nightlife, and private access from the city after dark.
        </p>

        {/* CTA System */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
          
          {/* Primary CTA */}
          <button className="group flex items-center gap-4 border border-brand-red/40 bg-black/40 backdrop-blur-sm px-6 py-4 transition-all duration-300 hover:border-brand-red hover:bg-brand-red/10">
            <span className="font-mono text-[11px] tracking-[0.25em] text-brand-red uppercase whitespace-nowrap">
              APPLY FOR ACCESS
            </span>
            <Image 
              src="/assets/widgets/press_start.png" 
              alt="Press Start" 
              width={60} 
              height={16} 
              className="h-4 w-auto pixel opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </button>

          {/* Secondary CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 font-mono text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-brand-ink/50 mt-2 md:mt-0">
            {["VIEW EVENTS", "SHOP DROPS", "SEND INQUIRY"].map((cta) => (
              <a key={cta} href="#" className="flex items-center gap-2 pb-1 border-b border-transparent transition-colors hover:text-brand-ink hover:border-brand-ink/30 group">
                {cta}
                <span className="text-brand-red opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                  +
                </span>
              </a>
            ))}
          </div>

        </div>
      </div>

      <StatusStrip />
    </section>
  );
}
