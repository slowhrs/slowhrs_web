export type EventCategory = "runway" | "nightlife" | "campaign" | "bts";
export type TileWidth = "wide" | "standard" | "half";

export type Event = {
  id: string;
  name: string;
  date: string;
  venue: string;
  category: EventCategory;
  videoSrc: string;
  caption: string;
  width: TileWidth;
};

/**
 * Curated chronological grid — all verified against disk.
 * 6 real videos on disk. No invented paths.
 *
 * Asset reality (from `find public/assets -name "*.mp4"`):
 *   /assets/videos/hero-recap.mp4
 *   /assets/events/block_party.mp4
 *   /assets/events/destroy_lonely.mp4
 *   /assets/events/newyears.mp4
 *   /assets/drops/fast_life_reel.mp4
 *   /assets/drops/christmas_drop.mp4
 */
export const EVENTS: Event[] = [
  {
    id: "act-iv",
    name: "act iv",
    date: "03.14.25",
    venue: "Los Angeles",
    category: "nightlife",
    videoSrc: "/assets/videos/hero-recap.mp4",
    caption: "Red Room. Members First. Footage from inside the room.",
    width: "wide",
  },
  {
    id: "block-party",
    name: "block party",
    date: "06.15.25",
    venue: "LA",
    category: "nightlife",
    videoSrc: "/assets/events/block_party.mp4",
    caption: "Ten crews, two stages, one city. Hosted by hardlyeverhome.",
    width: "standard",
  },
  {
    id: "destroy-lonely",
    name: "destroy lonely · trap rave",
    date: "02.18.25",
    venue: "WYA LA",
    category: "nightlife",
    videoSrc: "/assets/events/destroy_lonely.mp4",
    caption: "WYA Trap Rave. Late-night recap from the floor.",
    width: "standard",
  },
  {
    id: "nye",
    name: "nye",
    date: "12.31.24",
    venue: "Mid-City",
    category: "nightlife",
    videoSrc: "/assets/events/newyears.mp4",
    caption: "Fast life never sleeps. New Year's at Mid-City.",
    width: "standard",
  },
  {
    id: "fast-life",
    name: "fast life campaign",
    date: "11.10.24",
    venue: "LA",
    category: "campaign",
    videoSrc: "/assets/drops/fast_life_reel.mp4",
    caption: "Clothing reel. Fast life never returns.",
    width: "half",
  },
  {
    id: "holiday-drop",
    name: "holiday capsule",
    date: "12.20.24",
    venue: "LA",
    category: "campaign",
    videoSrc: "/assets/drops/christmas_drop.mp4",
    caption: "End-of-year capsule drop. Documented for the archive.",
    width: "half",
  },
];

/** Hero rotation uses the first 4 events (or fewer if less available) */
export const HERO_EVENTS = EVENTS.slice(0, Math.min(4, EVENTS.length));

/** Filter categories */
export const FILTER_CATEGORIES = ["all", "nightlife", "campaign", "runway", "bts"] as const;
