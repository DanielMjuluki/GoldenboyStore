import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenboystore.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cart', '/checkout', '/admin', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
