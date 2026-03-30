import React from 'react';
import './styles.css';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
  description: 'Premium cycling components and bikes.',
  title: 'Cadence — Bike Shop',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="ru" className={inter.className}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
