import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership | SLOWHRS",
  description: "Access is not a newsletter. It is the list. Apply for membership to SLOWHRS.",
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
