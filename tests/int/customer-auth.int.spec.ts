import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { getPayload, Payload } from 'payload';
import config from '@payload-config';

import {
  findOrCreateCustomerByEmail,
  hashMagicToken,
  issueCustomerToken,
} from '@/lib/customer-auth';

let payload: Payload;

/**
 * Round-trip a token through payload.auth the same way getAuthenticatedUser
 * does (Authorization: JWT <token>). Returns the authenticated user (or null).
 */
async function authWithToken(token: string) {
  const headers = new Headers();
  headers.set('Authorization', `JWT ${token}`);
  const { user } = await payload.auth({ headers });
  return user;
}

describe('customer-auth seam', () => {
  const emailA = 'magic-a@chainline.test';
  const emailB = 'magic-mixedcase@chainline.test';

  beforeAll(async () => {
    payload = await getPayload({ config });

    await payload.delete({
      collection: 'customers',
      where: { email: { in: [emailA, emailB] } },
    });
    await payload.delete({
      collection: 'magic-tokens',
      where: { email: { in: [emailA, emailB] } },
    });
  });

  afterAll(async () => {
    await payload.delete({
      collection: 'customers',
      where: { email: { in: [emailA, emailB] } },
    });
    await payload.delete({
      collection: 'magic-tokens',
      where: { email: { in: [emailA, emailB] } },
    });
  });

  // -------------------------------------------------------------------------
  // findOrCreateCustomerByEmail — idempotent
  // -------------------------------------------------------------------------

  it('findOrCreateCustomerByEmail creates once and is idempotent', async () => {
    const first = await findOrCreateCustomerByEmail(payload, emailA);
    expect(first.id).toBeDefined();
    expect(first.email).toBe(emailA);

    const second = await findOrCreateCustomerByEmail(payload, emailA);
    expect(second.id).toBe(first.id);

    const all = await payload.find({
      collection: 'customers',
      where: { email: { equals: emailA } },
      overrideAccess: true,
    });
    expect(all.totalDocs).toBe(1);
  });

  it('normalizes email so case variants resolve to one customer', async () => {
    const lower = await findOrCreateCustomerByEmail(payload, emailB);
    const upper = await findOrCreateCustomerByEmail(payload, emailB.toUpperCase());
    expect(upper.id).toBe(lower.id);
  });

  // -------------------------------------------------------------------------
  // issueCustomerToken — authenticates via payload.auth
  // -------------------------------------------------------------------------

  it('issueCustomerToken produces a token that authenticates as the customer', async () => {
    const customer = await findOrCreateCustomerByEmail(payload, emailA);
    const token = await issueCustomerToken(customer);

    const user = await authWithToken(token);
    expect(user).not.toBeNull();
    expect(user?.id).toBe(customer.id);
    expect(user?.collection).toBe('customers');
    expect(user?.email).toBe(emailA);
  });
});

// ---------------------------------------------------------------------------
// magic-token lifecycle
// ---------------------------------------------------------------------------

describe('magic-token lifecycle', () => {
  const email = 'magic-lifecycle@chainline.test';

  beforeAll(async () => {
    payload = await getPayload({ config });
    await payload.delete({
      collection: 'magic-tokens',
      where: { email: { equals: email } },
    });
    await payload.delete({
      collection: 'customers',
      where: { email: { equals: email } },
    });
  });

  afterAll(async () => {
    await payload.delete({
      collection: 'magic-tokens',
      where: { email: { equals: email } },
    });
    await payload.delete({
      collection: 'customers',
      where: { email: { equals: email } },
    });
  });

  async function createToken(raw: string, opts: { expiresAt: Date; usedAt?: Date }) {
    return payload.create({
      collection: 'magic-tokens',
      data: {
        email,
        tokenHash: hashMagicToken(raw),
        expiresAt: opts.expiresAt.toISOString(),
        ...(opts.usedAt ? { usedAt: opts.usedAt.toISOString() } : {}),
      },
      overrideAccess: true,
    });
  }

  /** Replicates the verify-route validation against a stored token. */
  async function lookupValid(raw: string) {
    const found = await payload.find({
      collection: 'magic-tokens',
      where: { tokenHash: { equals: hashMagicToken(raw) } },
      limit: 1,
      overrideAccess: true,
    });
    const record = found.docs[0];
    if (!record) return { ok: false as const, reason: 'missing' };
    if (record.usedAt) return { ok: false as const, reason: 'used' };
    if (!record.expiresAt || new Date(record.expiresAt).getTime() <= Date.now()) {
      return { ok: false as const, reason: 'expired' };
    }
    return { ok: true as const, record };
  }

  it('rejects an expired token', async () => {
    const raw = 'expired-raw-token';
    await createToken(raw, { expiresAt: new Date(Date.now() - 60_000) });
    const result = await lookupValid(raw);
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toBe('expired');
  });

  it('rejects an already-used token', async () => {
    const raw = 'used-raw-token';
    await createToken(raw, {
      expiresAt: new Date(Date.now() + 60_000),
      usedAt: new Date(),
    });
    const result = await lookupValid(raw);
    expect(result.ok).toBe(false);
    expect(result.ok === false && result.reason).toBe('used');
  });

  it('accepts a fresh token once, then rejects on reuse after marking used', async () => {
    const raw = 'fresh-raw-token';
    await createToken(raw, { expiresAt: new Date(Date.now() + 60_000) });

    const first = await lookupValid(raw);
    expect(first.ok).toBe(true);

    // Consume it (mirrors verify route).
    if (first.ok) {
      await payload.update({
        collection: 'magic-tokens',
        id: first.record.id,
        data: { usedAt: new Date().toISOString() },
        overrideAccess: true,
      });

      // The verified email mints a customer + an authenticating token.
      const customer = await findOrCreateCustomerByEmail(payload, email);
      const token = await issueCustomerToken(customer);
      const headers = new Headers();
      headers.set('Authorization', `JWT ${token}`);
      const { user } = await payload.auth({ headers });
      expect(user?.id).toBe(customer.id);
    }

    const second = await lookupValid(raw);
    expect(second.ok).toBe(false);
    expect(second.ok === false && second.reason).toBe('used');
  });
});

// ---------------------------------------------------------------------------
// existing email/password login still works (customer-login route logic)
// ---------------------------------------------------------------------------

describe('email/password login still works', () => {
  const email = 'pw-login@chainline.test';
  const password = 'test-password-123';

  beforeAll(async () => {
    payload = await getPayload({ config });
    await payload.delete({
      collection: 'customers',
      where: { email: { equals: email } },
    });
    await payload.create({
      collection: 'customers',
      data: { email, password },
      overrideAccess: true,
    });
  });

  afterAll(async () => {
    await payload.delete({
      collection: 'customers',
      where: { email: { equals: email } },
    });
  });

  it('payload.login issues a token that authenticates (useSessions:false)', async () => {
    const result = await payload.login({
      collection: 'customers',
      data: { email, password },
    });
    expect(result.token).toBeTruthy();

    const headers = new Headers();
    headers.set('Authorization', `JWT ${result.token}`);
    const { user } = await payload.auth({ headers });
    expect(user?.email).toBe(email);
    expect(user?.collection).toBe('customers');
  });
});
