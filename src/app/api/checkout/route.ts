import { getPayload } from 'payload';
import config from '@payload-config';
import { headers as getHeaders, cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { CartItem } from '@/types/cart';

export async function POST(req: Request) {
  const payload = await getPayload({ config });
  const headers = await getHeaders();
  const cookieStore = await cookies();

  const customerToken = cookieStore.get('customer-token')?.value;
  let user: Awaited<ReturnType<typeof payload.auth>>['user'] = null;
  if (customerToken) {
    const authHeaders = new Headers(headers);
    authHeaders.set('Authorization', `JWT ${customerToken}`);
    ({ user } = await payload.auth({ headers: authHeaders }));
  } else {
    ({ user } = await payload.auth({ headers }));
  }

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { items } = await req.json();

  try {
    const order = await payload.create({
      collection: 'orders',
      data: {
        items: items.map((item: CartItem) => ({
          product: Number(item.productId),
          quantity: item.quantity,
          price: item.price,
        })),
        customer: user.id,
        total: items.reduce(
          (acc: number, item: { price: number; quantity: number }) =>
            acc + item.price * item.quantity,
          0,
        ),
        status: 'pending',
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error('[checkout] Error creating order:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
