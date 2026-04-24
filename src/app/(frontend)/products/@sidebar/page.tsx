import config from '@payload-config';
import { getPayload } from 'payload';
import type { Category } from '@/payload-types';
import Link from 'next/link';

export default async function Sidebar() {
  const payload = await getPayload({ config });
  const { docs: categories } = await payload.find({ collection: 'categories' });

  return (
    <nav className="sidebar-inner">
      <p className="sidebar-label">Категории</p>
      <ul className="sidebar-nav">
        <li>
          <Link href="/products" className="sidebar-link">
            Все товары
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
