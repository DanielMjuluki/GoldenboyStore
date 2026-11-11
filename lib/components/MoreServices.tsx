import { Shirt, Hammer, MessageCircle } from 'lucide-react';
import './MoreServices.css';

const WA = 'https://wa.me/27678208752?text=';

const ITEMS = [
  {
    icon: Shirt,
    title: 'Custom tees and uniforms',
    text: 'Printed apparel for groups and businesses.',
    points: ['Teams, churches, schools and businesses', 'Your own design, or one we create together', 'Quote sent to you on WhatsApp'],
  },
  {
    icon: Hammer,
    title: 'Furniture and house decor',
    text: 'Tables and more, made by local craftsmen.',
    points: ['Send a photo or an idea of what you want', 'A quote for the piece and its delivery', 'Handled for you from order to handover'],
  },
  {
    icon: MessageCircle,
    title: 'Something else?',
    text: 'Need something made, printed or sorted?',
    points: ['Tell me what you need', 'I will tell you what is possible and what it costs'],
  },
];

export default function MoreServices() {
  return (
    <section className="sx">
      <p className="sx-eyebrow">More services</p>
      <h2>Made, printed and sorted for you</h2>
      <p className="sx-lead">Message me what you need and I will send you a quote.</p>
      <div className="sx-grid">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="sx-card">
              <span className="sx-icon">
                <Icon size={20} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <ul>
                {item.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a
                className="sx-btn"
                href={WA + encodeURIComponent('Hi Goldenboy, I would like a quote for: ' + item.title)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Request a quote
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
