import { headers as getHeaders } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const headers = await getHeaders();

  if (headers.get('x-revalidate-secret') !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await req.json().catch(() => ({ id: undefined }));

  revalidatePath('/products');
  revalidateTag('products');
  if (id != null) {
    revalidateTag(`product-${id}`);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
