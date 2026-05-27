// IMPORTANT: set env vars BEFORE any import that triggers src/lib/stripe.ts
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';
process.env.STRIPE_WEBHOOKS_SIGNING_SECRET =
  process.env.STRIPE_WEBHOOKS_SIGNING_SECRET || 'whsec_test_dummy';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { getPayload, Payload } from 'payload';
import config from '@payload-config';

// Partial mock of @/lib/stripe: real webhooks API (for signature verification),
// stubbed checkout.sessions.create (so no network calls).
vi.mock('@/lib/stripe', async () => {
  const StripeModule = await vi.importActual<typeof import('stripe')>('stripe');
  const Stripe = StripeModule.default;
  const real = new Stripe('sk_test_dummy');
  return {
    stripe: {
      webhooks: real.webhooks,
      checkout: {
        sessions: {
          create: vi.fn(async () => ({ id: 'cs_test_mock', url: 'https://stripe.test/mock' })),
        },
      },
    },
  };
});

import { createOrder, ValidationError } from '@/lib/orders';
import { stripe } from '@/lib/stripe';

let payload: Payload;

// ---------------------------------------------------------------------------
// describe: createOrder
// ---------------------------------------------------------------------------

describe('createOrder', () => {
  const customerEmail = 'harness-test@stripe.dev';
  let customerId: number;
  let productAId: number;
  let productBId: number;

  beforeAll(async () => {
    payload = await getPayload({ config });

    // Clean any leftover fixtures from previous runs
    await payload.delete({
      collection: 'customers',
      where: { email: { equals: customerEmail } },
    });
    await payload.delete({
      collection: 'products',
      where: { name: { in: ['Test Bike A', 'Test Bike B'] } },
    });

    const customer = await payload.create({
      collection: 'customers',
      data: {
        email: customerEmail,
        password: 'test-password-123',
      },
    });
    customerId = customer.id;

    const productA = await payload.create({
      collection: 'products',
      data: { name: 'Test Bike A', price: 100 },
      context: { isSeeding: true },
    });
    productAId = productA.id;

    const productB = await payload.create({
      collection: 'products',
      data: { name: 'Test Bike B', price: 250 },
      context: { isSeeding: true },
    });
    productBId = productB.id;
  });

  afterAll(async () => {
    // Delete orders created by this suite
    await payload.delete({
      collection: 'orders',
      where: { customer: { equals: customerId } },
    });
    await payload.delete({
      collection: 'products',
      where: { id: { in: [productAId, productBId] } },
    });
    await payload.delete({
      collection: 'customers',
      where: { id: { equals: customerId } },
    });
  });

  it('creates an order with status=pending and total computed server-side', async () => {
    const order = await createOrder(
      [
        { productId: productAId, quantity: 2 },
        { productId: productBId, quantity: 1 },
      ],
      customerId,
    );

    expect(order.id).toBeDefined();
    expect(order.status).toBe('pending');
    expect(order.total).toBe(450);
    expect(order.items).toHaveLength(2);
  });

  it('coerces string productId to number (regression for d7fca89)', async () => {
    const order = await createOrder(
      [{ productId: String(productAId), quantity: 1 }],
      customerId,
    );

    expect(order.id).toBeDefined();
    expect(order.total).toBe(100);
  });

  it('throws ValidationError for empty items array', async () => {
    await expect(createOrder([], customerId)).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError for null items', async () => {
    await expect(
      createOrder(null as unknown as Parameters<typeof createOrder>[0], customerId),
    ).rejects.toThrow(ValidationError);
  });

  it('throws ValidationError for non-existent productId', async () => {
    await expect(
      createOrder([{ productId: 99999999, quantity: 1 }], customerId),
    ).rejects.toThrow(ValidationError);
  });

  it.each([
    { quantity: 0, label: 'zero' },
    { quantity: -1, label: 'negative' },
    { quantity: 1.5, label: 'non-integer' },
  ])('throws ValidationError for invalid quantity ($label)', async ({ quantity }) => {
    await expect(
      createOrder([{ productId: productAId, quantity }], customerId),
    ).rejects.toThrow(ValidationError);
  });
});

// ---------------------------------------------------------------------------
// describe: POST /api/webhooks/stripe
// ---------------------------------------------------------------------------

