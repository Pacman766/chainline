import * as arctic from 'arctic';
import type { NextRequest } from 'next/server';
import type { Payload } from 'payload';
import type { Customer } from '@/payload-types';
import { findOrCreateCustomerByEmail } from '@/lib/customer-auth';

/** Short-lived cookies that carry the CSRF state and PKCE verifier across the redirect. */
export const OAUTH_STATE_COOKIE = 'oauth_state';
export const OAUTH_VERIFIER_COOKIE = 'oauth_code_verifier';

/**
 * Resolve the externally-reachable base URL. Same precedence as the magic-link
 * routes so redirect URIs stay consistent across auth flows.
 */
export function getBaseUrl(req: NextRequest): string {
  const origin = req.nextUrl?.origin;
  if (origin) return origin;
  if (process.env.NEXT_PUBLIC_SERVER_URL) return process.env.NEXT_PUBLIC_SERVER_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

/** Build a Google client bound to this request's callback URL. */
export function getGoogleClient(req: NextRequest): arctic.Google {
  const baseUrl = getBaseUrl(req);
  return new arctic.Google(
    requireEnv('GOOGLE_CLIENT_ID'),
    requireEnv('GOOGLE_CLIENT_SECRET'),
    `${baseUrl}/api/auth/oauth/google/callback`,
  );
}

/** Build a Yandex client bound to this request's callback URL. */
export function getYandexClient(req: NextRequest): arctic.Yandex {
  const baseUrl = getBaseUrl(req);
  return new arctic.Yandex(
    requireEnv('YANDEX_CLIENT_ID'),
    requireEnv('YANDEX_CLIENT_SECRET'),
    `${baseUrl}/api/auth/oauth/yandex/callback`,
  );
}

/** Raised when a provider could not assert a verified email — linking is refused (see ADR 0001). */
export class OAuthEmailNotVerifiedError extends Error {}

/**
 * Link an OAuth identity to a customer, keyed on the verified email. Linking is
 * only permitted when the provider asserts the email is verified; otherwise we
 * refuse rather than risk account takeover via an unverified address.
 */
export async function linkVerifiedCustomer(
  payload: Payload,
  {
    email,
    emailVerified,
    profile,
  }: {
    email?: string;
    emailVerified: boolean;
    profile?: { firstName?: string; lastName?: string };
  },
): Promise<Customer> {
  if (!emailVerified || !email) {
    throw new OAuthEmailNotVerifiedError('OAuth provider did not assert a verified email');
  }
  return findOrCreateCustomerByEmail(payload, email, profile);
}
