"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";

function LiveTimecode() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const la = now.toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setTime(`${la} PT`);
    };
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-[10px] tracking-[0.2em] text-brand-ink/40 tabular-nums">
      {time}
    </span>
  );
}

export default function PersistentNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide nav on the threshold
  if (pathname === "/") return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[90] h-[52px] flex items-center justify-between px-5 md:px-8 bg-black/40 backdrop-blur-sm border-b border-brand-border">
        {/* Logo */}
        <Link href="/" className="shrink-0 w-[80px] md:w-[100px] mix-blend-screen opacity-90">
          <Image
            src="/assets/logos/logo_main.png"
            alt="SLOWHRS"
            width={100}
            height={24}
            className="w-full h-auto"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 ${
                pathname === link.href
                  ? "text-brand-red"
                  : "text-brand-ink/50 hover:text-brand-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop timecode */}
        <div className="hidden md:block">
          <LiveTimecode />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-[5px] w-[20px] py-2"
          aria-label="Menu"
        >
          <span className={`block h-[1px] bg-brand-ink transition-transform duration-200 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block h-[1px] bg-brand-ink transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-[1px] bg-brand-ink transition-transform duration-200 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile timecode strip */}
      {pathname !== "/" && (
        <div className="md:hidden fixed top-[52px] left-0 right-0 z-[89] h-[24px] flex items-center justify-center bg-black/60 backdrop-blur-sm border-b border-brand-border/50">
          <LiveTimecode />
        </div>
      )}

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[88] bg-black/95 backdrop-blur-md pt-[80px] px-8 flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-serif italic text-[2rem] transition-colors ${
                pathname === link.href
                  ? "text-brand-red"
                  : "text-brand-ink/70 hover:text-brand-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
