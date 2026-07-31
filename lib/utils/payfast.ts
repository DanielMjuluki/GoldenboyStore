import crypto from 'crypto';

/**
 * PayFast integration.
 *
 * Once you've created your PayFast account, set these in your environment
 * (Vercel → Project Settings → Environment Variables):
 *
 *   PAYFAST_MERCHANT_ID   — from your PayFast dashboard
 *   PAYFAST_MERCHANT_KEY  — from your PayFast dashboard
 *   PAYFAST_PASSPHRASE    — optional but strongly recommended (Settings →
 *                           Integration on the PayFast dashboard). Must
 *                           match exactly what you set there.
 *   PAYFAST_MODE          — "live" once you're ready to take real payments.
 *                           Defaults to "sandbox" (PayFast's test environment)
 *                           so nothing charges real money until you flip this.
 *
 * Until PAYFAST_MERCHANT_ID / PAYFAST_MERCHANT_KEY are set, checkout will
 * return a clear "payments not configured yet" message instead of erroring.
 */

const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE;
const PAYFAST_MODE = process.env.PAYFAST_MODE === 'live' ? 'live' : 'sandbox';

export function isPayfastConfigured(): boolean {
  return Boolean(PAYFAST_MERCHANT_ID && PAYFAST_MERCHANT_KEY);
}

export function getPayfastProcessUrl(): string {
  return PAYFAST_MODE === 'live'
    ? 'https://www.payfast.co.za/eng/process'
    : 'https://sandbox.payfast.co.za/eng/process';
}

// PayFast's own signature examples use PHP's urlencode(), which encodes
// spaces as '+' rather than '%20'. Signatures won't match PayFast's if we
// don't do the same.
function payfastEncode(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, '+');
}

interface CheckoutFields {
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first?: string;
  email_address?: string;
  m_payment_id: string;
  amount: string; // e.g. "199.99" — always 2 decimal places
  item_name: string;
  item_description?: string;
}

/**
 * Builds a signed PayFast checkout URL. Returns null if PayFast credentials
 * aren't set yet — callers should treat that as "payments not configured".
 */
export function buildPayfastCheckoutUrl(fields: CheckoutFields): string | null {
  if (!PAYFAST_MERCHANT_ID || !PAYFAST_MERCHANT_KEY) return null;

  const allFields: Record<string, string | undefined> = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: fields.return_url,
    cancel_url: fields.cancel_url,
    notify_url: fields.notify_url,
    name_first: fields.name_first,
    email_address: fields.email_address,
    m_payment_id: fields.m_payment_id,
    amount: fields.amount,
    item_name: fields.item_name,
    item_description: fields.item_description,
  };

  // Field order matters for the signature — PayFast signs the fields in the
  // order they appear in the request, so we build both the query string and
  // the signature from this same ordered list.
  const pairs: string[] = [];
  for (const [key, value] of Object.entries(allFields)) {
    if (value !== undefined && value !== null && value !== '') {
      pairs.push(`${key}=${payfastEncode(value)}`);
    }
  }

  const queryString = pairs.join('&');
  const signature = signPayfastString(queryString);

  return `${getPayfastProcessUrl()}?${queryString}&signature=${signature}`;
}

function signPayfastString(queryString: string): string {
  const base = PAYFAST_PASSPHRASE
    ? `${queryString}&passphrase=${payfastEncode(PAYFAST_PASSPHRASE)}`
    : queryString;
  return crypto.createHash('md5').update(base).digest('hex');
}

/**
 * Verifies an Instant Transaction Notification (ITN) POST from PayFast by
 * recomputing the signature from the fields PayFast sent (in the order they
 * arrived) and comparing it to the one they included.
 *
 * Note: PayFast also recommends (1) confirming the request came from a
 * PayFast IP, and (2) posting the data back to PayFast's `/eng/query/validate`
 * endpoint to double-check it. Both are good additions once you're handling
 * real money — this signature check is the essential first line of defense.
 */
export function verifyPayfastSignature(fields: Record<string, string>): boolean {
  const { signature, ...rest } = fields;
  if (!signature) return false;

  const pairs: string[] = [];
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== '') {
      pairs.push(`${key}=${payfastEncode(value)}`);
    }
  }

  const computed = signPayfastString(pairs.join('&'));
  return computed === signature;
}
