'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/contexts/CartContext';

export function CartLink() {
  const { totalItems } = useCart();
  const t = useTranslations('common');

  return (
    <Link href="/cart" className="cart-link" aria-label={t('cartAria', { count: totalItems })}>
      <ShoppingCart size={18} />
      {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
    </Link>
  );
}
