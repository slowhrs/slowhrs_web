export interface NewsItem {
  id: string;
  date: string;
  title: string;
  body: string;
  video: string | null;
  locked: boolean;
}

export const news: NewsItem[] = [
  {
    id: 'TX-014',
    date: '2025-09-15',
    title: 'casting window open.',
    body: 'looking for 8 faces for the spring shoot. editorial film and runway. LA only. send a transmission with your reel or polaroids. no agencies needed.',
    video: null,
    locked: false,
  },
  {
    id: 'TX-013',
    date: '2025-09-08',
    title: 'vogue safari content pre-game · this friday.',
    body: 'luxury safari editorial. photo shoot plus content pre-game for models, creatives, and good energy. come camera ready. approved members rsvp through partiful.',
    video: '/assets/events/block_party.mp4',
    locked: false,
  },
  {
    id: 'TX-012',
    date: '2025-08-30',
    title: 'runway recap is live.',
    body: 'long-form cut from the spring show on the events page. two camera angles. members got it first.',
    video: '/assets/videos/hero-recap.mp4',
    locked: false,
  },
  {
    id: 'TX-011',
    date: '2025-08-22',
    title: 'inner room dispatch.',
    body: 'direct line. not for the timeline. approved members only.',
    video: null,
    locked: true,
  },
  {
    id: 'TX-010',
    date: '2025-08-12',
    title: 'fall drop loading.',
    body: 'six pieces. three numbered. one sample never printed twice. inner room gets the early window. public window closes the same night it opens.',
    video: '/assets/drops/fast_life_reel.mp4',
    locked: false,
  },
  {
    id: 'TX-009',
    date: '2025-07-28',
    title: 'members-only calendar update.',
    body: 'locations released after approval. patience required.',
    video: null,
    locked: true,
  },
];
