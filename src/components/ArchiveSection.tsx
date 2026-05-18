"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import LazyVideo from "@/components/LazyVideo";
import EventPhotoCarousel from "@/components/EventPhotoCarousel";
import { EVENT_PHOTO_SETS, getPhotoUrls } from "@/lib/data/eventPhotos";

const posterFor = (src: string) => src.replace(/\.mp4$/, ".jpg");

const ARCHIVE_ITEMS = [
  {
    id: "fashion_show",
    title: "SS26 Runway // Evidence",
    subtitle: "Sunset Blvd. front row smoke. one tape survived.",
    category: "Runway",
    date: "2026",
    type: "video",
    src: "/assets/events/recaps/fashion_show_recap.mp4",
    duration: "03:12"
  },
  {
    id: "block_party",
    title: "Block Party // Street File",
    subtitle: "10 crews, 2 stages, one city moving after dark.",
    category: "Events",
    date: "2025",
    type: "video",
    src: "/assets/events/block_party.mp4",
    duration: "02:14"
  },
  {
    id: "destroy_lonely",
    title: "Destroy Lonely // Trap Rave",
    subtitle: "WYA. stage heat, floor footage, no clean cuts.",
    category: "Nightlife",
    date: "03.14.26",
    type: "video",
    src: "/assets/events/destroy_lonely.mp4",
    duration: "01:30"
  },
  {
    id: "fast_life",
    title: "Fast Life Campaign // VHS",
    subtitle: "fall drop reel. clothes moving like getaway footage.",
    category: "Drops",
    date: "2026",
    type: "video",
    src: "/assets/drops/fast_life_reel.mp4",
    duration: "00:45"
  },
  {
    id: "kehlani",
    title: "Kehlani // Headline File",
    subtitle: "members plus one. low light, loud room.",
    category: "Headline",
    date: "2024",
    type: "video",
    src: "/assets/events/recaps/kehlani_recap.mp4",
    duration: "01:20"
  },
  {
    id: "j7kan_runway",
    title: "j7kan Debut // Sunset",
    subtitle: "pre-debut runway file. westside proof.",
    category: "Runway",
    date: "2024",
    type: "video",
    src: "/assets/events/recaps/j7kan_runway.mp4",
    duration: "02:45"
  },
  {
    id: "warehouse",
    title: "Warehouse Sessions // 90",
    subtitle: "private set in the warehouse. concrete and bass.",
    category: "Events",
    date: "2025",
    type: "video",
    src: "/assets/events/recaps/warehouse_sessions.mp4",
    duration: "01:05"
  },
  {
    id: "pj_party",
    title: "PJ Party // After File",
    subtitle: "invited only. soft clothes, hard flash.",
    category: "Events",
    date: "2026",
    type: "video",
    src: "/assets/events/recaps/pj_party.mp4",
    duration: "02:30"
  },
  {
    id: "nye",
    title: "NYE // Jsta Party",
    subtitle: "last night of the year. filed before sunrise.",
    category: "Events",
    date: "12.31.24",
    type: "video",
    src: "/assets/events/recaps/nye_2025_recap.mp4",
    duration: "03:45"
  },
  {
    id: "dsrpt",
    title: "Eric Bellinger × DSRPT",
    subtitle: "noise lab performance. restricted room.",
    category: "Performance",
    date: "2024",
    type: "video",
    src: "/assets/events/recaps/dsrpt_noiselab.mp4",
    duration: "00:42"
  },
  {
    id: "code_devastation",
    title: "Code: Devastation",
    subtitle: "private ops. restricted access. do not forward.",
    category: "Events",
    date: "2024",
    type: "video",
    src: "/assets/events/recaps/code_devastation.mp4",
    duration: "00:55"
  },
  {
    id: "fashion_promo",
    title: "SS26 Runway Promo // Signal",
    subtitle: "pre-show signal. campaign reel before the doors.",
    category: "Runway",
    date: "2026",
    type: "video",
    src: "/assets/events/recaps/fashion_show_promo.mp4",
    duration: "01:48"
  }
];

