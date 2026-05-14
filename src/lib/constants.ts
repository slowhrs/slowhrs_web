// SLOWHRS v2.1 — shared constants

export const NAV_LINKS = [
  { label: 'events', href: '/events' },
  { label: 'drops', href: '/drops' },
  { label: 'news', href: '/news' },
  { label: 'membership', href: '/membership' },
  { label: 'community', href: '/community' },
  { label: 'inquire', href: '/inquire' },
] as const;

export const SITE_META = {
  name: 'SLOWHRS',
  tagline: 'Private Creative Society',
  description: 'a private creative society in los angeles. events, film, clothing.',
  url: 'https://slowhrs.com',
} as const;

// All available event/recap reels — random pick for cinema entry + hero
export const ENTRY_VIDEOS = [
  '/assets/events/block_party.mp4',
  '/assets/events/destroy_lonely.mp4',
  '/assets/events/newyears.mp4',
  '/assets/drops/fast_life_reel.mp4',
  '/assets/drops/christmas_drop.mp4',
  '/assets/videos/hero-recap.mp4',
] as const;

export const INQUIRY_CATEGORIES = [
  { value: 'event-recap', label: 'event recap', question: 'which event. what you need from the footage.' },
  { value: 'production', label: 'production', question: 'the project. the date. the budget range.' },
  { value: 'collab', label: 'collab', question: 'what you make. what you want to make together.' },
  { value: 'casting', label: 'casting', question: 'your look. your reel or book. no agencies.' },
  { value: 'vendor', label: 'vendor / bar', question: 'what you bring to the room.' },
  { value: 'dj-performer', label: 'dj / performer', question: 'your set. your sound. a link.' },
  { value: 'sponsor', label: 'brand / sponsor', question: 'the brand. the activation. the number.' },
  { value: 'other', label: 'other', question: 'say it plain.' },
] as const;
