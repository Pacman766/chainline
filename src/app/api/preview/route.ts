import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const id = req.nextUrl.searchParams.get('id');

  if (secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  (await draftMode()).enable();
  redirect(`/products/${id}`);
}
