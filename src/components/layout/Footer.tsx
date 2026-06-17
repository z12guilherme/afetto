import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, ShoppingBasket } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link gap-2 to="/" className="flex items-center space-x-2">
              <ShoppingBasket className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl text-primary">Afetto</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Presentes que criam memórias. Transformamos presentes em momentos inesquecíveis.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Links Úteis</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/catalogo" className="hover:text-primary">Catálogo</Link></li>
              <li><Link to="/montar-cesta" className="hover:text-primary">Montar Cesta</Link></li>
              <li><Link to="/sobre" className="hover:text-primary">Sobre Nós</Link></li>
              <li><Link to="/contato" className="hover:text-primary">Contato</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Atendimento</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Seg - Sex: 9h às 18h</li>
              <li>Sáb: 9h às 13h</li>
              <li>WhatsApp: (11) 99999-9999</li>
              <li>contato@afetto.com.br</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Afetto. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/privacidade" className="hover:underline">Políticas de Privacidade</Link>
            <Link to="/termos" className="hover:underline">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
