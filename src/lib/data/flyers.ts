/**
 * Upcoming event flyers.
 */

export interface Flyer {
  id: string;
  title: string;
  date: string;
  image: string;
  rsvpUrl?: string;
  description: string;
}

export const FLYERS: Flyer[] = [
  {
    id: 'vogue_safari',
    title: 'Vogue Safari',
    date: 'MAY 8',
    image: '/assets/flyers/vogue_safari_may8.jpeg',
    rsvpUrl: 'https://partiful.com/e/slowhrs-vogue-safari',
    description: 'Content party before the night. Free photos + video. Westwood.',
  },
  {
    id: 'dj_moteoff_battles',
    title: 'DJ Battles — Moteoff',
    date: 'MAY 29',
    image: '/assets/flyers/dj_moteoff_battles.jpeg',
    rsvpUrl: 'https://partiful.com/e/slowhrs-dj-battles',
    description: 'No judges. The crowd decides. Afrobeats + trap.',
  },
  {
    id: 'cinco_de_mayo',
    title: 'Cinco de Mayo Private',
    date: 'MAY 5',
    image: '/assets/flyers/cinco_de_mayo_private.jpeg',
    rsvpUrl: 'https://partiful.com/e/slowhrs-cinco',
    description: 'Private party. Bar + tacos. Close friends only.',
  },
];
