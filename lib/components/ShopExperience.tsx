'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
    image: '/images/banners/kingdome-banner.png',
  },
  {
    id: 'goldenboy-merch',
    name: 'Goldenboy Merch',
    tagline: 'Official creator merchandise',
    icon: Shirt,
    image: null,
  },
  {
    id: 'general-store',
    name: 'Golden General Store',
    tagline: 'Everyday goods and general items',
    icon: Store,
    image: null,
  },
];

export default function ShopExperience({ initialProducts, initialCategories }: ShopExperienceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeFromUrl = searchParams.get('store');
  const [activeStore, setActiveStoreState] = useState<string | null>(storeFromUrl);
  const isKingdome = activeStore === 'kingdome-apparel';

  const setActiveStore = (storeId: string | null) => {
    setActiveStoreState(storeId);
    if (storeId) {
      router.push(`/products?store=${storeId}`, { scroll: false });
    } else {
      router.push('/products', { scroll: false });
    }
  };


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
                className={`store-banner store-banner-${store.id} ${store.image ? 'store-banner-has-image' : ''}`}
                onClick={() => setActiveStore(store.id)}
                style={store.image ? { backgroundImage: `url(${store.image})` } : undefined}
              >
                {!store.image && <Icon className="w-8 h-8" />}
                <div className="store-banner-text">
                  <h2>{store.name}</h2>
                  <p>{store.tagline}</p>
                </div>
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
