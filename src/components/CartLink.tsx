'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export function CartLink() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" className="cart-link" aria-label={`Корзина, ${totalItems} товаров`}>
      <ShoppingCart size={18} />
      {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
    </Link>
  );
}
