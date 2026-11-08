import './HeroMotion.css';

export default function HeroHeadline() {
  return (
    <h1>
      <span className="hh-w" style={{ animationDelay: '0.1s' }}>Creator.</span>{' '}
      <span className="hh-w" style={{ animationDelay: '0.35s' }}>Brand.</span>{' '}
      <span className="hh-w hh-gold" style={{ animationDelay: '0.6s' }}>Commerce.</span>
    </h1>
  );
}
