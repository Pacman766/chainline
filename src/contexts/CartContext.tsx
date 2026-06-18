'use client';

import { cartReducer } from '@/hooks/cartReducer';
import { CartItem } from '@/types/cart';
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  initialized: boolean;
  addItem: (product: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [initialized, setInitialized] = useState(false);

  const totalItems = useMemo(() => items.reduce((acc, p) => acc + p.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((acc, p) => acc + p.price * p.quantity, 0),
    [items],
  );

  useEffect(() => {
    try {
      const cart = localStorage.getItem('cart');
      if (cart) {
        dispatch({ type: 'INIT', items: JSON.parse(cart) });
      }
    } catch {
      localStorage.removeItem('cart');
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, initialized]);

  const addItem = (product: CartItem) => {
    dispatch({ type: 'ADD', product });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE', productId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const increment = (productId: string) => {
    dispatch({ type: 'INCREMENT', productId });
  };

  const decrement = (productId: string) => {
    dispatch({ type: 'DECREMENT', productId });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        initialized,
        addItem,
        removeItem,
        clearCart,
        updateQuantity,
        increment,
        decrement,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