describe('POST /api/webhooks/stripe', () => {
  const customerEmail = 'webhook-test@stripe.dev';
  let customerId: number;
  let productId: number;
  let orderPrimaryId: number;
  let orderFallbackId: number;

  const PRIMARY_SESSION_ID = 'cs_test_int_primary';

  beforeAll(async () => {
    payload = await getPayload({ config });

    // Clean leftovers
    await payload.delete({
      collection: 'customers',
      where: { email: { equals: customerEmail } },
    });
    await payload.delete({
      collection: 'products',
      where: { name: { equals: 'Webhook Test Product' } },
    });

    const customer = await payload.create({
      collection: 'customers',
      data: { email: customerEmail, password: 'test-password-123' },
    });
    customerId = customer.id;

    const product = await payload.create({
      collection: 'products',
      data: { name: 'Webhook Test Product', price: 50 },
      context: { isSeeding: true },
    });
    productId = product.id;

    const orderPrimary = await payload.create({
      collection: 'orders',
      data: {
        customer: customerId,
        items: [{ product: productId, quantity: 1, price: 50 }],
        total: 50,
        status: 'pending',
        stripeSessionId: PRIMARY_SESSION_ID,
      },
    });
    orderPrimaryId = orderPrimary.id;

    const orderFallback = await payload.create({
      collection: 'orders',
      data: {
        customer: customerId,
        items: [{ product: productId, quantity: 2, price: 50 }],
        total: 100,
        status: 'pending',
        // no stripeSessionId — webhook must fall back to metadata.orderId
      },
    });
    orderFallbackId = orderFallback.id;
  });

  afterAll(async () => {
    await payload.delete({
      collection: 'orders',
      where: { customer: { equals: customerId } },
    });
    await payload.delete({
      collection: 'products',
      where: { id: { equals: productId } },
    });
    await payload.delete({
      collection: 'customers',
      where: { id: { equals: customerId } },
    });
  });

  function signedRequest(eventPayload: object): Request {
    const body = JSON.stringify(eventPayload);
    const sig = stripe.webhooks.generateTestHeaderString({
      payload: body,
      secret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
    });
    return new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body,
      headers: { 'stripe-signature': sig, 'content-type': 'application/json' },
    });
  }

  it('returns 400 when stripe-signature header is missing', async () => {
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const req = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when stripe-signature is invalid', async () => {
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const req = new Request('http://localhost/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({ id: 'evt_bad', type: 'checkout.session.completed' }),
      headers: { 'stripe-signature': 'invalid', 'content-type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('flips order status to paid via stripeSessionId lookup', async () => {
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const req = signedRequest({
      id: 'evt_test_primary',
      type: 'checkout.session.completed',
      data: { object: { id: PRIMARY_SESSION_ID, metadata: {} } },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const updated = await payload.findByID({
      collection: 'orders',
      id: orderPrimaryId,
    });
    expect(updated.status).toBe('paid');
  });

  it('falls back to metadata.orderId when stripeSessionId not found', async () => {
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const req = signedRequest({
      id: 'evt_test_fallback',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_unknown_id',
          metadata: { orderId: String(orderFallbackId) },
        },
      },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const updated = await payload.findByID({
      collection: 'orders',
      id: orderFallbackId,
    });
    expect(updated.status).toBe('paid');
  });

  it('is idempotent on re-delivery of the same event', async () => {
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const eventPayload = {
      id: 'evt_test_idempotent',
      type: 'checkout.session.completed',
      data: { object: { id: PRIMARY_SESSION_ID, metadata: {} } },
    };

    const res1 = await POST(signedRequest(eventPayload));
    expect(res1.status).toBe(200);

    const res2 = await POST(signedRequest(eventPayload));
    expect(res2.status).toBe(200);

    const order = await payload.findByID({
      collection: 'orders',
      id: orderPrimaryId,
    });
    expect(order.status).toBe('paid');
  });

  it('returns 200 with no DB mutation for unknown event types', async () => {
    const { POST } = await import('@/app/api/webhooks/stripe/route');

    // Snapshot fallback order status before — it should remain 'paid' from prior test
    const before = await payload.findByID({
      collection: 'orders',
      id: orderFallbackId,
    });
    const beforeStatus = before.status;

    const req = signedRequest({
      id: 'evt_test_unknown',
      type: 'payment_intent.created',
      data: { object: { id: 'pi_test_123' } },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const after = await payload.findByID({
      collection: 'orders',
      id: orderFallbackId,
    });
    expect(after.status).toBe(beforeStatus);
  });
});

// ---------------------------------------------------------------------------
// describe: POST /api/checkout — auth gate only
// ---------------------------------------------------------------------------

vi.mock('@/lib/auth', () => ({
  getAuthenticatedUser: vi.fn(async () => null),
}));

describe('POST /api/checkout', () => {
  it('returns 401 when user is not authenticated', async () => {
    const { POST } = await import('@/app/api/checkout/route');
    const req = new Request('http://localhost/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ items: [{ productId: 1, quantity: 1 }] }),
      headers: { 'content-type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
