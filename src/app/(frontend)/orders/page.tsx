import config from '@payload-config';
import { getPayload } from 'payload';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PackageOpen, ArrowRight } from 'lucide-react';
import { getAuthenticatedUser } from '@/lib/auth';

const statusConfig: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'В обработке', cls: 'order-status--pending'   },
  paid:      { label: 'Оплачен',     cls: 'order-status--confirmed' },
  shipped:   { label: 'В пути',      cls: 'order-status--shipped'   },
  cancelled: { label: 'Отменён',     cls: 'order-status--cancelled' },
};

export default async function OrdersPage() {
  const payload = await getPayload({ config });
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
        <h1 className="cart-empty__title">Заказов пока нет</h1>
        <p className="cart-empty__sub">Оформите первый заказ в каталоге</p>
        <Link href="/products" className="cta-primary" style={{ marginTop: 8 }}>
          В каталог <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-shell">
      <div className="orders-header">
        <Link href="/products" className="orders-back">
          <ArrowLeft size={14} />
          Назад к каталогу
        </Link>
        <p className="catalog-eyebrow">История</p>
        <h1 className="catalog-title">Мои заказы</h1>
      </div>

      <div className="orders-list">
        {orders.docs.map((order, i) => {
          const status = statusConfig[order.status as keyof typeof statusConfig] ?? {
            label: order.status,
            cls: 'order-status--pending',
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
                            {item.quantity} × {Intl.NumberFormat('ru-RU').format(item.price)} ₽
                          </span>
                        </div>
                      ),
                  )}
                </div>
                <div className="order-card__divider" />
                <div className="order-card__total-row">
                  <span className="order-card__total-label">Итого</span>
                  <span className="order-card__total-val">
                    {Intl.NumberFormat('ru-RU').format(order.total)} ₽
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
