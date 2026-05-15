"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LazyVideo from "@/components/LazyVideo";
import type { Drop } from "@/lib/data/drops";

interface DropTileProps {
  drop: Drop;
  index: number;
}

export default function DropTile({ drop, index }: DropTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const isGone = drop.status === "gone";
  const isReversed = index % 2 === 1;

  const handleMouseEnter = () => {
    if (drop.hoverVideo && videoRef.current) {
      setIsHovering(true);
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      setIsHovering(false);
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center py-16 md:py-24 ${
        isReversed ? "md:direction-rtl" : ""
      }`}
      style={isReversed ? { direction: "rtl" } : undefined}
    >
      {/* Image / Video */}
      <div
        className="relative aspect-[4/5] overflow-hidden hover-lift light-sweep"
        style={isReversed ? { direction: "ltr" } : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Video as poster */}
        <LazyVideo
          src={drop.image}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovering ? "opacity-0" : "opacity-100"
          } ${isGone ? "grayscale" : ""}`}
        />

        {/* Hover video */}
        {drop.hoverVideo && (
          <video
            ref={videoRef}
            src={drop.hoverVideo}
            muted
            playsInline
            loop
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* GONE sticker */}
        {isGone && (
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

        {/* MEMBERS FIRST sticker */}
        {drop.status === "members-first" && (
          <div className="absolute top-4 right-4">
            <Image
              src="/assets/widgets/members_first.png"
              alt="SLOWHRS Members First Access"
              title="Members First"
              width={80}
              height={30}
              className="pixel"
              style={{ width: "80px", height: "auto" }}
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
          {drop.season}
        </span>
        <h3
          className="font-display italic text-ink-warm mt-4 leading-tight"
          style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 300 }}
        >
          {drop.name}
        </h3>
        <p className="font-serif italic text-ink-warm-dim text-base mt-4 max-w-[400px] leading-relaxed">
          {drop.blurb}
        </p>
        <div className="mt-6">
          {isGone ? (
            <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink-warm-dim">
              sold · archive only
            </span>
          ) : (
            <Link
              href={`/inquire?subject=collab&note=${drop.id}`}
              className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink-warm-dim hover:text-red transition-colors border-b border-ink-warm-dim/30 hover:border-red pb-0.5"
            >
              available · by application ↗
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
