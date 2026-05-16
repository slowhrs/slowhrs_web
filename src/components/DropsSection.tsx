"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import PhotoCycle from "@/components/PhotoCycle";
import SizePicker, { useSizeSelection } from "@/components/SizePicker";
import { DROPS, isAvailable, getStockStatus } from "@/lib/data/drops";
import type { Drop } from "@/lib/data/drops";
import LazyVideo from "@/components/LazyVideo";

/* Campaign model photos for the featured slideshow */
const CAMPAIGN_PHOTOS = [
  "/assets/drops/campaign/1.jpeg",
  "/assets/drops/campaign/2.jpeg",
  "/assets/drops/campaign/3.jpeg",
  "/assets/drops/campaign/4.jpeg",
  "/assets/drops/campaign/5.jpeg",
  "/assets/drops/campaign/6.jpeg",
  "/assets/drops/campaign/7.jpeg",
  "/assets/drops/campaign/8.jpeg",
  "/assets/drops/campaign/9.jpeg",
  "/assets/drops/campaign/12.jpeg",
  "/assets/drops/campaign/13.jpeg",
  "/assets/drops/campaign/14.jpeg",
  "/assets/drops/campaign/15.jpeg",
];

const availableCount = DROPS.filter(isAvailable).length;
const goneCount = DROPS.length - availableCount;

