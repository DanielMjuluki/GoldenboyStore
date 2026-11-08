'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ProductItem } from '@/lib/data/types';
import { formatPrice } from '@/lib/utils/currency';
import { getProductsData } from '@/lib/utils/productsData';
import CyclingImage from '@/lib/components/CyclingImage';
import './MerchShowcase.css';

const STORE_ID = 'goldenboy-merch';
const STORE_HREF = '/products?store=goldenboy-merch';

const ROWS = [
  { id: 'christian-tees', title: 'Christian Tees' },
  { id: 'political-voice', title: 'Political Voice' },
  { id: 'mens-mental-health', title: "Men's Mental Health" },
];

type Card = {
  id: string;
  name: string;
  href: string;
  images?: string[];
  price?: string;
  soon?: boolean;
};

function toCard(p: ProductItem): Card {
  return {
    id: p.id,
    name: p.name,
    href: `/products/${p.id}`,
    images: p.images,
    price: formatPrice(p.priceCents, p.currency),
  };
}

function placeholders(label: string): Card[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `${label}-${i}`,
    name: label,
    href: STORE_HREF,
    soon: true,
  }));
}

function Marquee({ cards, reverse }: { cards: Card[]; reverse: boolean }) {
  let loop = cards;
  while (loop.length < 6) loop = [...loop, ...cards];
  const track = [...loop, ...loop];
  return (
    <div className={`ms-marquee ${reverse ? 'ms-reverse' : ''}`}>
      <div className="ms-track" style={{ animationDuration: `${loop.length * 9}s` }}>
        {track.map((c, i) => (
          <Link
            key={`${c.id}-${i}`}
            href={c.href}
            className="ms-card"
            aria-hidden={i >= loop.length ? true : undefined}
            tabIndex={i >= loop.length ? -1 : 0}
          >
            {c.images && c.images.length > 0 ? (
              <CyclingImage images={c.images} alt={c.name} className="ms-card-img" />
            ) : (
              <div className="ms-card-ph">{c.soon ? 'Coming soon' : c.name}</div>
            )}
            <p className="ms-card-name">{c.name}</p>
            {c.price && <p className="ms-card-price">{c.price}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function MerchShowcase() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  const merch = products.filter((p) => p.categoryIds.includes(STORE_ID));

  useEffect(() => {
    getProductsData()
      .then((d) => setProducts(d.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (root === null) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('ms-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    root.querySelectorAll('.ms-reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ready]);

  if (ready === false) return null;

  const rows = ROWS.map((r) => {
    const items = merch.filter((p) => p.categoryIds.includes(r.id)).map(toCard);
    return { id: r.id, title: r.title, cards: items.length ? items : placeholders(r.title) };
  });
  if (merch.length) rows.push({ id: 'all', title: 'All Goldenboy Merch', cards: merch.map(toCard) });

  return (
    <section className="ms-section" ref={rootRef}>
      <div className="ms-head ms-reveal">
        <div>
          <p className="ms-eyebrow">Goldenboy Merch</p>
          <h2 className="ms-title">Shop the merch</h2>
        </div>
        <Link href={STORE_HREF} className="ms-all">
          Shop all
        </Link>
      </div>

      {rows.map((r, i) => (
        <div key={r.id} className="ms-row ms-reveal">
          <h3 className="ms-row-title">{r.title}</h3>
          <Marquee cards={r.cards} reverse={i % 2 === 1} />
        </div>
      ))}
    </section>
  );
}
