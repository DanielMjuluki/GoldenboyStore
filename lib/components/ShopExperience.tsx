'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ProductItem, CategoryItem } from '@/lib/data/types';
import ProductsExplorer from '@/lib/components/ProductsExplorer';
import { ArrowRight, CheckCircle2, MessageCircleMore, Sparkles } from 'lucide-react';

interface ShopExperienceProps {
  initialProducts: ProductItem[];
  initialCategories: CategoryItem[];
}

const serviceOptions = [
  'Business Branding and Printing',
  'Web and storefront builds',
];

export default function ShopExperience({ initialProducts, initialCategories }: ShopExperienceProps) {
  const [activeView, setActiveView] = useState<'products' | 'services'>('products');
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: 'Business Branding and Printing',
    budget: '',
    details: '',
  });

  const buildBody = () =>
    [
      `Name: ${formState.name}`,
      `Email: ${formState.email}`,
      `Service: ${formState.service}`,
      `Budget: ${formState.budget || 'Not specified'}`,
      '',
      'Project details:',
      formState.details || 'No additional details provided.',
    ].join('\n');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = `mailto:goldenboimj@gmail.com?subject=${encodeURIComponent('New service inquiry from GoldenStore')}&body=${encodeURIComponent(buildBody())}`;
    setSubmitted(true);
  };

  const handleWhatsApp = (event: React.MouseEvent) => {
    event.preventDefault();
    window.open(`https://wa.me/27678208752?text=${encodeURIComponent(buildBody())}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="shop-experience">
      <section className="products-hero">
        <div>
          <p className="eyebrow">GoldenStore marketplace</p>
          <h1>Shop products and book services.</h1>
          <p className="intro-copy">
            Whether you want a physical drop, a digital resource, or a tailored brand launch, this is the place to start.
          </p>
        </div>
      </section>

      <div className="shop-tabs" role="tablist" aria-label="Shop sections">
        <button
          className={`shop-tab ${activeView === 'products' ? 'active' : ''}`}
          onClick={() => setActiveView('products')}
          type="button"
        >
          Products
        </button>
        <button
          className={`shop-tab ${activeView === 'services' ? 'active' : ''}`}
          onClick={() => setActiveView('services')}
          type="button"
        >
          Services
        </button>
      </div>

      {activeView === 'products' ? (
        <ProductsExplorer initialProducts={initialProducts} initialCategories={initialCategories} />
      ) : (
        <section className="services-layout">
          <div className="catalog-card service-panel">
            <div className="service-header">
              <div className="feature-icon">
                <MessageCircleMore className="w-5 h-5" />
              </div>
              <div>
                <p className="eyebrow">Service inquiry</p>
                <h2>Tell me what you want to build.</h2>
              </div>
            </div>

            <form className="service-form" onSubmit={handleSubmit}>
              <label>
                <span>Your name</span>
                <input
                  required
                  value={formState.name}
                  onChange={(event) => setFormState({ ...formState, name: event.target.value })}
                  placeholder="Your name"
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  required
                  type="email"
                  value={formState.email}
                  onChange={(event) => setFormState({ ...formState, email: event.target.value })}
                  placeholder="you@example.com"
                />
              </label>

              <label>
                <span>What do you need?</span>
                <select
                  value={formState.service}
                  onChange={(event) => setFormState({ ...formState, service: event.target.value })}
                >
                  {serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Budget or timeline</span>
                <input
                  value={formState.budget}
                  onChange={(event) => setFormState({ ...formState, budget: event.target.value })}
                  placeholder="e.g. 2 weeks / R10k budget"
                />
              </label>

              <label>
                <span>Project details</span>
                <textarea
                  rows={5}
                  value={formState.details}
                  onChange={(event) => setFormState({ ...formState, details: event.target.value })}
                  placeholder="Describe the goal, audience, timeline, and what success looks like."
                />
              </label>

              <div className="hero-actions">
                <button className="button button-primary" type="submit">
                  Send via Email
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <button className="button button-secondary" type="button" onClick={handleWhatsApp}>
                  Send via WhatsApp
                  <MessageCircleMore className="w-4 h-4 ml-2" />
                </button>
              </div>
            </form>

            {submitted && (
              <div className="success-panel">
                <CheckCircle2 className="w-5 h-5" />
                <p>Your request is ready to send. Your email app should open with the details included.</p>
              </div>
            )}
          </div>

          <div className="catalog-card service-panel">
            <div className="service-header">
              <div className="feature-icon">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="eyebrow">Common service requests</p>
                <h2>Built for creators and growing brands.</h2>
              </div>
            </div>

            <ul className="check-list">
              <li>Business branding: logos, business cards, signage, and print collateral.</li>
              <li>Web and storefront builds: launch-ready websites and online stores.</li>
            </ul>

            <div className="service-cta">
              <Link href="/projects" className="text-link">
                Explore project examples
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
