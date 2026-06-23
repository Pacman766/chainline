import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { setCustomerCookie } from '@/lib/customer-auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const payload = await getPayload({ config });

    const result = await payload.login({
      collection: 'customers',
      data: { email, password },
    });

    if (!result.token) {
      return NextResponse.json({ error: 'Ошибка авторизации' }, { status: 401 });
    }

    const response = NextResponse.json({ user: result.user });
    setCustomerCookie(response, result.token);
    return response;
  } catch {
    return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
  }
}
