import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, SITE_META } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-brand-border bg-[#020202] pt-16 md:pt-24 pb-8 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 md:px-12 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-10 lg:gap-8 mb-16">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="w-[100px] md:w-[120px] mix-blend-screen opacity-90">
              <Image src="/assets/logos/logo_main.png" alt="SLOWHRS" width={120} height={28} className="w-full h-auto" />
            </div>
            <h3 className="font-serif italic text-[1.3rem] text-brand-ink/90">
              {SITE_META.tagline}
            </h3>
            <p className="font-mono text-[9px] tracking-[0.1em] text-brand-ink/40 max-w-[38ch] uppercase leading-relaxed">
              {SITE_META.description}
            </p>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[9px] tracking-[0.3em] text-brand-ink/30 uppercase border-b border-brand-border/40 pb-2">Connect</h4>
            <nav className="flex flex-col gap-2">
              {["Instagram", "TikTok", "YouTube"].map((s) => (
                <Link key={s} href="#" className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/50 hover:text-brand-ink transition-colors uppercase w-fit">
                  {s}
                </Link>
              ))}
              <Link href="/inquiries" className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/50 hover:text-brand-ink transition-colors uppercase w-fit">
                Contact
              </Link>
            </nav>
          </div>

          {/* Rooms */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-[9px] tracking-[0.3em] text-brand-ink/30 uppercase border-b border-brand-border/40 pb-2">Rooms</h4>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/50 hover:text-brand-ink transition-colors uppercase w-fit">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-brand-border/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="font-mono text-[8px] tracking-[0.1em] text-brand-ink/20 uppercase">
            © {new Date().getFullYear()} SLOWHRS. All rights reserved.
          </span>
          <span className="font-mono text-[8px] tracking-[0.1em] text-brand-ink/20 uppercase">
            Los Angeles
          </span>
        </div>
      </div>
    </footer>
  );
}
