'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const t = useTranslations('common');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button onClick={toggle} className="theme-toggle" aria-label={t('toggleTheme')}>
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
