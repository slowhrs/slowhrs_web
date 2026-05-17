"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import LazyVideo from "@/components/LazyVideo";
import SizePicker from "@/components/SizePicker";
import type { Drop, Size } from "@/lib/data/drops";
import { getStockStatus } from "@/lib/data/drops";

export default function DropTile({ drop }: { drop: Drop; index?: number }) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const status = getStockStatus(drop);
  const allSoldOut = status === "gone";

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDevice || allSoldOut) return;

    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${y * -4}deg`);
    card.style.setProperty("--tilt-y", `${x * 4}deg`);
  };

  const resetTilt = () => {
    setIsExpanded(false);
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <article
      ref={cardRef}
      className={`drop-tile group ${allSoldOut ? "drop-tile-sold-out" : ""}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      onClick={isTouchDevice && !allSoldOut ? () => setIsExpanded((value) => !value) : undefined}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--asphalt)]">
        <LazyVideo
          src={drop.video}
          poster={drop.poster}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${
            allSoldOut ? "grayscale" : ""
          }`}
        />

        {allSoldOut && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
            <Image
              src="/assets/widgets/gone.png"
              alt="sold out"
              width={140}
              height={70}
              className="pixel w-1/3 h-auto -rotate-12 opacity-95 drop-shadow-[0_0_12px_rgba(230,0,22,0.55)]"
            />
          </div>
        )}

        {!allSoldOut && status === "low" && (
          <div className="animate-pulse-scarcity absolute right-3 top-3 z-10 bg-red px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-bg">
            {drop.badge}
          </div>
        )}
      </div>

      <div className="flex min-h-[260px] flex-col gap-3 p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-red">
            {drop.category}
          </p>
          <p className="font-mono text-[12px] text-ink">${drop.price}</p>
        </div>

        <div>
          <h3 className="font-serif text-[1.8rem] italic lowercase leading-none text-ink">
            {drop.title.toLowerCase()}
          </h3>
          <p className="mt-3 line-clamp-2 font-serif text-sm italic leading-relaxed text-ink-dim">
            {drop.description}
          </p>
        </div>

        {!allSoldOut && (
          <div
            className={`overflow-hidden transition-all duration-400 ease-out ${
              isExpanded ? "mt-2 max-h-32 opacity-100" : "mt-0 max-h-0 opacity-0"
            }`}
          >
            <SizePicker
              drop={drop}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />
          </div>
        )}

        <div className="mt-auto">
          {!allSoldOut ? (
            <form action="/api/checkout" method="POST">
              <input type="hidden" name="product_id" value={drop.id} />
              <input type="hidden" name="size" value={selectedSize ?? ""} />
              <input type="hidden" name="stripe_price_id" value={drop.stripe_price_id ?? ""} />
              <button
                type="submit"
                disabled={!selectedSize}
                className={`w-full border py-3 font-mono text-[10px] uppercase tracking-[0.28em] transition-all duration-300 ease-out ${
                  selectedSize
                    ? "border-red text-red hover:translate-x-1 hover:bg-red hover:text-bg"
                    : "cursor-not-allowed border-border-2 text-ink-faint"
                }`}
              >
                {selectedSize ? `secure ${selectedSize} →` : "select size"}
              </button>
            </form>
          ) : (
            <p className="border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim">
              sold out. archive only.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
