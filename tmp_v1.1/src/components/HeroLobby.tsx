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
        {/* Bottom-only gradient mask — not a uniform overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/85"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(230,0,22,0.12)_0%,transparent_55%)]"></div>
      </div>

      {/* Security HUD Top Left */}
      <div className="absolute top-[100px] left-6 z-[4] flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-brand-red uppercase">
        <div className="w-2 h-2 bg-brand-red rounded-full shadow-[0_0_6px_var(--red)] animate-blink"></div>
        REC
      </div>

      {/* Security HUD Top Right */}
      <div className="absolute top-[100px] right-6 z-[4] font-mono text-[18px] tracking-[0.08em] text-brand-ink bg-black/50 px-2 py-1 border border-brand-border-2">
        12:45:00:00
      </div>

      {/* Corner Brackets */}
      <div className="absolute w-[60px] h-[60px] border border-brand-red opacity-50 z-[2] top-[90px] left-6 border-r-0 border-b-0"></div>
      <div className="absolute w-[60px] h-[60px] border border-brand-red opacity-50 z-[2] top-[90px] right-6 border-l-0 border-b-0"></div>
      <div className="absolute w-[60px] h-[60px] border border-brand-red opacity-50 z-[2] bottom-6 left-6 border-r-0 border-t-0"></div>
      <div className="absolute w-[60px] h-[60px] border border-brand-red opacity-50 z-[2] bottom-6 right-6 border-l-0 border-t-0"></div>

      {/* Main Content */}
      <div className="relative z-[3] px-6 pt-[9rem] pb-12 md:px-12 md:pt-[11rem] flex flex-col justify-end min-h-[calc(100vh-26px-80px)]">
        
        {/* Eyebrow */}
        <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-5 flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 bg-brand-red rounded-full shadow-[0_0_6px_var(--red)] animate-blink"></div>
          Private Creative Society · Los Angeles
        </div>

        {/* Wordmark Logo */}
        <div className="w-full max-w-[min(880px,90vw)] mb-6 drop-shadow-[0_0_60px_rgba(230,0,22,0.4)]">
          <Image 
            src="/assets/logos/logo_main.png" 
            alt="SLOWHRS" 
            width={880} 
            height={200} 
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Subline */}
        <div className="font-mono text-[11px] tracking-[0.3em] text-brand-ink-dim uppercase mb-8 flex flex-wrap gap-2.5 items-center">
          Only For Those Who Desire A Fast Life
          <div className="flex-1 h-[1px] bg-brand-border min-w-[40px]"></div>
        </div>

        {/* Body Text */}
        <p className="font-serif italic font-normal text-[clamp(1.4rem,3vw,2.2rem)] text-brand-ink max-w-[26ch] leading-[1.25] mb-8">
          Fashion, film, nightlife, and private access from the city after dark.
        </p>

        {/* Primary CTA (Press Start Widget) */}
        <div className="inline-block h-14 cursor-pointer mb-7 self-start transition-transform hover:-translate-y-0.5 hover:drop-shadow-[0_0_16px_var(--red)]">
          <Image 
            src="/assets/widgets/press_start.png" 
            alt="Press Start" 
            width={200} 
            height={56} 
            className="h-full w-auto pixel"
          />
        </div>

        {/* Secondary CTAs — thin nav row beneath PRESS START */}
        <div className="flex flex-wrap gap-0 font-mono text-[10px] tracking-[0.25em] uppercase text-brand-ink-dim">
          {[
            { text: "Apply For Access", href: "#access" },
            { text: "View Events", href: "#events" },
            { text: "Shop Drops", href: "#drops" },
            { text: "Send Inquiry", href: "#inquiry" }
          ].map((cta) => (
            <Link key={cta.text} href={cta.href} className="inline-flex items-center gap-2 px-4 py-2 border-b border-brand-border-2 transition-colors hover:text-brand-red hover:border-brand-red group text-[10px]">
              {cta.text}
            </Link>
          ))}
        </div>
      </div>

      <StatusStrip />
    </section>
  );
}
