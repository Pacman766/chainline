'use client';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function LogoutButton({ logoutUrl }: { logoutUrl: string }) {
  const router = useRouter();
  const t = useTranslations('actions');

  const logout = async () => {
    const res = await fetch(logoutUrl, { method: 'POST', credentials: 'include' });
    if (res.ok) router.refresh();
  };

  return (
    <button className="header-logout" onClick={logout}>
      {t('logout')}
    </button>
  );
}
