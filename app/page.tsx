'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Loader, Code2, Palette } from 'lucide-react';
import type { BrandStats } from '@/lib/data/types';
import PromoCarousel from '@/lib/components/PromoCarousel';

// Swap this for your actual latest-upload video ID once you have it —
// this is just a working placeholder so the player is guaranteed to load.
// Find your video ID in its YouTube URL: youtube.com/watch?v=THIS_PART
const FEATURED_VIDEO_ID = 'o3x070e09dM';

const featuredServices = [
  {
    title: 'Business Branding and Printing',
    description: 'Logos, business cards, signage, and print collateral built to make your business look professional.',
  },
  {
    title: 'Web and storefront builds',
    description: 'Launch-ready websites and online stores designed to turn attention into action.',
  },
];

function formatCount(n: number): string {
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return String(n);
}

export default function HomePage() {
  const [stats, setStats] = useState<BrandStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/social-media');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const displayStats = stats
    ? [
        { value: formatCount(stats.totalFollowers), label: 'Total Followers' },
        { value: formatCount(stats.totalViewers), label: 'Total Viewers' },
      ]
    : [
        { value: '—', label: 'Total Followers' },
        { value: '—', label: 'Total Viewers' },
      ];

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">GoldenStore</p>
          <h1>Creator. Brand. Commerce.</h1>
          <p className="intro-copy">
            I build content, products, and digital experiences that turn attention into income.
          </p>
          <div className="hero-actions">
            <Link href="/products" className="button button-primary">
              Shop now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link href="/projects" className="button button-secondary">
              View projects
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-stats">
            {displayStats.map((stat, i) => (
              <div key={i} className="stat-block">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          {loading && (
            <div className="sync-indicator">
              <Loader className="w-4 h-4 animate-spin" />
            </div>
          )}
        </div>
      </section>

      <PromoCarousel />

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Latest content</p>
            <h2>Watch what is live on YouTube</h2>
          </div>
          <a href="https://www.youtube.com/@goldenboy_mj" target="_blank" rel="noreferrer" className="text-link">
            Open channel
          </a>
        </div>

        <div className="video-grid">
          <div className="video-window">
            <div className="video-toolbar">
              <span className="window-dot" />
              <span className="window-dot" />
              <span className="window-dot" />
            </div>
            <iframe
              src={`https://www.youtube.com/embed/${FEATURED_VIDEO_ID}`}
              title="Goldenboy latest video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <div className="feature-stack">
            {featuredServices.map((service) => (
              <div key={service.title} className="feature-card">
                <div className="feature-icon">
                  {service.title.includes('Branding') ? <Palette className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Storefront</p>
            <h2>Products, services, and launches in one place</h2>
          </div>
        </div>

        <div className="preview-grid">
          <div className="catalog-card">
            <h3>Shop</h3>
            <p>Physical drops, digital resources, and creator-focused tools ready to buy.</p>
            <Link href="/products" className="text-link">
              Browse products
            </Link>
          </div>
          <div className="catalog-card">
            <h3>Projects</h3>
            <p>A portfolio-style view of the work, services, and brand builds behind the GoldenStore ecosystem.</p>
            <Link href="/projects" className="text-link">
              Explore projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
