import { create } from 'zustand';
import { Product } from '@/data/products';

export interface BasketItem {
  product: Product;
  quantity: number;
}

interface BasketState {
  items: BasketItem[];
  basketSourceName?: string; // Nome da cesta sugerida que serviu como base
  personalization: {
    name: string;
    message: string;
    date: string;
    notes: string;
  };
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updatePersonalization: (field: string, value: string) => void;
  loadBasket: (items: BasketItem[], sourceName?: string) => void;
  clearBasket: () => void;
  totalPrice: () => number;
  totalItems: () => number;
}

export const useBasketStore = create<BasketState>((set, get) => ({
  items: [],
  basketSourceName: undefined,
  personalization: {
    name: '',
    message: '',
    date: '',
    notes: '',
  },

  addItem: (product) => set((state) => {
    const existing = state.items.find(item => item.product.id === product.id);
    if (existing) {
      return {
        items: state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    return { items: [...state.items, { product, quantity: 1 }] };
  }),

  removeItem: (productId) => set((state) => ({
    items: state.items.filter(item => item.product.id !== productId)
  })),

  updateQuantity: (productId, quantity) => set((state) => {
    if (quantity <= 0) {
      return { items: state.items.filter(item => item.product.id !== productId) };
    }
    return {
      items: state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    };
  }),

  updatePersonalization: (field, value) => set((state) => ({
    personalization: { ...state.personalization, [field]: value }
  })),

  // Carrega uma lista de itens na cesta (usado pelo catálogo de sugestões)
  loadBasket: (items, sourceName) => set(() => ({
    items,
    basketSourceName: sourceName,
    personalization: { name: '', message: '', date: '', notes: '' },
  })),

  clearBasket: () => set(() => ({
    items: [],
    basketSourceName: undefined,
    personalization: { name: '', message: '', date: '', notes: '' },
  })),

  totalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },

  totalItems: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.quantity, 0);
  }
}));
