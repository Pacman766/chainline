import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { createOrder, ValidationError } from '@/lib/orders';

export async function POST(req: Request) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { items } = await req.json();

  try {
    const order = await createOrder(items, user.id);
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error('[checkout] Error creating order:', err);
    const status = err instanceof ValidationError ? 400 : 500;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status },
    );
  }
}
