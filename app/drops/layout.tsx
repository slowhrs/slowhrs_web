import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drops | SLOWHRS",
  description: "Member-first clothing drops from SLOWHRS. Fashion for the city after dark.",
};

export default function DropsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
