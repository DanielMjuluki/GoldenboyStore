import type { MetadataRoute } from 'next';
import { dataStore } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenboystore.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/projects`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const products = await dataStore.getActiveProducts();
    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error('Failed to build sitemap product entries:', error);
    return staticRoutes;
  }
}
