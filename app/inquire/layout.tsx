import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SLOWHRS | Inquire",
  description: "Direct line to SLOWHRS operations. Event coverage, production, collaborations, vendor placement, model casting, and sponsorship inquiries. Reviewed within 48 hours.",
  openGraph: {
    title: "SLOWHRS | Inquire",
    description: "Direct line to SLOWHRS operations. Event coverage, production, collaborations, and casting.",
  },
};

export default function InquireLayout({ children }: { children: React.ReactNode }) {
  return children;
}
