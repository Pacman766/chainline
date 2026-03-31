import config from '@payload-config';
import { getPayload } from 'payload';
import { headers as getHeaders } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-orange-600 mb-1">
            Каталог
          </p>
          <h1 className="text-3xl font-black tracking-tight">Товары</h1>
        </div>
        {!user && (
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="underline underline-offset-4">
              Войдите
            </Link>
            , чтобы увидеть все товары
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.docs.map((product) => {
          const firstImage = product.images?.[0]
          const image = typeof firstImage === 'object' && firstImage !== null ? firstImage : null

          return (
          <Link href={`/products/${product.id}`} key={product.id} className="group">
            <Card className="overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md h-full flex flex-col">
              <div className="aspect-[4/3] overflow-hidden bg-zinc-100 relative">
                {image ? (
                  <Image
                    src={image.sizes?.card?.url ?? image.url ?? ''}
                    alt={image.alt ?? product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    Нет фото
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{product.name}</CardTitle>
                  <Badge
                    variant={product.inStock ? 'default' : 'secondary'}
                    className="shrink-0 text-xs"
                  >
                    {product.inStock ? 'В наличии' : 'Нет'}
                  </Badge>
                </div>
                {typeof product.category === 'object' && product.category && (
                  <p className="text-xs text-muted-foreground">{product.category.name}</p>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-3">
                <ProductDescription data={product.description} />
                <div className="flex items-center justify-between pt-1">
                  <p className="text-lg font-black tracking-tight">
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
                </div>
              </CardContent>
            </Card>
          </Link>
          )
        })}
      </div>
    </div>
  );
}
