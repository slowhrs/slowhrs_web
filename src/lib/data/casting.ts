/**
 * Casting call data.
 */

export interface CastingCall {
  id: string;
  title: string;
  date: string;
  image: string;
  description: string;
  /** Reference code for inquiry pre-fill */
  ref: string;
  isOpen: boolean;
  statusLabel: string;
}

export const CASTING_CALLS: CastingCall[] = [
  {
    id: 'content_creators',
    title: 'Content Creators Wanted',
    date: 'ONGOING',
    image: '/assets/casting/content_creators_call.jpeg',
    description: 'Looking for content creators to join the collective.',
    ref: 'CC-001',
    isOpen: true,
    statusLabel: 'open now',
  },
  {
    id: 'model_torrance',
    title: 'Model Casting — Issue 002',
    date: 'DATE PASSED',
    image: '/assets/casting/model_casting_torrance_oct29.jpeg',
    description: 'Shooting Issue 2 of the merch line in Torrance, CA.',
    ref: 'CC-002',
    isOpen: false,
    statusLabel: 'not available',
  },
  {
    id: 'model_april',
    title: 'Model Casting + After Hours',
    date: 'DATE PASSED',
    image: '/assets/casting/model_casting_april12_2026.jpeg',
    description: 'Tag 2 models. Share to story. RSVP in bio. 100 capacity.',
    ref: 'CC-003',
    isOpen: false,
    statusLabel: 'date passed',
  },
  {
    id: 'merch_casting',
    title: 'Merch Drop Casting',
    date: 'DATE PASSED',
    image: '/assets/casting/slowhrs_merch_casting_810.jpeg',
    description: 'Casting 4-6 models for the upcoming merch drop. Shot on VHS.',
    ref: 'CC-004',
    isOpen: false,
    statusLabel: 'date passed',
  },
  {
    id: 'szn6_movie',
    title: 'SZN 6 — Movie Casting',
    date: 'NOT AVAILABLE',
    image: '/assets/casting/szn6_movie_casting_april2026.jpeg',
    description: 'Cast 100. Units 14. Fast cars. Private takeover. Restricted.',
    ref: 'CC-005',
    isOpen: false,
    statusLabel: 'not available',
  },
];
