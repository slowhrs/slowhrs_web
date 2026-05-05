"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only enable smooth scroll on desktop (fine pointer)
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsDesktop(mq.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isDesktop) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
      {children}
    </ReactLenis>
  );
}
