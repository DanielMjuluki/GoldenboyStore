import type { Metadata } from 'next';
import ServicesContent from '@/lib/components/ServicesContent';
import MoreServices from '@/lib/components/MoreServices';

export const metadata: Metadata = {
  title: 'Services — Custom Tees, Printing, Web Design & Furniture',
  description:
    'Custom tees and uniforms, business branding and printing, websites and online stores, and furniture and house decor in Port Elizabeth, South Africa. Request a quote.',
};

export default function ServicesPage() {
  return (
    <>
      <ServicesContent />
      <MoreServices />
    </>
  );
}
