import 'dotenv/config';
import { getPayload } from 'payload';
import config from '../payload.config';
import { products, buildDescription } from '../seed-data';

// Backfills the `description` richText field on products that already exist in
// the DB, matched by exact name. Idempotent — safe to re-run.
// Run: npx tsx src/scripts/update-descriptions.ts
async function run() {
  const payload = await getPayload({ config });

  let updated = 0;
  for (const product of products) {
    const { docs } = await payload.find({
      collection: 'products',
      where: { name: { equals: product.name } },
      limit: 1,
      overrideAccess: true,
    });

    const existing = docs[0];
    if (!existing) {
      console.warn(`Skip (not found): ${product.name}`);
      continue;
    }

    await payload.update({
      collection: 'products',
      id: existing.id,
      data: {
        description: buildDescription(product.description),
        _status: 'published',
      },
      draft: false,
      overrideAccess: true,
      context: { isSeeding: true },
    });
    console.log(`Updated: ${product.name}`);
    updated++;
  }

  console.log(`Done. ${updated}/${products.length} products updated.`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
