'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/components/CartContext';
import { formatPrice } from '@/lib/utils/currency';
import type { ProductItem } from '@/lib/data/types';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems } = useCart();
  const [productsMap, setProductsMap] = useState<Record<string, ProductItem>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch product details');
        const data = await response.json();
        const map: Record<string, ProductItem> = {};
        data.products.forEach((product: ProductItem) => {
          map[product.id] = product;
        });
        setProductsMap(map);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const cartItems = items.map((item) => ({
    ...item,
    product: productsMap[item.productId] ?? null,
  }));

  const totalAmount = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.priceCents * item.quantity;
  }, 0);

  // Real stores generally price everything in one currency. If items
  // somehow carry different currencies, we fall back to the first one for
  // display; the checkout API separately guards against mixed currencies.
  const cartCurrency = cartItems.find((item) => item.product)?.product?.currency ?? 'USD';

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">Your cart</p>
          <h1>Review your order</h1>
          <p className="intro-copy">Update quantities, remove items, or continue shopping before checkout.</p>
        </div>
        <div className="page-actions">
          <Link href="/products" className="button button-secondary">
            Continue shopping
          </Link>
        </div>
      </section>

      {loading && <p className="loading-message">Loading cart items...</p>}
      {error && <p className="error-message">Error: {error}</p>}

      {!loading && !error && items.length === 0 && (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link href="/products" className="button button-primary">
            Browse products
          </Link>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <section className="cart-table">
          <div className="cart-row cart-header">
            <span>Product</span>
            <span>Qty</span>
            <span>Price</span>
            <span />
          </div>
          {cartItems.map((item) => (
            <div key={`${item.productId}-${item.size ?? ''}-${item.color ?? ''}`} className="cart-row">
              <div>
                <p className="cart-product-name">{item.product?.name ?? item.productId}</p>
                <p className="cart-product-meta">
                  {[item.size, item.color].filter(Boolean).join(' / ') ||
                    item.product?.description ||
                    'Product details unavailable'}
                </p>
              </div>
              <div className="cart-quantity">
                <label htmlFor={`qty-${item.productId}-${item.size ?? ''}-${item.color ?? ''}`} className="sr-only">
                  Quantity for {item.product?.name ?? item.productId}
                </label>
                <input
                  id={`qty-${item.productId}-${item.size ?? ''}-${item.color ?? ''}`}
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.productId, Number(event.target.value), item.size, item.color)
                  }
                />
              </div>
              <div>
                <p className="cart-price">
                  {formatPrice((item.product?.priceCents ?? 0) * item.quantity, item.product?.currency)}
                </p>
              </div>
              <div>
                <button
                  className="button button-secondary"
                  onClick={() => removeItem(item.productId, item.size, item.color)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total-row">
            <span />
            <span />
            <strong>Total</strong>
            <strong>{formatPrice(totalAmount, cartCurrency)}</strong>
          </div>
        </section>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="cart-actions">
          <button type="button" className="button button-secondary" onClick={clearCart}>
            Clear cart
          </button>
          <Link href="/checkout" className="button button-primary">
            Checkout ({totalItems})
          </Link>
        </div>
      )}
    </main>
  );
}
