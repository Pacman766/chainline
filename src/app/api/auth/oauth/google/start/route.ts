import { NextRequest, NextResponse } from 'next/server';
import * as arctic from 'arctic';
import {
  getGoogleClient,
  getBaseUrl,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
} from '@/lib/oauth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const baseUrl = getBaseUrl(req);
  const fail = () => NextResponse.redirect(new URL('/login?error=oauth', baseUrl));

  try {
    const state = arctic.generateState();
    const codeVerifier = arctic.generateCodeVerifier();
    const url = getGoogleClient(req).createAuthorizationURL(state, codeVerifier, [
      'openid',
      'email',
      'profile',
    ]);

    const response = NextResponse.redirect(url);
    const cookieOpts = {
      httpOnly: true,
      path: '/',
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600,
    };
    response.cookies.set(OAUTH_STATE_COOKIE, state, cookieOpts);
    response.cookies.set(OAUTH_VERIFIER_COOKIE, codeVerifier, cookieOpts);
    return response;
  } catch (err) {
    console.error('[oauth/google/start] Error starting Google OAuth:', err);
    return fail();
  }
}
