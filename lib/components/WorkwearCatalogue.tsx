'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { ProductItem } from '@/lib/data/types';
import { formatPrice } from '@/lib/utils/currency';
import { getProductsData } from '@/lib/utils/productsData';
import CyclingImage from '@/lib/components/CyclingImage';
import './WorkwearCatalogue.css';

const WA = 'https://wa.me/27678208752?text=';

const GROUPS = [
  { id: 'ww-overalls', label: 'Overalls and conti suits' },
  { id: 'ww-hivis', label: 'Hi-vis' },
  { id: 'ww-jackets', label: 'Jackets' },
  { id: 'ww-gloves', label: 'Gloves' },
  { id: 'ww-boots', label: 'Boots' },
  { id: 'ww-ppe', label: 'Other PPE' },
];

function moq(p: ProductItem): string | null {
  const m = p.description.match(/MOQ:?\s*(\d+)/i);
  return m ? m[1] : null;
}

export default function WorkwearCatalogue() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');

  useEffect(() => {
    getProductsData()
      .then((d) => setProducts(d.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setReady(true));
  }, []);

  const items = useMemo(
    () => products.filter((p) => p.categoryIds.includes('workwear')),
    [products]
  );
  const chips = GROUPS.filter((g) => items.some((p) => p.categoryIds.includes(g.id)));
  const shown = items.filter((p) => {
    const inGroup = group === 'all' || p.categoryIds.includes(group);
    const q = query.trim().toLowerCase();
    return inGroup && (q === '' || p.name.toLowerCase().includes(q));
  });

  return (
    <main className="ww">
      <p className="ww-eyebrow">Workwear and PPE</p>
      <h1>Workwear for sites, teams and businesses</h1>
      <p className="ww-lead">
        Overalls, hi-vis, jackets, gloves and boots. Buy single items, or message us for a bulk quote.
        Ask us about adding your company logo.
      </p>

      {items.length > 0 && (
        <>
          <input
            className="ww-search"
            type="search"
            placeholder="Search workwear..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="ww-chips">
            <button type="button" className={`ww-chip ${group === 'all' ? 'ww-chip-on' : ''}`} onClick={() => setGroup('all')}>
              All
            </button>
            {chips.map((g) => (
              <button
                key={g.id}
                type="button"
                className={`ww-chip ${group === g.id ? 'ww-chip-on' : ''}`}
                onClick={() => setGroup(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </>
      )}

      {ready && items.length === 0 && (
        <div className="ww-empty">
          <p>The workwear catalogue is being built. Tell me what you need and I will send you a quote.</p>
          <a
            className="ww-btn ww-btn-main"
            href={WA + encodeURIComponent('Hi Goldenboy, I need workwear: ')}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tell me what you need
          </a>
        </div>
      )}

      <div className="ww-grid">
        {shown.map((p) => {
          const min = moq(p);
          const msg =
            'Hi Goldenboy, I would like a bulk quote for: ' + p.name + (min ? ' (minimum order ' + min + ')' : '');
          return (
            <div key={p.id} className="ww-card">
              <Link href={`/products/${p.id}`} className="ww-img">
                <CyclingImage images={p.images} alt={p.name} />
              </Link>
              <Link href={`/products/${p.id}`} className="ww-name">
                {p.name}
              </Link>
              <p className="ww-price">
                {p.priceCents > 0 ? 'From ' + formatPrice(p.priceCents, p.currency) : 'Pricing on request'}
              </p>
              {min && <p className="ww-meta">Bulk minimum: {min}</p>}
              {p.sizes && p.sizes.length > 0 && <p className="ww-meta">Sizes: {p.sizes.join(', ')}</p>}
              <a className="ww-btn ww-btn-main" href={WA + encodeURIComponent(msg)} target="_blank" rel="noopener noreferrer">
                Request a bulk quote
              </a>
              <Link href={`/products/${p.id}`} className="ww-btn">
                View and buy
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
