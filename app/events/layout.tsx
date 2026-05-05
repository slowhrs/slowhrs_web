import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | SLOWHRS",
  description: "Nightlife, runway, recaps, and rooms that moved. Documented by SLOWHRS in Los Angeles.",
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
