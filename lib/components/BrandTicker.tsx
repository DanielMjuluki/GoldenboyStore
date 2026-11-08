import './HeroMotion.css';

const ITEMS = ['Kingdome', 'Goldenboy Merch', 'Golden General Store', 'Online Barber', 'GoldenSolutions'];

export default function BrandTicker() {
  const group = [...ITEMS, ...ITEMS];
  const track = [...group, ...group];
  return (
    <div className="bt" aria-hidden="true">
      <div className="bt-track">
        {track.map((name, i) => (
          <span key={i} className="bt-item">
            {name}
            <span className="bt-dot">&#9670;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
