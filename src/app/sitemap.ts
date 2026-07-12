import type { MetadataRoute } from 'next';
import { getAllWorks } from '@/lib/works';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL || 'https://example.vercel.app';
  const works = getAllWorks();

  const workUrls: MetadataRoute.Sitemap = works.map(w => ({
    url: `${baseUrl}/zh/works/${w.slug}`,
    lastModified: new Date(w.frontmatter.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        en: `${baseUrl}/en/works/${w.slug}`,
      },
    },
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    { url: `${baseUrl}/zh`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/en`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/zh/works`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/en/works`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/zh/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/en/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    ...workUrls,
  ];
}
