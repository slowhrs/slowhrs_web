"use client";

import { useState } from "react";
import DropsGrid from "@/components/drops/DropsGrid";
import DropLightbox from "@/components/drops/DropLightbox";
import Footer from "@/components/Footer";
import type { Drop } from "@/components/drops/drops.data";

export default function DropsPage() {
  const [lightboxDrop, setLightboxDrop] = useState<Drop | null>(null);

  return (
    <>
      <main className="min-h-screen pt-[52px]">
        {/* Hero section */}
        <section className="max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32">
          <div className="mb-16">
            <h1
              className="font-serif italic text-brand-ink leading-none mb-6"
              style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
              drops
            </h1>
            <p className="font-mono text-[11px] tracking-[0.15em] text-brand-ink/40 uppercase max-w-[50ch] leading-relaxed">
              for the room, from the room. pieces come once. members know first.
            </p>
          </div>
        </section>

        {/* Grid */}
        <DropsGrid onSelect={setLightboxDrop} />

        {/* Lightbox */}
        <DropLightbox
          drop={lightboxDrop}
          onClose={() => setLightboxDrop(null)}
        />
      </main>
      <Footer />
    </>
  );
}
