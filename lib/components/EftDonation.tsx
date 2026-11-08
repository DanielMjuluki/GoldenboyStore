'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import './EftDonation.css';

const DETAILS = [
  { label: 'Bank', value: 'Absa', copy: false },
  { label: 'Account holder', value: 'Yonela Mjuluki', copy: false },
  { label: 'Account number', value: '4120384080', copy: true },
  { label: 'Branch code', value: '632005', copy: true },
  { label: 'Reference', value: 'GOLDENBOY', copy: true },
];

export default function EftDonation() {
  const [done, setDone] = useState<string | null>(null);

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(label);
      setTimeout(() => setDone(null), 1800);
    } catch {
      setDone(null);
    }
  };

  return (
    <section className="eft">
      <p className="eft-eyebrow">Prefer a bank transfer?</p>
      <h3 className="eft-title">Donate by EFT</h3>
      <p className="eft-sub">Pay straight from your banking app. Tap a field to copy it.</p>

      {DETAILS.map((d) => (
        <div key={d.label} className="eft-row">
          <div>
            <p className="eft-label">{d.label}</p>
            <p className="eft-value">{d.value}</p>
          </div>
          {d.copy && (
            <button
              type="button"
              className={`eft-copy ${done === d.label ? 'eft-copy-done' : ''}`}
              onClick={() => copy(d.label, d.value)}
            >
              {done === d.label ? <Check size={14} /> : <Copy size={14} />}
              {done === d.label ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      ))}

      <p className="eft-note">
        EFT donations aren&rsquo;t confirmed automatically. Use the reference above, or WhatsApp me
        your proof of payment so I can thank you.
      </p>
    </section>
  );
}
