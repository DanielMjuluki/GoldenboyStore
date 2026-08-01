import { NextResponse } from 'next/server';
import { buildPayfastCheckoutUrl, isPayfastConfigured, getPayfastProcessUrl } from '@/lib/utils/payfast';

// TEMPORARY debug route — safe to hit (sandbox test data only, no real
// order is created), used to inspect exactly what signature/query string
// the server generates without digging through Vercel logs. Remove once
// PayFast checkout is confirmed working.
export async function GET(request: Request) {
  const origin = request.headers.get('origin') || new URL(request.url).origin;

  const checkoutUrl = buildPayfastCheckoutUrl({
    return_url: `${origin}/checkout/success?order_id=debug_test`,
    cancel_url: `${origin}/checkout?cancelled=1`,
    notify_url: `${origin}/api/webhooks/payfast`,
    name_first: 'Yonela Mjuluki',
    email_address: 'onlinebarberza@gmail.com',
    m_payment_id: 'debug_test_order',
    amount: '250.00',
    item_name: 'Goldenboy Store order debug_test_order',
    item_description: 'Kingdome-Tshirt (S/Black) x1',
  });

  return NextResponse.json({
    isPayfastConfigured: isPayfastConfigured(),
    processUrl: getPayfastProcessUrl(),
    merchantIdPresent: Boolean(process.env.PAYFAST_MERCHANT_ID),
    merchantIdValue: process.env.PAYFAST_MERCHANT_ID ?? null,
    merchantKeyPresent: Boolean(process.env.PAYFAST_MERCHANT_KEY),
    merchantKeyLength: process.env.PAYFAST_MERCHANT_KEY?.length ?? 0,
    passphrasePresent: Boolean(process.env.PAYFAST_PASSPHRASE),
    passphraseLength: process.env.PAYFAST_PASSPHRASE?.length ?? 0,
    payfastMode: process.env.PAYFAST_MODE ?? null,
    checkoutUrl,
  });
}
