"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`relative py-24 px-6 md:px-12 border-t closing-line ${
        isVisible ? "is-visible" : ""
      }`}
      style={{ borderColor: "var(--color-border)" }}
    >
      <div
        className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          transition:
            "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
        }}
      >
        {/* Left */}
        <div>
          <Link
            href="/"
            className="block transition-opacity hover:opacity-70 mb-6"
          >
            <Image 
              src="/assets/logos/logo_main.png" 
              alt="SLOWHRS"
              title="SLOWHRS Private Creative Society"
              width={200} 
              height={50} 
              className="h-8 w-auto object-contain drop-shadow-[0_0_15px_rgba(230,0,22,0.3)]" 
            />
          </Link>
          <p className="font-mono text-[9px] tracking-[0.2em] text-ink-faint uppercase">
            private creative society · los angeles
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-8 md:gap-12">
          <div className="flex flex-col gap-3">
            <Link
              href="/events"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              events
            </Link>
            <Link
              href="/drops"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              drops
            </Link>
            <Link
              href="/news"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              news
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/membership"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              membership
            </Link>
            <Link
              href="/inquire"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              inquire
            </Link>
            <a
              href="https://instagram.com/slowhrstv"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.15em] text-ink-dim hover:text-red transition-colors uppercase"
            >
              @slowhrstv
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-[1200px] mx-auto mt-12 pt-6 border-t" style={{ borderColor: "var(--color-border)" }}>
        <p className="font-mono text-[8px] tracking-[0.15em] text-ink-faint uppercase">
          © {new Date().getFullYear()} slowhrs. all rights reserved.
        </p>
      </div>
    </footer>
  );
}
