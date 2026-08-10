'use client';

import { useState } from 'react';
import { Heart, ShieldCheck } from 'lucide-react';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

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
    <main className="page-shell donate-page">
      <section className="donate-hero">
        <div className="donate-hero-icon">
          <Heart className="w-6 h-6" />
        </div>
        <p className="eyebrow">My story</p>
        <h1>This is bigger than a store</h1>

        <div className="donate-story-card">
          <p>
            I recently left my parents' house. Not out of conflict, but because I needed to give
            my art and my dream the kind of full, uninterrupted dedication that home life
            couldn't allow for. Right now I'm staying with a friend, and the plan is to be here
            for about a month while I apply for NSFAS and head back to residence to continue my
            studies. I'm still a college student, studying Mechanical Engineering, alongside all
            of this.
          </p>
          <p>
            My dream is bigger than any one product or platform: I want to help people, especially
            young men like me, all around, become the greatest version of themselves through the
            talent God gave them. My father once told me something I carry with me every day:
          </p>
          <blockquote>
            "Only those who are able to seek for help can have the heart to help others."
          </blockquote>
          <p>
            So this is me, seeking help, honestly and humbly, so I can keep building something
            that will one day help a lot more people than just me. Every contribution, big or
            small, goes directly toward that. Thank you for being part of it.
          </p>
        </div>
      </section>

      <section className="donate-form-section">
        <form onSubmit={handleSubmit} className="donation-card">
          <p className="eyebrow">Choose an amount</p>

          <div className="donation-amounts">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`donation-amount-btn ${amount === preset && !customAmount ? 'donation-amount-active' : ''}`}
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

          <div className="donation-divider" />

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

          {error && <p className="contact-hint donation-error">{error}</p>}

          <button type="submit" className="button button-primary donation-submit" disabled={loading}>
            {loading ? 'Redirecting to PayFast…' : `Donate ${effectiveAmount ? `R${effectiveAmount}` : ''}`}
          </button>

          <p className="contact-hint donation-secure">
            <ShieldCheck className="w-4 h-4" />
            Payments are processed securely through PayFast. You'll be redirected there to
            complete your donation.
          </p>
        </form>
      </section>
    </main>
  );
}
