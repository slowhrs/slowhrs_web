"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

export default function PersistentNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsOpen(false);
      setMenuVisible(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  // Handle menu open/close with animation
  const openMenu = () => {
    setIsOpen(true);
    // Slight delay for paint, then reveal
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    menuTimeout.current = setTimeout(() => setMenuVisible(true), 30);
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    setMenuVisible(false);
    // Wait for transition to finish, then unmount
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    menuTimeout.current = setTimeout(() => {
      setIsOpen(false);
      document.body.style.overflow = "";
    }, 350);
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      if (menuTimeout.current) clearTimeout(menuTimeout.current);
    };
  }, []);

  if (isAdmin) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[8000] transition-all duration-300 ${
        isScrolled
          ? "bg-bg/90 backdrop-blur-md border-b border-border py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12 max-w-[1600px] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="transition-opacity hover:opacity-70"
        >
          <Image 
            src="/assets/logos/logo_main.png" 
            alt="SLOWHRS"
            title="SLOWHRS Private Creative Society"
            width={120} 
            height={30} 
            className="h-5 w-auto object-contain drop-shadow-[0_0_10px_rgba(230,0,22,0.2)]" 
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-mono text-[10px] tracking-[0.25em] uppercase transition-colors ${
                pathname === link.href
                  ? "text-red nav-active-dot"
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
          onClick={toggleMenu}
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

      {/* Mobile overlay — slide-down transition */}
      {isOpen && (
        <div
          className="fixed inset-0 top-[52px] bg-bg/98 backdrop-blur-lg z-[7999] md:hidden"
          style={{
            opacity: menuVisible ? 1 : 0,
            transform: menuVisible ? "translateY(0)" : "translateY(-12px)",
            transition:
              "opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`font-display italic text-lg transition-colors ${
                  pathname === link.href
                    ? "text-red"
                    : "text-ink hover:text-red"
                }`}
                style={{
                  opacity: menuVisible ? 1 : 0,
                  transform: menuVisible
                    ? "translateY(0)"
                    : "translateY(8px)",
                  transition: `opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1) ${
                    i * 50
                  }ms, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1) ${
                    i * 50
                  }ms`,
                }}
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
