import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Playfair_Display,
  Courier_Prime,
} from "next/font/google";
import "./globals.css";
import GrainOverlay from "@/components/GrainOverlay";
import PersistentNav from "@/components/PersistentNav";
import LenisProvider from "@/components/LenisProvider";
import { SITE_META } from "@/lib/constants";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
});

const courier = Courier_Prime({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
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
    title: `${SITE_META.name} | ${SITE_META.tagline}`,
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
    title: `${SITE_META.name} | ${SITE_META.tagline}`,
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
    <html
      lang="en"
      className={`${cormorant.variable} ${playfair.variable} ${courier.variable}`}
    >
      <body className="antialiased">
        <LenisProvider>
          <GrainOverlay />
          <PersistentNav />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
