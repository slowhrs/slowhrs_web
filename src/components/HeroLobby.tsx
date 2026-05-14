import Image from "next/image";
import Link from "next/link";
import StatusStrip from "./StatusStrip";

export default function HeroLobby() {
  return (
    <section className="relative min-h-[calc(100vh-26px)] overflow-hidden grid grid-rows-[1fr_auto] p-0">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05] saturate-[1.1]"
        >
          <source src="/assets/videos/hero-recap.mp4" type="video/mp4" />
        </video>
        {/* Bottom-only gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(230,0,22,0.12)_0%,transparent_55%)]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-[3] px-6 pt-[9rem] pb-12 md:px-12 md:pt-[11rem] flex flex-col justify-end min-h-[calc(100vh-26px-80px)]">
        
        {/* Wordmark Logo */}
        <div className="w-full max-w-[min(600px,80vw)] mb-6 drop-shadow-[0_0_40px_rgba(230,0,22,0.2)] reveal">
          <Image 
            src="/assets/logos/logo_main.png" 
            alt="SLOWHRS Private Creative Society Hero Logo"
            title="SLOWHRS Private Creative Society"
            width={880} 
            height={200} 
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Tagline */}
        <p className="font-serif italic font-normal text-[clamp(1.4rem,3vw,2.2rem)] text-brand-ink max-w-[26ch] leading-[1.25] mb-4 reveal reveal-d1">
          a private creative society.
        </p>

        {/* Location / Status */}
        <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-10 flex items-center gap-2.5 reveal reveal-d2">
          los angeles.
        </div>

        {/* Secondary CTAs — minimalist navigation */}
        <div className="flex flex-col items-start gap-4 font-mono text-[11px] tracking-[0.25em] uppercase text-brand-ink-dim reveal reveal-d3">
          <Link href="#access" className="hover:text-brand-red transition-colors border-b border-transparent hover:border-brand-red pb-0.5 cta-breathe">
            get on the list ↗
          </Link>
          <Link href="#inquiry" className="hover:text-brand-red transition-colors border-b border-transparent hover:border-brand-red pb-0.5">
            we filmed your event ↗
          </Link>
          <div className="flex flex-wrap gap-6 mt-4">
            <Link href="#events" className="text-[10px] text-brand-ink-dim/60 hover:text-brand-ink transition-colors">
              View Events
            </Link>
            <Link href="#drops" className="text-[10px] text-brand-ink-dim/60 hover:text-brand-ink transition-colors">
              Shop Drops
            </Link>
          </div>
        </div>
      </div>

      <StatusStrip />
    </section>
  );
}
