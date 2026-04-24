import { CollectionAfterChangeHook } from 'payload';

export const afterChange: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (doc._status !== 'published') return;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revalidate`, {
    method: 'POST',
    headers: {
      'x-revalidate-secret': process.env.REVALIDATE_SECRET ?? '',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[revalidate] failed:', res.status, text);
  }

  console.log(`[Products] ${operation}: ${doc?.name} (id: ${doc?.id})`);
};
