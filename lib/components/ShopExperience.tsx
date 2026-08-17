'use client';

import { useState } from 'react';
import type { ProductItem, CategoryItem } from '@/lib/data/types';
import ProductsExplorer from '@/lib/components/ProductsExplorer';
import { Store, Crown, Shirt } from 'lucide-react';

interface ShopExperienceProps {
  initialProducts: ProductItem[];
  initialCategories: CategoryItem[];
}

const STORE_BANNERS = [
  {
    id: 'kingdome-apparel',
    name: 'Kingdome Fashion Apparel',
    tagline: 'Streetwear for the kingdom',
    icon: Crown,
  },
  {
    id: 'goldenboy-merch',
    name: 'Goldenboy Merch',
    tagline: 'Official creator merchandise',
    icon: Shirt,
  },
  {
    id: 'general-store',
    name: 'Golden General Store',
    tagline: 'Everyday goods and general items',
    icon: Store,
  },
];

export default function ShopExperience({ initialProducts, initialCategories }: ShopExperienceProps) {
  const [activeStore, setActiveStore] = useState<string | null>(null);

  if (!activeStore) {
    return (
      <div className="shop-experience">
        <section className="products-hero">
          <div>
            <p className="eyebrow">GoldenStore marketplace</p>
            <h1>Choose a store.</h1>
            <p className="intro-copy">
              Pick where you want to shop — each store has its own collection.
            </p>
          </div>
        </section>

        <section className="store-banner-grid">
          {STORE_BANNERS.map((store) => {
            const Icon = store.icon;
            return (
              <button
                key={store.id}
                type="button"
                className={`store-banner store-banner-${store.id}`}
                onClick={() => setActiveStore(store.id)}
              >
                <Icon className="w-8 h-8" />
                <h2>{store.name}</h2>
                <p>{store.tagline}</p>
              </button>
            );
          })}
        </section>
      </div>
    );
  }

  return (
    <div className="shop-experience">
      <ProductsExplorer
        initialProducts={initialProducts}
        initialCategories={initialCategories}
        lockedTab={activeStore}
        onBack={() => setActiveStore(null)}
      />
    </div>
  );
}
