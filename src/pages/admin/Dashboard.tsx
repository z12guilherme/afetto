import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, TrendingUp, ShoppingCart, DollarSign, AlertCircle, Loader2 } from 'lucide-react';

export function Dashboard() {
  const { orders, loading: loadingOrders } = useOrders();
  const { products, loading: loadingProducts } = useProducts();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  // 1. Filtrar pedidos válidos (não cancelados)
  const validOrders = orders.filter(o => o.status !== 'cancelado');
  
  // 2. Faturamento Total
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.total, 0);

  // 3. Pedidos Hoje
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.created_at?.startsWith(todayStr));
  const pendingProductionCount = orders.filter(o => o.status === 'pendente' || o.status === 'preparando').length;

  // 4. Produtos Mais Vendidos (Analítico Dinâmico)
  const productSalesMap: Record<string, { name: string, image: string, category: string, count: number }> = {};
  
  validOrders.forEach(order => {
    order.items.forEach(item => {
      const pid = item.product.id;
      if (!productSalesMap[pid]) {
        productSalesMap[pid] = {
          name: item.product.name,
          image: item.product.image,
          category: item.product.category,
          count: 0
        };
      }
      productSalesMap[pid].count += item.quantity;
    });
  });

  const bestSellers = Object.values(productSalesMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-[10px] uppercase tracking-wider font-bold text-white border-none py-0.5 px-2">Pendente</Badge>;
      case 'pago':
        return <Badge className="bg-green-600 hover:bg-green-700 text-[10px] uppercase tracking-wider font-bold text-white border-none py-0.5 px-2">Pago</Badge>;
      case 'preparando':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-[10px] uppercase tracking-wider font-bold text-white border-none py-0.5 px-2">Em Produção</Badge>;
      case 'enviado':
        return <Badge className="bg-purple-500 hover:bg-purple-600 text-[10px] uppercase tracking-wider font-bold text-white border-none py-0.5 px-2">Enviado</Badge>;
      case 'entregue':
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-[10px] uppercase tracking-wider font-bold text-white border-none py-0.5 px-2">Entregue</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-500 hover:bg-red-600 text-[10px] uppercase tracking-wider font-bold text-white border-none py-0.5 px-2">Cancelado</Badge>;
      default:
        return <Badge className="text-[10px] uppercase py-0.5 px-2">{status}</Badge>;
    }
  };

  const loading = loadingOrders || loadingProducts;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Carregando métricas do painel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Visão geral em tempo real da sua plataforma de presentes.</p>
      </div>
      
      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-600" /> Soma de todos os pedidos ativos
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{validOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Excluindo pedidos cancelados
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Novos Pedidos Hoje</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{todayOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1 text-amber-600 font-medium">
              {pendingProductionCount} aguardando produção
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Produtos Cadastrados</CardTitle>
            <AlertCircle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Disponíveis para montagem de cesta
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Últimos Pedidos */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-center py-6 text-sm text-muted-foreground">Nenhum pedido recebido ainda.</p>
              ) : (
                orders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center gap-4 border-b last:border-0 pb-4 last:pb-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {order.id.replace('order-', '#').substring(0, 5)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">Cesta de {order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Entrega: {new Date(order.delivery_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{formatPrice(order.total)}</p>
                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Mais Vendidos */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bestSellers.length === 0 ? (
                <p className="text-center py-6 text-sm text-muted-foreground">Nenhuma venda registrada.</p>
              ) : (
                bestSellers.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-md relative overflow-hidden border flex-shrink-0">
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.category}</p>
                    </div>
                    <div className="text-sm font-bold text-primary flex-shrink-0">
                      {item.count} un.
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
