import { NextRequest, NextResponse } from 'next/server';
import * as arctic from 'arctic';
import { getYandexClient, getBaseUrl, OAUTH_STATE_COOKIE } from '@/lib/oauth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const baseUrl = getBaseUrl(req);
  const fail = () => NextResponse.redirect(new URL('/login?error=oauth', baseUrl));

  try {
    // Yandex has no PKCE support, so no code verifier is generated.
    const state = arctic.generateState();
    const url = getYandexClient(req).createAuthorizationURL(state, ['login:email', 'login:info']);

    const response = NextResponse.redirect(url);
    response.cookies.set(OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600,
    });
    return response;
  } catch (err) {
    console.error('[oauth/yandex/start] Error starting Yandex OAuth:', err);
    return fail();
  }
}