export default function ArchiveSection() {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border overflow-hidden" id="archive">
      <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_14%_10%,rgba(230,0,22,0.18),transparent_26%),radial-gradient(circle_at_86%_24%,rgba(237,237,235,0.06),transparent_22%)]" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10 reveal">
        <div className="max-w-[600px]">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-4 flex items-center gap-2">
            archive / black box
          </div>
          <h2 className="font-serif italic font-normal text-[2.5rem] md:text-[4rem] text-brand-ink leading-none mb-6">
            proof the room happened.
          </h2>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 max-w-[50ch] leading-[1.6] uppercase">
            Not content. Evidence. Runway, nightlife, castings, drops, and reels filed after the city turns red.
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-2 max-w-[300px] reveal reveal-d2">
          <div className="font-serif italic text-[1.2rem] text-brand-ink/80 text-left md:text-right">
            Some rooms disappear by morning. The archive is what stays on the table.
          </div>
          {/* CD sticker accent */}
          <div className="archive-disc hidden md:block w-[60px] mt-4 opacity-80 rotate-[-12deg] drop-shadow-[0_0_10px_rgba(230,0,22,0.3)] mix-blend-screen">
            <Image src="/assets/icons/CD.png" alt="SLOWHRS Archive Media Disc" title="Archive Media" width={60} height={60} className="w-full h-auto pixel" />
          </div>
        </div>
      </div>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {ARCHIVE_ITEMS.map((item, i) => (
          <div key={item.id} className={`group relative border border-brand-border bg-[#050505] overflow-hidden flex flex-col h-[380px] md:h-[450px] reveal reveal-d${Math.min(i + 1, 5)} transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-[0_24px_70px_rgba(230,0,22,0.12)]`}>
            
            {/* File Header: category in red mono 9px, date right-aligned in mono 9px */}
            <div className="flex items-center justify-between p-3 border-b border-brand-border bg-[#0a0a0a] z-20">
              <span className="font-mono text-[9px] tracking-[0.2em] text-brand-red uppercase">case / {item.category}</span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-brand-ink/30 uppercase">{item.date}</span>
            </div>

            {/* Media Area */}
            <div className="relative flex-grow bg-black overflow-hidden flex items-center justify-center">
              <LazyVideo 
                src={item.src}
                poster={posterFor(item.src)}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 brightness-90 contrast-110 saturate-125"
              />
              <div className="absolute inset-0 w-full h-full bg-[#111] opacity-0 transition-opacity duration-500 flex items-center justify-center pointer-events-none group-hover:opacity-10">
                 <span className="font-mono text-[9px] tracking-[0.3em] text-brand-ink/40 uppercase">open file</span>
              </div>
              <div className="absolute bottom-3 right-3 z-30 border border-brand-ink/15 bg-black/70 px-2 py-1 font-mono text-[7px] uppercase tracking-[0.2em] text-brand-ink/45">
                sealed
              </div>
              
              {/* CRT Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(255,255,255,0)_50%)] bg-[length:100%_4px] opacity-20 z-20"></div>
            </div>

            {/* File Info Footer: title in italic serif, subtitle below */}
            <div className="p-5 border-t border-brand-border bg-[#050505] z-20 flex flex-col gap-3 transition-colors group-hover:bg-[#0a0a0a]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] tracking-[0.2em] text-brand-red uppercase border border-brand-red/30 bg-brand-red/5 px-2 py-0.5">
                  {item.category}
                </span>
                <span className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">
                  {item.duration}
                </span>
              </div>
              <h3 className="font-serif italic text-[1.4rem] text-brand-ink leading-tight truncate">
                {item.title}
              </h3>
              <p className="font-mono text-[7px] tracking-[0.1em] text-brand-ink/40 uppercase truncate">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Event Photo Galleries ── */}
      {EVENT_PHOTO_SETS.length > 0 && (
        <div className="mt-16 relative z-10">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-8 flex items-center gap-2 reveal">
            photo evidence / contact sheets
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EVENT_PHOTO_SETS.map((set, i) => {
              const baseInterval = set.count >= 15 ? 1000 : set.count >= 10 ? 900 : set.count >= 8 ? 850 : 800;
              const cardInterval = baseInterval + (i % 4) * 60;
              return (
              <div key={set.archiveId} className={`group border border-brand-border bg-[#050505] overflow-hidden reveal reveal-d${Math.min(i + 1, 4)}`}>
                {/* Photo Carousel */}
                <div className="relative aspect-[4/5]">
                  <EventPhotoCarousel
                    photos={getPhotoUrls(set)}
                    interval={cardInterval}
                    alt={set.alt}
                    className="absolute inset-0 w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />
                </div>
                {/* Info Footer */}
                <div className="p-4 border-t border-brand-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[7px] tracking-[0.2em] text-brand-red uppercase border border-brand-red/30 bg-brand-red/5 px-1.5 py-0.5">
                      frames
                    </span>
                    <span className="font-mono text-[7px] tracking-[0.2em] text-brand-ink/30 uppercase">
                      {set.count} frames
                    </span>
                  </div>
                  <h4 className="font-serif italic text-[1rem] text-brand-ink leading-tight truncate">
                    {set.title}
                  </h4>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Archive CTA */}
      <div className="mt-12 flex justify-center reveal reveal-d3">
        <Link href="/events" className="brand-action border border-brand-ink/20 px-8 py-4 font-mono text-[9px] tracking-[0.2em] text-brand-ink/60 hover:text-brand-ink hover:border-brand-ink/60 transition-colors uppercase flex items-center gap-2">
          Enter Evidence Room <span className="font-serif italic text-[1rem]">→</span>
        </Link>
      </div>

    </section>
  );
}
