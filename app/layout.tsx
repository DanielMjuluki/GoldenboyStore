import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/components/CartContext';
import { ThemeToggle } from '@/lib/components/ThemeToggle';

// Runs before hydration so the page never flashes the wrong theme on load.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('goldenboy-theme');
    document.documentElement.dataset.theme = stored === 'light' ? 'light' : 'dark';
  } catch (e) {}
})();
`;

const SOCIAL_LINKS = [
  { platform: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@goldenboy_mj', icon: '/icons/youtube.svg' },
  { platform: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@goldenboy_za', icon: '/icons/tiktok.svg' },
  { platform: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/goldenboy.creates.za', icon: '/icons/facebook.svg' },
  { platform: 'kick', label: 'Kick', href: 'https://kick.com/Goldenboy_Mj', icon: '/icons/kick.svg' },
];

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenboystore.com'),
  title: {
    default: 'Goldenboy Store',
    template: '%s | Goldenboy Store',
  },
  description: 'Creator. Entrepreneur. Building digital culture. Shop services, merch, and digital products from the Goldenboy ecosystem.',
  openGraph: {
    title: 'Goldenboy Store',
    description: 'Creator. Entrepreneur. Building digital culture.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <div className="site-brand">
              <Link href="/">GoldenStore</Link>
            </div>
            <nav className="site-nav">
              <Link href="/projects">Projects</Link>
              <Link href="/services">Services</Link>
              <Link href="/products">Shop</Link>
              <Link href="/cart">Cart</Link>
              <div className="header-social">
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.platform} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                    <Image src={s.icon} alt={s.label} width={20} height={20} />
                  </a>
                ))}
              </div>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <CartProvider>{children}</CartProvider>
        <footer className="site-footer">
          <div className="site-footer-inner">
            <p>Follow the journey and stay connected.</p>
            <div className="social-links">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.platform} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                  <Image src={s.icon} alt={s.label} width={22} height={22} />
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>
            <div className="footer-legal">
              <Link href="/terms">Terms &amp; Conditions</Link>
            </div>
        </footer>
      </body>
    </html>
  );
}
