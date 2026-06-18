# TODO - Afetto (Pronto para Produção)

Este documento lista todas as pendências, correções e melhorias necessárias para que o sistema de pegue e monte **Afetto** esteja pronto para produção, organizadas por categoria (excluindo a implementação do backend em Supabase que será feita posteriormente, mas considerando a estrutura para integrá-lo).

---

## 🛠️ 1. Correções de TypeScript e Compilação (Imediato)
- [x] **Ajustar Escopo do TSConfig:** O arquivo `tsconfig.json` está varrendo a pasta duplicada `components` na raiz (que foi gerada incorretamente). Adicionar `"include": ["src"]` para focar apenas na pasta de código ativo.
- [x] **Remover Pasta Duplicada `/components`:** Excluir a pasta `components` na raiz do projeto (manter apenas `src/components`).
- [x] **Adicionar Declaração de Tipos do Vite (`vite-env.d.ts`):** Criar `src/vite-env.d.ts` com `/// <reference types="vite/client" />` para resolver o erro de tipo em `import.meta.env.VITE_SUPABASE_URL` no arquivo `src/lib/supabase.ts`.
- [x] **Importação do React em Componentes Admin:** Importar o `React` explicitamente em `src/pages/admin/ProductsAdmin.tsx` para resolver o erro `Cannot find namespace 'React'` ao usar tipos como `React.ChangeEvent`.
- [x] **Correção de Atributos no Footer:** Corrigir o link na logo do rodapé (`src/components/layout/Footer.tsx`), removendo o atributo `gap-2` do elemento `<Link>` (causa aviso/erro no React/HTML).

---

## 🔒 2. Segurança e Autenticação
- [x] **Proteção da Rota `/admin`:** Implementar uma tela de login (`/login` ou `/admin/login`) e um middleware/guarda de rotas (Route Guard). Sem isso, qualquer usuário pode acessar o painel administrativo simplesmente digitando `/admin` no navegador e gerenciar produtos e cestas.
- [x] **Gerenciamento de Roles (Permissões):** Garantir que apenas usuários autenticados com perfil de administrador possam ler/gravar na API/Supabase (ajustar as Row Level Security (RLS) no Supabase quando for integrado).

---

## 🛍️ 3. Fluxo de Pedidos e Carrinho (Checkout)
- [x] **Persistência de Pedidos no Banco:** Antes de redirecionar o usuário para o WhatsApp na finalização da compra, salvar os dados do pedido no banco de dados (tabela `orders`). Isso permite que a loja tenha um registro histórico confiável para gestão, relatórios e controle de status.
- [x] **Número de WhatsApp Configurável:** O número de telefone de contato (`5511999999999`) está hardcoded em `src/components/builder/BasketReview.tsx` e `src/pages/Home.tsx`. Mover este valor para variáveis de ambiente (`.env` / `import.meta.env.VITE_WHATSAPP_NUMBER`).
- [x] **Página/Modal de Confirmação:** Ao finalizar o checkout, redirecionar o usuário para uma página de "Pedido Enviado com Sucesso" ou abrir um modal instruindo-o a enviar a mensagem no WhatsApp que foi aberta na outra aba.
- [x] **Melhoria na Formatação do WhatsApp:** Garantir que o link gerado quebre as linhas corretamente em todos os dispositivos móveis.

---

## 🚚 4. Frete, CEP e Validação de Datas
- [x] **Cálculo Real de Frete:** O cálculo de frete em `BasketReview.tsx` usa valores simulados (`Math.random()`). Implementar integração com uma API de cálculo (ex: Melhor Envio, Correios ou uma tabela de taxas fixas baseada nas faixas de CEP de atendimento da loja).
- [x] **Validação Fina do CEP:** Adicionar máscara de entrada e validação por RegExp no campo de CEP para evitar envios com CEP incompleto ou inválido.
- [x] **Validação de Data de Entrega:** Impedir a seleção de datas retroativas no campo `Data da Entrega` e implementar uma regra de antecedência mínima (ex: não permitir entregas no mesmo dia se o pedido for feito após as 12h, ou exigir no mínimo 24h/48h de antecedência para produção da cesta).

---

## 🖥️ 5. Painel Administrativo (Admin)
- [x] **Tela de Gestão de Pedidos (`/admin/pedidos`):**
  - O link de "Pedidos" no menu lateral aponta para `/admin` (Dashboard), mas não existe uma tela para listar, filtrar e atualizar o status dos pedidos.
  - Criar a rota `/admin/pedidos` e implementar a listagem dos pedidos vindos do banco de dados (tabela `orders`).
- [x] **Atualização de Status de Pedido:** Permitir ao administrador alterar o status de um pedido (ex: "Aguardando Pagamento", "Em Produção", "Saiu para Entrega", "Entregue") direto pelo painel.
- [x] **Edição de Produtos e Cestas:** Atualmente o painel admin só permite adicionar ou excluir produtos/cestas. Adicionar funcionalidade para editar preços, fotos e descrições dos itens já cadastrados sem precisar recriá-los.

---

## 📄 6. Páginas Institucionais Faltantes
- [x] **Criar as rotas e páginas referenciadas no Footer:**
  - `/sobre` (Sobre Nós)
  - `/contato` (Contato)
  - `/privacidade` (Políticas de Privacidade)
  - `/termos` (Termos de Uso)
  - Atualmente, clicar nesses links gera rotas vazias/não encontradas pois elas não foram declaradas em `src/App.tsx`.

---

## 📈 7. SEO, UX e Performance
- [x] **Configuração do `index.html`:**
  - Alterar a tag `<html lang="en">` para `<html lang="pt-BR">`.
  - Alterar o título genérico `<title>My Google AI Studio App</title>` para algo comercial (ex: `Afetto | Cestas de Café da Manhã & Presentes Personalizados`).
  - Adicionar meta tags de descrição (`<meta name="description" ...>`) para indexação no Google.
  - Configurar tags Open Graph (`og:title`, `og:description`, `og:image`) para que o link fique bonito quando compartilhado nas redes sociais ou WhatsApp.
- [x] **Substituição de Imagens Mock/Placeholder:** Substituir as imagens geradas pelo `placehold.co` por fotos reais dos produtos e cestas ou por caminhos locais das imagens na pasta `public/assets`.
- [x] **Configuração do Favicon:** Adicionar um favicon personalizado que combine com a identidade visual da marca.
