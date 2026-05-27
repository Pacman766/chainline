import config from '@payload-config';
import { getPayload } from 'payload';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAuthenticatedUser } from '@/lib/auth';
import ClearCartOnPaid from './ClearCartOnPaid';

const statusConfig: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'В обработке', cls: 'order-status--pending'   },
  paid:      { label: 'Оплачен',     cls: 'order-status--confirmed' },
  shipped:   { label: 'В пути',      cls: 'order-status--shipped'   },
  cancelled: { label: 'Отменён',     cls: 'order-status--cancelled' },
};

export default async function OrderDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { id } = await params;
  const { session_id } = await searchParams;

  const numericId = Number(id);
  if (!Number.isFinite(numericId) || numericId <= 0) notFound();

  const user = await getAuthenticatedUser();
  if (!user) redirect('/login');

  const payload = await getPayload({ config });

  try {
    const order = await payload.findByID({
      collection: 'orders',
      id: numericId,
      depth: 2,
      overrideAccess: false,
      user,
    });

    const status = statusConfig[order.status as keyof typeof statusConfig] ?? {
      label: order.status,
      cls: 'order-status--pending',
    };

    const showPaidBanner = Boolean(session_id) && order.status === 'paid';
    const showPendingBanner = Boolean(session_id) && order.status === 'pending';

    return (
      <div className="orders-shell">
        <div className="orders-header">
          <Link href="/orders" className="orders-back">
            <ArrowLeft size={14} />
            Назад к заказам
          </Link>
          <p className="catalog-eyebrow">Заказ</p>
          <h1 className="catalog-title">#{order.id}</h1>
        </div>

        <div className="orders-list">
          {showPaidBanner && (
            <>
              <ClearCartOnPaid />
              <div className="order-paid-banner">Оплата прошла успешно</div>
            </>
          )}
          {showPendingBanner && (
            <div className="order-pending-banner">
              Платёж обрабатывается… Если статус не обновится в течение минуты — обновите страницу.
            </div>
          )}

          <div className="order-card">
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
                    typeof item.product === 'object' &&
                    item.product !== null && (
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
                <span className="order-card__total-label">Итого</span>
                <span className="order-card__total-val">
                  {Intl.NumberFormat('ru-RU').format(order.total ?? 0)} ₽
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
