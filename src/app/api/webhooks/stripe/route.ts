import type Stripe from 'stripe';
import { getPayload } from 'payload';
import config from '@payload-config';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

const jsonOk = () =>
  new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return new Response('Missing signature', { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOKS_SIGNING_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOKS_SIGNING_SECRET is not set');
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  console.log(`[stripe-webhook] received event: ${event.type} ${event.id}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        const payload = await getPayload({ config });

        let orderDoc = (
          await payload.find({
            collection: 'orders',
            where: { stripeSessionId: { equals: session.id } },
            limit: 1,
          })
        ).docs[0];

        if (!orderDoc && session.metadata?.orderId) {
          const fallbackId = Number(session.metadata.orderId);
          if (Number.isFinite(fallbackId)) {
            orderDoc = (
              await payload.find({
                collection: 'orders',
                where: { id: { equals: fallbackId } },
                limit: 1,
              })
            ).docs[0];
          }
        }

        if (!orderDoc) {
          console.warn(
            `[stripe-webhook] no order found for session ${session.id} (metadata.orderId=${session.metadata?.orderId ?? 'none'})`,
          );
          return jsonOk();
        }

        if (orderDoc.status === 'paid') {
          return jsonOk();
        }

        await payload.update({
          collection: 'orders',
          id: orderDoc.id,
          data: { status: 'paid' },
        });

        console.log(`[stripe-webhook] order ${orderDoc.id} → paid`);
      } catch (err) {
        console.error('[stripe-webhook] failed to process checkout.session.completed:', err);
        return jsonOk();
      }

      return jsonOk();
    }

    default:
      return jsonOk();
  }
}
