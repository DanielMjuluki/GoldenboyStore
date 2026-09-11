import type { Metadata } from 'next';
import ServicesContent from '@/lib/components/ServicesContent';

export const metadata: Metadata = {
  title: 'Services — Branding, Printing & Web Design',
  description:
    'Business branding, printing, and web design services in South Africa. Logos, business cards, signage, and launch-ready websites built to fit your budget.',
};

export default function ServicesPage() {
  return <ServicesContent />;
}
