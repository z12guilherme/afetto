import { useState, useEffect } from 'react';
import { Product, MOCK_PRODUCTS } from '@/data/products';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const STORAGE_KEY = 'afetto_products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(data);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching from Supabase, falling back to local:', error);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS));
        setProducts(MOCK_PRODUCTS);
      }
    } catch (error) {
      console.error('Error fetching products from localStorage:', error);
      toast.error('Erro ao carregar produtos. Exibindo padrão.');
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();

        if (error) throw error;

        setProducts(prev => [data, ...prev]);
        toast.success('Produto adicionado com sucesso no Supabase!');
        return data;
      } catch (error) {
        console.error('Error adding product to Supabase, falling back to local:', error);
      }
    }

    try {
      const newProduct = { ...productData, id: `prod-${Date.now()}` };
      const newProductsList = [newProduct, ...products];
      setProducts(newProductsList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProductsList));
      toast.success('Produto adicionado localmente!');
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erro ao adicionar produto.');
      return null;
    }
  };

  const deleteProduct = async (id: string) => {
    if (isSupabaseConfigured() && !id.startsWith('prod-')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success('Produto removido com sucesso!');
        return;
      } catch (error) {
        console.error('Error deleting product from Supabase:', error);
        toast.error('Erro ao remover produto do banco de dados.');
        return;
      }
    }

    try {
      const newProductsList = products.filter(p => p.id !== id);
      setProducts(newProductsList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProductsList));
      toast.success('Produto removido localmente!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erro ao remover produto.');
    }
  };

  return {
    products,
    loading,
    refetch: fetchProducts,
    addProduct,
    deleteProduct
  };
}
