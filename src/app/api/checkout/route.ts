import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { getAuthenticatedUser } from '@/lib/auth';
import { createOrder, ValidationError } from '@/lib/orders';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { items } = await req.json();

  let order;
  try {
    order = await createOrder(items, user.id);
  } catch (err) {
    console.error('[checkout] Error creating order:', err);
    const status = err instanceof ValidationError ? 400 : 500;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status },
    );
  }

  try {
    const payload = await getPayload({ config });

    const productIds = order.items
      ?.map((item) => (typeof item.product === 'object' ? item.product?.id : item.product))
      .filter((id): id is number => typeof id === 'number') ?? [];

    const productsRes = await payload.find({
      collection: 'products',
      where: { id: { in: productIds } },
      limit: productIds.length,
      depth: 0,
    });

    const productsById = new Map(productsRes.docs.map((p) => [p.id, p]));

    const lineItems = (order.items ?? []).map((item) => {
      const productId =
        typeof item.product === 'object' ? item.product?.id : item.product;
      const product = productId != null ? productsById.get(productId) : undefined;
      const name = product?.name ?? `Product #${productId ?? 'unknown'}`;
      const unitAmount = Math.round((item.price ?? 0) * 100);

      return {
        price_data: {
          currency: 'usd',
          product_data: { name },
          unit_amount: unitAmount,
        },
        quantity: item.quantity ?? 1,
      };
    });

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${baseUrl}/orders/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: { orderId: String(order.id) },
    });

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json(
      { checkoutUrl: session.url, orderId: order.id },
      { status: 201 },
    );
  } catch (err) {
    console.error('[checkout] Error creating Stripe session:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
