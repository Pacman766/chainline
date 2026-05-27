'use client';

import { useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function ClearCartOnPaid() {
  const { initialized, clearCart } = useCart();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (initialized && !clearedRef.current) {
      clearedRef.current = true;
      clearCart();
    }
  }, [initialized, clearCart]);

  return null;
}
