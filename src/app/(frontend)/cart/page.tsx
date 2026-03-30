'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types/cart';
import { Trash2, ShoppingCart, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CartPage() {
  const { totalPrice, items, removeItem, clearCart, updateQuantity } = useCart();

  async function submitOrder(items: CartItem[]) {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (res.status === 401) {
        toast.error('Необходимо войти в аккаунт');
        return;
      }
      if (!res.ok) {
        toast.error('Ошибка при оформлении заказа.');
        return;
      }
      toast.success('Заказ оформлен!');
      clearCart();
    } catch {
      toast.error('Ошибка сети');
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 flex flex-col items-center gap-4 text-center">
        <ShoppingCart className="w-12 h-12 text-muted-foreground" />
        <h1 className="text-2xl font-black tracking-tight">Корзина пуста</h1>
        <p className="text-muted-foreground">Добавьте товары из каталога</p>
        <Button asChild variant="outline">
          <Link href="/products">Перейти в каталог</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-orange-600 mb-1">
            Покупки
          </p>
          <h1 className="text-3xl font-black tracking-tight">Корзина</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => clearCart()}
        >
          Очистить
        </Button>
      </div>

      <div className="border rounded-lg divide-y">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate mb-1">{item.name}</p>
              <p className="text-sm text-muted-foreground mb-2">
                {Intl.NumberFormat('ru-RU').format(item.price)} ₽ × шт.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center font-black text-lg">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <p className="font-black shrink-0 text-lg">
              {Intl.NumberFormat('ru-RU').format(item.price * item.quantity)} ₽
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 hover:text-destructive"
              onClick={() => removeItem(item.productId)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-semibold">Итого</span>
        <span className="text-2xl font-black tracking-tight">
          {Intl.NumberFormat('ru-RU').format(totalPrice)} ₽
        </span>
      </div>

      <Button className="w-full" size="lg" onClick={() => submitOrder(items)}>
        Оформить заказ
      </Button>
    </div>
  );
}
