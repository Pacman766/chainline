'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="locale-switcher" role="group" aria-label="Language">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          className={`locale-switcher__btn${loc === locale ? ' locale-switcher__btn--active' : ''}`}
          aria-current={loc === locale ? 'true' : undefined}
          onClick={() => router.replace(pathname, { locale: loc })}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
