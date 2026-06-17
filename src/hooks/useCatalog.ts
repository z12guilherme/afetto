import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export type BasketProductItem = {
  productId: string;
  quantity: number;
};

export type CatalogBasket = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  tag?: string | null;
  image: string;
  items: BasketProductItem[];
};

export const MOCK_CATALOG: CatalogBasket[] = [
  {
    id: 'cesta-1',
    name: 'Cesta Romântica Premium',
    price: 350.0,
    oldPrice: 420.0,
    tag: 'Mais Vendida',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Cesta+Romantica',
    items: [
      { productId: 'perf-1', quantity: 1 },
      { productId: 'flores-1', quantity: 1 },
      { productId: 'choc-1', quantity: 1 },
      { productId: 'cartao-1', quantity: 1 },
    ]
  },
  {
    id: 'cesta-2',
    name: 'Cesta Doce Encanto',
    price: 180.0,
    tag: 'Econômica',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Cesta+Doce',
    items: [
      { productId: 'pelucia-1', quantity: 1 },
      { productId: 'choc-2', quantity: 2 },
      { productId: 'cartao-1', quantity: 1 },
    ]
  },
  {
    id: 'cesta-3',
    name: 'Cesta Classic',
    price: 250.0,
    tag: 'Lançamento',
    image: 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Cesta+Classic',
    items: [
      { productId: 'perf-2', quantity: 1 },
      { productId: 'choc-1', quantity: 1 },
      { productId: 'flores-2', quantity: 1 },
    ]
  }
];

const STORAGE_KEY = 'afetto_catalog_v2'; // v2 = novo formato com productId

export function useCatalog() {
  const [baskets, setBaskets] = useState<CatalogBasket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBaskets = async () => {
    setLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('baskets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setBaskets(data);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching baskets from Supabase:', error);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBaskets(JSON.parse(stored));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CATALOG));
        setBaskets(MOCK_CATALOG);
      }
    } catch (error) {
      console.error('Error fetching baskets from localStorage:', error);
      toast.error('Erro ao carregar cestas. Exibindo padrão.');
      setBaskets(MOCK_CATALOG);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaskets();
  }, []);

  const addBasket = async (basketData: Omit<CatalogBasket, 'id'>) => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('baskets')
          .insert([basketData])
          .select()
          .single();

        if (error) throw error;

        setBaskets(prev => [data, ...prev]);
        toast.success('Cesta adicionada com sucesso no Supabase!');
        return data;
      } catch (error) {
        console.error('Error adding basket to Supabase:', error);
      }
    }

    try {
      const newBasket = { ...basketData, id: `cesta-${Date.now()}` };
      const newBasketsList = [newBasket, ...baskets];
      setBaskets(newBasketsList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBasketsList));
      toast.success('Cesta adicionada localmente!');
      return newBasket;
    } catch (error) {
      console.error('Error adding basket:', error);
      toast.error('Erro ao adicionar cesta.');
      return null;
    }
  };

  const deleteBasket = async (id: string) => {
    if (isSupabaseConfigured() && !id.startsWith('cesta-')) {
      try {
        const { error } = await supabase
          .from('baskets')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setBaskets(prev => prev.filter(b => b.id !== id));
        toast.success('Cesta removida com sucesso!');
        return;
      } catch (error) {
        console.error('Error deleting basket from Supabase:', error);
        toast.error('Erro ao remover cesta do banco de dados.');
        return;
      }
    }

    try {
      const newBasketsList = baskets.filter(b => b.id !== id);
      setBaskets(newBasketsList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBasketsList));
      toast.success('Cesta removida localmente!');
    } catch (error) {
      console.error('Error deleting basket:', error);
      toast.error('Erro ao remover cesta.');
    }
  };

  return {
    baskets,
    loading,
    refetch: fetchBaskets,
    addBasket,
    deleteBasket
  };
}
