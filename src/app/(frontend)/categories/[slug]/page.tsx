import config from '@payload-config';
import { getPayload } from 'payload';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const payload = await getPayload({ config });
  const { slug } = await params;

  const { docs: categories } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  });

  const withCounts = await Promise.all(
    categories.map(async (cat) => {
      const { totalDocs } = await payload.find({
        collection: 'products',
        where: {
          category: { equals: cat.id },
          _status: { equals: 'published' },
        },
        limit: 0,
      });
      return { ...cat, productCount: totalDocs };
    }),
  );

  return <div></div>;
}
