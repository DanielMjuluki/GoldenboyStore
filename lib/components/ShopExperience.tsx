'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
  const isKingdome = activeStore === 'kingdome-apparel';

  useEffect(() => {
    const previousTitle = document.title;

    if (isKingdome) {
      document.body.classList.add('kingdome-active');
      document.title = 'KINGDOME';
    } else {
      document.body.classList.remove('kingdome-active');
    }

    return () => {
      document.body.classList.remove('kingdome-active');
      document.title = previousTitle;
    };
  }, [isKingdome]);

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
    <div className={`shop-experience ${isKingdome ? 'kingdome-theme' : ''}`}>
      {isKingdome && (
        <nav className="kingdome-nav">
          <Link href="/products" onClick={() => setActiveStore(null)}>
            Back to stores
          </Link>
          <span className="kingdome-nav-mark">KINGDOME</span>
          <Link href="/cart">Cart</Link>
        </nav>
      )}

      <ProductsExplorer
        initialProducts={initialProducts}
        initialCategories={initialCategories}
        lockedTab={activeStore}
        onBack={isKingdome ? undefined : () => setActiveStore(null)}
      />
    </div>
  );
}
