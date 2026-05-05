export type DropStatus = "available" | "gone" | "members_first";

export type Drop = {
  id: string;
  name: string;
  collection: string;
  price: string;
  status: DropStatus;
  videoSrc: string;
  description: string;
  details: string[];
};

/**
 * Drops showroom — curated archive of past + current pieces.
 * All video paths verified against `find public/assets -name "*.mp4"`.
 *
 * Sticker assets on disk:
 *   /assets/widgets/gone.png
 *   /assets/widgets/members_first.png
 */
export const DROPS: Drop[] = [
  {
    id: "fast-life-hoodie",
    name: "Fast Life Hoodie",
    collection: "Fast Life",
    price: "$120",
    status: "gone",
    videoSrc: "/assets/drops/fast_life_reel.mp4",
    description: "Heavyweight cut. Embroidered chest hit. Gone.",
    details: ["400gsm French terry", "Oversized fit", "Embroidered logo", "Released 11.10.24"],
  },
  {
    id: "fast-life-tee",
    name: "Fast Life Tee",
    collection: "Fast Life",
    price: "$55",
    status: "gone",
    videoSrc: "/assets/drops/fast_life_reel.mp4",
    description: "Standard issue. Front and back print. Archive only.",
    details: ["220gsm cotton", "Relaxed fit", "Screen print", "Released 11.10.24"],
  },
  {
    id: "holiday-capsule-tee",
    name: "Holiday Capsule Tee",
    collection: "Holiday '24",
    price: "$65",
    status: "members_first",
    videoSrc: "/assets/drops/christmas_drop.mp4",
    description: "End-of-year capsule. Members had first access. Limited remaining.",
    details: ["220gsm cotton", "Boxy fit", "Puff print detail", "Released 12.20.24"],
  },
  {
    id: "holiday-capsule-long-sleeve",
    name: "Holiday Long Sleeve",
    collection: "Holiday '24",
    price: "$75",
    status: "members_first",
    videoSrc: "/assets/drops/christmas_drop.mp4",
    description: "Winter weight. Cuff detail. Members access.",
    details: ["260gsm cotton", "Regular fit", "Embroidered cuffs", "Released 12.20.24"],
  },
  {
    id: "ss25-preview",
    name: "SS25 Piece 001",
    collection: "SS25",
    price: "—",
    status: "members_first",
    videoSrc: "/assets/drops/fast_life_reel.mp4",
    description: "Unreleased. Members will know first.",
    details: ["Details withheld", "Spring/Summer 2025", "Announcement pending"],
  },
];

export const STATUS_STICKERS: Record<DropStatus, { src: string | null; label: string }> = {
  available: { src: null, label: "" },
  gone: { src: "/assets/widgets/gone.png", label: "GONE" },
  members_first: { src: "/assets/widgets/members_first.png", label: "MEMBERS FIRST" },
};
