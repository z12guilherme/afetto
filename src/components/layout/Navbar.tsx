import { Link } from 'react-router-dom';
import { ShoppingBasket, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useBasketStore } from '@/store/useBasketStore';

export function Navbar() {
  const { items, totalItems } = useBasketStore();
  const routes = [
    { label: 'Início', path: '/' },
    { label: 'Catálogo', path: '/catalogo' },
    { label: 'Montar Minha Cesta', path: '/montar-cesta' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBasket className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-primary tracking-tight">Afetto</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              {route.label}
            </Link>
          ))}
          <div className="flex items-center ml-4 gap-4">
            <Link to="/montar-cesta">
              <Button variant="secondary" size="sm" className="gap-2 relative">
                <ShoppingBasket className="h-4 w-4" />
                <span>Minha Cesta</span>
                {totalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems()}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    className="text-lg font-medium hover:text-primary"
                  >
                    {route.label}
                  </Link>
                ))}
                <Link to="/admin" className="mt-4">
                  <Button className="w-full">Painel Admin</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
