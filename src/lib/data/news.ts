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
    body: 'looking for 8 faces for the spring shoot. editorial film and runway. LA only. send your reel or polaroids through the inquire page. no agencies.',
    video: null,
    locked: false,
  },
  {
    id: 'TX-013',
    date: '2025-09-08',
    title: 'vogue safari content pre-game · friday.',
    body: 'luxury safari editorial. photo shoot plus content pre-game. models, creatives, good energy. come camera ready. approved members rsvp on partiful.',
    video: '/assets/events/block_party.mp4',
    locked: false,
  },
  {
    id: 'TX-012',
    date: '2025-08-30',
    title: 'runway recap dropped.',
    body: 'long-form cut from the spring show. two camera angles. full runway walk. members saw it first.',
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
    title: 'fall drop loaded.',
    body: 'six pieces. three numbered. one sample that never prints again. inner room gets the window first. public window closes the same night.',
    video: '/assets/drops/fast_life_reel.mp4',
    locked: false,
  },
  {
    id: 'TX-009',
    date: '2025-07-28',
    title: 'calendar update · members only.',
    body: 'locations released after approval. patience.',
    video: null,
    locked: true,
  },
  {
    id: 'TX-008',
    date: '2025-07-14',
    title: 'holiday drop reel.',
    body: 'the christmas capsule. shot on film. three looks. one night.',
    video: '/assets/drops/christmas_drop.mp4',
    locked: false,
  },
];
