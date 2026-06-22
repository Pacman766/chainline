import config from '@payload-config';
import { getPayload } from 'payload';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { AddToCartButton } from './AddToCartButton';
import { shimmerDataURL } from '@/lib/shimmer';
import { getAuthenticatedUser } from '@/lib/auth';
import { SearchInput } from '@/components/SearchInput';
import type { Product } from '@/payload-types';

export const revalidate = 0;

export default async function ProductPage({
  searchParams, params
}: {
    searchParams: Promise<{ category?: string; q?: string }>;
    params: Promise<{ locale: 'ru' | 'en' }>
}) {
  const { category: categorySlug, q } = await searchParams;
  const payload = await getPayload({ config });
  const user = await getAuthenticatedUser();
  const { locale } = await params;
  const t = await getTranslations('catalog');

  let products: Product[] = [];

  if (q && user) {
    const searchQuery = q.toLowerCase();
    const searchResults = await payload.find({
      collection: 'search',
      where: {
        or: [
          { 'meta.titleSearch': { like: searchQuery } },
          { 'meta.description': { like: searchQuery } },
          { 'meta.categoryName': { like: searchQuery } },
        ],
      },
      limit: 100,
    });

    const productIds = searchResults.docs
      .map((rec) => (typeof rec.doc?.value === 'object' ? rec.doc.value.id : rec.doc?.value))
      .filter((id): id is number => typeof id === 'number');

    if (productIds.length > 0) {
      const result = await payload.find({
        collection: 'products',
        where: {
          id: { in: productIds },
          _status: { equals: 'published' },
        },
        locale,
        depth: 2,
      });
      products = result.docs;
    }
  } else if (categorySlug) {
    const { docs: categoryDocs } = await payload.find({
      collection: 'categories',
      where: { slug: { equals: categorySlug } },
      limit: 1,
    });
    const categoryId = categoryDocs[0]?.id;

    if (categoryId) {
      const result = await payload.find({
        collection: 'products',
        where: {
          _status: { equals: 'published' },
          category: { equals: categoryId },
        },
        sort: '-price',
        ...(user ? {} : { limit: 2 }),
        depth: 2,
        locale,
      });
      products = result.docs;
    }
  } else {
    const result = await payload.find({
      collection: 'products',
      where: {
        _status: { equals: 'published' },
      },
      sort: '-price',
      ...(user ? {} : { limit: 2 }),
      depth: 2,
      locale,
    });
    products = result.docs;
  }

  return (
    <>
      <div className="catalog-header">
        <div>
          <p className="catalog-eyebrow">{t('eyebrow')}</p>
          <h1 className="catalog-title">{t('title')}</h1>
        </div>
        {!user && (
          <p className="catalog-gate">
            {t.rich('gate', {
              login: (chunks) => <Link href="/login">{chunks}</Link>,
            })}
          </p>
        )}
      </div>

      <SearchInput isAuthenticated={!!user} defaultValue={q} />

      {q && products.length === 0 && (
        <p className="search-empty">
          {t.rich('searchEmpty', {
            query: q,
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      )}

      <div className="product-grid">
        {products.map((product) => {
          const firstImage = product.images?.[0];
          const image = typeof firstImage === 'object' && firstImage !== null ? firstImage : null;
          const category =
            typeof product.category === 'object' && product.category !== null
              ? product.category
              : null;

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
                  <span className="product-card__no-img">{t('noImage')}</span>
                )}
                <span
                  className={`product-card__stock${product.inStock ? '' : ' product-card__stock--out'}`}
                >
                  {product.inStock ? t('inStock') : t('outOfStockShort')}
                </span>
              </div>

              <div className="product-card__body">
                {category && <p className="product-card__cat">{category.name}</p>}
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
