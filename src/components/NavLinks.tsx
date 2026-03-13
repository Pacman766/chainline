'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [{ href: '/products', label: 'Товары' }];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'text-sm transition-colors hover:text-foreground',
            pathname === href ? 'text-foreground font-medium' : 'text-muted-foreground',
          )}
        >
          {label}
        </Link>
      ))}
    </>
  );
}
