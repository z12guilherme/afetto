import { Outlet, Link, Navigate, useNavigate } from 'react-router-dom';
import { Package, LayoutDashboard, ShoppingCart, Tag, ChevronLeft, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function AdminLayout() {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem('afetto_admin_logged_in') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem('afetto_admin_logged_in');
    toast.info('Sessão encerrada.');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="w-64 bg-background border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-bold text-lg text-primary">Afetto Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-foreground transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link to="/admin/produtos" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground transition-colors">
            <Package className="h-5 w-5" />
            Produtos
          </Link>
          <Link to="/admin/cestas" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground transition-colors">
            <Tag className="h-5 w-5" />
            Cestas
          </Link>
          <Link to="/admin/pedidos" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground transition-colors">
            <ShoppingCart className="h-5 w-5" />
            Pedidos
          </Link>
        </nav>
        <div className="p-4 border-t space-y-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive gap-2 px-2 h-9" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair do Painel
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
