import React, { useState } from 'react';
import { useCatalog, BasketProductItem } from '@/hooks/useCatalog';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus, Loader2, Minus, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export function BasketAdmin() {
  const { baskets, loading: loadingBaskets, addBasket, deleteBasket } = useCatalog();
  const { products, loading: loadingProducts } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    tag: '',
    image: '',
    items: [] as BasketProductItem[],
  });

  const [selectedProductId, setSelectedProductId] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("A imagem deve ser menor que 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!selectedProductId) {
      toast.error('Selecione um produto para adicionar.');
      return;
    }
    const alreadyAdded = formData.items.find(i => i.productId === selectedProductId);
    if (alreadyAdded) {
      // Incrementa a quantidade
      setFormData({
        ...formData,
        items: formData.items.map(i =>
          i.productId === selectedProductId ? { ...i, quantity: i.quantity + 1 } : i
        )
      });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { productId: selectedProductId, quantity: 1 }]
      });
    }
    setSelectedProductId('');
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setFormData({
      ...formData,
      items: formData.items
        .map(i => i.productId === productId ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0)
    });
  };

  const handleRemoveItem = (productId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(i => i.productId !== productId)
    });
  };

  const getProductById = (id: string) => products.find(p => p.id === id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      toast.error('Adicione pelo menos um produto à cesta.');
      return;
    }

    setIsSubmitting(true);

    await addBasket({
      name: formData.name,
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
      tag: formData.tag || null,
      image: formData.image || `https://placehold.co/400x400/0B2A5B/FFFFFF?text=${encodeURIComponent(formData.name)}`,
      items: formData.items,
    });

    setFormData({ name: '', price: '', oldPrice: '', tag: '', image: '', items: [] });
    setIsSubmitting(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Gestão de Cestas</h1>
        <p className="text-muted-foreground mt-2">
          Crie cestas <span className="font-medium text-foreground">sugeridas</span> usando os produtos cadastrados. O cliente pode personalizar livremente no builder.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Cesta Sugerida</CardTitle>
          <CardDescription>
            Monte uma cesta modelo selecionando produtos reais do catálogo. Ela aparecerá como sugestão para o cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Cesta</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag">Etiqueta (ex: Mais Vendida)</Label>
                <Input
                  id="tag"
                  placeholder="Opcional"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço Sugerido (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oldPrice">Preço Antigo (R$ - opcional)</Label>
                <Input
                  id="oldPrice"
                  type="number"
                  step="0.01"
                  placeholder="Para mostrar desconto"
                  value={formData.oldPrice}
                  onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image">Imagem (URL ou Upload)</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="imageUrl"
                    placeholder="https://..."
                    value={formData.image.startsWith('data:') ? 'Imagem carregada' : formData.image}
                    onChange={(e) => {
                      if (!formData.image.startsWith('data:')) {
                        setFormData({ ...formData, image: e.target.value });
                      }
                    }}
                    disabled={formData.image.startsWith('data:')}
                    className="flex-1"
                  />
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                      id="imageUpload"
                    />
                    <Button type="button" variant="secondary" className="w-full sm:w-[120px] shrink-0 pointer-events-none">
                      Upload Foto
                    </Button>
                  </div>
                </div>
                {formData.image && formData.image.startsWith('data:') && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="text-xs text-destructive mt-1 h-auto py-1 px-0"
                  >
                    Remover imagem
                  </Button>
                )}
              </div>
            </div>

            {/* Seletor de produtos */}
            <div className="space-y-3">
              <Label>Produtos que compõem esta cesta</Label>
              <p className="text-xs text-muted-foreground -mt-1">
                Selecione produtos reais do catálogo. O cliente poderá trocar qualquer item no builder.
              </p>

              {loadingProducts ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Carregando produtos...
                </div>
              ) : products.length === 0 ? (
                <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-4">
                  Nenhum produto cadastrado. Cadastre produtos primeiro em <strong>Gestão de Produtos</strong>.
                </p>
              ) : (
                <div className="flex gap-2">
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione um produto..." />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          <div className="flex items-center gap-2">
                            <span>{p.name}</span>
                            <span className="text-muted-foreground text-xs">— {formatPrice(p.price)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="secondary" onClick={handleAddProduct} disabled={!selectedProductId}>
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
              )}

              {/* Lista de itens adicionados */}
              {formData.items.length > 0 && (
                <div className="space-y-2 mt-2 rounded-lg border bg-muted/10 p-3">
                  {formData.items.map(item => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    return (
                      <div key={item.productId} className="flex items-center gap-3 bg-background rounded-md px-3 py-2 border border-border/50 shadow-sm">
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category} · {formatPrice(product.price)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUpdateQuantity(item.productId, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleUpdateQuantity(item.productId, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                  <p className="text-xs text-muted-foreground pt-1 px-1">
                    {formData.items.length} produto(s) — Preço calculado automaticamente no pedido
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando...</>
              ) : (
                <><Plus className="mr-2 h-4 w-4" /> Criar Cesta Sugerida</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Listagem */}
      <Card>
        <CardHeader>
          <CardTitle>Cestas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingBaskets ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Imagem</TableHead>
                    <TableHead>Nome & Tag</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {baskets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        Nenhuma cesta cadastrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    baskets.map((basket) => (
                      <TableRow key={basket.id}>
                        <TableCell>
                          <img src={basket.image} alt={basket.name} className="w-12 h-12 rounded-md object-cover" />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{basket.name}</div>
                          {basket.tag && (
                            <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary mt-1">
                              {basket.tag}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground min-w-[200px]">
                          <div className="flex flex-wrap gap-1">
                            {basket.items.map((item) => {
                              const product = products.find(p => p.id === item.productId);
                              return (
                                <Badge key={item.productId} variant="outline" className="text-xs font-normal gap-1">
                                  <Package className="h-3 w-3" />
                                  {product ? `${item.quantity}x ${product.name}` : `ID: ${item.productId}`}
                                </Badge>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{formatPrice(basket.price)}</div>
                          {basket.oldPrice && (
                            <div className="text-xs text-muted-foreground line-through">{formatPrice(basket.oldPrice)}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteBasket(basket.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
