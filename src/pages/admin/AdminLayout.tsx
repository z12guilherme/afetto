import { Outlet, Link } from 'react-router-dom';
import { Package, LayoutDashboard, ShoppingCart, Tag, ChevronLeft } from 'lucide-react';

export function AdminLayout() {
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
          <Link to="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground transition-colors">
            <ShoppingCart className="h-5 w-5" />
            Pedidos
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" />
            Voltar ao site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
