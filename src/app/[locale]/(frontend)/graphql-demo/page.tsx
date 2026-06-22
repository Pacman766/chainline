import { getPayload } from 'payload';
import config from '@payload-config';
import { getTranslations } from 'next-intl/server';

export default async function graphqlDemoPage() {
  const t = await getTranslations('graphqlDemo');
  let products: { id: string | number; name: string; price: number; inStock: boolean; category?: { name?: string } | null }[] = [];
  let totalDocs = 0;

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'products',
      limit: 10,
      depth: 1,
    });
    products = result.docs as typeof products;
    totalDocs = result.totalDocs;
  } catch (error) {
    console.error(error);
  }

  if (!products.length) return <div>{t('loadError')}</div>;

  return (
    <div>
      <h1>GraphQL Demo</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price} - {product.inStock ? 'In Stock' : 'Out of Stock'} -{' '}
            {product?.category?.name}
          </li>
        ))}
        {t('totalDocs')} {totalDocs}
      </ul>
    </div>
  );
}
