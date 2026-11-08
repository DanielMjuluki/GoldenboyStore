const ITEMS = [
  { title: 'Better products', text: 'More stock, more designs and higher quality across every store.' },
  { title: 'Stronger branding', text: 'Printing, packaging and a brand people remember.' },
  { title: 'More reach', text: 'Content, ads and tools that put the work in front of more people.' },
];

export default function DonateImpact() {
  return (
    <section className="di">
      <p className="di-eyebrow">Where your donation goes</p>
      <div className="di-grid">
        {ITEMS.map((i, n) => (
          <div key={i.title} className="di-card" style={{ animationDelay: `${n * 0.12}s` }}>
            <h3>{i.title}</h3>
            <p>{i.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
