import type { Metadata } from "next";
import { ImageSlider } from "@/lib/components/ImageSlider";

export const metadata: Metadata = {
  title: "About | GoldenStore",
  description:
    "Yonela Mjuluki (Goldenboy) — founder of GoldenStore and Online Barber. Administrative, technical, and entrepreneurial background.",
};

export default function AboutPage() {
  return (
    <>
      <style>{`
        .ab-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 80px 24px 100px;
        }
        .ab-eyebrow {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 16px;
        }
        .ab-hero {
          margin-bottom: 90px;
        }
        .ab-hero-text {
          max-width: 640px;
          margin: 36px auto 0;
          text-align: center;
        }
        .ab-hero-text .ab-eyebrow,
        .ab-hero-text .ab-title-line {
          text-align: center;
        }
        .ab-hero-text .ab-text {
          text-align: left;
        }
        .ab-metric-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          max-width: 640px;
          margin: 36px auto 0;
        }
        .ab-metric-card {
          background: var(--overlay-03);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px 18px;
          text-align: center;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .ab-metric-card:hover {
          transform: translateY(-3px);
          border-color: var(--overlay-30);
        }
        .ab-metric-card:first-child {
          border-color: var(--overlay-16);
          background: linear-gradient(135deg, var(--overlay-03) 0%, var(--overlay-08) 100%);
        }
        .ab-metric-value {
          font-size: 34px;
          font-weight: 700;
          color: var(--accent);
          line-height: 1;
          margin-bottom: 6px;
        }
        .ab-metric-label {
          font-size: 12.5px;
          color: var(--muted);
          font-weight: 500;
        }
        .ab-hero h1 {
          font-size: clamp(1.9rem, 4vw, 2.6rem);
          font-weight: 700;
          color: var(--text);
          line-height: 1.15;
          margin-bottom: 8px;
        }
        .ab-hero .ab-alias {
          color: var(--accent);
        }
        .ab-title-line {
          font-size: 15px;
          color: var(--muted);
          margin-bottom: 22px;
        }
        .ab-text {
          font-size: 16px;
          color: var(--muted);
          line-height: 1.8;
          margin-bottom: 16px;
        }
        .ab-section {
          margin-bottom: 70px;
        }
        .ab-section h2 {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
        }
        .ab-section-sub {
          font-size: 14.5px;
          color: var(--muted);
          margin-bottom: 32px;
        }
        .ab-skill-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 36px;
        }
        .ab-skill-col h3 {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 16px;
        }
        .ab-skill-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14.5px;
          color: var(--muted);
          margin-bottom: 13px;
          line-height: 1.5;
        }
        .ab-skill-icon {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          background: var(--overlay-08);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
        }
        .ab-skill-icon svg {
          width: 12px;
          height: 12px;
          fill: var(--accent);
        }
        .ab-contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .ab-contact-card {
          display: block;
          background: var(--overlay-03);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 22px;
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .ab-contact-card:hover {
          transform: translateY(-3px);
          border-color: var(--overlay-30);
        }
        .ab-contact-label {
          font-size: 12px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .ab-contact-value {
          font-size: 15.5px;
          color: var(--text);
          font-weight: 600;
        }
        .ab-photo-section {
          margin-bottom: 70px;
        }
        .ab-photo-frame {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--border);
          margin-bottom: 16px;
        }
        .ab-photo-frame img {
          width: 100%;
          height: auto;
          display: block;
        }
        .ab-photo-caption {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.6;
        }
        .ab-pillar-list {
          list-style: none;
          padding: 0;
          margin: 20px 0 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 10px;
        }
        .ab-pillar-list li {
          font-size: 14px;
          color: var(--muted);
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: 8px;
        }
        .ab-pillar-list strong {
          color: var(--text);
        }
        .ab-tagline {
          color: var(--accent);
          font-style: italic;
        }
        @media (max-width: 720px) {
          .ab-metric-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <main className="ab-wrap">
        {/* --- Hero / Founder --- */}
        <section className="ab-hero">
          <ImageSlider
            images={[
              { src: "/images/about/yonela-portrait.jpg", alt: "Yonela Mjuluki" },
            ]}
          />

          <div className="ab-hero-text">
            <p className="ab-eyebrow">About the Founder</p>
            <h1>
              Yonela Mjuluki <span className="ab-alias">— &quot;Goldenboy&quot;</span>
            </h1>
            <p className="ab-title-line">Founder, Developer &amp; Operator</p>

            <p className="ab-text">
              Yonela Mjuluki is the founder of GoldenStore, a multi-brand e-commerce
              platform spanning Kingdome Fashion Apparel, Goldenboy Merch, and Golden
              General Store, and the founder and operator of Online Barber, a
              physical barbershop business run on booking and performance-tracking
              systems he designed and built himself.
            </p>
            <p className="ab-text">
              His background combines two years of administrative experience in a
              logistics environment — where he handled job-file costing, invoicing,
              and record-keeping — with hands-on technical training through N4–N6
              Fitter Engineering studies. He is a self-taught developer who builds,
              deploys, and maintains full production systems entirely from a
              smartphone.
            </p>
          </div>

          <div className="ab-metric-grid">
            <div className="ab-metric-card">
              <div className="ab-metric-value">2+</div>
              <div className="ab-metric-label">Years Admin &amp; Costing Experience</div>
            </div>
            <div className="ab-metric-card">
              <div className="ab-metric-value">2</div>
              <div className="ab-metric-label">Businesses Founded</div>
            </div>
            <div className="ab-metric-card">
              <div className="ab-metric-value">100%</div>
              <div className="ab-metric-label">Built &amp; Deployed on Mobile</div>
            </div>
            <div className="ab-metric-card">
              <div className="ab-metric-value">N6</div>
              <div className="ab-metric-label">Fitter Engineering (In Progress)</div>
            </div>
          </div>
        </section>

        {/* --- Skills --- */}
        <section className="ab-section">
          <h2>Skills & Expertise</h2>
          <p className="ab-section-sub">
            A working combination of hands-on administration, technical training, and
            self-taught software development.
          </p>

          <div className="ab-skill-grid">
            <div className="ab-skill-col">
              <h3>Administrative & Business</h3>
              {[
                "Job-file costing, invoicing & order processing",
                "Administrative record-keeping & compliance-style documentation",
                "Customer service & client communication",
                "Founding and operating a business end-to-end",
                "Pricing decisions & revenue generation",
              ].map((item) => (
                <div className="ab-skill-item" key={item}>
                  <span className="ab-skill-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="ab-skill-col">
              <h3>Technical</h3>
              {[
                "Self-taught web development (Next.js, React)",
                "Mechanotechnics, mechanical draughting & engineering science",
                "PLC programming & CAD software (self-taught)",
                "Basic Python programming",
                "Microsoft Office & Google Sheets",
              ].map((item) => (
                <div className="ab-skill-item" key={item}>
                  <span className="ab-skill-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="ab-skill-col">
              <h3>Strengths</h3>
              {[
                "Attention to detail & accuracy",
                "Time management & organisation under deadlines",
                "Works independently and under pressure",
                "Reliable, disciplined & professional",
                "Adaptable and quick to learn new systems",
              ].map((item) => (
                <div className="ab-skill-item" key={item}>
                  <span className="ab-skill-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Online Barber --- */}
        <section className="ab-photo-section">
          <h2>Online Barber</h2>
          <p className="ab-section-sub">
            Based in Gqeberha (Port Elizabeth), Eastern Cape —{" "}
            <span className="ab-tagline">&quot;Siyeza Kuwe&quot; — We Come To You.</span>
          </p>

          <div className="ab-photo-frame">
            <img
              src="/images/about/online-barber-team.jpg"
              alt="The Online Barber team"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          <p className="ab-photo-caption">The Online Barber team.</p>

          <p className="ab-text" style={{ marginTop: 24 }}>
            Online Barber is a mobile grooming brand built on a simple idea: premium
            barbering and hairstyling should be delivered to the client, not the
            other way around. Rather than a single storefront, it operates as a
            physical, house-call service across Port Elizabeth and Uitenhage,
            running on booking and performance-tracking systems built specifically
            for the business.
          </p>
          <p className="ab-text">
            Beyond the core house-call barbering service, Online Barber is growing
            into a broader grooming and lifestyle brand for the Eastern Cape —
            expanding into product sales, education, and community media.
          </p>

          <ul className="ab-pillar-list">
            <li><strong>House Call Services</strong> — mobile barbering &amp; hairstyling across PE and surrounds</li>
            <li><strong>E-Commerce</strong> — grooming products delivered across South Africa</li>
            <li><strong>Barbering Lessons</strong> — hands-on training for aspiring barbers</li>
            <li><strong>Pet Grooming</strong> — mobile pet grooming as a household add-on</li>
            <li><strong>The Online_Barber Podcast</strong> — grooming culture &amp; community storytelling</li>
            <li><strong>CubeKit™</strong> — a future portable, self-contained grooming pod (in development)</li>
          </ul>
        </section>

        {/* --- Contact --- */}
        <section className="ab-section" style={{ marginBottom: 0 }}>
          <h2>Get In Touch</h2>
          <p className="ab-section-sub">Open to opportunities, collaborations, and enquiries.</p>

          <div className="ab-contact-grid">
            <a className="ab-contact-card" href="mailto:goldenboimj@gmail.com">
              <div className="ab-contact-label">Email</div>
              <div className="ab-contact-value">goldenboimj@gmail.com</div>
            </a>
            <a className="ab-contact-card" href="https://wa.me/27678208752">
              <div className="ab-contact-label">WhatsApp</div>
              <div className="ab-contact-value">067 820 8752</div>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
