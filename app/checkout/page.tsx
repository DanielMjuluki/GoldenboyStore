'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CheckoutForm from '@/lib/components/CheckoutForm';
import { useCart } from '@/lib/components/CartContext';
import type { ProductItem } from '@/lib/data/types';

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutPageInner />
    </Suspense>
  );
}

function CheckoutPageInner() {
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'redirecting' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [productsMap, setProductsMap] = useState<Record<string, ProductItem>>({});

  const { items, totalItems } = useCart();
  const searchParams = useSearchParams();
  const wasCancelled = searchParams.get('cancelled') === '1';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) return;
        const data = await res.json();
        const map: Record<string, ProductItem> = {};
        data.products.forEach((p: ProductItem) => (map[p.id] = p));
        setProductsMap(map);
      } catch (e) {
        // ignore product name enrichment failures
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // When the browser restores this page from its back-forward cache
    // (e.g. pressing back after we sent the customer to PayFast or
    // WhatsApp via window.location.href), it can show the exact frozen
    // React state from before navigation — which would still say
    // "Processing..." with the form disabled. event.persisted === true
    // means it came from bfcache rather than a fresh load, so reset the
    // status back to idle in that case.
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setOrderStatus('idle');
        setErrorMessage(null);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  const handleSubmit = async (formData: any) => {
    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Add at least one item before placing an order.');
      setOrderStatus('error');
      return;
    }

    setOrderStatus('loading');
    setErrorMessage(null);

    const payload = {
      ...formData,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color })),
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      setOrderStatus('redirecting');

      if (data.paymentMethod === 'eft') {
        // EFT flow: no PayFast redirect. Send the customer to WhatsApp to
        // confirm and send proof of payment. Cart is left intact until the
        // store owner manually marks the order as paid.
        if (!data.whatsappUrl) {
          throw new Error('No WhatsApp link was returned. Please try again.');
        }
        window.location.href = data.whatsappUrl;
        return;
      }

      if (!data.checkoutUrl) {
        throw new Error('No checkout URL was returned. Please try again.');
      }

      // Cart is intentionally left intact until payment is confirmed (see
      // /checkout/success), so cancelling out of PayFast doesn't lose the cart.
      window.location.href = data.checkoutUrl;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      setOrderStatus('error');
    }
  };

  return (
    <main className="page-shell">
      <section className="checkout-section">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Guest Checkout</p>
            <h1>Complete your order</h1>
          </div>
          <div className="page-actions">
            <Link href="/cart" className="button button-secondary">
              Edit cart ({totalItems})
            </Link>
          </div>
        </div>

        {wasCancelled && (
          <div className="error-panel">
            <p className="error-message">Checkout was cancelled. Your cart is still saved below.</p>
          </div>
        )}

        <div className="cart-summary">
          <h2>Order Summary</h2>
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
             <ul className="checkout-summary-list">
              {items.map((it) => {
                const product = productsMap[it.productId];
                return (
                  <li key={`${it.productId}-${it.size ?? ''}-${it.color ?? ''}`} className="checkout-summary-item">
                    {product?.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="checkout-summary-image" />
                    )}
                    <span>
                      {product?.name ?? it.productId}
                      {(it.size || it.color) && ` (${[it.size, it.color].filter(Boolean).join(', ')})`} — Qty: {it.quantity}
                    </span>
                  </li>
                );
              })}
            </ul>          )}
        </div>

        <CheckoutForm onSubmit={handleSubmit} isLoading={orderStatus === 'loading' || orderStatus === 'redirecting'} initialItems={items} />

        {orderStatus === 'redirecting' && (
          <p className="intro-copy">Redirecting you to secure checkout...</p>
        )}

        {orderStatus === 'error' && errorMessage && (
          <div className="error-panel">
            <p className="error-message">{errorMessage}</p>
          </div>
        )}
      </section>
    </main>
  );
}