export default function DropsSection() {
  const { selectSize, getSelectedSize } = useSizeSelection();

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="drops">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10 reveal">
        <div className="max-w-[600px]">
          <div className="font-mono text-[10px] tracking-[0.3em] text-brand-red uppercase mb-4 flex items-center gap-2">
            <Image src="/assets/icons/slowhrs_bag.png" alt="" width={14} height={14} className="pixel opacity-70" aria-hidden="true" />
            FAST LIFE COLLECTION
          </div>
          <h2 className="font-serif italic font-normal text-[2.5rem] md:text-[3.5rem] text-brand-ink leading-none mb-4">
            shop drops.
          </h2>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 max-w-[45ch] leading-[1.6] uppercase">
            {goneCount} of {DROPS.length} pieces gone. {availableCount > 0 ? `${availableCount} remaining.` : 'what remains is what remains.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.2fr_1fr] gap-6 lg:gap-10 relative z-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": DROPS.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Product",
                  "name": item.title,
                  "description": item.description,
                  "category": item.category,
                  "offers": {
                    "@type": "Offer",
                    "priceCurrency": "USD",
                    "price": item.price,
                    "availability": isAvailable(item) ? "https://schema.org/LimitedAvailability" : "https://schema.org/OutOfStock"
                  }
                }
              }))
            })
          }}
        />

        {/* Featured Drop — Campaign Photo Slideshow */}
        <div className="border border-brand-border bg-[#0a0a0a] relative overflow-hidden group reveal reveal-d1">
          <div className="absolute inset-0 bg-black z-0">
            <PhotoCycle 
              images={CAMPAIGN_PHOTOS}
              interval={2200}
              className="w-full h-full"
              alt="SLOWHRS Fast Life Campaign Lookbook"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10"></div>
          </div>
          
          {/* Members First badge */}
          <div className="absolute top-5 right-5 z-20 w-[70px] md:w-[90px] opacity-85 rotate-[10deg] drop-shadow-[0_0_12px_rgba(230,0,22,0.35)] pointer-events-none">
            <Image src="/assets/widgets/members_first.png" alt="SLOWHRS Members First Access" title="Members First" width={90} height={90} className="w-full h-auto pixel" />
          </div>

          <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-end min-h-[400px] lg:min-h-[600px]">
            {/* Logo GIF accent */}
            <div className="absolute top-6 left-6 w-[60px] md:w-[80px] opacity-40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/drops/clothing/slowhrs_logo.gif" alt="" className="w-full h-auto pixel" />
            </div>

            <h3 className="font-serif italic text-[2.5rem] md:text-[3.5rem] text-brand-ink leading-none mb-4">
              fast life.
            </h3>
            <p className="font-mono text-[9px] md:text-[10px] tracking-[0.1em] text-brand-ink/60 uppercase max-w-[35ch] mb-3">
              shot on vhs. worn in the room.
            </p>
            <p className="font-mono text-[8px] tracking-[0.15em] text-brand-ink/40 uppercase mb-8">
              {goneCount} of {DROPS.length} pieces sold out. {availableCount > 0 ? `${availableCount} remaining.` : 'archive collection.'}
            </p>
            <div className="flex items-center gap-4">
              <Link href="#drops-grid" className="flex items-center gap-3 bg-brand-ink text-black px-6 py-3 self-start hover:bg-brand-red transition-colors duration-300">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold">VIEW DROP</span>
                <span className="font-serif italic text-[1.2rem] leading-none">→</span>
              </Link>
              <div className="w-[32px] opacity-70 drop-shadow-[0_0_8px_rgba(230,0,22,0.3)]">
                <Image src="/assets/icons/cart.png" alt="" width={32} height={32} className="w-full h-auto pixel" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid — 2-column with video tiles */}
        <div id="drops-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-4 lg:overflow-y-auto lg:max-h-[600px] lg:pr-2 custom-scrollbar">
          {DROPS.map((drop, i) => (
            <DropCard
              key={drop.id}
              drop={drop}
              index={i}
              selectedSize={getSelectedSize(drop.id)}
              onSelectSize={(size) => selectSize(drop.id, size)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


/* ── Individual Drop Card ── */

function DropCard({
  drop,
  index,
  selectedSize,
  onSelectSize,
}: {
  drop: Drop;
  index: number;
  selectedSize: import("@/lib/data/drops").Size | null;
  onSelectSize: (size: import("@/lib/data/drops").Size) => void;
}) {
  const available = isAvailable(drop);
  const status = getStockStatus(drop);

  const handleCheckout = () => {
    if (!selectedSize) return;

    // If Stripe isn't configured, route to inquiry form with product context
    if (!drop.stripe_price_id) {
      window.location.href = `#inquiry?subject=order&product=${drop.id}&size=${selectedSize}`;
      return;
    }

    // Stripe checkout — POST to server action
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/checkout';
    
    const addField = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    addField('product_id', drop.id);
    addField('size', selectedSize);
    addField('stripe_price_id', drop.stripe_price_id);
    
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className={`flex flex-row md:flex-col lg:flex-row items-start lg:items-stretch gap-4 p-3 border border-brand-border bg-[#080808] hover:bg-[#0e0e0e] transition-all group reveal reveal-d${Math.min(index + 1, 5)} ${!available ? 'opacity-60' : ''}`}>
      
      {/* Video Product Preview */}
      <div className="w-[120px] h-[160px] md:w-full md:h-[220px] lg:w-[130px] lg:h-[170px] shrink-0 bg-[#0a0a0a] relative border border-brand-border/40 overflow-hidden">
        <LazyVideo
          src={drop.video}
          className="w-full h-full object-contain"
        />
        
        {/* GONE overlay */}
        {!available && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <Image src="/assets/widgets/gone.png" alt="Sold Out" title="Sold Out" width={60} height={30} className="pixel rotate-[-15deg] opacity-90 drop-shadow-[0_0_8px_rgba(230,0,22,0.6)]" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-between flex-1 py-1 min-w-0 gap-2">
        <div>
          <div className="flex justify-between items-start mb-1.5">
            <div className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">{drop.category}</div>
            <div className={`font-mono text-[7px] tracking-[0.2em] px-1.5 py-0.5 border uppercase shrink-0 ${
              available 
                ? 'border-brand-red text-brand-red animate-pulse' 
                : 'border-brand-ink/20 text-brand-ink/20'
            }`}>{drop.badge}</div>
          </div>
          <h4 className="font-serif italic text-[1rem] md:text-[1.1rem] text-brand-ink leading-tight mb-1 truncate">{drop.title}</h4>
          <p className="font-mono text-[8px] tracking-[0.1em] text-brand-ink/50 leading-snug mb-2 max-w-[30ch]">{drop.description}</p>
        </div>

        {/* Size Picker — only for available items */}
        {available && (
          <div className="mb-2">
            <SizePicker
              drop={drop}
              selectedSize={selectedSize}
              onSelect={onSelectSize}
            />
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className={`font-mono text-[11px] tracking-[0.1em] ${available ? 'text-brand-red font-bold' : 'text-brand-ink/40 line-through'}`}>${drop.price}</div>
          
          {available ? (
            <button
              onClick={handleCheckout}
              disabled={!selectedSize}
              className={`font-mono text-[8px] tracking-[0.2em] uppercase border-b pb-0.5 transition-colors ${
                selectedSize
                  ? 'text-brand-red border-brand-red/50 hover:border-brand-red cursor-pointer'
                  : 'text-brand-ink/30 border-brand-ink/10 cursor-not-allowed'
              }`}
            >
              {selectedSize ? (drop.stripe_price_id ? 'SECURE PIECE' : 'MESSAGE TO ORDER') : 'SELECT SIZE'}
            </button>
          ) : (
            <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-brand-ink/30 border-b border-brand-ink/10 pb-0.5">
              SOLD OUT
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
