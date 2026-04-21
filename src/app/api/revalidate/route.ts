import { headers as getHeaders } from 'next/headers';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
  const headers = await getHeaders();

  if (headers.get('x-revalidate-secret') !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidatePath('/products');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
