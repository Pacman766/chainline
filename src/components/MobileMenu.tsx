'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from '@/i18n/navigation';
import { NavLinks } from '@/components/NavLinks';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import LogoutButton from '@/components/LogoutButton';

interface MobileMenuProps {
  email: string | null;
  logoutUrl: string;
  loginLabel: string;
  openMenuLabel: string;
  closeMenuLabel: string;
}

export function MobileMenu({
  email,
  logoutUrl,
  loginLabel,
  openMenuLabel,
  closeMenuLabel,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Portal target (document.body) is only available on the client; render the
  // drawer via a portal after mount so it escapes the header's containing block
  // (a transformed/sticky ancestor made a nested fixed clip size to the header,
  // not the viewport).
  useEffect(() => setMounted(true), []);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const drawerId = 'mobile-nav-drawer';

  const closeMenu = useCallback(() => {
    setOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  // Close on route change (nav link clicked)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Body scroll lock while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape key + focus close button when drawer opens
  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        ref={hamburgerRef}
        className="mobile-menu-btn"
        aria-label={openMenuLabel}
        aria-expanded={open}
        aria-controls={drawerId}
        onClick={() => setOpen(true)}
      >
        <span className="hamburger-line" aria-hidden="true" />
        <span className="hamburger-line" aria-hidden="true" />
        <span className="hamburger-line" aria-hidden="true" />
      </button>

      {mounted &&
        createPortal(
          <>
            {open && (
              <div
                className="mobile-backdrop"
                aria-hidden="true"
                onClick={closeMenu}
              />
            )}

            <div className="mobile-drawer-clip">
      <div
        id={drawerId}
        className={`mobile-drawer${open ? ' mobile-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <button
          ref={closeButtonRef}
          className="mobile-drawer__close"
          aria-label={closeMenuLabel}
          onClick={closeMenu}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            aria-hidden="true"
            fill="none"
          >
            <line
              x1="2"
              y1="2"
              x2="16"
              y2="16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="16"
              y1="2"
              x2="2"
              y2="16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Nav links — clicking any link closes the drawer via setOpen(false) + pathname change */}
        <nav
          className="mobile-drawer__nav"
          onClick={() => setOpen(false)}
        >
          <NavLinks />
        </nav>

        <div className="mobile-drawer__tools">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>

        <div className="mobile-drawer__auth">
          {email ? (
            <>
              <span className="header-email">{email}</span>
              <LogoutButton logoutUrl={logoutUrl} />
            </>
          ) : (
            <Link href="/login" className="header-login">
              {loginLabel}
            </Link>
          )}
        </div>
      </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
