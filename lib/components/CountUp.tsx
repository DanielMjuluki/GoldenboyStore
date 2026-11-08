'use client';

import { useEffect, useState } from 'react';

export default function CountUp({ value }: { value: string }) {
  const [text, setText] = useState(value);

  useEffect(() => {
    const m = value.match(/^([\d.]+)([KM]?)$/);
    if (!m || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(value);
      return;
    }
    const target = parseFloat(m[1]);
    const decimals = (m[1].split('.')[1] || '').length;
    const suffix = m[2];
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setText((target * eased).toFixed(decimals) + suffix);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{text}</>;
}
