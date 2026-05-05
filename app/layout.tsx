import type { Metadata } from "next";
import { Cormorant_Garamond, Courier_Prime } from "next/font/google";
import "./globals.css";
import GrainOverlay from "@/components/GrainOverlay";
import PersistentNav from "@/components/PersistentNav";
import AmbientCorner from "@/components/AmbientCorner";
import CustomCursor from "@/components/CustomCursor";
import LenisProvider from "@/components/LenisProvider";
import { SITE_META } from "@/lib/constants";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const courier = Courier_Prime({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_META.url),
  title: `${SITE_META.name} | ${SITE_META.tagline}`,
  description: SITE_META.description,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: `${SITE_META.name} | Private Creative Society`,
    description: SITE_META.description,
    url: SITE_META.url,
    siteName: SITE_META.name,
    images: [
      {
        url: "/assets/logos/logo_main.png",
        width: 1200,
        height: 630,
        alt: "SLOWHRS",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_META.name} | Private Creative Society`,
    description: SITE_META.description,
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
        <LenisProvider>
          {/* Global Overlays */}
          <GrainOverlay />

          {/* Persistent Chrome */}
          <PersistentNav />
          <AmbientCorner />

          {/* Route Content */}
          {children}

          {/* Custom Cursor (desktop only) */}
          <CustomCursor />
        </LenisProvider>
      </body>
    </html>
  );
}
