import nodemailer from 'nodemailer';
import type { OrderPayload } from '@/lib/data/types';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;

// Where every new order/quote request gets forwarded. Override in
// .env.local / Vercel env vars if this ever needs to change.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'goldenboymj@gmail.com';

export async function sendOrderConfirmationEmail(orderId: string, payload: OrderPayload) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const itemsDescription = payload.items
    .map((item) => `- ${item.productId}${item.size || item.color ? ` (${[item.size, item.color].filter(Boolean).join('/')})` : ''}: ${item.quantity}`)
    .join('\n');

  const message = {
    from: EMAIL_FROM,
    to: payload.email,
    subject: `Your Golden Store order ${orderId} is confirmed`,
    text: `Hi ${payload.name},\n\n` +
      `Thank you for your order. Your order ${orderId} has been received and is being processed.\n\n` +
      `Order summary:\n${itemsDescription}\n\n` +
      `Shipping address:\n${payload.shippingAddress.line1}\n` +
      `${payload.shippingAddress.line2 ? `${payload.shippingAddress.line2}\n` : ''}` +
      `${payload.shippingAddress.city}, ${payload.shippingAddress.region} ${payload.shippingAddress.postalCode}\n` +
      `${payload.shippingAddress.country}\n\n` +
      `Notes: ${payload.note ?? 'None'}\n\n` +
      `If you have any questions, reply to this email.\n\n` +
      `Thanks,\nThe Golden Store Team`,
  };

  await transporter.sendMail(message);
}

// Print partner that produces apparel/merch items. Any paid order
// containing at least one product tagged with the "merch" category gets
// a dedicated heads-up here, in addition to the normal admin notification,
// so production can start without anyone manually forwarding the order.
const PRINT_PARTNER_EMAIL = process.env.PRINT_PARTNER_EMAIL || 'Sales@printcartel.co.za';

/**
 * Notifies the print partner when a PAID order contains apparel/merch
 * items. `apparelItems` should already be filtered to just the lines that
 * need producing — this function doesn't do that filtering itself.
 */
export async function sendApparelOrderNotification(
  orderId: string,
  payload: OrderPayload,
  apparelItems: { name: string; size?: string; color?: string; quantity: number }[]
) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    return;
  }
  if (apparelItems.length === 0) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const itemsDescription = apparelItems
    .map((item) => `- ${item.name}${item.size || item.color ? ` (${[item.size, item.color].filter(Boolean).join('/')})` : ''}: ${item.quantity}`)
    .join('\n');

  const message = {
    from: EMAIL_FROM,
    to: PRINT_PARTNER_EMAIL,
    subject: `Apparel order to produce — ${orderId}`,
    text:
      `A paid order containing apparel items needs producing.\n\n` +
      `Order ID: ${orderId}\n` +
      `Customer: ${payload.name}\n\n` +
      `Items to produce:\n${itemsDescription}\n\n` +
      `Ship to:\n${payload.shippingAddress.line1}\n` +
      `${payload.shippingAddress.line2 ? `${payload.shippingAddress.line2}\n` : ''}` +
      `${payload.shippingAddress.city}, ${payload.shippingAddress.region} ${payload.shippingAddress.postalCode}\n` +
      `${payload.shippingAddress.country}\n\n` +
      `Notes: ${payload.note ?? 'None'}\n`,
  };

  await transporter.sendMail(message);
}

/**
 * Notifies the store owner (goldenboymj@gmail.com by default) every time a
 * new order or quote request comes in, so nothing gets missed.
 */
export async function sendAdminOrderNotification(orderId: string, payload: OrderPayload) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const itemsDescription = payload.items
    .map((item) => `- ${item.productId}${item.size || item.color ? ` (${[item.size, item.color].filter(Boolean).join('/')})` : ''}: ${item.quantity}`)
    .join('\n');

  const message = {
    from: EMAIL_FROM,
    to: ADMIN_EMAIL,
    subject: `New order ${orderId} — ${payload.name}`,
    text:
      `New order received.\n\n` +
      `Order ID: ${orderId}\n` +
      `Customer: ${payload.name} (${payload.email})\n\n` +
      `Items:\n${itemsDescription}\n\n` +
      `Shipping address:\n${payload.shippingAddress.line1}\n` +
      `${payload.shippingAddress.line2 ? `${payload.shippingAddress.line2}\n` : ''}` +
      `${payload.shippingAddress.city}, ${payload.shippingAddress.region} ${payload.shippingAddress.postalCode}\n` +
      `${payload.shippingAddress.country}\n\n` +
      `Notes: ${payload.note ?? 'None'}\n`,
  };

  await transporter.sendMail(message);
}

export async function sendDonationNotification(donation: { amount?: string; name?: string; email?: string }) {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: EMAIL_FROM,
    to: ADMIN_EMAIL,
    subject: `New donation received — R${donation.amount ?? '?'}`,
    text:
      `You received a donation.\n\n` +
      `Amount: R${donation.amount ?? 'unknown'}\n` +
      `From: ${donation.name ?? 'Anonymous'} (${donation.email ?? 'no email given'})\n`,
  });
}
