'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductItem } from '@/lib/data/types';
import { formatPrice } from '@/lib/utils/currency';

export default function PromoCarousel() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .catch((err) => console.error('Failed to load promo products:', err))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="section-block">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Merch</p>
          <h2>Shop the drops</h2>
        </div>
        <div className="carousel-arrows">
          <button type="button" onClick={() => scroll('left')} aria-label="Scroll left" className="carousel-arrow">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => scroll('right')} aria-label="Scroll right" className="carousel-arrow">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="promo-carousel" ref={scrollerRef}>
        {products.map((product) => {
          const onSale =
            product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents;
          const discountPct = onSale
            ? Math.round(
                ((product.compareAtPriceCents! - product.priceCents) / product.compareAtPriceCents!) * 100
              )
            : 0;

          return (
            <Link key={product.id} href={`/products/${product.id}`} className="promo-card">
              <div className="promo-card-image-wrap">
                {product.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.name} className="promo-card-image" />
                ) : (
                  <div className="promo-card-image-placeholder" />
                )}
                {onSale && <span className="promo-badge">-{discountPct}%</span>}
              </div>
              <p className="promo-card-name">{product.name}</p>
              <div className="promo-card-price-row">
                <span className="promo-card-price">{formatPrice(product.priceCents, product.currency)}</span>
                {onSale && (
                  <span className="promo-card-compare">
                    {formatPrice(product.compareAtPriceCents!, product.currency)}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
