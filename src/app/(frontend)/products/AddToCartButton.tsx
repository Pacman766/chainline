'use client';
import { CartItem } from '@/types/cart';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

export function AddToCartButton({ product }: { product: CartItem }) {
  const { addItem } = useCart();

  return (
    <Button
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
      }}
    >
      В корзину
    </Button>
  );
}
