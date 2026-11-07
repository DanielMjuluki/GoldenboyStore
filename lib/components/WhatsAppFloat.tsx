import { MessageCircle } from 'lucide-react';
import './WhatsAppFloat.css';

const HREF = 'https://wa.me/27678208752?text=Hi%20Goldenboy%2C%20I%20am%20on%20your%20website';

export default function WhatsAppFloat() {
  return (
    <a href={HREF} target="_blank" rel="noopener noreferrer" className="wa" aria-label="Chat with Goldenboy on WhatsApp">
      <MessageCircle className="w-6 h-6" />
      <span className="wa-label">Chat on WhatsApp</span>
    </a>
  );
}
