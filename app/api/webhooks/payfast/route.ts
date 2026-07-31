import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data';
import { verifyPayfastSignature } from '@/lib/utils/payfast';
import { sendOrderConfirmationEmail } from '@/lib/utils/email';
import { logError } from '@/lib/utils/logging';

// PayFast POSTs ITN (Instant Transaction Notification) data here as
// application/x-www-form-urlencoded whenever a payment's status changes.
// This is the source of truth for marking an order paid — the customer's
// browser redirect to /checkout/success is just for their own UX and should
// never be trusted on its own to confirm payment.
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const params = new URLSearchParams(rawBody);
  const fields: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    fields[key] = value;
  }

  if (!verifyPayfastSignature(fields)) {
    logError('PayFast ITN signature verification failed', new Error('Invalid signature'), {
      mPaymentId: fields.m_payment_id,
    });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const orderId = fields.m_payment_id;
  if (!orderId) {
    logError('PayFast ITN received with no m_payment_id', new Error('Missing m_payment_id'));
    return NextResponse.json({ error: 'Missing m_payment_id' }, { status: 400 });
  }

  try {
    const order = await dataStore.findOrderById(orderId);
    if (!order) {
      logError('PayFast ITN could not find matching order', new Error('Order not found'), { orderId });
      // Still return 200 — PayFast retries on non-2xx, and a missing order
      // on our end won't resolve itself with retries.
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const paymentStatus = fields.payment_status;

    if (paymentStatus === 'COMPLETE') {
      // Avoid double-processing (PayFast may send more than one ITN for the
      // same payment).
      if (order.status !== 'paid') {
        await dataStore.updateOrder(orderId, { status: 'paid' });
        await dataStore.decrementStockForOrder(order.payload.items);

        try {
          await sendOrderConfirmationEmail(orderId, order.payload);
        } catch (emailError) {
          logError('Payment confirmed but confirmation email failed', emailError, { orderId });
        }
      }
    } else if (paymentStatus === 'FAILED') {
      await dataStore.updateOrder(orderId, { status: 'payment_failed' });
    }
    // CANCELLED / PENDING and any other statuses are left as-is — PayFast
    // will send a follow-up ITN once the payment reaches a final state.

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logError('Failed to process PayFast ITN', error, { orderId });
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
