import { MetadataRoute } from 'next';
import { SITE_META } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${SITE_META.url}/sitemap.xml`,
  };
}
