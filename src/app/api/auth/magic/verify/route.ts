import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import {
  findOrCreateCustomerByEmail,
  hashMagicToken,
  issueCustomerToken,
  setCustomerCookie,
} from '@/lib/customer-auth';

function getBaseUrl(req: NextRequest): string {
  const origin = req.nextUrl?.origin;
  if (origin) return origin;
  if (process.env.NEXT_PUBLIC_SERVER_URL) return process.env.NEXT_PUBLIC_SERVER_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export async function GET(req: NextRequest) {
  const baseUrl = getBaseUrl(req);
  const rawToken = req.nextUrl.searchParams.get('token');

  const fail = () => NextResponse.redirect(new URL('/login?error=magic', baseUrl));

  if (!rawToken) {
    return fail();
  }

  try {
    const payload = await getPayload({ config });
    const tokenHash = hashMagicToken(rawToken);

    const found = await payload.find({
      collection: 'magic-tokens',
      where: { tokenHash: { equals: tokenHash } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    const record = found.docs[0];
    if (!record) {
      return fail();
    }

    // One-time: reject if already consumed.
    if (record.usedAt) {
      return fail();
    }

    // Expiry check.
    if (!record.expiresAt || new Date(record.expiresAt).getTime() <= Date.now()) {
      return fail();
    }

    // Mark used immediately (one-time guarantee).
    await payload.update({
      collection: 'magic-tokens',
      id: record.id,
      data: { usedAt: new Date().toISOString() },
      overrideAccess: true,
    });

    // Email is verified because the user controls the inbox the link arrived in.
    const customer = await findOrCreateCustomerByEmail(payload, record.email);
    const token = await issueCustomerToken(customer);

    // Redirect to root; middleware prepends the locale prefix.
    const response = NextResponse.redirect(new URL('/', baseUrl));
    setCustomerCookie(response, token);
    return response;
  } catch (err) {
    console.error('[magic/verify] Error verifying magic link:', err);
    return fail();
  }
}
