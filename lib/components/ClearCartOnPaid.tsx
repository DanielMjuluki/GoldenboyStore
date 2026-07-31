'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '@/lib/components/CartContext';

/**
 * Fire-and-forget client component: clears the local cart once we've
 * confirmed payment succeeded. Rendered from the (server-rendered)
 * checkout success page, which can't touch localStorage/cart state itself.
 */
export default function ClearCartOnPaid() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
