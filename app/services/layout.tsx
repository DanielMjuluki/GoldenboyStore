import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Services and offers from the Goldenboy ecosystem — content, strategy, and brand launches.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
