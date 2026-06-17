export type Category = 
  | 'Cesta Base'
  | 'Chocolates'
  | 'Perfumes'
  | 'Body Splash'
  | 'Maquiagem'
  | 'Flores'
  | 'Pelúcias'
  | 'Canecas'
  | 'Cartões'
  | 'Outros';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: Category;
  image: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'base-1',
    name: 'Cesta de Vime G',
    price: 45.0,
    category: 'Cesta Base',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Cesta+de+Vime+G',
  },
  {
    id: 'base-2',
    name: 'Caixa Rígida Premium',
    price: 65.0,
    category: 'Cesta Base',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Caixa+Rigida',
  },
  {
    id: 'choc-1',
    name: 'Ferrero Rocher 12un',
    price: 35.9,
    category: 'Chocolates',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Ferrero+Rocher',
  },
  {
    id: 'choc-2',
    name: 'Barra Lindt Excellence 100g',
    price: 24.9,
    category: 'Chocolates',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Lindt',
  },
  {
    id: 'perf-1',
    name: 'Perfume Lily Eau de Parfum',
    price: 289.9,
    category: 'Perfumes',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Perfume+Lily',
  },
  {
    id: 'perf-2',
    name: 'Malbec Desodorante Colônia',
    price: 189.9,
    category: 'Perfumes',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Malbec',
  },
  {
    id: 'flores-1',
    name: 'Buquê de Rosas Vermelhas',
    price: 120.0,
    category: 'Flores',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Rosas',
  },
  {
    id: 'flores-2',
    name: 'Orquídea Branca',
    price: 85.0,
    category: 'Flores',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Orquidea',
  },
  {
    id: 'pelucia-1',
    name: 'Urso de Pelúcia M',
    price: 75.0,
    category: 'Pelúcias',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Urso+Pelucia',
  },
  {
    id: 'cartao-1',
    name: 'Cartão com Mensagem',
    price: 15.0,
    category: 'Cartões',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Cartao',
  }
];

export const CATEGORIES: Category[] = [
  'Cesta Base',
  'Chocolates',
  'Perfumes',
  'Body Splash',
  'Maquiagem',
  'Flores',
  'Pelúcias',
  'Canecas',
  'Cartões',
  'Outros'
];
