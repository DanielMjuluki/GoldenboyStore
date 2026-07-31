'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (productId: string, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'goldenboy_cart_v2';

// Two cart lines are "the same" only if product, size, AND color all match —
// a Medium black tee and a Large black tee are separate lines.
function sameLine(a: CartItem, productId: string, size?: string, color?: string) {
  return a.productId === productId && a.size === size && a.color === color;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart to localStorage', e);
    }
  }, [items]);

  const addItem = (productId: string, quantity = 1, size?: string, color?: string) => {
    setItems((prev) => {
      const existing = prev.find((p) => sameLine(p, productId, size, color));
      if (existing) {
        return prev.map((p) =>
          sameLine(p, productId, size, color) ? { ...p, quantity: p.quantity + quantity } : p
        );
      }
      return [...prev, { productId, quantity, size, color }];
    });
  };

  const removeItem = (productId: string, size?: string, color?: string) => {
    setItems((prev) => prev.filter((p) => !sameLine(p, productId, size, color)));
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) return removeItem(productId, size, color);
    setItems((prev) =>
      prev.map((p) => (sameLine(p, productId, size, color) ? { ...p, quantity } : p))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export default CartContext;
