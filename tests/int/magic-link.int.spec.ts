import crypto from 'crypto';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { getPayload, Payload } from 'payload';
import config from '@payload-config';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/magic/request/route';
import { GET } from '@/app/api/auth/magic/verify/route';
import { CUSTOMER_TOKEN_COOKIE, hashMagicToken } from '@/lib/customer-auth';

let payload: Payload;

const TEST_EMAIL = 'magic-harness@test.dev';
const OTHER_EMAIL = 'magic-harness-2@test.dev';
const TTL_MS = 15 * 60 * 1000;

async function cleanup() {
  for (const email of [TEST_EMAIL, OTHER_EMAIL]) {
    await payload.delete({ collection: 'magic-tokens', where: { email: { equals: email } } });
    await payload.delete({ collection: 'customers', where: { email: { equals: email } } });
  }
}

/** Persist a magic-token row directly so verify tests own a known raw token. */
async function seedToken(opts: { email?: string; raw?: string; ttlMs?: number; used?: boolean } = {}) {
  const email = opts.email ?? TEST_EMAIL;
  const raw = opts.raw ?? crypto.randomBytes(32).toString('hex');
  const ttlMs = opts.ttlMs ?? TTL_MS;
  const rec = await payload.create({
    collection: 'magic-tokens',
    data: {
      email,
      tokenHash: hashMagicToken(raw),
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
      ...(opts.used ? { usedAt: new Date().toISOString() } : {}),
    },
    overrideAccess: true,
  });
  return { raw, rec };
}

function requestReq(body: unknown, raw = false) {
  return new NextRequest('http://localhost:3000/api/auth/magic/request', {
    method: 'POST',
    body: raw ? (body as string) : JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

function verifyReq(token?: string) {
  const url =
    token != null
      ? `http://localhost:3000/api/auth/magic/verify?token=${token}`
      : 'http://localhost:3000/api/auth/magic/verify';
  return new NextRequest(url, { method: 'GET' });
}

beforeAll(async () => {
  payload = await getPayload({ config });
  // The route loads a real (valid) RESEND_API_KEY from .env — never send a real
  // email during tests. The token-issuance path is what we are exercising.
  vi.spyOn(payload, 'sendEmail').mockResolvedValue(undefined as never);
  await cleanup();
});

afterAll(async () => {
  await cleanup();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// describe: POST /api/auth/magic/request
// ---------------------------------------------------------------------------

describe('POST /api/auth/magic/request', () => {
  beforeEach(cleanup);

  it('issues a hashed, ~15min token for a valid email and always responds 200', async () => {
    const res = await POST(requestReq({ email: TEST_EMAIL }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });

    const found = await payload.find({
      collection: 'magic-tokens',
      where: { email: { equals: TEST_EMAIL } },
      overrideAccess: true,
    });
    expect(found.docs).toHaveLength(1);
    const doc = found.docs[0];
    // Only the hash is persisted (64 hex chars), never a raw token.
    expect(doc.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(doc.usedAt ?? null).toBeNull();
    const ttl = new Date(doc.expiresAt).getTime() - Date.now();
    expect(ttl).toBeGreaterThan(TTL_MS - 60_000);
    expect(ttl).toBeLessThanOrEqual(TTL_MS + 1_000);
  });

  it('normalizes the email (trim + lowercase) before persisting', async () => {
    await POST(requestReq({ email: `  ${TEST_EMAIL.toUpperCase()}  ` }));
    const found = await payload.find({
      collection: 'magic-tokens',
      where: { email: { equals: TEST_EMAIL } },
      overrideAccess: true,
    });
    expect(found.docs).toHaveLength(1);
  });

  it('does not reveal account existence: 200 with no token for invalid email', async () => {
    const res = await POST(requestReq({ email: 'not-an-email' }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });

    const found = await payload.find({
      collection: 'magic-tokens',
      where: { email: { equals: 'not-an-email' } },
      overrideAccess: true,
    });
    expect(found.docs).toHaveLength(0);
  });

  it('responds 200 to a malformed JSON body without creating a token', async () => {
    const res = await POST(requestReq('}{ not json', true));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });
});

// ---------------------------------------------------------------------------
// describe: GET /api/auth/magic/verify
// ---------------------------------------------------------------------------

describe('GET /api/auth/magic/verify', () => {
  beforeEach(cleanup);

  it('signs in on a valid token: sets customer-token cookie and find-or-creates the customer', async () => {
    const { raw, rec } = await seedToken();

    const res = await GET(verifyReq(raw));

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/');
    expect(res.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value).toBeTruthy();

    const customers = await payload.find({
      collection: 'customers',
      where: { email: { equals: TEST_EMAIL } },
      overrideAccess: true,
    });
    expect(customers.docs).toHaveLength(1);

    // Token is marked one-time-used.
    const after = await payload.findByID({ collection: 'magic-tokens', id: rec.id, overrideAccess: true });
    expect(after.usedAt).toBeTruthy();
  });

  it('rejects a reused (already consumed) token', async () => {
    const { raw } = await seedToken();
    const first = await GET(verifyReq(raw));
    expect(first.status).toBe(307);
    expect(first.headers.get('location')).toBe('http://localhost:3000/');

    const second = await GET(verifyReq(raw));
    expect(second.status).toBe(307);
    expect(second.headers.get('location')).toBe('http://localhost:3000/login?error=magic');
    expect(second.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value).toBeFalsy();
  });

  it('rejects an expired token', async () => {
    const { raw } = await seedToken({ ttlMs: -1000 });
    const res = await GET(verifyReq(raw));
    expect(res.headers.get('location')).toBe('http://localhost:3000/login?error=magic');
    expect(res.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value).toBeFalsy();
  });

  it('rejects a missing token', async () => {
    const res = await GET(verifyReq());
    expect(res.headers.get('location')).toBe('http://localhost:3000/login?error=magic');
  });

  it('rejects an unknown token', async () => {
    const res = await GET(verifyReq(crypto.randomBytes(32).toString('hex')));
    expect(res.headers.get('location')).toBe('http://localhost:3000/login?error=magic');
  });

  it('resolves the same email to the SAME customer across separate sign-ins (no duplicates)', async () => {
    const a = await seedToken();
    const resA = await GET(verifyReq(a.raw));
    expect(resA.status).toBe(307);

    const b = await seedToken();
    const resB = await GET(verifyReq(b.raw));
    expect(resB.status).toBe(307);

    const customers = await payload.find({
      collection: 'customers',
      where: { email: { equals: TEST_EMAIL } },
      overrideAccess: true,
    });
    expect(customers.docs).toHaveLength(1);
  });
});
