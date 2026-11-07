'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { ProductItem } from '@/lib/data/types';
import { formatPrice } from '@/lib/utils/currency';
import { getProductsData } from '@/lib/utils/productsData';
import './MerchShowcase.css';

const STORE_ID = 'goldenboy-merch';
const STORE_HREF = '/shop?store=goldenboy-merch';

const ROWS = [
  { id: 'christian-tees', title: 'Christian Tees' },
  { id: 'political-voice', title: 'Political Voice' },
  { id: 'mens-mental-health', title: "Men's Mental Health" },
  { id: 'goals', title: 'Goals & Campaigns' },
];

type Card = {
  id: string;
  name: string;
  href: string;
  image?: string;
  price?: string;
  soon?: boolean;
};

function toCard(p: ProductItem): Card {
  return {
    id: p.id,
    name: p.name,
    href: `/products/${p.id}`,
    image: p.images[0],
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
  while (loop.length < 8) loop = [...loop, ...cards];
  const track = [...loop, ...loop];
  return (
    <div className={`ms-marquee ${reverse ? 'ms-reverse' : ''}`}>
      <div className="ms-track" style={{ animationDuration: `${loop.length * 5}s` }}>
        {track.map((c, i) => (
          <Link
            key={`${c.id}-${i}`}
            href={c.href}
            className="ms-card"
            aria-hidden={i >= loop.length ? true : undefined}
            tabIndex={i >= loop.length ? -1 : 0}
          >
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={c.name} className="ms-card-img" loading="lazy" />
            ) : (
              <div className="ms-card-ph">{c.soon ? 'Coming soon' : c.name}</div>
            )}
            <p className="ms-card-name">{c.soon ? c.name : c.name}</p>
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
  const [slide, setSlide] = useState(0);
  const rootRef = useRef<HTMLElement>(null);

  const merch = products.filter((p) => p.categoryIds.includes(STORE_ID));
  const heroCards: Card[] = merch.length
    ? merch.slice(0, 5).map(toCard)
    : placeholders('Goldenboy Merch').slice(0, 3);

  useEffect(() => {
    getProductsData()
      .then((d) => setProducts(d.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (heroCards.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % heroCards.length), 5000);
    return () => clearInterval(t);
  }, [heroCards.length]);

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
      { threshold: 0.15 }
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
          <h2 className="ms-title">Wear the message</h2>
        </div>
        <Link href={STORE_HREF} className="ms-all">
          Shop all
        </Link>
      </div>

      <div className="ms-hero ms-reveal">
        {heroCards.map((c, i) => (
          <Link
            key={c.id}
            href={c.href}
            className={`ms-slide ${i === slide ? 'ms-active' : ''}`}
            aria-hidden={i === slide ? undefined : true}
            tabIndex={i === slide ? 0 : -1}
          >
            {c.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={c.name} className="ms-slide-img" />
            )}
            <div className="ms-slide-shade" />
            <div className="ms-slide-body">
              <span className="ms-slide-tag">{c.soon ? 'Coming soon' : 'Featured'}</span>
              <h3 className="ms-slide-name">{c.name}</h3>
              {c.price && <p className="ms-slide-price">{c.price}</p>}
              <span className="ms-btn">Shop now</span>
            </div>
          </Link>
        ))}
        <div className="ms-dots">
          {heroCards.map((c, i) => (
            <button
              key={c.id}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              className={`ms-dot ${i === slide ? 'ms-on' : ''}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
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
