import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBasketStore } from '@/store/useBasketStore';
import { useOrders } from '@/hooks/useOrders';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash2, Minus, Plus, ShoppingBasket } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Por favor, insira o nome do destinatário'),
  message: z.string().optional(),
  date: z.string().min(10, 'Selecione uma data de entrega válida'),
  notes: z.string().optional(),
  zipCode: z.string().min(9, 'Insira o CEP completo (00000-000)'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function BasketReview() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, personalization, updatePersonalization, clearBasket } = useBasketStore();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const [shippingCost, setShippingCost] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { ...personalization, zipCode: '' },
  });

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.substring(0, 8);
    if (val.length > 5) {
      val = `${val.substring(0, 5)}-${val.substring(5)}`;
    }
    form.setValue('zipCode', val, { shouldValidate: true });
  };

  const calculateShipping = () => {
    const rawZip = form.getValues('zipCode');
    const zipCode = rawZip?.replace(/\D/g, '');
    if (!zipCode || zipCode.length < 8) {
      toast.error('CEP inválido', { description: 'Por favor, insira um CEP de 8 dígitos para calcular o frete.' });
      return;
    }
    
    setIsCalculatingShipping(true);
    
    setTimeout(() => {
      let cost = 0;
      const prefix = zipCode.substring(0, 2);
      const numPrefix = parseInt(prefix, 10);
      
      if (numPrefix >= 1 && numPrefix <= 9) {
        cost = 15.00;
        toast.success('Frete calculado!', { description: 'São Paulo e Grande SP: R$ 15,00' });
      } else if (numPrefix >= 11 && numPrefix <= 19) {
        cost = 25.00;
        toast.success('Frete calculado!', { description: 'Interior/Litoral de São Paulo: R$ 25,00' });
      } else if (zipCode.startsWith('2')) {
        cost = 30.00;
        toast.success('Frete calculado!', { description: 'Sudeste (RJ/ES): R$ 30,00' });
      } else if (zipCode.startsWith('3')) {
        cost = 32.00;
        toast.success('Frete calculado!', { description: 'Sudeste (MG): R$ 32,00' });
      } else {
        cost = 45.00;
        toast.success('Frete calculado!', { description: 'Outras regiões do Brasil: R$ 45,00' });
      }
      
      setShippingCost(cost);
      setIsCalculatingShipping(false);
    }, 800);
  };

  const handleCheckout = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast.error('Sua cesta está vazia!', {
        description: 'Adicione produtos antes de finalizar.',
      });
      return;
    }

    if (shippingCost === 0) {
      toast.error('Frete não calculado!', {
        description: 'Por favor, calcule o frete utilizando seu CEP.',
      });
      return;
    }

    // Save personalization fields in store
    updatePersonalization('name', data.name);
    updatePersonalization('message', data.message || '');
    updatePersonalization('date', data.date);
    updatePersonalization('notes', data.notes || '');

    const subtotal = totalPrice();
    const finalTotal = subtotal + shippingCost;

    // Salvar pedido no banco/local
    const savedOrder = await addOrder({
      customer_name: data.name,
      delivery_date: data.date,
      card_message: data.message,
      extra_notes: data.notes,
      zip_code: data.zipCode,
      shipping_cost: shippingCost,
      subtotal: subtotal,
      total: finalTotal,
      items: items,
    });

    if (!savedOrder) {
      toast.error('Erro ao finalizar pedido', {
        description: 'Não foi possível registrar seu pedido. Tente novamente.',
      });
      return;
    }

    // Formatar mensagem WhatsApp
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999';
    const lines = [
      'Olá! Gostaria de solicitar a seguinte cesta personalizada:\n',
      '*Itens:*',
      ...items.map(i => `- ${i.quantity}x ${i.product.name} (${formatPrice(i.product.price * i.quantity)})`),
      '\n*Personalização:*',
      `Para: ${data.name}`,
      `Data de Entrega: ${data.date}`,
      `Mensagem no Cartão: ${data.message || 'Nenhuma'}`,
      `Observações: ${data.notes || 'Nenhuma'}`,
      `CEP: ${data.zipCode}`,
      `\n*Subtotal:* ${formatPrice(subtotal)}`,
      `*Frete:* ${formatPrice(shippingCost)}`,
      `*Valor Total:* ${formatPrice(finalTotal)}`,
      '\nObrigado!'
    ];

    const message = encodeURIComponent(lines.join('\n'));
    
    // Tenta abrir a aba do WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

    // Limpar o carrinho e a personalização
    clearBasket();

    // Redireciona para página de confirmação passando o pedido recém-criado
    navigate('/pedido-confirmado', { state: { order: savedOrder } });
  };

  const { onChange: onZipCodeChange, ...zipCodeReg } = form.register('zipCode');

  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)] w-full sticky top-24 border-primary/20 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-xl px-6 py-4">
        <CardTitle className="flex justify-between items-center text-xl font-semibold">
          <div className="flex items-center gap-2">
            <ShoppingBasket className="h-5 w-5" />
            <span>Sua Cesta</span>
          </div>
          <span className="bg-primary-foreground/20 px-3 py-1 rounded-full text-sm">
            {totalItems()} itens
          </span>
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-1 w-full px-6">
        <div className="py-4 space-y-6">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground mt-10"
              >
                <div className="p-4 bg-muted rounded-full mb-4">
                  <ShoppingBasket className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <p className="font-medium text-lg">Sua cesta está vazia</p>
                <p className="text-sm">Selecione produtos ao lado para criar o seu presente.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="list"
                className="space-y-4"
              >
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div 
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, scale: 0.9 }}
                      className="flex gap-4 items-center bg-background p-3 rounded-xl border border-border/50 shadow-sm"
                    >
                      <img src={item.product.image} alt={item.product.name} className="h-16 w-16 object-cover rounded-md flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium leading-none mb-1 text-foreground truncate">{item.product.name}</h4>
                        <span className="text-sm font-bold text-primary">{formatPrice(item.product.price)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-muted/60 rounded-md">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-4 text-center font-medium">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Separator />
              <form id="checkout-form" onSubmit={form.handleSubmit(handleCheckout)} className="space-y-4 pt-2 pb-4">
                <h3 className="font-semibold text-lg text-primary">Personalização</h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="name">Para quem é o presente? (Nome)</Label>
                    <Input id="name" placeholder="Ex: Maria" {...form.register('name')} className="bg-background" />
                    {form.formState.errors.name && (
                      <p className="text-xs text-destructive mt-0.5">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="message">Mensagem do Cartão (Opcional)</Label>
                    <Input id="message" placeholder="Deixe sua mensagem de carinho..." {...form.register('message')} className="bg-background" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="date">Data da Entrega</Label>
                      <Input id="date" type="date" min={tomorrowStr} {...form.register('date')} className="bg-background" />
                      {form.formState.errors.date && (
                        <p className="text-xs text-destructive mt-0.5">{form.formState.errors.date.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="notes">Observações extras</Label>
                      <Input id="notes" placeholder="Ex: Entregar de manhã" {...form.register('notes')} className="bg-background" />
                    </div>
                  </div>
                  <div className="space-y-1 pt-2">
                    <Label htmlFor="zipCode">Calcular Frete (CEP)</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="zipCode" 
                        placeholder="00000-000" 
                        {...zipCodeReg}
                        onChange={(e) => {
                          onZipCodeChange(e);
                          handleZipCodeChange(e);
                        }}
                        className="bg-background flex-1" 
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={calculateShipping}
                        disabled={isCalculatingShipping}
                      >
                        {isCalculatingShipping ? 'Calculando...' : 'Calcular'}
                      </Button>
                    </div>
                    {form.formState.errors.zipCode && (
                      <p className="text-xs text-destructive mt-0.5">{form.formState.errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-6 bg-background rounded-b-xl border-t shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.1)]">
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice())}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <span>Frete</span>
            <span>{shippingCost > 0 ? formatPrice(shippingCost) : '---'}</span>
          </div>
          <div className="flex items-center justify-between font-bold text-xl pt-2 border-t">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{formatPrice(totalPrice() + shippingCost)}</span>
          </div>
        </div>
        <Button 
          type="submit" 
          form="checkout-form"
          className="w-full text-lg h-14 bg-secondary text-white hover:bg-secondary/90 shadow-md transition-transform hover:scale-[1.02]"
          disabled={items.length === 0}
        >
          Enviar Pedido pelo WhatsApp
        </Button>
      </div>
    </Card>
  );
}
