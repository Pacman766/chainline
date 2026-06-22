import config from '@payload-config';
import { getPayload } from 'payload';
import { getTranslations } from 'next-intl/server';
import type { Category } from '@/payload-types';
import Link from 'next/link';

export default async function Sidebar({ params }: { params: Promise<{ locale: 'ru' | 'en' }> }) {
  const { locale } = await params;
  const t = await getTranslations('sidebar');
  const payload = await getPayload({ config });
  const { docs: categories } = await payload.find({ collection: 'categories', locale });

  return (
    <nav className="sidebar-inner">
      <p className="sidebar-label">{t('label')}</p>
      <ul className="sidebar-nav">
        <li>
          <Link href="/products" className="sidebar-link">
            {t('all')}
          </Link>
        </li>
        {categories.map((category: Category) => (
          <li key={category.id}>
            <Link href={`/products?category=${category.slug}`} className="sidebar-link">
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
