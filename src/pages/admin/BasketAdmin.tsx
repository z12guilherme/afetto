import { useState } from 'react';
import { useCatalog } from '@/hooks/useCatalog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus, Loader2, Minus } from 'lucide-react';
import { toast } from 'sonner';

export function BasketAdmin() {
  const { baskets, loading, addBasket, deleteBasket } = useCatalog();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    tag: '',
    image: '',
    items: [''],
  });

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

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...formData.items];
    newItems[index] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItemField = () => {
    setFormData({ ...formData, items: [...formData.items, ''] });
  };

  const removeItemField = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty items
    const filteredItems = formData.items.filter(item => item.trim() !== '');
    
    if (filteredItems.length === 0) {
      toast.error('Adicione pelo menos um item à cesta.');
      return;
    }

    setIsSubmitting(true);
    
    await addBasket({
      name: formData.name,
      price: parseFloat(formData.price),
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
      tag: formData.tag || null,
      image: formData.image || `https://placehold.co/400x400/0B2A5B/FFFFFF?text=${encodeURIComponent(formData.name)}`,
      items: filteredItems,
    });

    setFormData({
      name: '',
      price: '',
      oldPrice: '',
      tag: '',
      image: '',
      items: [''],
    });
    
    setIsSubmitting(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Gestão de Cestas</h1>
        <p className="text-muted-foreground mt-2">Crie e gerencie cestas predefinidas para o catálogo.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Cesta</CardTitle>
          <CardDescription>Adicione uma nova cesta pronta ao catálogo de produtos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Cesta</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag">Etiqueta (ex: Mais Vendida)</Label>
                <Input 
                  id="tag" 
                  placeholder="Opcional"
                  value={formData.tag} 
                  onChange={(e) => setFormData({...formData, tag: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
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
                  onChange={(e) => setFormData({...formData, oldPrice: e.target.value})} 
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
                        setFormData({...formData, image: e.target.value});
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
                    onClick={() => setFormData({...formData, image: ''})}
                    className="text-xs text-destructive mt-1 h-auto py-1 px-0"
                  >
                    Remover imagem
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label>O que vem na cesta? (Itens)</Label>
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input 
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    placeholder={`Item ${index + 1}`}
                    required={index === 0}
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                    onClick={() => removeItemField(index)}
                    disabled={formData.items.length === 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addItemField}
                className="mt-2 text-primary"
              >
                <Plus className="mr-2 h-3 w-3" /> Adicionar mais um item
              </Button>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adicionando...</>
              ) : (
                <><Plus className="mr-2 h-4 w-4" /> Criar Cesta</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cestas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
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
                    <TableHead>Itens</TableHead>
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
                          {basket.items.join(', ')}
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
