import type { Metadata } from "next";
import { Cormorant_Garamond, Courier_Prime } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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
        {/* Global Overlays */}
        <div className="overlay-grain"></div>
        <div className="overlay-scan"></div>
        
        {/* Children will contain the Nav, Ticker, and Page content */}
        {children}
      </body>
    </html>
  );
}
