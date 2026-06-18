import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BasketItem } from '@/store/useBasketStore';
import { toast } from 'sonner';

export interface Order {
  id: string;
  customer_name: string;
  delivery_date: string;
  card_message?: string;
  extra_notes?: string;
  zip_code?: string;
  shipping_cost: number;
  subtotal: number;
  total: number;
  status: 'pendente' | 'pago' | 'preparando' | 'enviado' | 'entregue' | 'cancelado';
  items: BasketItem[];
  created_at?: string;
}

const STORAGE_KEY = 'afetto_orders';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          // Normalizar snake_case para camelCase se necessário
          const formattedOrders = data.map((d: any) => ({
            id: d.id,
            customer_name: d.customer_name,
            delivery_date: d.delivery_date,
            card_message: d.card_message,
            extra_notes: d.extra_notes,
            zip_code: d.zip_code,
            shipping_cost: Number(d.shipping_cost),
            subtotal: Number(d.subtotal),
            total: Number(d.total),
            status: d.status,
            items: d.items,
            created_at: d.created_at,
          }));
          setOrders(formattedOrders);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching orders from Supabase:', error);
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setOrders(JSON.parse(stored));
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders from localStorage:', error);
      toast.error('Erro ao carregar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addOrder = async (orderData: Omit<Order, 'id' | 'status' | 'created_at'>) => {
    const newOrder: Order = {
      ...orderData,
      id: isSupabaseConfigured() ? undefined as any : `order-${Date.now()}`,
      status: 'pendente',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        // Mapear campos para o banco de dados (snake_case)
        const dbOrder = {
          customer_name: newOrder.customer_name,
          delivery_date: newOrder.delivery_date,
          card_message: newOrder.card_message,
          extra_notes: newOrder.extra_notes,
          zip_code: newOrder.zip_code,
          shipping_cost: newOrder.shipping_cost,
          subtotal: newOrder.subtotal,
          total: newOrder.total,
          status: newOrder.status,
          items: newOrder.items,
        };

        const { data, error } = await supabase
          .from('orders')
          .insert([dbOrder])
          .select()
          .single();

        if (error) throw error;

        const formatted = {
          id: data.id,
          customer_name: data.customer_name,
          delivery_date: data.delivery_date,
          card_message: data.card_message,
          extra_notes: data.extra_notes,
          zip_code: data.zip_code,
          shipping_cost: Number(data.shipping_cost),
          subtotal: Number(data.subtotal),
          total: Number(data.total),
          status: data.status,
          items: data.items,
          created_at: data.created_at,
        };

        setOrders(prev => [formatted, ...prev]);
        return formatted;
      } catch (error) {
        console.error('Error adding order to Supabase:', error);
        toast.error('Erro ao salvar pedido na nuvem. Salvando localmente...');
      }
    }

    // Fallback local
    try {
      // Garantir id único local se falhou/desconectado do Supabase
      if (!newOrder.id) {
        newOrder.id = `order-${Date.now()}`;
      }
      const newOrdersList = [newOrder, ...orders];
      setOrders(newOrdersList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrdersList));
      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Erro ao registrar pedido.');
      return null;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    if (isSupabaseConfigured() && !id.startsWith('order-')) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', id);

        if (error) throw error;

        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        toast.success('Status do pedido atualizado!');
        return true;
      } catch (error) {
        console.error('Error updating order status in Supabase:', error);
        toast.error('Erro ao atualizar status do pedido no banco de dados.');
        return false;
      }
    }

    try {
      const newOrdersList = orders.map(o => o.id === id ? { ...o, status } : o);
      setOrders(newOrdersList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrdersList));
      toast.success('Status do pedido atualizado localmente!');
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erro ao atualizar status do pedido.');
      return false;
    }
  };

  const deleteOrder = async (id: string) => {
    if (isSupabaseConfigured() && !id.startsWith('order-')) {
      try {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setOrders(prev => prev.filter(o => o.id !== id));
        toast.success('Pedido removido do banco com sucesso!');
        return true;
      } catch (error) {
        console.error('Error deleting order from Supabase:', error);
        toast.error('Erro ao remover pedido do banco de dados.');
        return false;
      }
    }

    try {
      const newOrdersList = orders.filter(o => o.id !== id);
      setOrders(newOrdersList);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrdersList));
      toast.success('Pedido removido localmente!');
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Erro ao remover pedido.');
      return false;
    }
  };

  return {
    orders,
    loading,
    refetch: fetchOrders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
  };
}
