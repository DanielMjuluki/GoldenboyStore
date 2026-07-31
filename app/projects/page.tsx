'use client';

import Link from 'next/link';
import { ArrowRight, Home, Scissors } from 'lucide-react';

const projects = [
  {
    title: 'OnlineBarber',
    description: 'A booking and storefront site built for a barbershop business — visit the live site to see it in action.',
    icon: <Scissors className="w-5 h-5" />,
    image: '/images/file_00000000abd48243a4c5201e0f249d18.png',
    href: 'https://onlinebarberza-spec.github.io/OnlineBarbe/',
  },
  {
    title: 'GoldenSolutions',
    description: 'Get a quote for your house project.',
    icon: <Home className="w-5 h-5" />,
    image: '/images/project-golden-solutions.png',
    href: 'https://goldenboi-mjuluki.github.io/GoldenSolutions/',
  },
];

export default function ProjectsPage() {
  return (
    <main className="page-shell">
      <section className="projects-hero">
        <div>
          <p className="eyebrow">Projects</p>
          <h1>A portfolio of launches, offers, and brand builds.</h1>
          <p className="intro-copy">
            This is where the work lives — real projects behind the GoldenStore ecosystem.
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured work</p>
            <h2>My Projects</h2>
          </div>
        </div>

        <p className="intro-copy" style={{ marginBottom: '1.5rem' }}>
          If you&rsquo;d like to support and help grow these projects, check them out, share them, or reach out — every bit of support helps.
        </p>

        <div className="projects-grid">
          {projects.map((project, i) => {
            const cardContent = (
              <>
                <img src={project.image} alt={`${project.title} placeholder`} className="project-card-image" />
                <div className="feature-icon">
                  {project.icon}
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.href && (
                  <span className="button button-secondary" style={{ marginTop: '0.75rem', display: 'inline-flex' }}>
                    Visit site
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                )}
              </>
            );

            return project.href ? (
              <a
                key={i}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="project-card"
              >
                {cardContent}
              </a>
            ) : (
              <div key={i} className="project-card">
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-block">
        <div className="catalog-card">
          <h3>Ready to shop or book?</h3>
          <p>Visit the storefront for products and services, or check out what services are on offer.</p>
          <div className="hero-actions">
            <Link href="/products" className="button button-primary">
              Open shop
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link href="/services" className="button button-secondary">
              View services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
