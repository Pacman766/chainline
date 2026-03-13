'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const res = await fetch('/api/customers/logout', { method: 'POST', credentials: 'include' });
    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={logout}>
      Выйти
    </Button>
  );
}
