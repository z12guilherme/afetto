import { FileText } from 'lucide-react';

export function Terms() {
  return (
    <div className="bg-muted/10 min-h-[calc(100vh-4rem)] py-16 px-4">
      <div className="container mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-xl shadow-sm border border-border/50 space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">Termos de Uso</h1>
            <p className="text-xs text-muted-foreground mt-1">Última atualização: 18 de Junho de 2026</p>
          </div>
        </div>

        <section className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Bem-vindo à <strong>Afetto</strong>. Ao acessar este site e utilizar nossos serviços de montagem e entrega de cestas personalizadas, você concorda em cumprir e estar vinculado aos seguintes termos de uso.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">1. Uso do Serviço Pegue e Monte</h2>
          <p>
            Nossa plataforma disponibiliza um construtor interativo para montagem de cestas personalizadas. O usuário é inteiramente responsável pela seleção dos produtos, quantidades e pelo teor das mensagens escritas nos cartões personalizados.
          </p>
          <p>
            Reservamo-nos o direito de recusar a impressão de mensagens contendo linguagem ofensiva, difamatória, preconceituosa ou ilegal.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">2. Encomendas, Pagamento e WhatsApp</h2>
          <p>
            O fechamento do pedido no site é um pré-cadastro de intenção de compra. A finalização e validação ocorrem mediante o contato iniciado no WhatsApp oficial da loja.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Os pagamentos devem ser efetuados através de PIX ou cartão de crédito conforme instruções fornecidas no atendimento do WhatsApp.</li>
            <li>A montagem e produção da cesta só serão iniciadas após a confirmação do pagamento integral do pedido (itens + frete).</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">3. Entregas, Prazos e Agendamento</h2>
          <p>
            As entregas são feitas na data agendada pelo usuário no formulário de checkout.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Exigimos uma antecedência mínima indicada no seletor de datas para possibilitar a preparação impecável da cesta.</li>
            <li>É de responsabilidade do cliente garantir que haverá alguém disponível no endereço de entrega na data agendada para receber o presente.</li>
            <li>Caso a entrega não possa ser efetuada por ausência do destinatário ou endereço incorreto, taxas adicionais de reenvio poderão ser cobradas.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground pt-4">4. Alterações nos Produtos e Disponibilidade</h2>
          <p>
            Por trabalharmos com flores naturais, frutas e itens artesanais, a disponibilidade de alguns produtos específicos pode variar de acordo com a sazonalidade ou estoque.
          </p>
          <p>
            Caso algum produto selecionado não esteja disponível, entraremos em contato via WhatsApp para sugerir uma substituição por um item equivalente de igual ou maior valor.
          </p>

          <h2 className="text-lg font-bold text-foreground pt-4">5. Cancelamentos e Reembolsos</h2>
          <p>
            Devido à natureza personalizada e perecível das cestas de presentes, cancelamentos com reembolso total só serão aceitos se solicitados com no mínimo 48 horas de antecedência em relação à data agendada para entrega.
          </p>
        </section>
      </div>
    </div>
  );
}
