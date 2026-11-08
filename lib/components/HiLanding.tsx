'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ProductItem } from '@/lib/data/types';
import { formatPrice } from '@/lib/utils/currency';
import { getProductsData } from '@/lib/utils/productsData';
import CyclingImage from '@/lib/components/CyclingImage';
import './HiLanding.css';

const WHATSAPP = 'https://wa.me/27678208752?text=Hi%20Goldenboy%2C%20I%20got%20your%20card';

// Rename any product on this page: 'product-id': 'New name'
const TITLES: Record<string, string> = {};

const GROUPS = [
  { id: 'kingdome-apparel', title: 'Kingdome', sub: 'Premium streetwear', wide: false },
  { id: 'christian-tees', title: 'Faith Tees', sub: 'Wear what you believe', wide: true },
  { id: 'mens-mental-health', title: "Men's Mental Health", sub: 'Tees that start the conversation', wide: true },
];

const SOCIALS = [
  { label: 'YouTube', href: 'https://www.youtube.com/@goldenboy_mj' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@goldenboy_za' },
  { label: 'Facebook', href: 'https://www.facebook.com/goldenboy.creates.za' },
  { label: 'Kick', href: 'https://kick.com/Goldenboy_Mj' },
];

export default function HiLanding() {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    getProductsData()
      .then((d) => setProducts(d.products ?? []))
      .catch(() => setProducts([]));
  }, []);

  const inStock = products.filter((p) => p.stockQuantity === null || p.stockQuantity > 0);

  return (
    <main className="hi">
      <section className="hi-hero">
        <p className="hi-eyebrow">Thank you for stopping</p>
        <h1>
          Hi, I&rsquo;m <span>Goldenboy.</span>
        </h1>
        <p className="hi-lead">
          I&rsquo;m a young local founder building brands and creative projects. Every tee you buy,
          and every rand you give, goes straight into growing my business.
        </p>

        <div className="hi-video">
          <video controls playsInline preload="metadata" poster="/images/intro-poster.jpg">
            <source src="/videos/intro.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="hi-cta">
          <a href="#shop" className="hi-btn hi-btn-main">
            Shop the tees
          </a>
          <Link href="/donate" className="hi-btn">
            Donate instead
          </Link>
        </div>
      </section>

      <div className="hi-trust">
        <div>Secure checkout with PayFast</div>
        <div>Delivery across South Africa</div>
        <div>Exchanges accepted</div>
      </div>

      <div id="shop">
        {GROUPS.map((g) => {
          let items = inStock.filter((p) => p.categoryIds.includes(g.id));
          items = g.id === 'kingdome-apparel'
            ? [...items].sort((a, b) => b.priceCents - a.priceCents)
            : [...items].sort((a, b) => a.name.localeCompare(b.name));
          items = items.slice(0, 4);
          if (items.length === 0) return null;
          return (
            <section key={g.id} className="hi-group">
              <div className="hi-group-head">
                <h2>{g.title}</h2>
                <p>{g.sub}</p>
              </div>
              <div className={`hi-grid ${g.wide ? 'hi-grid-wide' : ''}`}>
                {items.map((p, i) => {
                  const onSale = p.compareAtPriceCents && p.compareAtPriceCents > p.priceCents;
                  const name = TITLES[p.id] ?? p.name;
                  return (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      className="hi-card"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      <div className="hi-card-img">
                        <CyclingImage images={p.images} alt={name} />
                      </div>
                      <p className="hi-card-name">{name}</p>
                      <p className="hi-card-price">
                        {formatPrice(p.priceCents, p.currency)}
                        {onSale && <s>{formatPrice(p.compareAtPriceCents!, p.currency)}</s>}
                      </p>
                      <span className="hi-card-buy">Buy now</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <Link href="/products?store=goldenboy-merch" className="hi-all">
        See all Goldenboy merch &rarr;
      </Link>

      <section className="hi-box">
        <h2>Prefer to back the business?</h2>
        <p>Any amount helps me build more and reach more people. Pay by card or by EFT.</p>
        <Link href="/donate" className="hi-btn hi-btn-main">
          Donate to Goldenboy
        </Link>
      </section>

      <section className="hi-box">
        <h2>Questions?</h2>
        <p>Sizes, delivery or collection, message me directly and I&rsquo;ll answer personally.</p>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hi-btn">
          Chat on WhatsApp
        </a>
      </section>

      <div className="hi-chips">
        {SOCIALS.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hi-chip">
            {s.label}
          </a>
        ))}
      </div>
    </main>
  );
}
