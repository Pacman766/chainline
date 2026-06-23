import crypto from 'crypto';
import { SignJWT } from 'jose';
import type { NextResponse } from 'next/server';
import type { Payload } from 'payload';
import type { Customer } from '@/payload-types';

/**
 * Session token TTL in seconds (7 days). Mirrors the `tokenExpiration`
 * configured on the `customers` collection so a token we mint here and a
 * token Payload mints on password login behave identically.
 */
export const CUSTOMER_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

export const CUSTOMER_TOKEN_COOKIE = 'customer-token';

/**
 * Derive the JWT signing secret the same way Payload does internally
 * (see payload/dist/index.js: `crypto.createHash('sha256').update(secret).digest('hex').slice(0, 32)`).
 * Signing with the raw PAYLOAD_SECRET would produce a token Payload rejects.
 */
function getSigningSecret(): Uint8Array {
  const raw = process.env.PAYLOAD_SECRET;
  if (!raw) {
    throw new Error('PAYLOAD_SECRET is not set');
  }
  const derived = crypto.createHash('sha256').update(raw).digest('hex').slice(0, 32);
  return new TextEncoder().encode(derived);
}

/**
 * Find a customer by email, or create one if none exists. Identity key is the
 * verified email (single source of truth — see ADR 0001). Idempotent: the same
 * email always resolves to the same customer, never a duplicate.
 *
 * A random throwaway password is set on create so the auth-enabled collection
 * is satisfied; it is never returned or reused (sign-in happens via token).
 */
export async function findOrCreateCustomerByEmail(
  payload: Payload,
  email: string,
  profile?: { firstName?: string; lastName?: string },
): Promise<Customer> {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await payload.find({
    collection: 'customers',
    where: { email: { equals: normalizedEmail } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (existing.docs.length > 0) {
    return existing.docs[0] as Customer;
  }

  const created = await payload.create({
    collection: 'customers',
    data: {
      email: normalizedEmail,
      password: crypto.randomBytes(32).toString('hex'),
      ...(profile?.firstName ? { firstName: profile.firstName } : {}),
      ...(profile?.lastName ? { lastName: profile.lastName } : {}),
    },
    overrideAccess: true,
  });

  return created as Customer;
}

/**
 * Issue a Payload-compatible stateless JWT for a customer. Mirrors Payload's
 * own `jwtSign` (HS256, iat/exp) and the claim shape from `getFieldsToSign`
 * for a sessionless auth collection: `{ id, collection, email }`.
 *
 * Because `customers.auth.useSessions === false`, no `sid` claim is required
 * and `payload.auth` accepts this token as a bearer.
 */
export async function issueCustomerToken(customer: Pick<Customer, 'id' | 'email'>): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);
  const exp = issuedAt + CUSTOMER_TOKEN_TTL_SECONDS;

  return new SignJWT({
    id: customer.id,
    collection: 'customers',
    email: customer.email,
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(issuedAt)
    .setExpirationTime(exp)
    .sign(getSigningSecret());
}

/**
 * Attach the customer-token cookie to a response. httpOnly + sameSite=lax,
 * secure in production. maxAge matches the token TTL.
 */
export function setCustomerCookie(response: NextResponse, token: string): void {
  response.cookies.set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: CUSTOMER_TOKEN_TTL_SECONDS,
  });
}

/** sha256 hex of a raw magic-link token. Only the hash is ever persisted. */
export function hashMagicToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}
