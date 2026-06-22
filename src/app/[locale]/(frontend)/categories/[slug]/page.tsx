import config from '@payload-config';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { getTranslations } from 'next-intl/server';
import { AddToCartButton } from '../../products/AddToCartButton';
import { shimmerDataURL } from '@/lib/shimmer';

export const revalidate = 0;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; locale: 'ru' | 'en' }>;
}) {
  const { slug, locale } = await params;
  const payload = await getPayload({ config });
  const tCat = await getTranslations('categoriesPage');
  const tCatalog = await getTranslations('catalog');

  const { docs: categories } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
  });

  const category = categories[0];
  if (!category) notFound();

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      category: { equals: category.id },
      _status: { equals: 'published' },
    },
    sort: '-price',
    depth: 2,
    locale,
  });

  return (
    <>
      <div className="catalog-header">
        <div>
          <p className="catalog-eyebrow">{tCat('singleEyebrow')}</p>
          <h1 className="catalog-title">{category.name}</h1>
        </div>
        <p className="catalog-gate">
          {products.length} {tCat('products', { count: products.length })}
        </p>
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const firstImage = product.images?.[0];
          const image = typeof firstImage === 'object' && firstImage !== null ? firstImage : null;

          return (
            <Link href={`/products/${product.id}`} key={product.id} className="product-card">
              <div className="product-card__img-wrap">
                {image ? (
                  <Image
                    src={image.sizes?.card?.url ?? image.url ?? ''}
                    alt={image.alt ?? product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-contain"
                    placeholder="blur"
                    blurDataURL={shimmerDataURL}
                  />
                ) : (
                  <span className="product-card__no-img">{tCatalog('noImage')}</span>
                )}
                <span
                  className={`product-card__stock${product.inStock ? '' : ' product-card__stock--out'}`}
                >
                  {product.inStock ? tCatalog('inStock') : tCatalog('outOfStockShort')}
                </span>
              </div>

              <div className="product-card__body">
                <p className="product-card__name">{product.name}</p>
                <div className="product-card__footer">
                  <span className="product-card__price">
                    {Intl.NumberFormat('ru-RU').format(product.price ?? 0)} ₽
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
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
