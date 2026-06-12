'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Главная' },
  { href: '/products', label: 'Товары' },
  { href: '/categories', label: 'Категории' },
  { href: '/orders', label: 'Мои заказы' },
  { href: '/contacts', label: 'Контакты' },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`nav-link${pathname === href ? ' nav-link--active' : ''}`}
        >
          {label}
        </Link>
      ))}
    </>
  );
}
