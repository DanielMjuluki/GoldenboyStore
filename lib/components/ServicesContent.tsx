'use client';

import { useRef, useState } from 'react';
import { Code2, MessageCircleMore, Palette, Send } from 'lucide-react';

const services = [
  {
    title: 'Business Branding and Printing',
    description: 'Logos, business cards, signage, and print collateral built to make your business look professional.',
    icon: <Palette className="w-5 h-5" />,
    image: '/images/file_000000004768820a98958760ad5a824e.png',
  },
  {
    title: 'Web and storefront builds',
    description: 'Launch-ready websites and online stores designed to turn attention into action.',
    icon: <Code2 className="w-5 h-5" />,
    image: '/images/file_00000000c4648246bcbce00d93623e99.png',
  },
];

const PRICING_TIERS = [
  {
    name: 'Starter Page',
    price: 'R1,500 – R2,500',
    desc: 'Single page, digital business card style. Perfect for a quick professional presence.',
  },
  {
    name: 'Business Website',
    price: 'R5,000 – R12,000',
    desc: '3–6 pages, contact form, mobile responsive. The right fit for most small businesses.',
  },
  {
    name: 'E-commerce Website',
    price: 'R12,000 – R30,000',
    desc: 'Product catalogue, payment gateway (PayFast), shopping cart, order emails — start selling online.',
  },
  {
    name: 'Custom / Advanced',
    price: 'R25,000+',
    desc: 'Bookings, client portals, custom integrations, dashboards — built around exactly what you need.',
  },
];

const PROJECT_TYPES = [
  'Not sure yet — help me decide',
  'Business Branding and Printing',
  ...PRICING_TIERS.map((t) => `${t.name} (${t.price})`),
];

const WHATSAPP_NUMBER = '27678208752';
const CONTACT_EMAIL = 'goldenboimj@gmail.com';

export default function ServicesContent() {
  const [formState, setFormState] = useState({ name: '', contact: '', message: '', projectType: PROJECT_TYPES[0] });
  const formRef = useRef<HTMLDivElement>(null);

  const selectTier = (label: string) => {
    setFormState((prev) => ({ ...prev, projectType: label }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const buildMessage = () =>
    [
      `Name: ${formState.name || 'Not provided'}`,
      `Contact: ${formState.contact || 'Not provided'}`,
      `Looking for: ${formState.projectType}`,
      '',
      formState.message || 'No message provided.',
    ].join('\n');

  const handleEmail = (event: React.FormEvent) => {
    event.preventDefault();
    const body = buildMessage();
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      `Service inquiry — ${formState.projectType}`
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsApp = (event: React.FormEvent) => {
    event.preventDefault();
    const text = `Hi, I'd like to get in touch about a service.\n\n${buildMessage()}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <main className="page-shell">
      <section className="projects-hero">
        <div>
          <p className="eyebrow">Services</p>
          <h1>Services built for creators and growing businesses.</h1>
          <p className="intro-copy">
            Get in touch below and I&rsquo;ll get back to you by email or WhatsApp.
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Catalog</p>
            <h2>What I offer</h2>
          </div>
        </div>

        <div className="projects-grid">
          {services.map((service, i) => (
            <div key={i} className="project-card">
              <img src={service.image} alt={`${service.title} placeholder`} className="project-card-image" />
              <div className="feature-icon">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Web &amp; Branding pricing</p>
            <h2>Pick a tier to get started</h2>
            <p className="intro-copy">
              Tap a package below — it'll pre-fill the form so you don't have to type it out.
            </p>
          </div>
        </div>

        <div className="pricing-tiers-grid">
          {PRICING_TIERS.map((tier) => {
            const label = `${tier.name} (${tier.price})`;
            const active = formState.projectType === label;
            return (
              <button
                key={tier.name}
                type="button"
                className={`pricing-tier-card ${active ? 'pricing-tier-active' : ''}`}
                onClick={() => selectTier(label)}
              >
                <h3>{tier.name}</h3>
                <p className="pricing-tier-price">{tier.price}</p>
                <p className="pricing-tier-desc">{tier.desc}</p>
                <span className="pricing-tier-cta">Get this quote →</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section-block" ref={formRef} id="inquiry-form">
        <div className="catalog-card service-panel">
          <div className="service-header">
            <div className="feature-icon">
              <MessageCircleMore className="w-5 h-5" />
            </div>
            <div>
              <p className="eyebrow">Get in touch</p>
              <h2>Tell me what you need.</h2>
            </div>
          </div>

          <form className="service-form">
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
              <span>Email or phone number</span>
              <input
                required
                value={formState.contact}
                onChange={(event) => setFormState({ ...formState, contact: event.target.value })}
                placeholder="you@example.com or 0XX XXX XXXX"
              />
            </label>

            <label>
              <span>What are you looking for?</span>
              <select
                value={formState.projectType}
                onChange={(event) => setFormState({ ...formState, projectType: event.target.value })}
              >
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Message</span>
              <textarea
                rows={5}
                value={formState.message}
                onChange={(event) => setFormState({ ...formState, message: event.target.value })}
                placeholder="Tell me a bit about what you need, and any deadline or budget in mind."
              />
            </label>

            <div className="hero-actions">
              <button className="button button-primary" type="submit" onClick={handleEmail}>
                Send via Email
                <Send className="w-4 h-4 ml-2" />
              </button>
              <button className="button button-secondary" type="submit" onClick={handleWhatsApp}>
                Send via WhatsApp
                <MessageCircleMore className="w-4 h-4 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
