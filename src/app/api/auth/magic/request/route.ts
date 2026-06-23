import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { hashMagicToken } from '@/lib/customer-auth';

const MAGIC_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

function getBaseUrl(req: NextRequest): string {
  const origin = req.nextUrl?.origin;
  if (origin) return origin;
  if (process.env.NEXT_PUBLIC_SERVER_URL) return process.env.NEXT_PUBLIC_SERVER_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export async function POST(req: NextRequest) {
  let email: unknown;
  try {
    ({ email } = await req.json());
  } catch {
    // Malformed body — still respond generically (no enumeration signal).
    return NextResponse.json({ ok: true });
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    // Invalid input: do not reveal anything, just succeed silently.
    return NextResponse.json({ ok: true });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const payload = await getPayload({ config });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashMagicToken(rawToken);
    const expiresAt = new Date(Date.now() + MAGIC_TOKEN_TTL_MS);

    await payload.create({
      collection: 'magic-tokens',
      data: {
        email: normalizedEmail,
        tokenHash,
        expiresAt: expiresAt.toISOString(),
      },
      overrideAccess: true,
    });

    const baseUrl = getBaseUrl(req);
    const link = `${baseUrl}/api/auth/magic/verify?token=${rawToken}`;

    await payload.sendEmail({
      to: normalizedEmail,
      subject: 'Ваша ссылка для входа',
      html: `
        <p>Нажмите на ссылку ниже, чтобы войти. Ссылка действительна 15 минут.</p>
        <p><a href="${link}">Войти</a></p>
        <p>Если вы не запрашивали вход, проигнорируйте это письмо.</p>
      `,
    });
  } catch (err) {
    // Swallow into the generic 200 (no account enumeration) but log it.
    console.error('[magic/request] Error issuing magic link:', err);
  }

  // ALWAYS 200 regardless of whether the email exists.
  return NextResponse.json({ ok: true });
}
