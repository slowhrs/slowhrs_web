/**
 * SLOWHRS — Fast Life Collection
 * Single source of truth for all clothing products.
 *
 * stripe_price_id values are placeholders — replace with real Stripe Price IDs
 * after creating products in the Stripe dashboard. See STRIPE_SETUP.md.
 */

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type StockStatus = 'available' | 'low' | 'gone';

export interface Drop {
  id: string;
  title: string;
  category: 'Outerwear' | 'Top' | 'Bottom';
  price: number;
  description: string;
  /** Path to MP4 product video in /public */
  video: string;
  /** Path to JPG poster frame in /public */
  poster: string;
  /** Sizes still available for purchase */
  available_sizes: Size[];
  /** Sizes that sold out — shown as disabled with strikethrough */
  sold_out_sizes: Size[];
  /** Display badge text */
  badge: string;
  /** Stripe Price ID — set after creating product in Stripe dashboard */
  stripe_price_id: string | null;
}

export const ALL_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const DROPS: Drop[] = [
  {
    id: 'spider_hoodie',
    title: 'SPIDER HOODIE',
    category: 'Outerwear',
    price: 100,
    description: 'Heavyweight cut. Web-stitched. One production run.',
    video: '/assets/drops/clothing/spider_hoodie.mp4',
    poster: '/assets/drops/clothing/spider_hoodie.jpg',
    available_sizes: [],
    sold_out_sizes: ['S', 'M', 'L', 'XL'],
    badge: 'GONE',
    stripe_price_id: null,
  },
  {
    id: 'front_hoodie',
    title: 'FRONT HOODIE',
    category: 'Outerwear',
    price: 50,
    description: 'Logo placement front. Archive fit.',
    video: '/assets/drops/clothing/front_hoodie.mp4',
    poster: '/assets/drops/clothing/front_hoodie.jpg',
    available_sizes: [],
    sold_out_sizes: ['S', 'M', 'L', 'XL'],
    badge: 'GONE',
    stripe_price_id: null,
  },
  {
    id: 'crop_hoodie',
    title: 'CROP HOODIE',
    category: 'Top',
    price: 40,
    description: 'Cropped body. Made for the after hours.',
    video: '/assets/drops/clothing/crop_hoodie.mp4',
    poster: '/assets/drops/clothing/crop_hoodie.jpg',
    available_sizes: [],
    sold_out_sizes: ['XS', 'S', 'M', 'L'],
    badge: 'GONE',
    stripe_price_id: null,
  },
  {
    id: 'fast_life_skirt',
    title: 'FAST LIFE SKIRT',
    category: 'Bottom',
    price: 50,
    description: 'Low-rise silhouette. VHS campaign. Final 2 units.',
    video: '/assets/drops/clothing/skirt.mp4',
    poster: '/assets/drops/clothing/skirt.jpg',
    available_sizes: ['S', 'M'],
    sold_out_sizes: ['XS', 'L', 'XL'],
    badge: '2 LEFT',
    stripe_price_id: null,
  },
  {
    id: 'flare_pants',
    title: 'FLARE PANTS',
    category: 'Bottom',
    price: 50,
    description: 'Wide leg construction. Runway silhouette.',
    video: '/assets/drops/clothing/flare_pants.mp4',
    poster: '/assets/drops/clothing/flare_pants.jpg',
    available_sizes: [],
    sold_out_sizes: ['S', 'M', 'L', 'XL'],
    badge: 'GONE',
    stripe_price_id: null,
  },
  {
    id: 'fast_life_pants',
    title: 'FAST LIFE PANTS',
    category: 'Bottom',
    price: 50,
    description: 'Straight cut. Night shift standard.',
    video: '/assets/drops/clothing/pants.mp4',
    poster: '/assets/drops/clothing/pants.jpg',
    available_sizes: [],
    sold_out_sizes: ['S', 'M', 'L', 'XL'],
    badge: 'GONE',
    stripe_price_id: null,
  },
  {
    id: 'fast_life_pant_002',
    title: 'FAST LIFE PANT 002',
    category: 'Bottom',
    price: 50,
    description: 'Second edition. Single production run.',
    video: '/assets/drops/clothing/fast_life_pant_002.mp4',
    poster: '/assets/drops/clothing/fast_life_pant_002.jpg',
    available_sizes: [],
    sold_out_sizes: ['S', 'M', 'L', 'XL'],
    badge: 'GONE',
    stripe_price_id: null,
  },
  {
    id: 'fast_life_tee',
    title: 'FAST LIFE TEE',
    category: 'Top',
    price: 20,
    description: 'Entry-level piece. Front logo print.',
    video: '/assets/drops/clothing/fast_life_tee.mp4',
    poster: '/assets/drops/clothing/fast_life_tee.jpg',
    available_sizes: [],
    sold_out_sizes: ['S', 'M', 'L', 'XL'],
    badge: 'GONE',
    stripe_price_id: null,
  },
  {
    id: 'fast_life_shorts',
    title: 'FAST LIFE SHORTS',
    category: 'Bottom',
    price: 30,
    description: 'Above the knee. Summer capsule.',
    video: '/assets/drops/clothing/shorts.mp4',
    poster: '/assets/drops/clothing/shorts.jpg',
    available_sizes: [],
    sold_out_sizes: ['S', 'M', 'L', 'XL'],
    badge: 'GONE',
    stripe_price_id: null,
  },
];

/** Returns stock status for a given drop */
export function getStockStatus(drop: Drop): StockStatus {
  if (drop.available_sizes.length === 0) return 'gone';
  if (drop.available_sizes.length <= 2) return 'low';
  return 'available';
}

/** Returns whether a drop can be purchased */
export function isAvailable(drop: Drop): boolean {
  return drop.available_sizes.length > 0;
}

/** Returns the drop by ID */
export function getDropById(id: string): Drop | undefined {
  return DROPS.find(d => d.id === id);
}
