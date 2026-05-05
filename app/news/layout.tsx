import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transmission | SLOWHRS",
  description: "What happened. What's coming. Nothing else. Updates from SLOWHRS, Los Angeles.",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
