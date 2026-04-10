'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/products', label: 'Товары' },
  { href: '/orders', label: 'Мои заказы' },
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
