"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SizePicker from "@/components/SizePicker";
import type { Drop, Size } from "@/lib/data/drops";
import { getStockStatus } from "@/lib/data/drops";

export default function DropTile({ drop }: { drop: Drop; index?: number }) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTouchDevice] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(hover: none)").matches : false
  );
  const cardRef = useRef<HTMLElement>(null);
  const status = getStockStatus(drop);
  const allSoldOut = status === "gone";

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
      <div className="drop-media relative aspect-[4/5] overflow-hidden">
        <div className="drop-gif-stage absolute inset-0 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={drop.gif}
            alt={`${drop.title} animated product view`}
            className="h-full w-full object-contain scale-[1.2] transition-transform duration-700 group-hover:scale-[1.32]"
          />
        </div>

        {allSoldOut && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/15">
            <Image
              src="/assets/widgets/gone.png"
              alt="sold out"
              width={140}
              height={70}
              className="pixel w-1/4 max-w-[120px] h-auto -rotate-12 opacity-85 drop-shadow-[0_0_12px_rgba(230,0,22,0.55)]"
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
            drop.stripe_price_id ? (
            <form action="/api/checkout" method="POST">
              <input type="hidden" name="product_id" value={drop.id} />
              <input type="hidden" name="size" value={selectedSize ?? ""} />
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
            ) : selectedSize ? (
              <Link
                href={`/#inquiry?subject=order&product=${encodeURIComponent(drop.id)}&size=${selectedSize}`}
                className="brand-action block w-full border border-red py-3 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-red transition-all duration-300 ease-out hover:translate-x-1 hover:bg-red hover:text-bg"
              >
                message to order {selectedSize} →
              </Link>
            ) : (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsExpanded(true);
                }}
                className="w-full border border-border-2 py-3 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint transition-all duration-300 ease-out hover:border-red hover:text-red"
              >
                select size
              </button>
            )
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
