import config from '@payload-config';
import { getPayload } from 'payload';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PackageOpen, ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getAuthenticatedUser } from '@/lib/auth';

const statusConfig: Record<string, { key: string; cls: string }> = {
  pending:   { key: 'status.pending',   cls: 'order-status--pending'   },
  paid:      { key: 'status.paid',      cls: 'order-status--confirmed' },
  shipped:   { key: 'status.shipped',   cls: 'order-status--shipped'   },
  cancelled: { key: 'status.cancelled', cls: 'order-status--cancelled' },
};

export default async function OrdersPage() {
  const payload = await getPayload({ config });
  const t = await getTranslations('orders');
  const user = await getAuthenticatedUser();

  if (!user) redirect('/login');

  const orders = await payload.find({
    collection: 'orders',
    depth: 2,
    sort: '-createdAt',
    overrideAccess: false,
    user,
  });

  if (!orders.docs || orders.docs.length === 0) {
    return (
      <div className="orders-empty">
        <PackageOpen size={72} strokeWidth={1} className="cart-empty__icon" />
        <h1 className="cart-empty__title">{t('emptyTitle')}</h1>
        <p className="cart-empty__sub">{t('emptySub')}</p>
        <Link href="/products" className="cta-primary" style={{ marginTop: 8 }}>
          {t('toCatalog')} <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-shell">
      <div className="orders-header">
        <Link href="/products" className="orders-back">
          <ArrowLeft size={14} />
          {t('backToCatalog')}
        </Link>
        <p className="catalog-eyebrow">{t('eyebrow')}</p>
        <h1 className="catalog-title">{t('title')}</h1>
      </div>

      <div className="orders-list">
        {orders.docs.map((order, i) => {
          const statusEntry = statusConfig[order.status as keyof typeof statusConfig];
          const status = {
            label: statusEntry ? t(statusEntry.key) : order.status,
            cls: statusEntry?.cls ?? 'order-status--pending',
          };

          return (
            <div
              key={order.id}
              className="order-card"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="order-card__head">
                <div>
                  <p className="order-card__id">#{order.id}</p>
                  <p className="order-card__date">
                    {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`order-status ${status.cls}`}>{status.label}</span>
              </div>

              <div className="order-card__body">
                <div className="order-card__items">
                  {order.items?.map(
                    (item) =>
                      typeof item.product === 'object' && (
                        <div key={item.id} className="order-item-row">
                          <span className="order-item-row__name">{item.product?.name}</span>
                          <span className="order-item-row__qty-price">
                            {item.quantity} × {Intl.NumberFormat('ru-RU').format(item.price ?? 0)} ₽
                          </span>
                        </div>
                      ),
                  )}
                </div>
                <div className="order-card__divider" />
                <div className="order-card__total-row">
                  <span className="order-card__total-label">{t('total')}</span>
                  <span className="order-card__total-val">
                    {Intl.NumberFormat('ru-RU').format(order.total ?? 0)} ₽
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
