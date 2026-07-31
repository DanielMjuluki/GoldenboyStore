/**
 * Formats a price in cents/minor units using the given ISO 4217 currency
 * code. Every price in the UI was previously hardcoded with a "$" symbol
 * regardless of the product's actual `currency` field — misleading once
 * products are priced in ZAR (or anything else). This respects whatever
 * currency the product/order actually specifies.
 */
export function formatPrice(priceCents: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en', {
      style: 'currency',
      currency: currency.toUpperCase(),
      currencyDisplay: 'narrowSymbol',
    }).format(priceCents / 100);
  } catch {
    // Fall back gracefully if `currency` isn't a recognized ISO code.
    return `${currency.toUpperCase()} ${(priceCents / 100).toFixed(2)}`;
  }
}
