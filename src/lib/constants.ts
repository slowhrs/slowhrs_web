// SLOWHRS v2 — shared constants

export const NAV_LINKS = [
  { label: "events", href: "/events" },
  { label: "drops", href: "/drops" },
  { label: "inquiries", href: "/inquiries" },
  { label: "news", href: "/news" },
  { label: "membership", href: "/membership" },
] as const;

export const THRESHOLD_ANSWERS = [
  { text: "late", route: "/events" },
  { text: "early", route: "/drops" },
  { text: "i don't know", route: "/news" },
] as const;

export const MEMBER_TIERS = [
  { name: "Guest", hearts: 0, minEvents: 0 },
  { name: "Cast", hearts: 2, minEvents: 1 },
  { name: "Crew", hearts: 3, minEvents: 3 },
  { name: "Inner Circle", hearts: 4, minEvents: 6 },
] as const;

export const SITE_META = {
  name: "SLOWHRS",
  tagline: "Private Creative Society · Los Angeles",
  description: "Fashion, film, nightlife, and private access from the city after dark.",
  url: "https://slowhrs.com",
} as const;
