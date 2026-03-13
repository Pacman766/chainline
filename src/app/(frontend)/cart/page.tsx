'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types/cart';
import { Trash2, ShoppingCart, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const { totalPrice, items, removeItem, clearCart, updateQuantity } = useCart();

  async function submitOrder(items: CartItem[]) {
    try {
      const res = await fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ items }) });
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
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
        <ShoppingCart className="w-12 h-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Корзина пуста</h1>
        <p className="text-muted-foreground">Добавьте товары на странице каталога</p>
        <Button asChild variant="outline">
          <a href="/products">Перейти в каталог</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Корзина</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => {
            clearCart();
          }}
        >
          Очистить
        </Button>
      </div>

      <div className="border rounded-lg divide-y">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {Intl.NumberFormat('ru-RU').format(item.price)} ₽ ×
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
                <span className="w-8 text-center font-semibold text-lg">{item.quantity}</span>
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
            <p className="font-semibold shrink-0">
              {Intl.NumberFormat('ru-RU').format(item.price * item.quantity)} ₽
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 hover:text-destructive"
              onClick={() => {
                removeItem(item.productId);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-semibold">Итого</span>
        <span className="text-xl font-bold">{Intl.NumberFormat('ru-RU').format(totalPrice)} ₽</span>
      </div>

      <Button className="w-full" size="lg" onClick={() => submitOrder(items)}>
        Оформить заказ
      </Button>
    </div>
  );
}
