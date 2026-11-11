'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Shirt, Printer, Globe, Hammer } from 'lucide-react';
import type { ProductItem } from '@/lib/data/types';
import { formatPrice } from '@/lib/utils/currency';
import { getProductsData } from '@/lib/utils/productsData';
import CyclingImage from '@/lib/components/CyclingImage';
import './MerchShowcase.css';

const STORE_ID = 'goldenboy-merch';
const STORE_HREF = '/products?store=goldenboy-merch';
const WA = 'https://wa.me/27678208752?text=';

const ROWS = [
  { id: 'christian-tees', title: 'Christian Tees' },
  { id: 'political-voice', title: 'Political Voice' },
  { id: 'mens-mental-health', title: "Men's Mental Health" },
];

const SERVICES = [
  { icon: Shirt, title: 'Custom tees and uniforms', text: 'Teams, churches, schools and businesses.' },
  { icon: Printer, title: 'Printing and branding', text: 'Business cards, banners, flyers and signage.' },
  { icon: Globe, title: 'Websites and online stores', text: 'Launch-ready builds that turn visits into orders.' },
  { icon: Hammer, title: 'Furniture and house decor', text: 'Tables and more, made by local craftsmen.' },
];

type Card = { id: string; name: string; href: string; images: string[]; price: string };

type Row =
  | { kind: 'products'; id: string; title: string; cards: Card[] }
  | { kind: 'services'; id: string; title: string };

function toCard(p: ProductItem): Card {
  return {
    id: p.id,
    name: p.name,
    href: `/products/${p.id}`,
    images: p.images,
    price: formatPrice(p.priceCents, p.currency),
  };
}

function ProductMarquee({ cards, reverse }: { cards: Card[]; reverse: boolean }) {
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
            {c.images.length > 0 ? (
              <CyclingImage images={c.images} alt={c.name} className="ms-card-img" />
            ) : (
              <div className="ms-card-ph">{c.name}</div>
            )}
            <p className="ms-card-name">{c.name}</p>
            <p className="ms-card-price">{c.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ServiceMarquee({ reverse }: { reverse: boolean }) {
  const loop = [...SERVICES, ...SERVICES];
  const track = [...loop, ...loop];
  return (
    <div className={`ms-marquee ${reverse ? 'ms-reverse' : ''}`}>
      <div className="ms-track" style={{ animationDuration: `${loop.length * 9}s` }}>
        {track.map((s, i) => {
          const Icon = s.icon;
          return (
            <a
              key={`${s.title}-${i}`}
              className="ms-card ms-service"
              href={WA + encodeURIComponent('Hi Goldenboy, I would like a quote for: ' + s.title)}
              target="_blank"
              rel="noopener noreferrer"
              aria-hidden={i >= loop.length ? true : undefined}
              tabIndex={i >= loop.length ? -1 : 0}
            >
              <span className="ms-svc-icon">
                <Icon size={20} />
              </span>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
              <span className="ms-svc-link">Get a quote &rarr;</span>
            </a>
          );
        })}
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

  const productRows: Row[] = [];
  ROWS.forEach((r) => {
    const cards = merch.filter((p) => p.categoryIds.includes(r.id)).map(toCard);
    if (cards.length > 0) productRows.push({ kind: 'products', id: r.id, title: r.title, cards });
  });
  if (merch.length > 0) {
    productRows.push({ kind: 'products', id: 'all', title: 'All Goldenboy Merch', cards: merch.map(toCard) });
  }

  const rows: Row[] = [];
  productRows.forEach((r, i) => {
    rows.push(r);
    if (i === 0) rows.push({ kind: 'services', id: 'services', title: 'Services' });
  });
  if (productRows.length === 0) rows.push({ kind: 'services', id: 'services', title: 'Services' });

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
          {r.kind === 'services' ? (
            <ServiceMarquee reverse={i % 2 === 1} />
          ) : (
            <ProductMarquee cards={r.cards} reverse={i % 2 === 1} />
          )}
        </div>
      ))}
    </section>
  );
}
