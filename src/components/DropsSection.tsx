import Image from "next/image";
import PhotoCycle from "@/components/PhotoCycle";

/* ── Real Fast Life clothing items ── */
const CLOTHING = [
  { 
    title: "SPIDER HOODIE", 
    type: "Outerwear", 
    price: "$100", 
    badge: "GONE", 
    desc: "Web-stitched heavyweight. One run only.",
    gif: "/assets/drops/clothing/spider_hoodie.gif"
  },
  { 
    title: "FRONT HOODIE", 
    type: "Outerwear", 
    price: "$50", 
    badge: "GONE", 
    desc: "Logo front. Archive cut.",
    gif: "/assets/drops/clothing/front_hoodie.gif"
  },
  { 
    title: "CROP HOODIE", 
    type: "Top", 
    price: "$40", 
    badge: "GONE", 
    desc: "Cropped. For the night shift.",
    gif: "/assets/drops/clothing/crop_hoodie.gif"
  },
  { 
    title: "FAST LIFE SKIRT", 
    type: "Bottom", 
    price: "$50", 
    badge: "2 LEFT", 
    desc: "Low-rise. Shot on VHS. Final units.",
    gif: "/assets/drops/clothing/skirt.gif"
  },
  { 
    title: "FLARE PANTS", 
    type: "Bottom", 
    price: "$50", 
    badge: "GONE", 
    desc: "Wide leg. Runway silhouette.",
    gif: "/assets/drops/clothing/flare_pants.gif"
  },
  { 
    title: "FAST LIFE PANTS", 
    type: "Bottom", 
    price: "$50", 
    badge: "GONE", 
    desc: "Straight cut. Built for the after hours.",
    gif: "/assets/drops/clothing/pants.gif"
  },
  { 
    title: "ADIDAS COLLAB PANTS", 
    type: "Bottom", 
    price: "$50", 
    badge: "GONE", 
    desc: "One-off collaboration. Never restocked.",
    gif: "/assets/drops/clothing/adidas_pants.gif"
  },
  { 
    title: "FAST LIFE TEE", 
    type: "Top", 
    price: "$20", 
    badge: "GONE", 
    desc: "Entry piece. Logo on front.",
    gif: "/assets/drops/clothing/fast_life_tee.gif"
  },
  { 
    title: "FAST LIFE SHORTS", 
    type: "Bottom", 
    price: "$30", 
    badge: "GONE", 
    desc: "Cut above the knee. Summer run.",
    gif: "/assets/drops/clothing/shorts.gif"
  },
];

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

export default function DropsSection() {
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
            most pieces are gone. what remains is what remains.
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
              "itemListElement": CLOTHING.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Product",
                  "name": item.title,
                  "description": item.desc,
                  "category": item.type,
                  "offers": {
                    "@type": "Offer",
                    "priceCurrency": "USD",
                    "price": item.price.replace("$", ""),
                    "availability": item.badge === "GONE" ? "https://schema.org/OutOfStock" : "https://schema.org/LimitedAvailability"
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
              alt="SLOWHRS Fast Life Campaign"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10"></div>
          </div>
          
          {/* Members First badge */}
          <div className="absolute top-5 right-5 z-20 w-[70px] md:w-[90px] opacity-85 rotate-[10deg] drop-shadow-[0_0_12px_rgba(230,0,22,0.35)] pointer-events-none">
            <Image src="/assets/widgets/members_first.png" alt="Members First" width={90} height={90} className="w-full h-auto pixel" />
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
              8 of 9 pieces sold out. 1 remaining.
            </p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-3 bg-brand-ink text-black px-6 py-3 self-start hover:bg-brand-red transition-colors duration-300">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold">VIEW DROP</span>
                <span className="font-serif italic text-[1.2rem] leading-none">→</span>
              </button>
              <div className="w-[32px] opacity-70 drop-shadow-[0_0_8px_rgba(230,0,22,0.3)]">
                <Image src="/assets/icons/cart.png" alt="" width={32} height={32} className="w-full h-auto pixel" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid — Real Clothing with GIFs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-4 lg:overflow-y-auto lg:max-h-[600px] lg:pr-2 custom-scrollbar">
          {CLOTHING.map((item, i) => {
            const isAvailable = item.badge !== "GONE";
            return (
              <div key={i} className={`flex flex-row md:flex-col lg:flex-row items-center lg:items-stretch gap-4 p-3 border border-brand-border bg-[#080808] hover:bg-[#0e0e0e] transition-all group reveal reveal-d${Math.min(i + 1, 5)} ${!isAvailable ? 'opacity-60' : ''}`}>
                
                {/* GIF Product Image */}
                <div className="w-[100px] h-[130px] md:w-full md:h-[180px] lg:w-[110px] lg:h-[140px] shrink-0 bg-[#0a0a0a] relative border border-brand-border/40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.gif} 
                    alt={`SLOWHRS ${item.title} Product Image`}
                    className={`w-full h-full object-contain ${!isAvailable ? 'grayscale' : ''}`}
                    loading="lazy"
                  />
                  
                  {/* GONE overlay */}
                  {!isAvailable && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                      <Image src="/assets/widgets/gone.png" alt="Sold Out" title="Sold Out" width={60} height={30} className="pixel rotate-[-15deg] opacity-90 drop-shadow-[0_0_8px_rgba(230,0,22,0.6)]" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-center flex-1 py-1 min-w-0">
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">{item.type}</div>
                    <div className={`font-mono text-[7px] tracking-[0.2em] px-1.5 py-0.5 border uppercase shrink-0 ${
                      isAvailable 
                        ? 'border-brand-red text-brand-red animate-pulse' 
                        : 'border-brand-ink/20 text-brand-ink/20'
                    }`}>{item.badge}</div>
                  </div>
                  <h4 className="font-serif italic text-[1rem] md:text-[1.1rem] text-brand-ink leading-tight mb-1 truncate">{item.title}</h4>
                  <p className="font-mono text-[8px] tracking-[0.1em] text-brand-ink/50 leading-snug mb-2 max-w-[30ch]">{item.desc}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className={`font-mono text-[11px] tracking-[0.1em] ${isAvailable ? 'text-brand-red font-bold' : 'text-brand-ink/40 line-through'}`}>{item.price}</div>
                    <button className={`font-mono text-[8px] tracking-[0.2em] uppercase border-b pb-0.5 transition-colors ${
                      isAvailable
                        ? 'text-brand-red border-brand-red/50 hover:border-brand-red cursor-pointer' 
                        : 'text-brand-ink/30 border-brand-ink/10 cursor-not-allowed'
                    }`}>
                      {isAvailable ? 'SECURE PIECE' : 'SOLD OUT'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
