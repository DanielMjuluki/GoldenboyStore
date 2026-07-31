'use client';

import { useState } from 'react';
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

const WHATSAPP_NUMBER = '27678208752';
const CONTACT_EMAIL = 'goldenboimj@gmail.com';

export default function ServicesPage() {
  const [formState, setFormState] = useState({ name: '', contact: '', message: '' });

  const buildMessage = () =>
    [
      `Name: ${formState.name || 'Not provided'}`,
      `Contact: ${formState.contact || 'Not provided'}`,
      '',
      formState.message || 'No message provided.',
    ].join('\n');

  const handleEmail = (event: React.FormEvent) => {
    event.preventDefault();
    const body = buildMessage();
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      'Service inquiry from GoldenStore'
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
            Two focused offers, done properly. Get in touch below and I&rsquo;ll get back to you by email or WhatsApp.
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
              <span>Message</span>
              <textarea
                rows={5}
                value={formState.message}
                onChange={(event) => setFormState({ ...formState, message: event.target.value })}
                placeholder="Tell me a bit about what you need."
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
