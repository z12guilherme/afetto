import React, { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2, Plus, Loader2, Pencil, X } from 'lucide-react';
import { CATEGORIES, Category } from '@/data/products';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function ProductsAdmin() {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
    });
    // Rolar até o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      category: CATEGORIES[0] as Category,
      image: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || `https://placehold.co/400x400/0B2A5B/FFFFFF?text=${encodeURIComponent(formData.name)}`,
    };

    if (editingId) {
      await updateProduct(editingId, productData);
      setEditingId(null);
    } else {
      await addProduct(productData);
    }

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Gestão de Produtos</h1>
          <p className="text-muted-foreground mt-2">Adicione, edite ou remova produtos usando Supabase/Local.</p>
        </div>
      </div>

      <Card className={editingId ? 'border-secondary/40 shadow-md bg-secondary/5' : ''}>
        <CardHeader>
          <CardTitle>{editingId ? 'Editar Produto' : 'Adicionar Novo Produto'}</CardTitle>
          <CardDescription>
            {editingId ? 'Modifique os dados do produto selecionado.' : 'Cadastre um novo item para os clientes usarem na cesta.'}
          </CardDescription>
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
            
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1 md:flex-initial">
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                ) : editingId ? (
                  <><Pencil className="mr-2 h-4 w-4" /> Salvar Alterações</>
                ) : (
                  <><Plus className="mr-2 h-4 w-4" /> Cadastrar Produto</>
                )}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  <X className="mr-2 h-4 w-4" /> Cancelar
                </Button>
              )}
            </div>
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
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditClick(product)}
                              className="text-secondary hover:text-secondary hover:bg-secondary/10"
                              title="Editar Produto"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                if (window.confirm(`Excluir o produto "${product.name}"?`)) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Excluir Produto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
