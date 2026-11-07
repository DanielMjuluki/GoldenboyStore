import type { ProductItem, CategoryItem } from '@/lib/data/types';

type ProductsData = { products?: ProductItem[]; categories?: CategoryItem[] };

let cached: Promise<ProductsData> | null = null;
let fetchedAt = 0;

export function getProductsData(): Promise<ProductsData> {
  const now = Date.now();
  if (cached === null || now - fetchedAt > 60000) {
    fetchedAt = now;
    cached = fetch('/api/products')
      .then((r) => r.json())
      .catch((err) => {
        cached = null;
        throw err;
      });
  }
  return cached;
}
