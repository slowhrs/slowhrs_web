import type { Metadata } from "next";
import { Cormorant_Garamond, Courier_Prime } from "next/font/google";
import "./globals.css";
import ScrollRevealInit from "@/components/ScrollRevealInit";

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
                    "https://instagram.com/slowhrs"
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

        {/* Children will contain the Nav, Ticker, and Page content */}
        {children}
      </body>
    </html>
  );
}
