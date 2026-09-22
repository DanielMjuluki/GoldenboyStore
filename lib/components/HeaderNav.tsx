'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/services', label: 'Services' },
  { href: '/products', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/donate', label: 'Donate' },
  { href: '/cart', label: 'Cart' },
];

export function HeaderNav() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <div className="hn-wrap" ref={wrapRef}>
      <style>{`
        .hn-wrap { position: relative; }
        .hn-toggle {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 34px;
          height: 34px;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          padding: 0;
        }
        .hn-toggle span {
          display: block;
          height: 2px;
          margin: 0 auto;
          width: 18px;
          background: var(--text);
          border-radius: 2px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .hn-toggle[aria-expanded="true"] span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .hn-toggle[aria-expanded="true"] span:nth-child(2) {
          opacity: 0;
        }
        .hn-toggle[aria-expanded="true"] span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        .hn-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 180px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 8px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
          z-index: 60;
        }
        .hn-dropdown a {
          display: block;
          padding: 10px 12px;
          border-radius: 6px;
          color: var(--text);
          text-decoration: none;
          font-size: 14.5px;
        }
        .hn-dropdown a:hover {
          background: var(--overlay-06);
        }
      `}</style>

      <button
        type="button"
        className="hn-toggle"
        aria-expanded={open}
        aria-controls="hn-dropdown-menu"
        aria-label="Toggle navigation menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="hn-dropdown" id="hn-dropdown-menu" role="menu">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} role="menuitem" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
