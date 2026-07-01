import React from 'react';
import './styles.css';
import { Header } from '@/components/Header';
import { SmoothScroll } from '@/components/SmoothScroll';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'sonner';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';

export const metadata = {
  description: 'Premium cycling components and bikes.',
  title: 'CHAINLINE — Bike Shop',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(s===null&&p)){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll />
          <CartProvider>
            <Header />
            <main>{children}</main>
          </CartProvider>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
