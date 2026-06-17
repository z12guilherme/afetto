import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { CATEGORIES, Category } from '@/data/products';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export function ProductsAdmin() {
  const { products, loading, addProduct, deleteProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: CATEGORIES[0] as Category,
    image: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await addProduct({
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || `https://placehold.co/400x400/0B2A5B/FFFFFF?text=${formData.name}`,
    });

    setFormData({
      name: '',
      price: '',
      category: CATEGORIES[0] as Category,
      image: '',
    });
    
    setIsSubmitting(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Gestão de Produtos</h1>
        <p className="text-muted-foreground mt-2">Adicione ou remova produtos usando Supabase.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Produto</CardTitle>
          <CardDescription>Cadastre um novo item para os clientes usarem na cesta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
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
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => setFormData({...formData, category: val as Category})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="image">Imagem (URL ou Upload)</Label>
                <div className="flex gap-2">
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
                    <Button type="button" variant="secondary" className="w-[120px] shrink-0 pointer-events-none">
                      Upload
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
                    Remover imagem carregada
                  </Button>
                )}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="mt-2 w-full md:w-auto">
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adicionando...</>
              ) : (
                <><Plus className="mr-2 h-4 w-4" /> Cadastrar Produto</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Produtos Cadastrados</CardTitle>
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
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        Nenhum produto cadastrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteProduct(product.id)}
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
