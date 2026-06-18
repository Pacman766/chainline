import { CartAction, CartItem } from '@/types/cart';

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find((p) => p.productId === action.product.productId);
      return exists
        ? state.map((p) =>
            p.productId === action.product.productId
              ? { ...p, quantity: p.quantity + action.product.quantity }
              : p,
          )
        : [...state, action.product];
    }
    case 'REMOVE': {
      return state.filter((p) => p.productId !== action.productId);
    }
    case 'CLEAR': {
      return [];
    }
    case 'INIT': {
      return action.items;
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return state.filter((p) => p.productId !== action.productId);
      }
      return state.map((p) =>
        p.productId === action.productId ? { ...p, quantity: action.quantity } : p,
      );
    }
    default: {
      const _exhaustive: never = action;   // TS-ошибка, если забыл case
      return state;
    }
  }
}
