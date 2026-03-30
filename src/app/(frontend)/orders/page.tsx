import config from '@payload-config';
import { headers as getHeaders } from 'next/headers';
import { getPayload } from 'payload';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, PackageOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'В обработке', variant: 'secondary' },
  confirmed: { label: 'Подтверждён', variant: 'default' },
  shipped: { label: 'В пути', variant: 'default' },
  delivered: { label: 'Доставлен', variant: 'default' },
  cancelled: { label: 'Отменён', variant: 'destructive' },
};

export default async function OrdersPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

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
      <div className="max-w-2xl mx-auto px-6 py-24 flex flex-col items-center gap-4 text-center">
        <PackageOpen className="w-12 h-12 text-muted-foreground" />
        <h1 className="text-2xl font-black tracking-tight">Заказов пока нет</h1>
        <p className="text-muted-foreground">Оформите первый заказ в каталоге</p>
        <Button asChild variant="outline">
          <Link href="/products">Перейти в каталог</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Button asChild variant="ghost" size="sm" className="mb-8 gap-2 -ml-2">
        <Link href="/products">
          <ArrowLeft className="w-4 h-4" />
          Назад к каталогу
        </Link>
      </Button>

      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-orange-600 mb-1">
          История
        </p>
        <h1 className="text-3xl font-black tracking-tight">Мои заказы</h1>
      </div>

      <div className="flex flex-col gap-4">
        {orders.docs.map((order) => {
          const status = statusConfig[order.status as keyof typeof statusConfig] ?? {
            label: order.status,
            variant: 'secondary' as const,
          };

          return (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm font-mono text-muted-foreground">#{order.id}</p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <div className="flex flex-col gap-2 mb-4">
                  {order.items?.map(
                    (item) =>
                      typeof item.product === 'object' && (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">{item.product?.name}</span>
                          <span className="text-muted-foreground shrink-0 ml-4">
                            {item.quantity} × {Intl.NumberFormat('ru-RU').format(item.price)} ₽
                          </span>
                        </div>
                      ),
                  )}
                </div>
                <Separator className="mb-3" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Итого</span>
                  <span className="font-black text-lg">
                    {Intl.NumberFormat('ru-RU').format(order.total)} ₽
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
