import { getPayload } from 'payload';
import config from '@payload-config';
import { headers as getHeaders } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LogoutButton from '@/components/LogoutButton';
import { NavLinks } from '@/components/NavLinks';
import { CartLink } from './CartLink';
import { Store } from 'lucide-react';

export async function Header() {
  const payload = await getPayload({ config });
  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground text-2xl">
            <Store className="w-6 h-6" />
            Pac-Shop
          </Link>
          <NavLinks />
          <CartLink />
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Войти</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
