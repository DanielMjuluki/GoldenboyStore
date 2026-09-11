import type { Metadata } from 'next';
import { Suspense } from 'react';
import { dataStore } from '@/lib/data';
import ShopExperience from '@/lib/components/ShopExperience';

const STORE_SEO: Record<string, { title: string; description: string }> = {
  'kingdome-apparel': {
    title: 'Kingdome Fashion Apparel — Streetwear',
    description:
      'Shop Kingdome streetwear — t-shirts, hoodies, and sweatpants built for everyday wear. Official Kingdome apparel, South Africa.',
  },
  'goldenboy-merch': {
    title: 'Goldenboy Merch — Official Creator Merchandise',
    description:
      'Official Goldenboy merchandise. Shop apparel and creator-branded gear straight from the source.',
  },
  'general-store': {
    title: 'Golden General Store — Electronics, Homeware & More',
    description:
      'Everyday goods from Golden General Store — electronics, homeware, and general items, all in one place.',
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { store?: string };
}): Promise<Metadata> {
  const store = searchParams.store;
  const seo = store ? STORE_SEO[store] : undefined;

  if (seo) {
    return {
      title: seo.title,
      description: seo.description,
    };
  }

  return {
    title: 'Shop',
    description:
      'Shop Kingdome streetwear apparel, official Goldenboy merch, and everyday goods from the Golden General Store — all in one marketplace.',
  };
}

// Revalidate the product list periodically instead of on every request.
// Product data doesn't change second-to-second, so this avoids re-hitting
// the data store (and Google Sheets, once connected) on every page view.
export const revalidate = 60;

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof dataStore.getActiveProducts>> = [];
  let categories: Awaited<ReturnType<typeof dataStore.getCategories>> = [];
  let loadError = false;

  try {
    [products, categories] = await Promise.all([
      dataStore.getActiveProducts(),
      dataStore.getCategories(),
    ]);
  } catch (error) {
    console.error('Failed to load products for storefront:', error);
    loadError = true;
  }

  return (
    <main className="page-shell">
      {loadError ? (
        <div className="products-error">
          We couldn&apos;t load the catalog right now. Please refresh, or check back shortly.
        </div>
      ) : (
        <Suspense fallback={<div className="products-loading">Loading store…</div>}>
            <ShopExperience initialProducts={products} initialCategories={categories} />
          </Suspense>
      )}
    </main>
  );
}
