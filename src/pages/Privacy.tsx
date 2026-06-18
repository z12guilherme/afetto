import { Shield } from 'lucide-react';

export function Privacy() {
  return (
    <div className="bg-muted/10 min-h-[calc(100vh-4rem)] py-16 px-4">
      <div className="container mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-xl shadow-sm border border-border/50 space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">Política de Privacidade</h1>
            <p className="text-xs text-muted-foreground mt-1">Última atualização: 18 de Junho de 2026</p>
          </div>
        </div>

        <section className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            A sua privacidade é de extrema importância para nós na <strong>Afetto</strong>. Esta política detalha como coletamos, usamos, armazenamos e protegemos suas informações pessoais ao utilizar nosso site.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">1. Coleta de Informações</h2>
          <p>
            Coletamos informações que você nos fornece diretamente ao realizar um pedido de cesta personalizada:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nome do remetente e destinatário;</li>
            <li>Informações de entrega, incluindo endereço e CEP;</li>
            <li>Mensagem de texto que será impressa no cartão de presente;</li>
            <li>Informações de contato (e-mail, WhatsApp ou telefone).</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">2. Uso das Informações</h2>
          <p>
            As informações coletadas são utilizadas exclusivamente para:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Processar e montar a sua cesta personalizada;</li>
            <li>Calcular o frete exato de entrega;</li>
            <li>Realizar a entrega no endereço solicitado e na data agendada;</li>
            <li>Preencher a mensagem do cartão conforme solicitado;</li>
            <li>Entrar em contato via WhatsApp para confirmar o pagamento e entrega.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">3. Compartilhamento de Dados</h2>
          <p>
            Não vendemos nem alugamos suas informações pessoais a terceiros. Seus dados de entrega são compartilhados estritamente com os parceiros logísticos responsáveis por efetuar a entrega das cestas no endereço estipulado.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">4. Segurança dos Dados</h2>
          <p>
            Implementamos medidas técnicas e organizacionais adequadas para garantir a segurança dos dados pessoais. Ao utilizar conexão criptografada (HTTPS), garantimos que todos os dados transmitidos entre seu navegador e nossos servidores ou banco de dados (Supabase) permaneçam protegidos.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">5. Direitos do Usuário</h2>
          <p>
            Você tem o direito de solicitar o acesso, retificação ou exclusão permanente dos seus dados cadastrados em nosso sistema a qualquer momento. Para isso, entre em contato através do e-mail <em>contato@afetto.com.br</em>.
          </p>
        </section>
      </div>
    </div>
  );
}
