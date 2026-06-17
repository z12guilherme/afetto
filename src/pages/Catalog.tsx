import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';

export function Catalog() {
  const { baskets, loading } = useCatalog();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };


  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Catálogo de Cestas</h1>
          <p className="text-muted-foreground mt-2">Cestas prontas preparadas com muito afeto.</p>
        </div>
        <Link to="/montar-cesta">
          <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
            Prefiro montar minha própria cesta
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : baskets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/10 rounded-xl">
            Nenhuma cesta cadastrada.
          </div>
        ) : (
          baskets.map(cesta => (
            <Card key={cesta.id} className="overflow-hidden group flex flex-col border-none shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden">
                {cesta.tag && (
                  <Badge className="absolute top-3 left-3 z-10 bg-secondary text-white border-none">
                    {cesta.tag}
                  </Badge>
                )}
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
                  <p className="text-sm font-medium text-muted-foreground mb-2">O que vem na cesta:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc marker:text-primary">
                    {cesta.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90 text-white gap-2">
                  <ShoppingBasket className="h-4 w-4" /> Comprar
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
