export type DropStatus = 'available' | 'members-first' | 'runway' | '1of1' | 'sample' | 'gone';

export interface Drop {
  id: string;
  name: string;
  season: string;
  blurb: string;
  image: string;
  hoverVideo: string | null;
  status: DropStatus;
}

export const drops: Drop[] = [
  {
    id: 'DR-001',
    name: 'Slowhrs Waxed Denim',
    season: 'FW25 / 01 OF 06',
    blurb: 'indigo black. heavy waxed cotton. members get the early window.',
    image: '/assets/drops/fast_life_reel.mp4',
    hoverVideo: '/assets/drops/fast_life_reel.mp4',
    status: 'members-first',
  },
  {
    id: 'DR-002',
    name: 'Private Society Tank',
    season: 'FW25 / 02 OF 06',
    blurb: 'off-white. asphalt. red trim.',
    image: '/assets/events/block_party.mp4',
    hoverVideo: '/assets/drops/fast_life_reel.mp4',
    status: 'available',
  },
  {
    id: 'DR-003',
    name: 'Runway Archive Tee',
    season: 'FW25 / 03 OF 06',
    blurb: 'heavy cotton. print front and back. from the spring show.',
    image: '/assets/videos/hero-recap.mp4',
    hoverVideo: '/assets/videos/hero-recap.mp4',
    status: 'runway',
  },
  {
    id: 'DR-004',
    name: 'Red Room Thermal',
    season: 'FW25 / 04 OF 06',
    blurb: 'one of one. hand-distressed. numbered.',
    image: '/assets/events/destroy_lonely.mp4',
    hoverVideo: null,
    status: '1of1',
  },
  {
    id: 'DR-005',
    name: 'Afterhours Jorts',
    season: 'FW25 / 05 OF 06',
    blurb: 'cropped. distressed. red tag.',
    image: '/assets/events/newyears.mp4',
    hoverVideo: null,
    status: 'sample',
  },
  {
    id: 'DR-006',
    name: 'Fast Life Sample 001',
    season: 'FW25 / 06 OF 06',
    blurb: 'sold. archive only.',
    image: '/assets/drops/fast_life_reel.mp4',
    hoverVideo: null,
    status: 'gone',
  },
];
