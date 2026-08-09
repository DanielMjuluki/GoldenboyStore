'use client';

import { useState } from 'react';

const PRESET_AMOUNTS = [50, 100, 250, 500];

export default function DonatePage() {
  const [amount, setAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!effectiveAmount || effectiveAmount < 10) {
      setError('Please choose or enter an amount of at least R10.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: effectiveAmount, name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Support the work</p>
          <h1>Help support and grow GoldenStore</h1>
          <p className="intro-copy">
            Every contribution, big or small, directly supports the content, products, and
            projects you see here. Thank you for being part of this.
          </p>
        </div>
      </section>

      <section className="section-block">
        <form onSubmit={handleSubmit} className="donation-form">
          <div className="donation-amounts">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`variant-pill ${amount === preset && !customAmount ? 'variant-pill-active' : ''}`}
                onClick={() => {
                  setAmount(preset);
                  setCustomAmount('');
                }}
              >
                R{preset}
              </button>
            ))}
          </div>

          <label className="contact-field">
            <span>Or enter a custom amount (ZAR)</span>
            <input
              type="number"
              min={10}
              step="1"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="e.g. 150"
            />
          </label>

          <label className="contact-field">
            <span>Your name (optional)</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </label>

          <label className="contact-field">
            <span>Your email (optional)</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>

          <label className="contact-field">
            <span>Message (optional)</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something if you'd like"
              rows={3}
            />
          </label>

          {error && <p className="contact-hint" style={{ color: '#ff6b6b' }}>{error}</p>}

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Redirecting to PayFast…' : `Donate ${effectiveAmount ? `R${effectiveAmount}` : ''}`}
          </button>

          <p className="contact-hint">
            Payments are processed securely through PayFast. You'll be redirected there to
            complete your donation.
          </p>
        </form>
      </section>
    </main>
  );
}
