import type { Metadata } from 'next';
import WorkwearCatalogue from '@/lib/components/WorkwearCatalogue';

export const metadata: Metadata = {
  title: 'Workwear and PPE | Overalls, Hi-Vis, Gloves and Boots | GoldenStore',
  description:
    'Workwear and safety gear in Port Elizabeth: overalls, hi-vis vests and jackets, gloves and boots. Buy single items or request a bulk quote.',
};

export default function WorkwearPage() {
  return <WorkwearCatalogue />;
}
