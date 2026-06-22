'use client';

import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types/cart';
import { Trash2, ShoppingCart, Minus, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CartPage() {
  const { totalPrice, items, removeItem, clearCart, increment, decrement } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const t = useTranslations('cart');

  async function submitOrder(items: CartItem[]) {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (res.status === 401) {
        toast.error(t('errorLoginRequired'));
        setIsCheckingOut(false);
        return;
      }
      if (!res.ok) {
        toast.error(t('errorCheckout'));
        setIsCheckingOut(false);
        return;
      }
      const data = (await res.json()) as { checkoutUrl?: string; orderId?: number };
      if (!data.checkoutUrl) {
        toast.error(t('errorNoCheckoutUrl'));
        setIsCheckingOut(false);
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      toast.error(t('errorNetwork'));
      setIsCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingCart className="cart-empty__icon" size={72} strokeWidth={1} />
        <h1 className="cart-empty__title">{t('emptyTitle')}</h1>
        <p className="cart-empty__sub">{t('emptySub')}</p>
        <Link href="/products" className="cta-primary" style={{ marginTop: 8 }}>
          {t('toCatalog')} <ArrowRight size={16} />
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
            <p className="catalog-eyebrow">{t('eyebrow')}</p>
            <h1 className="catalog-title">{t('title')}</h1>
          </div>
        </div>

        <div className="cart-items-list">
          {items.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item__info">
                <p className="cart-item__name">{item.name}</p>
                <p className="cart-item__unit-price">
                  {Intl.NumberFormat('ru-RU').format(item.price)} ₽ {t('perUnit')}
                </p>
                <div className="cart-item__qty">
                  <button
                    className="qty-btn"
                    onClick={() => decrement(item.productId)}
                    aria-label={t('decrease')}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="qty-val">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => increment(item.productId)}
                    aria-label={t('increase')}
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
                aria-label={t('remove')}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-summary-col">
        <p className="summary-label">{t('summaryLabel')}</p>
        <div className="summary-lines">
          <div className="summary-line">
            <span className="summary-line__label">{t('positions')}</span>
            <span className="summary-line__val">{items.length}</span>
          </div>
          <div className="summary-line">
            <span className="summary-line__label">{t('products')}</span>
            <span className="summary-line__val">{t('pcs', { count: itemCount })}</span>
          </div>
        </div>
        <div className="summary-divider" />
        <p className="summary-total-label">{t('orderTotal')}</p>
        <p className="summary-total-val">{Intl.NumberFormat('ru-RU').format(totalPrice)} ₽</p>
        <button
          className="summary-checkout"
          onClick={() => submitOrder(items)}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? t('redirecting') : t('checkout')}
        </button>
        <button className="summary-clear" onClick={() => clearCart()} disabled={isCheckingOut}>
          {t('clear')}
        </button>
      </div>
    </div>
  );
}
