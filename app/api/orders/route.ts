import { NextResponse } from 'next/server';
import { orderPayloadSchema } from '@/lib/validation/order';
import { dataStore } from '@/lib/data';
import { rateLimit, getRateLimitHeaders } from '@/lib/utils/rateLimit';
import { logError } from '@/lib/utils/logging';
import { buildPayfastCheckoutUrl, isPayfastConfigured } from '@/lib/utils/payfast';
import { sendAdminOrderNotification } from '@/lib/utils/email';

// Rate limit: 10 requests per hour per IP
const ORDERS_RATE_LIMIT = 10;
const ORDERS_RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: Request) {
  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const rateLimitResult = await rateLimit(
    `orders:${clientIp}`,
    ORDERS_RATE_LIMIT,
    ORDERS_RATE_WINDOW_MS
  );

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: getRateLimitHeaders(ORDERS_RATE_LIMIT, rateLimitResult.remaining, rateLimitResult.retryAfter),
      }
    );
  }

  if (!isPayfastConfigured()) {
    logError('Order attempted but PayFast is not configured', new Error('Missing PAYFAST_MERCHANT_ID/KEY'));
    return NextResponse.json(
      { error: 'Payments are not set up yet. Please contact the store owner.' },
      { status: 501 }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    logError('Failed to parse order JSON', error);
    return NextResponse.json(
      { error: 'Invalid JSON payload. Please submit a valid order.' },
      { status: 400 }
    );
  }

  const validation = orderPayloadSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Order validation failed.', issues: validation.error.format() },
      { status: 422 }
    );
  }

  try {
    // Server-side validation: ensure products exist, are active, and have
    // enough stock. Prices are also read from here, never trusted from the
    // client, so nobody can tamper with the amount charged.
    const products = await dataStore.getActiveProducts();
    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalCents = 0;
    let cartCurrency: string | null = null;
    const itemNames: string[] = [];

    for (const item of validation.data.items) {
      const prod = productMap.get(item.productId);
      if (!prod) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }
      if (prod.status !== 'active') {
        return NextResponse.json({ error: `Product unavailable: ${item.productId}` }, { status: 409 });
      }
      if (prod.stockQuantity !== null && prod.stockQuantity < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for product: ${item.productId}` }, { status: 409 });
      }

      // PayFast processes one currency per transaction (ZAR). If you ever
      // sell in other currencies, that checkout needs to happen separately.
      if (cartCurrency === null) {
        cartCurrency = prod.currency;
      } else if (cartCurrency.toLowerCase() !== prod.currency.toLowerCase()) {
        return NextResponse.json(
          { error: 'This order mixes products priced in different currencies, which isn\u2019t supported in one checkout. Please order them separately.' },
          { status: 409 }
        );
      }

      totalCents += prod.priceCents * item.quantity;
      const variant = [item.size, item.color].filter(Boolean).join('/');
      itemNames.push(`${prod.name}${variant ? ` (${variant})` : ''} x${item.quantity}`);
    }

    if (cartCurrency && cartCurrency.toUpperCase() !== 'ZAR') {
      logError(
        'Order placed in a non-ZAR currency, but PayFast only settles in ZAR',
        new Error('Currency mismatch'),
        { currency: cartCurrency }
      );
    }

    const order = await dataStore.createOrder(validation.data);

    const origin = request.headers.get('origin') || new URL(request.url).origin;
    const amount = (totalCents / 100).toFixed(2);

    const checkoutUrl = buildPayfastCheckoutUrl({
      return_url: `${origin}/checkout/success?order_id=${order.id}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      notify_url: `${origin}/api/webhooks/payfast`,
      name_first: validation.data.name,
      email_address: validation.data.email,
      m_payment_id: order.id,
      amount,
      item_name: `Goldenboy Store order ${order.id}`,
      item_description: itemNames.join(', ').slice(0, 255),
    });

    if (!checkoutUrl) {
      throw new Error('PayFast did not return a checkout URL');
    }

    // Best-effort: let the store owner know a new order/quote came in.
    // Never let an email hiccup block the customer's checkout.
    try {
      await sendAdminOrderNotification(order.id, order.payload);
    } catch (emailError) {
      logError('Order created but admin notification email failed', emailError, { orderId: order.id });
    }

    return NextResponse.json({ orderId: order.id, checkoutUrl }, { status: 201 });
  } catch (error) {
    logError('Failed to create order', error);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again later.' },
      { status: 500 }
    );
  }
}
