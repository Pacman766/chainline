'use client';

import { CartItem } from '@/types/cart';
import { useCart } from '@/contexts/CartContext';
import { useTranslations } from 'next-intl';
import { ShoppingCart } from 'lucide-react';

export function PdpAddToCart({ product }: { product: CartItem }) {
  const { addItem } = useCart();
  const t = useTranslations('actions');
  return (
    <button className="pdp-add-btn" onClick={() => addItem(product)}>
      <ShoppingCart size={15} />
      {t('addToCart')}
    </button>
  );
}
