"use client";

import { useState } from "react";
import type { Size, Drop } from "@/lib/data/drops";
import { ALL_SIZES } from "@/lib/data/drops";

interface SizePickerProps {
  drop: Drop;
  selectedSize: Size | null;
  onSelect: (size: Size) => void;
}

/**
 * Size selector with sold-out sizes visible but disabled.
 * Sold-out sizes show line-through + reduced opacity for social proof.
 */
export default function SizePicker({ drop, selectedSize, onSelect }: SizePickerProps) {
  const soldOutSet = new Set(drop.sold_out_sizes);
  const availableSet = new Set(drop.available_sizes);

  // Only show sizes that are either available or sold out (skip sizes never offered)
  const visibleSizes = ALL_SIZES.filter(
    (s) => availableSet.has(s) || soldOutSet.has(s)
  );

  return (
    <div role="radiogroup" aria-label={`Select size for ${drop.title}`} className="flex flex-wrap gap-1.5">
      {visibleSizes.map((size) => {
        const isSoldOut = soldOutSet.has(size);
        const isSelected = selectedSize === size;

        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isSoldOut}
            disabled={isSoldOut}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(size);
            }}
            className={`
              font-mono text-[9px] tracking-[0.15em] uppercase
              w-[36px] h-[28px] flex items-center justify-center
              border transition-all duration-200
              ${isSoldOut
                ? 'border-brand-ink/10 text-brand-ink/20 line-through cursor-not-allowed opacity-40'
                : isSelected
                  ? 'border-brand-red bg-brand-red/10 text-brand-red'
                  : 'border-brand-ink/25 text-brand-ink/60 hover:border-brand-ink/50 hover:text-brand-ink cursor-pointer'
              }
            `}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Hook for managing size selection state per drop.
 */
export function useSizeSelection() {
  const [selections, setSelections] = useState<Record<string, Size | null>>({});

  const selectSize = (dropId: string, size: Size) => {
    setSelections((prev) => ({ ...prev, [dropId]: size }));
  };

  const getSelectedSize = (dropId: string): Size | null => {
    return selections[dropId] ?? null;
  };

  return { selectSize, getSelectedSize };
}
