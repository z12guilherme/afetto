import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, Loader2, Pencil, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { useProducts } from '@/hooks/useProducts';
import { useBasketStore, BasketItem } from '@/store/useBasketStore';
import { toast } from 'sonner';

export function Catalog() {
  const { baskets, loading: loadingBaskets } = useCatalog();
  const { products } = useProducts();
  const { loadBasket } = useBasketStore();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const handleUseAsBase = (basketId: string, basketName: string) => {
    const basket = baskets.find(b => b.id === basketId);
    if (!basket) return;

    // Resolve produtos pelos IDs
    const resolvedItems: BasketItem[] = basket.items
      .map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;
        return { product, quantity: item.quantity };
      })
      .filter(Boolean) as BasketItem[];

    if (resolvedItems.length === 0) {
      toast.error('Não foi possível carregar os produtos desta cesta.');
      return;
    }

    loadBasket(resolvedItems, basketName);
    toast.success(`Cesta "${basketName}" carregada! Personalize como quiser.`);
    navigate('/montar-cesta');
  };

  const getBasketItemNames = (basket: typeof baskets[0]) => {
    return basket.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return product ? `${item.quantity}x ${product.name}` : null;
    }).filter(Boolean) as string[];
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Catálogo de Cestas</h1>
          <p className="text-muted-foreground mt-2">
            Cestas sugeridas preparadas com muito afeto — personalize como quiser!
          </p>
        </div>
        <Link to="/montar-cesta">
          <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white gap-2">
            <Pencil className="h-4 w-4" />
            Montar do zero
          </Button>
        </Link>
      </div>

      {/* Banner explicativo */}
      <div className="mb-8 rounded-xl bg-primary/5 border border-primary/10 p-4 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">Estas cestas são sugestões, não produtos fechados!</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Clique em <strong>"Usar como Base"</strong> e o builder abrirá com os itens pré-selecionados.
            Você pode trocar, remover ou adicionar qualquer produto.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loadingBaskets ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : baskets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/10 rounded-xl">
            Nenhuma cesta cadastrada.
          </div>
        ) : (
          baskets.map(cesta => {
            const itemNames = getBasketItemNames(cesta);
            return (
              <Card key={cesta.id} className="overflow-hidden group flex flex-col border-none shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {cesta.tag && (
                    <Badge className="absolute top-3 left-3 z-10 bg-secondary text-white border-none">
                      {cesta.tag}
                    </Badge>
                  )}
                  <Badge className="absolute top-3 right-3 z-10 bg-primary/80 text-white border-none text-[10px]">
                    Sugestão
                  </Badge>
                  <img
                    src={cesta.image || `https://placehold.co/400x400/0B2A5B/FFFFFF?text=${encodeURIComponent(cesta.name)}`}
                    alt={cesta.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl text-foreground">{cesta.name}</h3>
                  <div className="flex items-end gap-2 mt-2 mb-4">
                    <p className="font-bold text-2xl text-primary">{formatPrice(cesta.price)}</p>
                    {cesta.oldPrice && (
                      <p className="text-muted-foreground line-through text-sm mb-1">{formatPrice(cesta.oldPrice)}</p>
                    )}
                  </div>

                  <div className="mb-6 flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2">O que vem na sugestão:</p>
                    {itemNames.length > 0 ? (
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc marker:text-primary">
                        {itemNames.map((name, idx) => (
                          <li key={idx}>{name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        {cesta.items.length} produto(s)
                      </p>
                    )}
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white gap-2 transition-transform active:scale-[0.98]"
                    onClick={() => handleUseAsBase(cesta.id, cesta.name)}
                  >
                    <ShoppingBasket className="h-4 w-4" /> Usar como Base
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
