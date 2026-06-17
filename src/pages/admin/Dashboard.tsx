import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Visão geral da sua plataforma de presentes.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lucro Estimado (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R$ 14.520,00</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-secondary" /> +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendas no Mês</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">+125</div>
            <p className="text-xs text-muted-foreground mt-1">
               +15% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground mt-1">
               4 aguardando produção
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-destructive/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Estoque Baixo</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pelúcia P, Caneca Branca, Ferrero Rocher
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Últimos Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1,2,3,4].map((i) => (
                <div key={i} className="flex items-center gap-4 border-b last:border-0 pb-4 last:pb-0">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    #{1000 + i}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cesta Personalizada ({i + 2} itens)</p>
                    <p className="text-xs text-muted-foreground">João Silva - Entregar amanhã</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">R$ 254,00</p>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-secondary/10 text-secondary rounded">
                      Em Produção
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-md relative overflow-hidden">
                  <img src="https://placehold.co/400x400/0B2A5B/FFFFFF?text=Ferrero" alt="Ferrero" className="object-cover w-full h-full" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Ferrero Rocher 12un</p>
                  <p className="text-xs text-muted-foreground">Chocolates</p>
                </div>
                <div className="text-sm font-bold">145 unid.</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-md relative overflow-hidden">
                  <img src="https://placehold.co/400x400/0B2A5B/FFFFFF?text=Cesta" alt="Cesta" className="object-cover w-full h-full" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Cesta de Vime G</p>
                  <p className="text-xs text-muted-foreground">Base</p>
                </div>
                <div className="text-sm font-bold">98 unid.</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-md relative overflow-hidden">
                  <img src="https://placehold.co/400x400/0B2A5B/FFFFFF?text=Rosas" alt="Rosas" className="object-cover w-full h-full" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Buquê de Rosas Vermelhas</p>
                  <p className="text-xs text-muted-foreground">Flores</p>
                </div>
                <div className="text-sm font-bold">64 unid.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
