import { getPayload } from 'payload';
import config from '@payload-config';

export default async function graphqlDemoPage() {
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

  if (!products.length) return <div>Ошибка загрузки</div>;

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
        {'Всего документов:'} {totalDocs}
      </ul>
    </div>
  );
}
