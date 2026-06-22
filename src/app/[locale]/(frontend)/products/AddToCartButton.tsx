'use client';
import { CartItem } from '@/types/cart';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useTranslations } from 'next-intl';

export function AddToCartButton({ product }: { product: CartItem }) {
  const { addItem } = useCart();
  const t = useTranslations('actions');

  return (
    <Button
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
      }}
    >
      {t('addToCart')}
    </Button>
  );
}
