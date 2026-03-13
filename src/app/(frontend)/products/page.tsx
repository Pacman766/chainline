import config from '@payload-config';
import { getPayload } from 'payload';
import { headers as getHeaders } from 'next/headers';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductDescription } from './ProductDescription';
import { AddToCartButton } from './AddToCartButton';

export default async function ProductPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

  const filteredProducts = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    sort: '-price',
    ...(user ? {} : { limit: 2 }),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Товары</h1>
        {!user && (
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="underline underline-offset-4">
              Войдите
            </Link>
            , чтобы увидеть все товары
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.docs.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <Badge variant={product.inStock ? 'default' : 'secondary'}>
                    {product.inStock ? 'В наличии' : 'Нет'}
                  </Badge>
                </div>
                {typeof product.category === 'object' && product.category && (
                  <p className="text-xs text-muted-foreground">{product.category.name}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <ProductDescription data={product.description} />
                <p className="font-semibold">
                  {Intl.NumberFormat('ru-RU').format(product.price)} ₽
                </p>
                <AddToCartButton
                  product={{
                    productId: String(product.id),
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                  }}
                />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
