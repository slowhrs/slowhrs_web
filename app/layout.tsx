import type { Metadata } from "next";
import { Cormorant_Garamond, Courier_Prime } from "next/font/google";
import "./globals.css";
import ScrollRevealInit from "@/components/ScrollRevealInit";
import WebVitals from "@/components/WebVitals";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const courier = Courier_Prime({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://slowhrs.com"), // Placeholder domain
  title: "SLOWHRS | Private Creative Society Los Angeles",
  description: "SLOWHRS is a private creative society in Los Angeles built around fashion, film, nightlife, clothing drops, event recaps, and member access.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "SLOWHRS | Private Creative Society",
    description: "Fashion, film, nightlife, and private access from the city after dark.",
    url: "https://slowhrs.com",
    siteName: "SLOWHRS",
    images: [
      {
        url: "/assets/logos/logo_main.png", // Fallback OG image
        width: 1200,
        height: 630,
        alt: "SLOWHRS Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SLOWHRS | Private Creative Society",
    description: "Fashion, film, nightlife, and private access from the city after dark.",
    images: ["/assets/logos/logo_main.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${courier.variable}`}>
      <head>
        <link rel="preconnect" href="https://checkout.stripe.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.stripe.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.stripe.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.stripe.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        {/* One high-priority preload only: the hero poster paints the first
            frame instantly. Video sources are fetched by HeroVideo with
            preload="auto"; preloading them here competes with critical CSS. */}
        <link
          rel="preload"
          as="image"
          href="/assets/videos/hero-poster.jpg"
          fetchPriority="high"
        />
      </head>
      <body className="antialiased font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://slowhrs.com/#organization",
                  "name": "SLOWHRS",
                  "url": "https://slowhrs.com",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://slowhrs.com/assets/logos/logo_main.png"
                  },
                  "description": "A private creative society in Los Angeles built around fashion, film, nightlife, and member access.",
                  "sameAs": [
                    "https://www.instagram.com/slowhrs/"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://slowhrs.com/#website",
                  "url": "https://slowhrs.com",
                  "name": "SLOWHRS",
                  "publisher": {
                    "@id": "https://slowhrs.com/#organization"
                  }
                }
              ]
            })
          }}
        />
        {/* Global Overlays */}
        <div className="overlay-grain"></div>
        <div className="overlay-scan"></div>
        
        {/* Scroll reveal observer */}
        <ScrollRevealInit />

        {/* Passive Core Web Vitals reporter */}
        <WebVitals />

        {/* Children will contain the Nav, Ticker, and Page content */}
        {children}
      </body>
    </html>
  );
}
