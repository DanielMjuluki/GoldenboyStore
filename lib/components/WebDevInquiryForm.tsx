'use client';

import { useState } from 'react';

const CONTACT_EMAIL = 'Goldenboimj@gmail.com';
const WHATSAPP_NUMBER = '27678208752';

const PROJECT_TYPES = [
  'Starter Page (R1,500 – R2,500)',
  'Business Website (R5,000 – R12,000)',
  'E-commerce Website (R12,000 – R30,000)',
  'Custom / Advanced Project (R25,000+)',
  'Business Branding & Printing',
  'Not sure yet — help me decide',
];

export default function WebDevInquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [message, setMessage] = useState('');

  const canSend = name.trim().length > 0 && message.trim().length > 0;

  function buildBody() {
    return `Hi, my name is ${name}.\n\nProject type: ${projectType}\n\n${message}`;
  }

  function sendViaEmail() {
    const subject = encodeURIComponent(`Website/branding enquiry — ${projectType}`);
    const body = encodeURIComponent(buildBody());
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  function sendViaWhatsApp() {
    const text = encodeURIComponent(buildBody());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener');
  }

  return (
    <div className="contact-form webdev-inquiry-form">
      <label className="contact-field">
        <span>Your name</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </label>

      <label className="contact-field">
        <span>Your email (optional)</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </label>

      <label className="contact-field">
        <span>What are you looking for?</span>
        <select value={projectType} onChange={(e) => setProjectType(e.target.value)}>
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>

      <label className="contact-field">
        <span>Tell me about your project</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What do you need, and any deadline or budget in mind?"
          rows={4}
        />
      </label>

      <div className="contact-actions">
        <button type="button" className="button button-primary" onClick={sendViaEmail} disabled={!canSend}>
          Send via Email
        </button>
        <button type="button" className="button button-secondary" onClick={sendViaWhatsApp} disabled={!canSend}>
          Send via WhatsApp
        </button>
      </div>

      {!canSend && <p className="contact-hint">Fill in your name and message to send.</p>}
    </div>
  );
}
