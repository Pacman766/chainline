export default async function graphqlDemoPage() {
  let data;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query { Products(limit: 10) { docs { id name price inStock category {name} } totalDocs } }`,
      }),
    });
    if (res.ok) {
      ({ data } = await res.json());
    } else {
      console.error(await res.text());
    }
  } catch (error) {
    console.error(error);
  }
  if (!data) return <div>Ошибка загрузки</div>;

  return (
    <div>
      <h1>GraphQL Demo</h1>
      <ul>
        {data.Products.docs.map(
          (product: {
            id: string;
            name: string;
            price: number;
            inStock: boolean;
            category: { name: string };
          }) => (
            <li key={product.id}>
              {product.name} - ${product.price} - {product.inStock ? 'In Stock' : 'Out of Stock'} -{' '}
              {product?.category?.name}
            </li>
          ),
        )}
        {'Всего документов:'} {data.Products.totalDocs}
      </ul>
    </div>
  );
}
