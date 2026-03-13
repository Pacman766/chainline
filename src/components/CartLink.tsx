'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

export function CartLink() {
  const { totalItems } = useCart();

  return (
    <Button asChild variant="ghost" size="sm" className="gap-2">
      <Link href="/cart">
        <ShoppingCart className="w-4 h-4" />
        {totalItems > 0 && (
          <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </Link>
    </Button>
  );
}
