'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './WelcomeIntro.css';

const WHATSAPP = 'https://wa.me/27678208752?text=Hi%20Goldenboy%2C%20I%20just%20found%20your%20site';

const VIDEOS = [
  { id: 'intro', tab: 'Welcome', src: '/videos/intro.mp4', poster: '/images/intro-poster.jpg' },
  { id: 'support', tab: 'Support me', src: '/videos/support.mp4', poster: '/images/support-poster.jpg' },
  { id: 'thanks', tab: 'Thank you', src: '/videos/thanks.mp4', poster: '/images/thanks-poster.jpg' },
];

const COMMUNITY = [
  { label: 'YouTube', href: 'https://www.youtube.com/@goldenboy_mj' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@goldenboy_za' },
  { label: 'Facebook', href: 'https://www.facebook.com/goldenboy.creates.za' },
  { label: 'Kick', href: 'https://kick.com/Goldenboy_Mj' },
];

function greetingFor(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function WelcomeIntro() {
  const [greeting, setGreeting] = useState('Welcome');
  const [active, setActive] = useState(0);
  const [missing, setMissing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()));
  }, []);

  const current = VIDEOS[active];

  const markMissing = () => setMissing((m) => ({ ...m, [current.id]: true }));
  const goNext = () => {
    if (active < VIDEOS.length - 1) setActive(active + 1);
  };

  return (
    <section className="wi">
      <p className="wi-hello">{greeting}, welcome to my world</p>
      <h2 className="wi-title">
        I&rsquo;m a GenZ with a <span>Dream.</span>
      </h2>
      <p className="wi-sub">To help people the best way I know how.</p>
      <p className="wi-connect">Let&rsquo;s connect. Be part of my community.</p>

      <div className="wi-tabs" role="tablist">
        {VIDEOS.map((v, i) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={`wi-tab ${i === active ? 'wi-tab-on' : ''}`}
            onClick={() => setActive(i)}
          >
            {v.tab}
          </button>
        ))}
      </div>

      <div className="wi-video">
        {missing[current.id] ? (
          <div className="wi-soon">
            <div className="wi-play">&#9654;</div>
            <p>{current.tab} video coming soon</p>
          </div>
        ) : (
          <video
            key={current.id}
            controls
            playsInline
            preload="metadata"
            poster={current.poster}
            onError={markMissing}
            onEnded={goNext}
          >
            <source src={current.src} type="video/mp4" onError={markMissing} />
          </video>
        )}
      </div>

      {current.id === 'intro' && (
        <div className="wi-actions">
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="wi-btn wi-btn-main">
            Say hi on WhatsApp
          </a>
          <Link href="/shop?store=goldenboy-merch" className="wi-btn">
            Shop the merch
          </Link>
          <Link href="/projects" className="wi-btn">
            See my projects
          </Link>
          <button type="button" className="wi-btn" onClick={() => setActive(1)}>
            How you can help
          </button>
        </div>
      )}

      {current.id === 'support' && (
        <div className="wi-actions">
          <Link href="/donate" className="wi-btn wi-btn-main wi-wide">
            Support my dream
          </Link>
          <Link href="/shop?store=goldenboy-merch" className="wi-btn wi-wide">
            Or buy merch to support me
          </Link>
        </div>
      )}

      {current.id === 'thanks' && (
        <div className="wi-community">
          <p>Thank you. Follow along and join the community:</p>
          <div className="wi-chips">
            {COMMUNITY.map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="wi-chip">
                {c.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
