import type { Metadata } from 'next';
import { dataStore } from '@/lib/data';
import ShopExperience from '@/lib/components/ShopExperience';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse the full Goldenboy marketplace — content creation, strategy, and merch launch services.',
};

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
        <ShopExperience initialProducts={products} initialCategories={categories} />
      )}
    </main>
  );
}
