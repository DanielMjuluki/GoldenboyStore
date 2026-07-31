'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductItem } from '@/lib/data/types';
import { useCart } from '@/lib/components/CartContext';
import { formatPrice } from '@/lib/utils/currency';

export default function ProductDetailActions({ product }: { product: ProductItem }) {
  const router = useRouter();
  const { addItem } = useCart();

  const sizes = product.sizes ?? [];
  const colors = product.colors ?? [];

  const [selectedSize, setSelectedSize] = useState<string | undefined>(sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(colors[0]);

  const needsSize = sizes.length > 0 && !selectedSize;
  const needsColor = colors.length > 0 && !selectedColor;
  const canAdd = !needsSize && !needsColor && (product.stockQuantity === null || product.stockQuantity > 0);

  const handleAdd = () => {
    if (!canAdd) return;
    addItem(product.id, 1, selectedSize, selectedColor);
    router.push('/cart');
  };

  return (
    <aside className="product-actions-card">
      <div className="product-price-block">
        <p className="eyebrow">Price</p>
        <p className="product-price-large">{formatPrice(product.priceCents, product.currency)}</p>
      </div>

      {sizes.length > 0 && (
        <div className="variant-picker">
          <p className="eyebrow">Size</p>
          <div className="variant-options">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={`variant-pill ${selectedSize === size ? 'variant-pill-active' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div className="variant-picker">
          <p className="eyebrow">Colour</p>
          <div className="variant-options">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`variant-pill ${selectedColor === color ? 'variant-pill-active' : ''}`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="product-availability">
        <p className="eyebrow">Availability</p>
        <p>{product.stockQuantity === null ? 'In stock' : `${product.stockQuantity} available`}</p>
      </div>

      <button className="button button-primary" onClick={handleAdd} disabled={!canAdd}>
        Add to cart
      </button>

      <p className="product-detail-note">
        Add this item to your cart, then review your order before checkout.
      </p>
    </aside>
  );
}
