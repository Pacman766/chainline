'use client';

import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types/cart';
import { Trash2, ShoppingCart, Minus, Plus, ArrowRight } from 'lucide-react';
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
      <div className="cart-empty">
        <ShoppingCart className="cart-empty__icon" size={72} strokeWidth={1} />
        <h1 className="cart-empty__title">Корзина пуста</h1>
        <p className="cart-empty__sub">Добавьте товары из каталога</p>
        <Link href="/products" className="cta-primary" style={{ marginTop: 8 }}>
          В каталог <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="cart-shell">
      <div className="cart-items-col">
        <div className="cart-page-header">
          <div>
            <p className="catalog-eyebrow">Покупки</p>
            <h1 className="catalog-title">Корзина</h1>
          </div>
        </div>

        <div className="cart-items-list">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item__info">
                <p className="cart-item__name">{item.name}</p>
                <p className="cart-item__unit-price">
                  {Intl.NumberFormat('ru-RU').format(item.price)} ₽ / шт.
                </p>
                <div className="cart-item__qty">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    aria-label="Уменьшить количество"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="qty-val">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    aria-label="Увеличить количество"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <p className="cart-item__price">
                {Intl.NumberFormat('ru-RU').format(item.price * item.quantity)} ₽
              </p>
              <button
                className="cart-item__remove"
                onClick={() => removeItem(item.productId)}
                aria-label="Удалить товар"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-summary-col">
        <p className="summary-label">Итого</p>
        <div className="summary-lines">
          <div className="summary-line">
            <span className="summary-line__label">Позиций</span>
            <span className="summary-line__val">{items.length}</span>
          </div>
          <div className="summary-line">
            <span className="summary-line__label">Товаров</span>
            <span className="summary-line__val">{itemCount} шт.</span>
          </div>
        </div>
        <div className="summary-divider" />
        <p className="summary-total-label">Сумма заказа</p>
        <p className="summary-total-val">{Intl.NumberFormat('ru-RU').format(totalPrice)} ₽</p>
        <button className="summary-checkout" onClick={() => submitOrder(items)}>
          Оформить заказ
        </button>
        <button className="summary-clear" onClick={() => clearCart()}>
          Очистить корзину
        </button>
      </div>
    </div>
  );
}
