import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for Goldenstore.co.za, including delivery, exchanges, and order policies.',
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Policies</p>
          <h1>Terms & Conditions</h1>
          <p className="intro-copy">Last updated: {new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </section>

      <section className="section-block terms-content">
        <h2>About us</h2>
        <p>
          Goldenstore.co.za is operated by Yonela Mjuluki, trading as Goldenboy / Goldenstore, based in Overbaakens, Fairview,
          South Africa. We sell branded merchandise and digital products directly to customers
          across South Africa.
        </p>

        <h2>Orders and payment</h2>
        <p>
          All orders are placed and paid for through our website via PayFast, a secure South
          African payment gateway. Your order is confirmed once payment has been successfully
          processed. You will receive confirmation of your order by email.
        </p>

        <h2>Delivery</h2>
        <p>
          We currently deliver orders across South Africa using PEP Paxi and bus courier
          services (such as Intercape and Translux parcel services). These are affordable,
          widely available delivery methods used by many small South African sellers.
        </p>
        <p>
          Once your order is dispatched, you will be contacted with your parcel's tracking or
          collection details. Delivery timeframes typically range from 3–7 business days
          depending on your location and the courier used, though this can vary. We will keep
          you updated if there are any delays.
        </p>
        <p>
          Delivery costs, where applicable, will be communicated to you before your order is
          finalised.
        </p>

        <h2>Exchanges — no refunds</h2>
        <p>
          We do not offer cash refunds. If you receive an item that is faulty, damaged, or
          incorrect, or if a clothing item doesn't fit, we're happy to arrange an exchange.
        </p>
        <ul>
          <li>Contact us within 7 days of receiving your order to request an exchange.</li>
          <li>Items must be unworn, unwashed, and in their original condition with tags attached.</li>
          <li>You are responsible for the cost of returning the item to us, unless the item was
            faulty or incorrect due to our error, in which case we will cover the return cost.</li>
          <li>Once we receive and inspect the returned item, we will arrange for the replacement
            item to be sent to you.</li>
        </ul>
        <p>
          To start an exchange, contact us via WhatsApp at 067 820 8752 or email
          Goldenboimj@gmail.com with your order details.
        </p>

        <h2>Cancellations</h2>
        <p>
          If you need to cancel an order, contact us as soon as possible. If your order hasn't
          been dispatched yet, we can cancel it. Once an order has been handed over to a courier
          for delivery, it can no longer be cancelled, and our exchange policy above will apply
          instead.
        </p>

        <h2>Product availability</h2>
        <p>
          We do our best to keep stock levels accurate on our site. In the rare case that an
          item you've ordered is unavailable, we will contact you to arrange an alternative
          item, a delayed dispatch, or a cancellation of that item.
        </p>

        <h2>Contact us</h2>
        <p>
          For any questions about these terms, your order, or an exchange request, reach out via:
        </p>
        <ul>
          <li>WhatsApp: 067 820 8752</li>
          <li>Email: Goldenboimj@gmail.com</li>
        </ul>
      </section>
    </main>
  );
}
