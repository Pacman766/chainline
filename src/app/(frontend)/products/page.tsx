import config from '@payload-config';
import { getPayload } from 'payload';
import { headers as getHeaders } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { AddToCartButton } from './AddToCartButton';

export const revalidate = 0;

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category: categorySlug } = await searchParams;
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      and: [
        { status: { equals: 'published' } },
        ...(categorySlug ? [{ 'category.slug': { equals: categorySlug } }] : []),
      ],
    },
    sort: '-price',
    ...(user ? {} : { limit: 2 }),
  });

  return (
    <>
      <div className="catalog-header">
        <div>
          <p className="catalog-eyebrow">Каталог</p>
          <h1 className="catalog-title">Товары</h1>
        </div>
        {!user && (
          <p className="catalog-gate">
            <Link href="/login">Войдите</Link>, чтобы увидеть все товары
          </p>
        )}
      </div>

      <div className="product-grid">
        {products.map((product) => {
          const firstImage = product.images?.[0];
          const image = typeof firstImage === 'object' && firstImage !== null ? firstImage : null;
          const category = typeof product.category === 'object' && product.category !== null
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
                    className="object-cover"
                  />
                ) : (
                  <span className="product-card__no-img">Нет фото</span>
                )}
                <span className={`product-card__stock${product.inStock ? '' : ' product-card__stock--out'}`}>
                  {product.inStock ? 'В наличии' : 'Нет'}
                </span>
              </div>

              <div className="product-card__body">
                {category && <p className="product-card__cat">{category.name}</p>}
                <p className="product-card__name">{product.name}</p>
                <div className="product-card__footer">
                  <span className="product-card__price">
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
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
