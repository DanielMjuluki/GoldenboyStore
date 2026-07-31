'use client';

import type { ProductItem, CategoryItem } from '@/lib/data/types';
import ProductsExplorer from '@/lib/components/ProductsExplorer';

interface ShopExperienceProps {
  initialProducts: ProductItem[];
  initialCategories: CategoryItem[];
}

export default function ShopExperience({ initialProducts, initialCategories }: ShopExperienceProps) {
  return (
    <div className="shop-experience">
      <section className="products-hero">
        <div>
          <p className="eyebrow">GoldenStore marketplace</p>
          <h1>Shop products.</h1>
          <p className="intro-copy">
            Browse the latest drops and grab what you need — checkout is quick and easy.
          </p>
        </div>
      </section>

      <ProductsExplorer initialProducts={initialProducts} initialCategories={initialCategories} />
    </div>
  );
}
