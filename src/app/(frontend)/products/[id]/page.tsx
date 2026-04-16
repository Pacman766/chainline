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
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-8 gap-2 -ml-2">
        <Link href="/products">
          <ArrowLeft className="w-4 h-4" />
          Назад к каталогу
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          {product.images && product.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
              {product.images.map((img, i) => {
                if (typeof img !== 'object') return null;
                return (
                  <div
                    key={i}
                    className={`overflow-hidden bg-zinc-100 ${
                      product.images!.length === 1 || (i === 0 && product.images!.length >= 3)
                        ? 'col-span-2'
                        : ''
                    }`}
                  >
                    <Image
                      src={img.url ?? ''}
                      alt={img.alt || product.name}
                      width={600}
                      height={400}
                      className="w-full object-cover aspect-[4/3]"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="aspect-square bg-zinc-100 rounded-xl flex items-center justify-center text-muted-foreground text-sm">
              Нет фото
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {typeof product.category === 'object' && product.category && (
            <p className="text-xs font-semibold tracking-widest uppercase text-orange-600 mb-3">
              {product.category.name}
            </p>
          )}
          <h1 className="text-4xl font-black tracking-tight leading-tight mb-4">{product.name}</h1>
          <Badge variant={product.inStock ? 'default' : 'secondary'} className="w-fit mb-6">
            {product.inStock ? 'В наличии' : 'Нет в наличии'}
          </Badge>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-black tracking-tight">
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

          {product.description && (
            <>
              <Separator className="mb-6" />
              <div className="prose prose-sm max-w-none">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                  Описание
                </p>
                <ProductDescription data={product.description} />
              </div>
            </>
          )}

          {product.dimensions &&
            (product.dimensions.weight || product.dimensions.width || product.dimensions.height) && (
              <>
                <Separator className="my-6" />
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
                  Характеристики
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {product.dimensions.weight && (
                    <div className="text-center p-4 bg-zinc-50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Вес</p>
                      <p className="font-bold">{product.dimensions.weight} г</p>
                    </div>
                  )}
                  {product.dimensions.width && (
                    <div className="text-center p-4 bg-zinc-50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Ширина</p>
                      <p className="font-bold">{product.dimensions.width} см</p>
                    </div>
                  )}
                  {product.dimensions.height && (
                    <div className="text-center p-4 bg-zinc-50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Высота</p>
                      <p className="font-bold">{product.dimensions.height} см</p>
                    </div>
                  )}
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
