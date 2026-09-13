'use client';

import { useRef, useState } from 'react';
import { Code2, MessageCircleMore, Palette, Send, ChevronDown, Check } from 'lucide-react';

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
    turnaround: '3–5 days',
    features: [
      '1 page (hero, about, contact)',
      'Mobile responsive design',
      'Your logo, colours, and copy',
      'Contact form or WhatsApp button',
      'Free domain connection help',
    ],
  },
  {
    name: 'Business Website',
    price: 'R5,000 – R12,000',
    desc: '3–6 pages, contact form, mobile responsive. The right fit for most small businesses.',
    turnaround: '1–2 weeks',
    features: [
      '3–6 pages (Home, About, Services, Contact, etc.)',
      'Mobile responsive, fast-loading',
      'Contact form with email delivery',
      'Basic SEO setup (titles, descriptions)',
      'Google Maps / location embed if needed',
      '1 round of revisions included',
    ],
  },
  {
    name: 'E-commerce Website',
    price: 'R12,000 – R30,000',
    desc: 'Product catalogue, payment gateway (PayFast), shopping cart, order emails — start selling online.',
    turnaround: '2–4 weeks',
    features: [
      'Full product catalogue & categories',
      'Shopping cart & checkout flow',
      'PayFast payment integration',
      'Automatic order + customer emails',
      'Admin panel to manage products & stock',
      'Structured data & SEO for products',
    ],
  },
  {
    name: 'Custom / Advanced',
    price: 'R25,000+',
    desc: 'Bookings, client portals, custom integrations, dashboards — built around exactly what you need.',
    turnaround: 'Scoped per project',
    features: [
      'Booking/scheduling systems',
      'Client portals & login areas',
      'Custom integrations (APIs, third-party tools)',
      'Admin dashboards & reporting',
      'Ongoing support options available',
    ],
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
  const [expandedTier, setExpandedTier] = useState<string | null>(null);
  const formRef = useRef<HTMLElement>(null);

  const toggleTier = (name: string) => {
    setExpandedTier((prev) => (prev === name ? null : name));
  };

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
        <div className="about-founder-card">
          <p className="eyebrow">About the founder</p>
          <h2>Meet Goldenboy</h2>
          <p className="intro-copy">
            Yonela "Goldenboy" Mjuluki is a self-taught programmer who studied Computer Science
            at UCT before shifting into Mechanical Engineering at PETVET. Everything on this
            site — the store, the checkout system, the admin tools — was built and is maintained
            solo, from the ground up.
          </p>
          <p className="intro-copy">
            Beyond GoldenStore, he's built and supported projects for other local businesses,
            including OnlineBarber. He's young, ambitious, and driven to help people grow across
            multiple areas of life — creatively inspired by figures like Kanye West and Elon Musk,
            and grounded in his faith in Jesus Christ. The throughline in all of it: breaking
            boundaries and exploring what most people write off as abnormal.
          </p>

          <div className="kingdome-callout">
            <p className="eyebrow">Why "Kingdome"</p>
            <p>
              Kingdome is more than a clothing line. It's built on the belief that every young man
              carries real potential — and real strength — when that potential is rooted in
              Christ. History's greatest kingdoms and empires were built on Christian foundations
              and a love for God the Creator. Kingdome exists to carry that forward: young men
              stepping into who they're capable of becoming, in Christ.
            </p>
          </div>
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
              Tap a package to see exactly what's included. Ready to go? Tap "Get this quote" to jump to the form.
            </p>
          </div>
        </div>

        <div className="pricing-tiers-list">
          {PRICING_TIERS.map((tier) => {
            const label = `${tier.name} (${tier.price})`;
            const active = formState.projectType === label;
            const isOpen = expandedTier === tier.name;
            return (
              <div key={tier.name} className={`pricing-tier-item ${active ? 'pricing-tier-active' : ''}`}>
                <button
                  type="button"
                  className="pricing-tier-summary"
                  onClick={() => toggleTier(tier.name)}
                  aria-expanded={isOpen}
                >
                  <div>
                    <h3>{tier.name}</h3>
                    <p className="pricing-tier-price">{tier.price}</p>
                    <p className="pricing-tier-desc">{tier.desc}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 pricing-tier-chevron ${isOpen ? 'pricing-tier-chevron-open' : ''}`} />
                </button>

                {isOpen && (
                  <div className="pricing-tier-details">
                    <p className="pricing-tier-turnaround">Typical turnaround: {tier.turnaround}</p>
                    <ul className="pricing-tier-features">
                      {tier.features.map((feature) => (
                        <li key={feature}>
                          <Check className="w-4 h-4" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="button button-primary pricing-tier-quote-btn"
                      onClick={() => selectTier(label)}
                    >
                      Get this quote →
                    </button>
                  </div>
                )}
              </div>
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
