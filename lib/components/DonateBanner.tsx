import Link from 'next/link';
import './DonateBanner.css';

export default function DonateBanner() {
  return (
    <Link href="/donate" className="db" aria-label="Donate to Goldenboy">
      <span className="db-ring" aria-hidden="true" />
      <p className="db-eyebrow">Back my dream</p>
      <h2 className="db-title">
        Donate to <span>Goldenboy</span>
      </h2>
      <p className="db-text">
        Every rand gets me closer to going back to university. Thank you for believing in me.
      </p>
      <span className="db-btn">Donate now &rarr;</span>
    </Link>
  );
}
