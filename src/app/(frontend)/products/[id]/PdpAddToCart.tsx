'use client';

import { CartItem } from '@/types/cart';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

export function PdpAddToCart({ product }: { product: CartItem }) {
  const { addItem } = useCart();
  return (
    <button className="pdp-add-btn" onClick={() => addItem(product)}>
      <ShoppingCart size={15} />
      В корзину
    </button>
  );
}
