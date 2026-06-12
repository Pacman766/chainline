import config from '@payload-config';
import Link from 'next/link';
import { getPayload } from 'payload';

export const revalidate = 0;

// Русская плюрализация: 1 товар, 2 товара, 5 товаров
function pluralProducts(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'товар';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'товара';
  return 'товаров';
}

export default async function CategoriesPage() {
  const payload = await getPayload({ config });
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
  });

  const withCounts = await Promise.all(
    categories.map(async (cat) => {
      const { totalDocs } = await payload.find({
        collection: 'products',
        where: {
          category: { equals: cat.id },
          _status: { equals: 'published' },
        },
        limit: 0,
      });
      return { ...cat, productCount: totalDocs };
    }),
  );

  return (
    <div className="cat-page">
      <div className="catalog-header">
        <div>
          <p className="catalog-eyebrow">Каталог</p>
          <h1 className="catalog-title">Категории</h1>
        </div>
        <p className="catalog-gate">
          {withCounts.length}{' '}
          {withCounts.length === 1 ? 'раздел' : 'разделов'}
        </p>
      </div>

      <div className="cat-grid">
        {withCounts.map((cat, i) => (
          <Link href={`/products?category=${cat.slug}`} key={cat.id} className="cat-card">
            <span className="cat-card__index">{String(i + 1).padStart(2, '0')}</span>
            <span className="cat-card__name">{cat.name}</span>

            <div className="cat-card__footer">
              <span
                className={`cat-card__count${cat.productCount === 0 ? ' cat-card__count--empty' : ''}`}
              >
                <span className="cat-card__count-num">{cat.productCount}</span>
                <span className="cat-card__count-lbl">{pluralProducts(cat.productCount)}</span>
              </span>
              <svg
                className="cat-card__arrow"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="square"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
