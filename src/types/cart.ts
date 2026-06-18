export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type CartAction =
  | { type: 'ADD'; product: CartItem }
  | { type: 'REMOVE'; productId: string }
  | { type: 'CLEAR' }
  | { type: 'INIT'; items: CartItem[] }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'INCREMENT'; productId: string }
  | { type: 'DECREMENT'; productId: string };
