'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton({ logoutUrl }: { logoutUrl: string }) {
  const router = useRouter();

  const logout = async () => {
    const res = await fetch(logoutUrl, { method: 'POST', credentials: 'include' });
    if (res.ok) router.refresh();
  };

  return (
    <button className="header-logout" onClick={logout}>
      Выйти
    </button>
  );
}
