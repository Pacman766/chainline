import config from '@payload-config';
import { getPayload } from 'payload';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getAuthenticatedUser } from '@/lib/auth';
import ClearCartOnPaid from './ClearCartOnPaid';

const statusConfig: Record<string, { key: string; cls: string }> = {
  pending:   { key: 'status.pending',   cls: 'order-status--pending'   },
  paid:      { key: 'status.paid',      cls: 'order-status--confirmed' },
  shipped:   { key: 'status.shipped',   cls: 'order-status--shipped'   },
  cancelled: { key: 'status.cancelled', cls: 'order-status--cancelled' },
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
  const t = await getTranslations('orders');

  try {
    const order = await payload.findByID({
      collection: 'orders',
      id: numericId,
      depth: 2,
      overrideAccess: false,
      user,
    });

    const statusEntry = statusConfig[order.status as keyof typeof statusConfig];
    const status = {
      label: statusEntry ? t(statusEntry.key) : order.status,
      cls: statusEntry?.cls ?? 'order-status--pending',
    };

    const showPaidBanner = Boolean(session_id) && order.status === 'paid';
    const showPendingBanner = Boolean(session_id) && order.status === 'pending';

    return (
      <div className="orders-shell">
        <div className="orders-header">
          <Link href="/orders" className="orders-back">
            <ArrowLeft size={14} />
            {t('backToOrders')}
          </Link>
          <p className="catalog-eyebrow">{t('detailEyebrow')}</p>
          <h1 className="catalog-title">#{order.id}</h1>
        </div>

        <div className="orders-list">
          {showPaidBanner && (
            <>
              <ClearCartOnPaid />
              <div className="order-paid-banner">{t('paidBanner')}</div>
            </>
          )}
          {showPendingBanner && (
            <div className="order-pending-banner">
              {t('pendingBanner')}
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
                <span className="order-card__total-label">{t('total')}</span>
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
