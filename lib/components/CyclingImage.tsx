'use client';

import { useEffect, useState } from 'react';

export default function CyclingImage({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    let swap: ReturnType<typeof setTimeout> | undefined;

    const start = setTimeout(() => {
      interval = setInterval(() => {
        setVisible(false);
        swap = setTimeout(() => {
          setIndex((i) => (i + 1) % images.length);
          setVisible(true);
        }, 350);
      }, 3500);
    }, Math.random() * 3000);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
      if (swap) clearTimeout(swap);
    };
  }, [images.length]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={images[index]}
      alt={alt}
      className={className}
      loading="lazy"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease' }}
    />
  );
}
