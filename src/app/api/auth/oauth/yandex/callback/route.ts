import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { issueCustomerToken, setCustomerCookie } from '@/lib/customer-auth';
import {
  getYandexClient,
  getBaseUrl,
  linkVerifiedCustomer,
  OAUTH_STATE_COOKIE,
} from '@/lib/oauth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const baseUrl = getBaseUrl(req);
  const fail = () => NextResponse.redirect(new URL('/login?error=oauth', baseUrl));

  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const cookieState = req.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return fail();
  }

  try {
    const tokens = await getYandexClient(req).validateAuthorizationCode(code);

    const res = await fetch('https://login.yandex.ru/info?format=json', {
      headers: { Authorization: `OAuth ${tokens.accessToken()}` },
    });
    if (!res.ok) {
      return fail();
    }
    const info = (await res.json()) as {
      default_email?: string;
      first_name?: string;
      last_name?: string;
    };

    const payload = await getPayload({ config });
    // Yandex only returns default_email with the login:email scope granted, so
    // its presence is treated as proof of a verified address (see ADR 0001).
    const customer = await linkVerifiedCustomer(payload, {
      email: info.default_email,
      emailVerified: Boolean(info.default_email),
      profile: { firstName: info.first_name, lastName: info.last_name },
    });

    const token = await issueCustomerToken(customer);
    const response = NextResponse.redirect(new URL('/', baseUrl));
    setCustomerCookie(response, token);
    response.cookies.delete(OAUTH_STATE_COOKIE);
    return response;
  } catch (err) {
    console.error('[oauth/yandex/callback] Error completing Yandex OAuth:', err);
    return fail();
  }
}
