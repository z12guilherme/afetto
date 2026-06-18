import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, MessageSquare, ArrowLeft, Calendar, FileText, User } from 'lucide-react';
import { Order } from '@/hooks/useOrders';

export function OrderConfirmed() {
  const location = useLocation();
  const order = location.state?.order as Order;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const getWhatsAppLink = (o: Order) => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999';
    const lines = [
      'Olá! Gostaria de solicitar a seguinte cesta personalizada:\n',
      '*Itens:*',
      ...o.items.map(i => `- ${i.quantity}x ${i.product.name} (${formatPrice(i.product.price * i.quantity)})`),
      '\n*Personalização:*',
      `Para: ${o.customer_name}`,
      `Data de Entrega: ${o.delivery_date}`,
      `Mensagem no Cartão: ${o.card_message || 'Nenhuma'}`,
      `Observações: ${o.extra_notes || 'Nenhuma'}`,
      `CEP: ${o.zip_code || 'Não informado'}`,
      `\n*Subtotal:* ${formatPrice(o.subtotal)}`,
      `*Frete:* ${formatPrice(o.shipping_cost)}`,
      `*Valor Total:* ${formatPrice(o.total)}`,
      '\nObrigado!'
    ];
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Pedido não encontrado</h2>
        <p className="text-muted-foreground mb-6">Não foi possível recuperar as informações do pedido.</p>
        <Link to="/">
          <Button className="bg-primary text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para a Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-muted/10 min-h-[calc(100vh-4rem)] py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Pedido Recebido com Sucesso!</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            Parabéns! Registramos o seu pedido em nossa plataforma. Agora, basta confirmar os detalhes e combinar o pagamento no WhatsApp.
          </p>
        </div>

        <Card className="border-emerald-200/50 shadow-xl bg-white">
          <CardHeader className="bg-muted/30 border-b rounded-t-xl px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold text-primary">Resumo do Pedido</CardTitle>
                <CardDescription className="text-xs">Código do Pedido: {order.id.replace('order-', '#')}</CardDescription>
              </div>
              <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none uppercase text-[10px] tracking-wider font-bold">
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Itens do Pedido */}
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Itens da Cesta</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-muted/20 p-2 rounded-lg border border-border/20">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="h-12 w-12 object-cover rounded-md flex-shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Personalização */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Dados de Entrega & Mensagem</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5">
                  <User className="h-4 w-4 text-secondary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Destinatário</p>
                    <p className="text-sm font-medium">{order.customer_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Calendar className="h-4 w-4 text-secondary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data da Entrega</p>
                    <p className="text-sm font-medium">{new Date(order.delivery_date + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                {order.card_message && (
                  <div className="flex items-start gap-2.5 md:col-span-2">
                    <FileText className="h-4 w-4 text-secondary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mensagem no Cartão</p>
                      <p className="text-sm font-medium italic">"{order.card_message}"</p>
                    </div>
                  </div>
                )}
                {order.extra_notes && (
                  <div className="flex items-start gap-2.5 md:col-span-2">
                    <FileText className="h-4 w-4 text-secondary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Observações Extras</p>
                      <p className="text-sm font-medium">{order.extra_notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Totais */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-muted-foreground text-sm">
                <span>Subtotal dos itens</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground text-sm">
                <span>Taxa de Entrega (Frete)</span>
                <span>{order.shipping_cost > 0 ? formatPrice(order.shipping_cost) : 'Grátis'}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-lg pt-2 border-t">
                <span className="text-foreground">Total Geral</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>

            <Separator />

            {/* Ações de Whatsapp */}
            <div className="bg-secondary/5 rounded-xl border border-secondary/20 p-5 text-center">
              <p className="text-sm font-semibold text-secondary mb-3">Sua conversa com a Afetto não abriu?</p>
              <p className="text-xs text-muted-foreground mb-4">
                Clique no botão abaixo para iniciar ou retomar a conversa no WhatsApp e finalizar seu pedido.
              </p>
              <a href={getWhatsAppLink(order)} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white gap-2 font-semibold">
                  <MessageSquare className="h-4 w-4" /> Enviar Mensagem no WhatsApp
                </Button>
              </a>
            </div>

            <div className="flex justify-center pt-2">
              <Link to="/">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Voltar para a Página Inicial
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
