"use client";

import Image from "next/image";
import Link from "next/link";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-brand-border bg-[#020202] pt-20 md:pt-32 pb-10 overflow-hidden">
      
      {/* Background VHS Noise / Scanline Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(255,255,255,0)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-12 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-6 reveal">
            <div className="mb-2 w-[120px] md:w-[150px] mix-blend-screen opacity-90">
              <Image src="/assets/logos/logo_main.png" alt="SLOWHRS Private Creative Society Wordmark Logo - Los Angeles" title="SLOWHRS Private Creative Society" width={200} height={45} className="w-full h-auto" />
            </div>
            
            <div className="flex flex-col gap-2">
              <h3 className="font-serif italic text-[1.5rem] text-brand-ink/90">
                Private Creative Society · Los Angeles
              </h3>
              <p className="font-mono text-[10px] tracking-[0.2em] text-brand-red uppercase">
                Only For Those Who Desire A Fast Life
              </p>
            </div>

            <p className="font-mono text-[9px] md:text-[10px] tracking-[0.1em] text-brand-ink/50 max-w-[40ch] uppercase leading-relaxed mt-4">
              Fashion, film, nightlife, and private access from the city after dark.
            </p>
            

          </div>

          {/* Connect Column */}
          <div className="flex flex-col gap-6 reveal reveal-d1">
            <h4 className="font-mono text-[9px] tracking-[0.3em] text-brand-ink/40 uppercase border-b border-brand-border/40 pb-2">Connect</h4>
            <nav className="flex flex-col gap-3">
              <Link href="https://instagram.com/slowhrstv" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/60 hover:text-brand-ink transition-colors uppercase w-fit">Instagram</Link>
              <Link href="https://tiktok.com/@slowhrstv" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/60 hover:text-brand-ink transition-colors uppercase w-fit">TikTok</Link>
              <Link href="https://youtube.com/@slowhrstv" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/60 hover:text-brand-ink transition-colors uppercase w-fit">YouTube</Link>
              <Link href="#inquiry" className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/60 hover:text-brand-ink transition-colors uppercase w-fit">Contact</Link>
            </nav>
          </div>

          {/* Legal/Ops Column */}
          <div className="flex flex-col gap-6 reveal reveal-d2">
            <h4 className="font-mono text-[9px] tracking-[0.3em] text-brand-ink/40 uppercase border-b border-brand-border/40 pb-2">Operations</h4>
            <nav className="flex flex-col gap-3">
              <Link href="#footer" className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/60 hover:text-brand-ink transition-colors uppercase w-fit">Shipping</Link>
              <Link href="#footer" className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/60 hover:text-brand-ink transition-colors uppercase w-fit">Returns</Link>
              <Link href="#footer" className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/60 hover:text-brand-ink transition-colors uppercase w-fit">Privacy</Link>
              <Link href="#footer" className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/60 hover:text-brand-ink transition-colors uppercase w-fit">Terms</Link>
            </nav>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="pt-8 border-t border-brand-border/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 reveal reveal-d3">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[8px] tracking-[0.1em] text-brand-ink/30 uppercase">
              Location details move through approved channels.
            </span>
            <span className="font-mono text-[8px] tracking-[0.1em] text-brand-ink/30 uppercase">
              Some files stay locked. Built for the city after dark.
            </span>
          </div>
          
          <div className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/20 uppercase flex flex-col md:items-end gap-1">
            <span>© {currentYear} SLOWHRS. ALL RIGHTS RESERVED.</span>

          </div>
        </div>

      </div>
    </footer>
  );
}
