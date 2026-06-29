import { NextRequest, NextResponse } from 'next/server';
import * as arctic from 'arctic';
import { getPayload } from 'payload';
import config from '@payload-config';
import { issueCustomerToken, setCustomerCookie } from '@/lib/customer-auth';
import {
  getGoogleClient,
  getBaseUrl,
  linkVerifiedCustomer,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
} from '@/lib/oauth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const baseUrl = getBaseUrl(req);
  const fail = () => NextResponse.redirect(new URL('/login?error=oauth', baseUrl));

  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const cookieState = req.cookies.get(OAUTH_STATE_COOKIE)?.value;
  const codeVerifier = req.cookies.get(OAUTH_VERIFIER_COOKIE)?.value;

  if (!code || !state || !cookieState || !codeVerifier || state !== cookieState) {
    return fail();
  }

  try {
    const tokens = await getGoogleClient(req).validateAuthorizationCode(code, codeVerifier);
    const claims = arctic.decodeIdToken(tokens.idToken()) as {
      email?: string;
      email_verified?: boolean;
      given_name?: string;
      family_name?: string;
    };

    const payload = await getPayload({ config });
    const customer = await linkVerifiedCustomer(payload, {
      email: claims.email,
      emailVerified: claims.email_verified === true,
      profile: { firstName: claims.given_name, lastName: claims.family_name },
    });

    const token = await issueCustomerToken(customer);
    const response = NextResponse.redirect(new URL('/', baseUrl));
    setCustomerCookie(response, token);
    response.cookies.delete(OAUTH_STATE_COOKIE);
    response.cookies.delete(OAUTH_VERIFIER_COOKIE);
    return response;
  } catch (err) {
    console.error('[oauth/google/callback] Error completing Google OAuth:', err);
    return fail();
  }
}
