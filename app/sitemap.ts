import { MetadataRoute } from 'next';
import { SITE_META, NAV_LINKS } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = NAV_LINKS.map((link) => ({
    url: `${SITE_META.url}${link.href}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_META.url,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...routes,
  ];
}
