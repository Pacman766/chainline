'use client';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const links = [
  { href: '/', key: 'home' },
  { href: '/products', key: 'products' },
  { href: '/categories', key: 'categories' },
  { href: '/orders', key: 'orders' },
  { href: '/contacts', key: 'contacts' },
] as const;

export function NavLinks() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <>
      {links.map(({ href, key }) => (
        <Link
          key={href}
          href={href}
          className={`nav-link${pathname === href ? ' nav-link--active' : ''}`}
        >
          {t(key)}
        </Link>
      ))}
    </>
  );
}
