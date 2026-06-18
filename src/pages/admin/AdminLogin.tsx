import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingBasket, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('afetto_admin_logged_in', 'true');
        toast.success('Login realizado com sucesso!', {
          description: 'Seja bem-vindo ao painel da Afetto.',
        });
        navigate('/admin');
      } else {
        toast.error('Credenciais inválidas', {
          description: 'Por favor, tente novamente com os dados corretos.',
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-6 gap-2">
          <div className="p-3 bg-primary text-white rounded-full shadow-md">
            <ShoppingBasket className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Afetto Presentes</h1>
        </div>

        <Card className="border-primary/10 shadow-xl bg-white/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl text-primary font-bold">Acesso Administrativo</CardTitle>
            <CardDescription>Insira suas credenciais para gerenciar a plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/95 text-white mt-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar no Painel'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
