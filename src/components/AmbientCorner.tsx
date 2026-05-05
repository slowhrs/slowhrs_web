"use client";

import { usePathname } from "next/navigation";

const PAGE_ICONS: Record<string, { char: string; label: string; blink?: boolean }> = {
  "/events":     { char: "⎘", label: "ticket" },
  "/drops":      { char: "⊞", label: "cart" },
  "/inquiries":  { char: "●", label: "rec", blink: true },
  "/news":       { char: "·", label: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit", timeZone: "America/Los_Angeles" }) },
  "/membership": { char: "♥", label: "heart" },
};

export default function AmbientCorner() {
  const pathname = usePathname();
  
  // Hidden on threshold and mobile
  if (pathname === "/") return null;

  // Find the matching page icon (match prefix for nested routes like /events/[slug])
  const matchedKey = Object.keys(PAGE_ICONS).find(key => pathname.startsWith(key));
  const icon = matchedKey ? PAGE_ICONS[matchedKey] : null;
  if (!icon) return null;

  return (
    <div className="hidden md:flex fixed bottom-6 left-6 z-[80] items-center gap-2 opacity-50 hover:opacity-80 transition-opacity select-none">
      <span
        className={`text-[14px] text-brand-red ${icon.blink ? "animate-blink" : ""}`}
        aria-hidden="true"
      >
        {icon.char}
      </span>
      <span className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">
        {icon.label}
      </span>
    </div>
  );
}
