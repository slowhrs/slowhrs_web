"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

export default function PersistentNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hide on cinema entry
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (isAdmin) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[8000] transition-all duration-300 ${
        isScrolled
          ? "bg-bg/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
      style={{ height: "52px" }}
    >
      <div className="flex items-center justify-between h-full px-6 md:px-12 max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="font-display italic text-ink text-lg hover:text-red transition-colors"
        >
          slowhrs
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono text-[10px] tracking-[0.25em] uppercase transition-colors ${
                pathname === link.href
                  ? "text-red"
                  : "text-ink-dim hover:text-red"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1 w-6 h-6 justify-center items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block w-5 h-[1px] bg-ink transition-all duration-200 ${
              isOpen ? "rotate-45 translate-y-[3px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1px] bg-ink transition-all duration-200 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1px] bg-ink transition-all duration-200 ${
              isOpen ? "-rotate-45 -translate-y-[3px]" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[52px] bg-bg/98 backdrop-blur-lg z-[7999] md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-display italic text-2xl transition-colors ${
                  pathname === link.href
                    ? "text-red"
                    : "text-ink hover:text-red"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
