"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LazyVideo from "@/components/LazyVideo";
import type { Drop } from "@/lib/data/drops";
import { isAvailable } from "@/lib/data/drops";

interface DropTileProps {
  drop: Drop;
  index: number;
}

export default function DropTile({ drop, index }: DropTileProps) {
  const available = isAvailable(drop);
  const isReversed = index % 2 === 1;

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center py-16 md:py-24 ${
        isReversed ? "md:direction-rtl" : ""
      }`}
      style={isReversed ? { direction: "rtl" } : undefined}
    >
      {/* Video */}
      <div
        className="relative aspect-[4/5] overflow-hidden hover-lift light-sweep"
        style={isReversed ? { direction: "ltr" } : undefined}
      >
        <LazyVideo
          src={drop.video}
          className={`absolute inset-0 w-full h-full object-cover ${!available ? "grayscale" : ""}`}
        />

        {/* GONE sticker */}
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/assets/widgets/gone.png"
              alt="SLOWHRS Sold Out"
              title="Sold Out"
              width={120}
              height={40}
              className="pixel w-[30%] h-auto"
            />
          </div>
        )}
      </div>

      {/* Text */}
      <div
        className="flex flex-col justify-center"
        style={isReversed ? { direction: "ltr" } : undefined}
      >
        <span className="font-mono uppercase text-[10px] tracking-[0.3em] text-red">
          {drop.category}
        </span>
        <h3
          className="font-display italic text-ink-warm mt-4 leading-tight"
          style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 300 }}
        >
          {drop.title}
        </h3>
        <p className="font-serif italic text-ink-warm-dim text-base mt-4 max-w-[400px] leading-relaxed">
          {drop.description}
        </p>
        <div className="flex items-center gap-4 mt-3">
          <span className="font-mono text-[12px] tracking-[0.1em] text-red font-bold">
            ${drop.price}
          </span>
          <span className="font-mono text-[9px] tracking-[0.1em] text-brand-ink/40 uppercase">
            {drop.badge}
          </span>
        </div>
        <div className="mt-6">
          {!available ? (
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink-warm-dim">
              sold · archive only
            </span>
          ) : (
            <Link
              href="/#drops"
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink-warm-dim hover:text-red transition-colors border-b border-ink-warm-dim/30 hover:border-red pb-0.5"
            >
              available · shop now ↗
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
