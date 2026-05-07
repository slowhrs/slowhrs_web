// SLOWHRS v2.0 — shared constants

export const NAV_LINKS = [
  { label: 'events', href: '/events' },
  { label: 'drops', href: '/drops' },
  { label: 'news', href: '/news' },
  { label: 'membership', href: '/membership' },
  { label: 'inquire', href: '/inquire' },
] as const;

export const SITE_META = {
  name: 'SLOWHRS',
  tagline: 'Private Creative Society',
  description: 'a private creative society in los angeles.',
  url: 'https://slowhrs.com',
} as const;

export const ENTRY_VIDEOS = [
  '/assets/events/block_party.mp4',
  '/assets/events/destroy_lonely.mp4',
  '/assets/events/newyears.mp4',
  '/assets/drops/fast_life_reel.mp4',
  '/assets/videos/hero-recap.mp4',
] as const;

export const INQUIRY_CATEGORIES = [
  { value: 'event-recap', label: 'event recap', question: 'tell us about your event' },
  { value: 'production', label: 'production', question: 'what\'s the project' },
  { value: 'collab', label: 'collab', question: 'what you have in mind' },
  { value: 'casting', label: 'casting', question: 'what you\'re auditioning for' },
  { value: 'vendor', label: 'vendor', question: 'what you provide' },
  { value: 'dj-performer', label: 'dj or performer', question: 'tell us about your set' },
  { value: 'sponsor', label: 'sponsor', question: 'the brand and the budget' },
  { value: 'other', label: 'something else', question: 'tell us what this is' },
] as const;
