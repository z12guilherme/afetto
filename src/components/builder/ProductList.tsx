import { useState, useMemo } from 'react';
import { CATEGORIES } from '@/data/products';
import { useBasketStore } from '@/store/useBasketStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, SearchX } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export function ProductList() {
  const { addItem } = useBasketStore();
  const { products, loading } = useProducts();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  const filteredProducts = useMemo(() => 
    products.filter(p => p.category === activeCategory),
    [products, activeCategory]
  );

  const handleAddItem = (product: any) => {
    addItem(product);
    toast.success(`${product.name} adicionado à cesta!`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 pb-2">
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as any)} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start">
            {CATEGORIES.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 border border-border/50 shadow-sm transition-all"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex justify-center items-center"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex flex-col justify-center items-center text-center text-muted-foreground bg-white/50 backdrop-blur-sm rounded-xl border border-dashed border-border"
            >
              <SearchX className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="font-medium text-lg">Nenhum produto em "{activeCategory}"</p>
              <p className="text-sm">Explore outras categorias acima.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20"
            >
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden h-full group flex flex-col justify-between border-transparent hover:border-primary/20 shadow-sm hover:shadow-md transition-all">
                      <div>
                        <div className="aspect-square relative overflow-hidden bg-muted/10">
                          <img 
                            src={product.image || `https://placehold.co/400x400/0B2A5B/FFFFFF?text=${encodeURIComponent(product.name)}`} 
                            alt={product.name} 
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-sm leading-tight text-foreground line-clamp-2" title={product.name}>
                            {product.name}
                          </h3>
                          <p className="font-bold text-lg text-primary mt-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                          </p>
                        </CardContent>
                      </div>
                      <div className="p-4 pt-0">
                        <Button 
                          onClick={() => handleAddItem(product)} 
                          className="w-full gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-transform active:scale-95 font-semibold"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" /> Adicionar
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
