import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work & Projects',
  description: 'Goldenboy\u2019s journey from 2022 to now \u2014 building brands, media, and businesses.',
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
