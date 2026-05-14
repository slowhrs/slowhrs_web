import Image from "next/image";

export default function DropsSection() {
  const products = [
    { title: "SLOWHRS WAXED DENIM", type: "Pants", price: "", badge: "LIMITED", desc: "Waxed black denim built for after-hours movement." },
    { title: "PRIVATE SOCIETY TANK", type: "Top", price: "By Application", badge: "MEMBERS FIRST", desc: "Entry layer for the private calendar." },
    { title: "RUNWAY ARCHIVE TEE", type: "Top", price: "", badge: "RUNWAY", desc: "A piece pulled from the show file." },
    { title: "RED ROOM THERMAL", type: "Top", price: "", badge: "GONE", desc: "Cold room base layer with red signal energy." },
    { title: "AFTERHOURS JORTS", type: "Bottoms", price: "", badge: "SAMPLE", desc: "Cut for long nights and flash photos." },
    { title: "FAST LIFE SAMPLE", type: "Outerwear", price: "", badge: "1 OF 1", desc: "Limited sample from the fast life file." }
  ];

  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-5 md:px-12 py-20 md:py-32 border-t border-brand-border" id="drops">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10 reveal">
        <div className="max-w-[600px]">
          <h2 className="font-serif italic font-normal text-[2.5rem] md:text-[3.5rem] text-brand-ink leading-none mb-4">
            shop drops.
          </h2>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.1em] text-brand-ink/60 max-w-[45ch] leading-[1.6] uppercase">
            pieces pulled from the archive.
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
              "itemListElement": products.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Product",
                  "name": product.title,
                  "description": product.desc,
                  "category": product.type,
                  "offers": {
                    "@type": "Offer",
                    "priceCurrency": "USD",
                    "price": "0.00",
                    "availability": product.badge === "GONE" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
                  }
                }
              }))
            })
          }}
        />
        {/* Featured Drop Video Card */}
        <div className="border border-brand-border bg-[#0a0a0a] relative overflow-hidden group reveal reveal-d1">
          <div className="absolute inset-0 bg-black z-0">
            <video autoPlay loop muted playsInline className="w-full h-full object-cover filter brightness-[0.6] contrast-[1.1] transition-transform duration-[2s] group-hover:scale-105">
              <source src="/assets/drops/fast_life_reel.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          </div>
          
          {/* Members First badge */}
          <div className="absolute top-5 right-5 z-20 w-[70px] md:w-[90px] opacity-85 rotate-[10deg] drop-shadow-[0_0_12px_rgba(230,0,22,0.35)] mix-blend-screen pointer-events-none">
            <Image src="/assets/widgets/members_first.png" alt="Members First" width={90} height={90} className="w-full h-auto pixel" />
          </div>

          <div className="relative z-10 p-6 md:p-10 h-full flex flex-col justify-end min-h-[400px] lg:min-h-[600px]">
            <h3 className="font-serif italic text-[2.5rem] md:text-[3.5rem] text-brand-ink leading-none mb-4">
              fw25 capsule.
            </h3>
            <p className="font-mono text-[9px] md:text-[10px] tracking-[0.1em] text-brand-ink/60 uppercase max-w-[35ch] mb-8">
              some pieces do not return.
            </p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-3 bg-brand-ink text-black px-6 py-3 self-start hover:bg-brand-red transition-colors duration-300">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold">VIEW DROP</span>
                <span className="font-serif italic text-[1.2rem] leading-none">→</span>
              </button>
              <div className="w-[32px] opacity-60 drop-shadow-[0_0_8px_rgba(230,0,22,0.3)] mix-blend-screen">
                <Image src="/assets/icons/cart.png" alt="" width={32} height={32} className="w-full h-auto pixel" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6 lg:overflow-y-auto lg:max-h-[600px] lg:pr-2 custom-scrollbar">
          {products.map((product, i) => (
            <div key={i} className={`flex flex-row md:flex-col lg:flex-row items-center lg:items-stretch gap-4 p-4 border border-brand-border bg-black/40 hover:bg-[#0a0a0a] transition-all group reveal reveal-d${Math.min(i + 1, 5)} ${product.badge === 'GONE' ? 'opacity-60 grayscale' : ''}`}>
              
              <div className="w-[100px] h-[130px] md:w-full md:h-[200px] lg:w-[120px] lg:h-[150px] shrink-0 bg-[#0c0c0c] relative border border-brand-border/40 flex flex-col items-center justify-center overflow-hidden">
                <span className="font-mono text-[7px] tracking-[0.3em] text-brand-ink/10 -rotate-90 whitespace-nowrap absolute">SLOWHRS ARCHIVE</span>
                <div className="absolute top-2 left-2 flex gap-1">
                  <div className="w-1 h-1 bg-brand-ink/20"></div>
                  <div className="w-1 h-1 bg-brand-ink/20"></div>
                </div>
                <div className="font-mono text-[6px] tracking-[0.2em] text-brand-ink/20 absolute bottom-2">FW25 / {String(i+1).padStart(2, '0')} of {String(products.length).padStart(2, '0')}</div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-brand-ink/5 mix-blend-overlay group-hover:opacity-50 transition-opacity"></div>
                
                {product.badge === 'GONE' && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                    <Image src="/assets/widgets/gone.png" alt="SLOWHRS Sold Out Gone Sticker Widget" title="Sold Out" width={60} height={30} className="pixel rotate-[-15deg] opacity-90 drop-shadow-[0_0_8px_rgba(230,0,22,0.6)]" />
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center flex-1 py-1">
                <div className="flex justify-between items-start mb-1.5">
                  <div className="font-mono text-[8px] tracking-[0.2em] text-brand-ink/40 uppercase">{product.type}</div>
                  <div className={`font-mono text-[7px] tracking-[0.2em] px-1.5 py-0.5 border uppercase ${product.badge === 'GONE' ? 'border-brand-ink/20 text-brand-ink/20' : 'border-brand-red/50 text-brand-red'}`}>{product.badge}</div>
                </div>
                <h4 className="font-serif italic text-[1.1rem] md:text-[1.2rem] text-brand-ink leading-tight mb-1 pr-2">{product.title}</h4>
                <p className="font-mono text-[8px] tracking-[0.1em] text-brand-ink/50 leading-snug mb-3 max-w-[30ch]">{product.desc}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="font-mono text-[10px] tracking-[0.1em] text-brand-ink/80">{product.price}</div>
                  <button className={`font-mono text-[8px] tracking-[0.2em] uppercase border-b pb-0.5 transition-colors ${product.badge === 'GONE' ? 'text-brand-ink/30 border-brand-ink/10 cursor-not-allowed' : 'text-brand-ink border-brand-ink/30 hover:text-brand-red hover:border-brand-red'}`}>
                    {product.badge === 'GONE' ? 'GONE' : 'SECURE PIECE'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
