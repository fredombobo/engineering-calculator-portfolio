import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const sitemapUrl = `${process.env.SITE_URL || 'https://example.vercel.app'}/sitemap.xml`;
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: sitemapUrl,
  };
}
