"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

type NavClientProps = {
  memberHref: "/dashboard" | "/sign-in";
  memberLabel: "the room" | "sign in";
};

export default function NavClient({ memberHref, memberLabel }: NavClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Events", href: "/#events" },
    { label: "Drops", href: "/#drops" },
    { label: "Updates", href: "/#updates" },
    { label: "Inquiry", href: "/#inquiry" },
    { label: "Archive", href: "/#archive" },
  ];

  return (
    <>
      <nav className="nav-below-ticker left-0 right-0 flex justify-between items-center px-5 md:px-8 py-5 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px]">
        <Link href="/#home" className="h-7 md:h-8 flex items-center z-[90]">
          <Image
            src="/assets/logos/logo_main.png"
            alt="SLOWHRS"
            title="SLOWHRS Private Creative Society"
            width={120}
            height={32}
            className="h-full w-auto drop-shadow-[0_0_8px_rgba(230,0,22,0.4)]"
            style={{ width: "auto" }}
          />
        </Link>

        <ul className="hidden md:flex gap-6 items-center">
          {navLinks.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="font-mono text-[10px] tracking-[0.22em] text-brand-ink-dim uppercase transition-colors hover:text-brand-red relative group">
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-brand-red rounded-full opacity-0 transition-opacity group-hover:opacity-100"></span>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={memberHref}
              className="font-mono text-[10px] tracking-[0.22em] text-brand-ink-dim uppercase transition-colors hover:text-brand-red inline-flex items-center gap-1.5"
            >
              <span>{memberLabel}</span>
              <span aria-hidden="true" className="font-mono text-[9px] leading-none translate-y-[1px]">›</span>
            </Link>
          </li>
          <li>
            <Link href="/#access" className="font-mono text-[10px] tracking-[0.22em] text-brand-red uppercase border border-brand-red px-4 py-2 transition-all hover:bg-brand-red hover:text-black">
              Access
            </Link>
          </li>
        </ul>

        <button
          aria-label={isMenuOpen ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex w-7 h-[18px] flex-col justify-between cursor-pointer focus:outline-none z-[90]"
        >
          <span className={`block h-[1px] bg-brand-ink w-full transition-transform duration-300 ${isMenuOpen ? "translate-y-[8px] rotate-45" : ""}`}></span>
          <span className={`block h-[1px] bg-brand-ink w-full transition-opacity duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
          <span className={`block h-[1px] bg-brand-ink w-full transition-transform duration-300 ${isMenuOpen ? "-translate-y-[9px] -rotate-45" : ""}`}></span>
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[70] bg-[#020202] flex flex-col justify-center px-8 transition-all duration-500 md:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(255,255,255,0)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>

        <ul className="flex flex-col gap-8 relative z-10">
          {navLinks.map((item) => (
            <li key={item.label} className="border-b border-brand-border/40 pb-4">
              <Link
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="font-serif italic text-[2rem] text-brand-ink block hover:text-brand-red transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="border-b border-brand-border/40 pb-4">
            <Link
              href={memberHref}
              onClick={() => setIsMenuOpen(false)}
              className="group flex items-baseline gap-4 text-brand-ink hover:text-brand-red transition-colors"
            >
              <span className="font-serif italic text-[2rem] leading-none">{memberLabel}</span>
              <span
                aria-hidden="true"
                className="font-mono text-[10px] tracking-[0.32em] uppercase text-brand-ink-dim/70 group-hover:text-brand-red transition-colors"
              >
                enter →
              </span>
            </Link>
          </li>
          <li className="pt-4">
            <Link
              href="/#access"
              onClick={() => setIsMenuOpen(false)}
              className="font-mono text-[12px] tracking-[0.22em] text-brand-red uppercase border border-brand-red px-8 py-4 inline-block hover:bg-brand-red hover:text-black transition-colors"
            >
              Request Access
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
