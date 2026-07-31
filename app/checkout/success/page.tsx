import type { Metadata } from 'next';
import Link from 'next/link';
import { dataStore } from '@/lib/data';
import ClearCartOnPaid from '@/lib/components/ClearCartOnPaid';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: {
    order_id?: string;
  };
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams.order_id;

  if (!orderId) {
    return (
      <main className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Order status unavailable</h1>
            <p className="intro-copy">
              We couldn&apos;t find your order. If you completed payment, check your email for confirmation, or
              contact us directly.
            </p>
          </div>
        </section>
      </main>
    );
  }

  try {
    const order = await dataStore.findOrderById(orderId);

    if (!order) {
      return (
        <main className="page-shell">
          <section className="page-heading">
            <div>
              <h1>Order status unavailable</h1>
              <p className="intro-copy">
                We couldn&apos;t find that order. If you completed payment, check your email for confirmation, or
                contact us directly.
              </p>
            </div>
          </section>
        </main>
      );
    }

    // PayFast's ITN webhook (app/api/webhooks/payfast) is the source of
    // truth for payment status — it updates this order's status
    // independently of whether the customer's browser makes it back here.
    const isPaid = order.status === 'paid';

    return (
      <main className="page-shell">
        {isPaid && <ClearCartOnPaid />}
        <section className="page-heading">
          <div>
            <p className="eyebrow">{isPaid ? 'Payment received' : 'Payment processing'}</p>
            <h1>{isPaid ? 'Thank you for your order!' : 'We\u2019re confirming your payment'}</h1>
            <p className="intro-copy">
              {isPaid
                ? `Your order ${orderId} is confirmed. A confirmation email is on its way.`
                : 'This can take a moment. We\u2019ll email you as soon as PayFast confirms your payment.'}
            </p>
          </div>
          <div className="page-actions">
            <Link href="/products" className="button button-secondary">
              Continue shopping
            </Link>
          </div>
        </section>

        <section className="admin-form-wrapper">
          <div className="admin-form">
            <h2>Order summary</h2>
            <ul>
              {order.payload.items.map((item) => (
                <li key={item.productId}>
                  {item.productId} &times; {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error('Failed to look up order status:', error);
    return (
      <main className="page-shell">
        <section className="page-heading">
          <div>
            <h1>Something went wrong</h1>
            <p className="intro-copy">
              We couldn&apos;t confirm your order status right now. If you completed payment, check your email for
              confirmation, or contact us directly.
            </p>
          </div>
        </section>
      </main>
    );
  }
}
