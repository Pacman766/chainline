import { CollectionBeforeDeleteHook } from 'payload';

export const beforeDelete: CollectionBeforeDeleteHook = async ({ id, req: { payload } }) => {
  const orders = await payload.find({
    collection: 'orders',
    where: { 'items.product': { equals: id } },
  });
  if (orders.totalDocs > 0) {
    throw new Error('Нельзя удалить товар с активными заказами');
  }

  // Purge the cached PDP for the deleted product (tag-based, via /api/revalidate).
  if (payload.config.serverURL || process.env.NEXT_PUBLIC_API_URL) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'x-revalidate-secret': process.env.REVALIDATE_SECRET ?? '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      console.error('[revalidate] delete failed:', res.status, await res.text());
    }
  }
};
