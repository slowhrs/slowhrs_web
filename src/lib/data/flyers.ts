/**
 * Upcoming event flyers.
 */

export interface Flyer {
  id: string;
  title: string;
  date: string;
  image: string;
  rsvpUrl?: string;
  status: 'passed' | 'open';
  ctaLabel: string;
  description: string;
}

export const FLYERS: Flyer[] = [
  {
    id: 'vogue_safari',
    title: 'Vogue Safari',
    date: 'MAY 8',
    image: '/assets/flyers/vogue_safari_may8.jpeg',
    status: 'passed',
    ctaLabel: 'event passed',
    description: 'Content party before the night. Free photos + video. Westwood.',
  },
  {
    id: 'dj_moteoff_battles',
    title: 'DJ Battles — Moteoff',
    date: 'MAY 29',
    image: '/assets/flyers/dj_moteoff_battles.jpeg',
    rsvpUrl: 'https://www.djmote.com/eventViewFromInviteLink?type=event_promoter&promoter_link_token=RLtkvbYxZcA7-wQQ5VoJzZYW8W2sdCql9DsmpTmaK5b6Oi4G0Z00qvjAYodsaVq-&organization_id=26&uuid=70ae9369-dff5-4088-b935-3c549b7b7243',
    status: 'open',
    ctaLabel: 'reserve on dj mote',
    description: 'No judges. The crowd decides. Afrobeats + trap.',
  },
  {
    id: 'cinco_de_mayo',
    title: 'Cinco de Mayo Private',
    date: 'MAY 5',
    image: '/assets/flyers/cinco_de_mayo_private.jpeg',
    status: 'passed',
    ctaLabel: 'event passed',
    description: 'Private party. Bar + tacos. Close friends only.',
  },
];
