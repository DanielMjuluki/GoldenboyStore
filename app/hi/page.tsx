import type { Metadata } from 'next';
import HiLanding from '@/lib/components/HiLanding';

export const metadata: Metadata = {
  title: 'Goldenboy | Kingdome, Faith and Mental Health tees',
  description: 'Premium Kingdome streetwear and message tees from a young local founder. Shop or back the business.',
};

export default function HiPage() {
  return <HiLanding />;
}
