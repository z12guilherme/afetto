import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Mensagem enviada com sucesso!', {
        description: 'Responderemos o seu contato por e-mail em até 24 horas úteis.'
      });
      setForm({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-muted/10 min-h-[calc(100vh-4rem)] py-16 px-4">
      <div className="container mx-auto max-w-4xl space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary tracking-tight">Fale Conosco</h1>
          <p className="text-muted-foreground mt-2">Dúvidas, sugestões ou pedidos sob medida? Estamos aqui para ajudar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Informações */}
          <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="bg-white p-6 rounded-xl border border-border/50 shadow-sm space-y-6 flex-1">
              <h3 className="font-bold text-lg text-primary mb-4 border-b pb-2">Informações de Contato</h3>
              
              <div className="flex gap-3 text-sm">
                <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                <div>
                  <p className="font-bold text-foreground">WhatsApp</p>
                  <p className="text-muted-foreground">(11) 99999-9999</p>
                </div>
              </div>

              <div className="flex gap-3 text-sm">
                <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                <div>
                  <p className="font-bold text-foreground">E-mail</p>
                  <p className="text-muted-foreground">contato@afetto.com.br</p>
                </div>
              </div>

              <div className="flex gap-3 text-sm">
                <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Endereço</p>
                  <p className="text-muted-foreground">São Paulo - SP</p>
                </div>
              </div>

              <div className="flex gap-3 text-sm">
                <Clock className="h-5 w-5 text-secondary flex-shrink-0" />
                <div>
                  <p className="font-bold text-foreground">Horário de Atendimento</p>
                  <p className="text-muted-foreground">Seg - Sex: 9h às 18h<br />Sáb: 9h às 13h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <Card className="md:col-span-7 border-primary/10 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-primary font-bold">Envie uma Mensagem</CardTitle>
              <CardDescription>Preencha os campos abaixo para entrar em contato diretamente com nossa equipe.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Seu Nome</Label>
                  <Input 
                    id="name" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    placeholder="Ex: Maria Souza" 
                    required 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="email">Seu E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    placeholder="Ex: maria@email.com" 
                    required 
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Mensagem</Label>
                  <textarea 
                    id="message"
                    rows={4}
                    value={form.message} 
                    onChange={(e) => setForm({ ...form, message: e.target.value })} 
                    placeholder="Digite seu recado ou dúvida..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/95 text-white gap-2">
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                  ) : (
                    <><Send className="h-4 w-4" /> Enviar Mensagem</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
