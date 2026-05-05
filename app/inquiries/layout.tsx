import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inquiries | SLOWHRS",
  description: "Direct line to SLOWHRS. Production, events, collaborations, and casting requests.",
};

export default function InquiriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
