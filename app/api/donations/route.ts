import { NextResponse } from 'next/server';
import { buildPayfastCheckoutUrl, isPayfastConfigured } from '@/lib/utils/payfast';
import { logError } from '@/lib/utils/logging';

export async function POST(request: Request) {
  if (!isPayfastConfigured()) {
    return NextResponse.json(
      { error: 'Donations are not set up yet. Please contact the site owner.' },
      { status: 501 }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const body = payload as { amount?: number; name?: string; email?: string; message?: string };
  const amount = Number(body.amount);

  if (!Number.isFinite(amount) || amount < 10) {
    return NextResponse.json({ error: 'Please enter an amount of at least R10.' }, { status: 422 });
  }

  const donationId = `donation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const origin = request.headers.get('origin') || new URL(request.url).origin;

  const checkoutUrl = buildPayfastCheckoutUrl({
    return_url: `${origin}/donate/thank-you`,
    cancel_url: `${origin}/donate?cancelled=1`,
    notify_url: `${origin}/api/webhooks/payfast`,
    name_first: body.name?.trim() || undefined,
    email_address: body.email?.trim() || undefined,
    m_payment_id: donationId,
    amount: amount.toFixed(2),
    item_name: 'Donation to GoldenStore',
    item_description: body.message?.trim().slice(0, 255) || undefined,
  });

  if (!checkoutUrl) {
    logError('Failed to build donation checkout URL', new Error('PayFast URL builder returned null'));
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ checkoutUrl }, { status: 201 });
}
