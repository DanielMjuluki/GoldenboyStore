import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | GoldenStore",
  description: "About Yonela Mjuluki (Goldenboy) — founder of GoldenStore.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* --- Founder --- */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-2">About the Founder</h1>
        <h2 className="text-lg text-neutral-500 mb-6">Yonela Mjuluki — "Goldenboy"</h2>

        <p className="mb-4 leading-relaxed">
          Yonela Mjuluki, known online as Goldenboy, is the founder of GoldenStore — a
          multi-brand e-commerce platform housing Kingdome Fashion Apparel, Goldenboy
          Merch, and Golden General Store. He also founded and operates Online Barber,
          a real, physical barbershop business run on booking and performance-tracking
          systems he personally developed.
        </p>
        <p className="mb-4 leading-relaxed">
          Currently studying towards N6 Fitter Engineering at Port Elizabeth TVET
          College, Yonela combines a technical engineering foundation with hands-on,
          self-taught software development — building, deploying, and maintaining
          GoldenStore entirely from a smartphone using Termux.
        </p>
        <p className="leading-relaxed">
          Alongside his ventures, he has administrative experience in a logistics
          environment, handling job-file costing, invoicing, and record-keeping —
          skills that carry directly into running GoldenStore's operations.
        </p>
      </section>

      {/* --- Skills --- */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>

        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2 text-neutral-700">Technical</h3>
            <ul className="list-disc list-inside space-y-1 text-neutral-600">
              <li>Self-taught web development (Next.js, React)</li>
              <li>Mechanotechnics, mechanical draughting &amp; engineering science</li>
              <li>PLC programming (self-taught)</li>
              <li>CAD software (self-taught)</li>
              <li>Basic Python programming</li>
              <li>Microsoft Office &amp; Google Sheets</li>
              <li>Windows troubleshooting</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-neutral-700">Administrative &amp; Business</h3>
            <ul className="list-disc list-inside space-y-1 text-neutral-600">
              <li>Costing, invoicing &amp; order processing</li>
              <li>Job-file administration &amp; record-keeping</li>
              <li>Customer service &amp; client communication</li>
              <li>Founding and running a business end-to-end</li>
              <li>Pricing decisions &amp; revenue generation</li>
              <li>Quality control &amp; consistency management</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-neutral-700">Strengths</h3>
          <ul className="list-disc list-inside space-y-1 text-neutral-600">
            <li>Attention to detail and accuracy</li>
            <li>Time management &amp; organisation</li>
            <li>Works independently and under pressure</li>
            <li>Reliable, disciplined &amp; professional</li>
            <li>Adaptable and eager to learn</li>
          </ul>
        </div>
      </section>

      {/* --- Contact --- */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <ul className="space-y-1 text-neutral-700">
          <li>Email: <a className="underline" href="mailto:goldenboimj@gmail.com">goldenboimj@gmail.com</a></li>
          <li>WhatsApp: <a className="underline" href="https://wa.me/27678208752">067 820 8752</a></li>
        </ul>
      </section>
    </main>
  );
}
