import { useState } from 'react';
import { useOrders, Order } from '@/hooks/useOrders';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2, Calendar, FileText, ShoppingBag, Eye, X } from 'lucide-react';

export function OrdersAdmin() {
  const { orders, loading, updateOrderStatus, deleteOrder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none">Pendente</Badge>;
      case 'pago':
        return <Badge className="bg-green-600 hover:bg-green-700 text-white border-none">Pago</Badge>;
      case 'preparando':
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none">Preparando</Badge>;
      case 'enviado':
        return <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-none">Enviado</Badge>;
      case 'entregue':
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none">Entregue</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-500 hover:bg-red-600 text-white border-none">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Gestão de Pedidos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie e acompanhe todos os pedidos realizados no sistema de pegue e monte.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lista de Pedidos */}
        <Card className="lg:col-span-8 shadow-sm">
          <CardHeader>
            <CardTitle>Histórico de Pedidos</CardTitle>
            <CardDescription>Clique em visualizar para ver a personalização e os produtos de cada cesta.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                Nenhum pedido cadastrado ainda.
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Entrega</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className={selectedOrder?.id === order.id ? 'bg-primary/5' : ''}>
                        <TableCell className="font-bold">{order.id.replace('order-', '#').substring(0, 8)}</TableCell>
                        <TableCell className="font-medium">{order.customer_name}</TableCell>
                        <TableCell>{formatDate(order.delivery_date)}</TableCell>
                        <TableCell className="font-bold text-primary">{formatPrice(order.total)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                            title="Visualizar Pedido"
                          >
                            <Eye className="h-4 w-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
                                deleteOrder(order.id);
                                if (selectedOrder?.id === order.id) {
                                  setSelectedOrder(null);
                                }
                              }
                            }}
                            title="Remover Pedido"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detalhes do Pedido Selecionado */}
        <div className="lg:col-span-4 sticky top-8">
          {selectedOrder ? (
            <Card className="shadow-lg border-primary/20 bg-white">
              <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between py-4">
                <div>
                  <CardTitle className="text-md font-bold text-primary">
                    Detalhes do Pedido {selectedOrder.id.replace('order-', '#').substring(0, 8)}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Realizado em: {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString('pt-BR') : 'Sem data'}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => setSelectedOrder(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                {/* Alterar Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status do Pedido</label>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(val) => {
                      updateOrderStatus(selectedOrder.id, val as any);
                      setSelectedOrder({ ...selectedOrder, status: val as any });
                    }}
                  >
                    <SelectTrigger className="w-full bg-background border-border">
                      <SelectValue placeholder="Alterar status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="pago">Pago</SelectItem>
                      <SelectItem value="preparando">Preparando</SelectItem>
                      <SelectItem value="enviado">Enviado</SelectItem>
                      <SelectItem value="entregue">Entregue</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Cliente */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b pb-1">Cliente & Entrega</h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-foreground">{selectedOrder.customer_name}</p>
                    <p className="text-muted-foreground">CEP: {selectedOrder.zip_code || 'Não informado'}</p>
                    <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Calendar className="h-3.5 w-3.5 text-secondary" />
                      Entrega: {formatDate(selectedOrder.delivery_date)}
                    </p>
                  </div>
                </div>

                {/* Personalização */}
                {(selectedOrder.card_message || selectedOrder.extra_notes) && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b pb-1">Personalização</h4>
                    <div className="space-y-2 text-sm bg-muted/30 p-3 rounded-lg border border-border/20">
                      {selectedOrder.card_message && (
                        <div className="flex gap-1.5 items-start">
                          <FileText className="h-3.5 w-3.5 text-secondary mt-0.5" />
                          <p className="text-xs text-foreground italic leading-relaxed">
                            " {selectedOrder.card_message} "
                          </p>
                        </div>
                      )}
                      {selectedOrder.extra_notes && (
                        <div className="text-xs">
                          <span className="font-bold block text-muted-foreground">Observações:</span>
                          <span className="text-foreground">{selectedOrder.extra_notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Itens */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider border-b pb-1">Itens do Pedido</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-muted/10 p-1.5 rounded border border-border/40 text-xs">
                        <img src={item.product.image} alt={item.product.name} className="h-8 w-8 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.product.name}</p>
                          <p className="text-[10px] text-muted-foreground">Qtd: {item.quantity} · {formatPrice(item.product.price)}</p>
                        </div>
                        <span className="font-bold">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumo Financeiro */}
                <div className="space-y-1.5 bg-muted/30 p-3 rounded-lg text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span>{formatPrice(selectedOrder.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-primary pt-1.5 border-t">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Botão WhatsApp */}
                <a 
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999'}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block mt-2"
                >
                  <Button variant="outline" className="w-full text-xs gap-1.5 border-secondary text-secondary hover:bg-secondary/10">
                    <ShoppingBag className="h-3.5 w-3.5" /> Falar com o cliente
                  </Button>
                </a>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2 flex items-center justify-center p-8 h-60 text-center text-muted-foreground bg-muted/5">
              <div>
                <Eye className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="font-medium">Nenhum pedido selecionado</p>
                <p className="text-xs">Selecione um pedido na tabela para visualizar os detalhes completos.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
