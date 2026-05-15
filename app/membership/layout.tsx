import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SLOWHRS | Membership",
  description: "Apply for SLOWHRS membership. Private access to events, drops, castings, and archive. Applications reviewed manually. Los Angeles.",
  openGraph: {
    title: "SLOWHRS | Membership",
    description: "Apply for SLOWHRS membership. Private access to events, drops, castings, and archive.",
  },
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
