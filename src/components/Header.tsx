import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { getAuthenticatedUser } from '@/lib/auth';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { NavLinks } from '@/components/NavLinks';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { CartLink } from './CartLink';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

// SVG chainring — 9 зубцов, как у передней звёздочки велосипеда
// function ChainringLogo() {
//   return (
//     <svg viewBox="0 0 32 32" width="44" height="44" aria-hidden="true" className="logo-chainring">
//       {/* Зубья chainring */}
//       <polygon
//         fill="#e85d04"
//         points="
//           14.61,6.10  16,2.50    17.39,6.10
//           21.30,7.52  24.68,5.66  23.43,9.31
//           25.51,12.91 29.30,13.65 25.99,15.65
//           25.27,19.75 27.69,22.75 23.88,22.16
//           20.69,24.83 20.62,28.69 18.08,25.78
//           13.92,25.78 11.38,28.69 11.31,24.83
//           8.12,22.16  4.31,22.75  6.73,19.75
//           6.01,15.65  2.70,13.65  6.49,12.91
//           8.57,9.31   7.32,5.66  10.70,7.52
//         "
//       />
//       {/* Паук (spider) */}
//       <circle cx="16" cy="16" r="8.2" fill="#111" />
//       {/* Bottom bracket отверстие */}
//       <circle cx="16" cy="16" r="4.2" fill="#111" stroke="#e85d04" strokeWidth="0.7" strokeOpacity="0.5" />
//       {/* Центральный болт */}
//       <circle cx="16" cy="16" r="2.2" fill="#3a3a3a" />
//       <circle cx="16" cy="16" r="1.0" fill="#555" />
//     </svg>
//   );
// }

function ChainlinkLogo() {
  return (
    <svg viewBox="0 0 32 32" width="44" height="44" className="logo-chainring">
      <rect
        x="3"
        y="10"
        width="26"
        height="12"
        rx="6"
        ry="6"
        fill="none"
        stroke="#f0f0f0"
        strokeWidth="2.2"
      />
      <circle cx="11" cy="16" r="2.4" fill="#e85d04" />
      <circle cx="21" cy="16" r="2.4" fill="#e85d04" />
    </svg>
  );
}

export async function Header() {
  const cookieStore = await cookies();
  const customerToken = cookieStore.get('customer-token')?.value;
  const logoutUrl = customerToken ? '/api/auth/customer-logout' : '/api/users/logout';
  const user = await getAuthenticatedUser();
  const t = await getTranslations('header');

  return (
    <header className="site-header">
      <div className="header-inner">
        <nav className="header-nav">
          <Link href="/" className="header-logo">
            <ChainlinkLogo />
            <span className="logo-text">CHAINLINE</span>
          </Link>
          <div className="nav-links">
            <NavLinks />
          </div>
        </nav>

        <div className="header-actions">
          <LocaleSwitcher />
          <ThemeToggle />
          <CartLink />
          {user ? (
            <>
              <span className="header-email">{user.email}</span>
              <LogoutButton logoutUrl={logoutUrl} />
            </>
          ) : (
            <Link href="/login" className="header-login">
              {t('login')}
            </Link>
          )}
        </div>

        {/* Mobile-only: cart stays visible in top bar, hamburger opens drawer */}
        <div className="header-mobile-right">
          <CartLink />
          <MobileMenu
            email={user?.email ?? null}
            logoutUrl={logoutUrl}
            loginLabel={t('login')}
            openMenuLabel={t('openMenu')}
            closeMenuLabel={t('closeMenu')}
          />
        </div>
      </div>
    </header>
  );
}
