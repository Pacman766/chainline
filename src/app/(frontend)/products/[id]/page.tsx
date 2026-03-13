import { getPayload } from 'payload';
import config from '@payload-config';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ProductDescription } from '../ProductDescription';
import { AddToCartButton } from '../AddToCartButton';
import Image from 'next/image';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const payload = await getPayload({ config });
  const product = await payload.findByID({
    collection: 'products',
    id,
    depth: 1,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 gap-2">
        <Link href="/products">
          <ArrowLeft className="w-4 h-4" />
          Назад к товарам
        </Link>
      </Button>

      {/* Images */}
      {product.images && product.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-6 rounded-lg overflow-hidden">
          {product.images.map((img, i) => (
            <Image
              key={i}
              src={img.url}
              alt={img.alt || product.name}
              width={600}
              height={400}
              className={`w-full object-cover ${
                product.images!.length === 1 ? 'col-span-2 max-h-96' : 'aspect-square'
              }`}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          {typeof product.category === 'object' && product.category && (
            <p className="text-sm text-muted-foreground mt-1">{product.category.name}</p>
          )}
        </div>
        <Badge variant={product.inStock ? 'default' : 'secondary'} className="shrink-0 mt-1">
          {product.inStock ? 'В наличии' : 'Нет в наличии'}
        </Badge>
      </div>

      {/* Price + Cart */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-2xl font-bold">
          {Intl.NumberFormat('ru-RU').format(product.price)} ₽
        </span>
        <AddToCartButton
          product={{
            productId: String(product.id),
            name: product.name,
            price: product.price,
            quantity: 1,
          }}
        />
      </div>

      <Separator className="my-6" />

      {/* Description */}
      {product.description && (
        <div className="prose prose-sm max-w-none">
          <h2 className="text-lg font-semibold mb-2">Описание</h2>
          <ProductDescription data={product.description} />
        </div>
      )}

      {/* Dimensions */}
      {product.dimensions &&
        (product.dimensions.weight || product.dimensions.width || product.dimensions.height) && (
          <>
            <Separator className="my-6" />
            <h2 className="text-lg font-semibold mb-3">Характеристики</h2>
            <div className="grid grid-cols-3 gap-4">
              {product.dimensions.weight && (
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Вес</p>
                  <p className="font-semibold">{product.dimensions.weight} г</p>
                </div>
              )}
              {product.dimensions.width && (
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Ширина</p>
                  <p className="font-semibold">{product.dimensions.width} см</p>
                </div>
              )}
              {product.dimensions.height && (
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Высота</p>
                  <p className="font-semibold">{product.dimensions.height} см</p>
                </div>
              )}
            </div>
          </>
        )}
    </div>
  );
}
