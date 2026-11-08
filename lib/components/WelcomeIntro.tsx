'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './WelcomeIntro.css';

const WHATSAPP = 'https://wa.me/27678208752?text=Hi%20Goldenboy%2C%20I%20just%20found%20your%20site';
const VIDEO_SRC = '/videos/intro.mp4';
const POSTER_SRC = '/images/intro-poster.jpg';

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
  const [noVideo, setNoVideo] = useState(false);

  useEffect(() => {
    setGreeting(greetingFor(new Date().getHours()));
  }, []);

  return (
    <section className="wi">
      <p className="wi-hello">{greeting}, welcome to my world</p>
      <h2 className="wi-title">
        I&rsquo;m building something <span>Golden.</span>
      </h2>
      <p className="wi-sub">Businesses, brands and creativity, all built to help people the best way I know how.</p>
      <p className="wi-connect">Let&rsquo;s connect. Be part of my community.</p>

      <div className="wi-video">
        {noVideo ? (
          <div className="wi-soon">
            <div className="wi-play">&#9654;</div>
            <p>Welcome video coming soon</p>
          </div>
        ) : (
          <video controls playsInline preload="metadata" poster={POSTER_SRC} onError={() => setNoVideo(true)}>
            <source src={VIDEO_SRC} type="video/mp4" onError={() => setNoVideo(true)} />
          </video>
        )}
      </div>

      <div className="wi-actions">
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="wi-btn wi-btn-main">
          Say hi on WhatsApp
        </a>
        <Link href="/products?store=goldenboy-merch" className="wi-btn">
          Shop the merch
        </Link>
        <Link href="/projects" className="wi-btn">
          See my projects
        </Link>
        <Link href="/donate" className="wi-btn">
          Support my business
        </Link>
      </div>

      <div className="wi-community">
        <p>Follow along and join the community:</p>
        <div className="wi-chips">
          {COMMUNITY.map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="wi-chip">
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
