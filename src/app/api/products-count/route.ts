import config from '@payload-config';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';

export async function GET() {
  const payload = await getPayload({ config });
  const products = await payload.find({
    collection: 'products',
    limit: 0,
  });
  return NextResponse.json({ count: products.totalDocs });
}
