import { CollectionAfterChangeHook } from 'payload';

export const afterChange: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (doc._status !== 'published') return;

  // Bulk/seed operations run without a web server — skip per-doc revalidation.
  if (req.context?.isSeeding) return;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

  // Revalidation is a best-effort side effect — never let it fail the publish.
  try {
    const res = await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'x-revalidate-secret': process.env.REVALIDATE_SECRET ?? '',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ id: doc.id }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[revalidate] failed:', res.status, text);
    }
  } catch (err) {
    console.error('[revalidate] error:', err);
  }

  console.log(`[Products] ${operation}: ${doc?.name} (id: ${doc?.id})`);
};
