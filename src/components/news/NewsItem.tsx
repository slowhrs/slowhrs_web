"use client";

import { useRef } from "react";
import Image from "next/image";
import type { NewsItem as NewsItemType } from "@/lib/data/news";

interface NewsItemProps {
  item: NewsItemType;
  useSticker?: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}.${dd}.${yy}`;
}

export default function NewsItemComponent({ item, useSticker }: NewsItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (item.locked) {
    return (
      <article className="relative py-10 border-b" style={{ borderColor: "var(--color-border-warm)" }}>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red">
          {formatDate(item.date)}
        </span>

        <div className="relative mt-4">
          {/* Blurred content */}
          <div style={{ filter: "blur(8px)" }} className="hover:blur-sm transition-all duration-400 select-none">
            <h3
              className="font-display italic leading-tight"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                color: "var(--color-ink-warm)",
              }}
            >
              {item.title}
            </h3>
            <p
              className="font-serif italic mt-3 leading-relaxed"
              style={{
                fontSize: "1rem",
                color: "var(--color-ink-warm)",
                lineHeight: 1.7,
              }}
            >
              {item.body}
            </p>
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {useSticker ? (
              <Image
                src="/assets/widgets/locked.png"
                alt="locked"
                width={40}
                height={40}
                className="pixel mb-3"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="mb-3"
                style={{ color: "var(--color-ink-warm-dim)" }}
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
            <span
              className="font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "var(--color-ink-warm-dim)" }}
            >
              members access · pending review
            </span>
          </div>
        </div>
      </article>
    );
  }

  const hasVideo = item.video != null;

  return (
    <article className="py-10 border-b" style={{ borderColor: "var(--color-border-warm)" }}>
      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red">
        {formatDate(item.date)}
      </span>

      <div className={`mt-4 ${hasVideo ? "grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-6" : ""}`}>
        {hasVideo && (
          <div className="relative aspect-video overflow-hidden rounded-sm">
            <video
              ref={videoRef}
              src={item.video!}
              muted
              playsInline
              loop
              preload="metadata"
              className="w-full h-full object-cover"
              onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
              onMouseLeave={(e) => {
                const v = e.target as HTMLVideoElement;
                v.pause();
                v.currentTime = 0;
              }}
            />
          </div>
        )}

        <div>
          <h3
            className="font-display italic leading-tight"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: "var(--color-ink-warm)",
              lineHeight: 1.15,
            }}
          >
            {item.title}
          </h3>
          <p
            className="font-serif italic mt-3 leading-relaxed"
            style={{
              fontSize: "1rem",
              color: "var(--color-ink-warm)",
              lineHeight: 1.7,
            }}
          >
            {item.body}
          </p>
        </div>
      </div>
    </article>
  );
}
