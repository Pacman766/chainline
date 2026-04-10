import React from 'react';
import './styles.css';
import { Header } from '@/components/Header';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'sonner';

export const metadata = {
  description: 'Premium cycling components and bikes.',
  title: 'Cadence — Bike Shop',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="ru">
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
