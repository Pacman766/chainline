'use client';

import { useState } from 'react';

export function CatalogShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`catalog-shell${open ? '' : ' catalog-shell--collapsed'}`}>
      <aside className="catalog-sidebar">
        <button
          className="sidebar-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Скрыть сайдбар' : 'Показать сайдбар'}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="sidebar-toggle__icon"
          >
            <path
              d="M9 2L4 7L9 12"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="sidebar-body">{sidebar}</div>
      </aside>
      <div className="catalog-content">{children}</div>
    </div>
  );
}
