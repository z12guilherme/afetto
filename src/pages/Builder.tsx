import { ProductList } from '@/components/builder/ProductList';
import { BasketReview } from '@/components/builder/BasketReview';
import { useBasketStore } from '@/store/useBasketStore';
import { Button } from '@/components/ui/button';
import { ShoppingBasket } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Builder() {
  const { items, totalItems, totalPrice } = useBasketStore();
  const [showBottomBar, setShowBottomBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hide bottom bar if we are near the bottom of the page
      const isNearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
      if (items.length > 0 && !isNearBottom) {
        setShowBottomBar(true);
      } else {
        setShowBottomBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const scrollToCheckout = () => {
    const checkoutElement = document.getElementById('checkout-section');
    if (checkoutElement) {
      checkoutElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-muted/10 min-h-[calc(100vh-4rem)] relative pb-24 lg:pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Monte Sua Cesta</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Selecione os produtos nas categorias abaixo, preencha os dados e finalize seu pedido com facilidade.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start relative">
          <div className="lg:col-span-7 xl:col-span-8">
            <ProductList />
          </div>
          <div id="checkout-section" className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 scroll-mt-24">
            <BasketReview />
          </div>
        </div>
      </div>

      {showBottomBar && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.2)] lg:hidden z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{totalItems()} itens</span>
              <span className="font-bold text-primary">{formatPrice(totalPrice())}</span>
            </div>
            <Button onClick={scrollToCheckout} className="gap-2 bg-secondary text-secondary-foreground">
              <ShoppingBasket className="h-4 w-4" /> Finalizar Pedido
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
