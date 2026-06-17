<div align="center">
  <h1>🎁 Afetto</h1>
  <p>Plataforma de presentes personalizados e cestas para datas comemorativas.</p>
</div>

## 📖 Sobre o Projeto

O **Afetto** é uma aplicação web interativa que permite aos usuários explorar um catálogo de cestas de presentes sugeridas ou montar sua própria cesta do zero, selecionando produtos individuais. A plataforma integra diretamente com o WhatsApp para finalização dos pedidos, oferecendo uma experiência de compra personalizada, rápida e cheia de afeto.

## ✨ Funcionalidades

- **Catálogo de Cestas:** Visualize opções pré-montadas sugeridas e use-as como base para a sua própria criação.
- **Montagem Personalizada (Builder):** Adicione, remova e altere quantidades de produtos (chocolates, flores, perfumes, etc.) na sua cesta.
- **Personalização de Presente:** Adicione o nome do destinatário, mensagens customizadas para o cartão, data de entrega e observações extras.
- **Integração com WhatsApp:** Geração automática e envio do pedido detalhado (itens, personalização, subtotal, cálculo de frete simulado) direto para o WhatsApp da loja.
- **Dashboard Administrativo:** Visão geral de vendas, lucros estimados, pedidos recentes e alertas de estoque baixo.
- **Persistência Híbrida:** Sincronização de dados na nuvem via Supabase, com _fallback_ automático para `localStorage` caso o backend não esteja configurado.

## 🚀 Tecnologias Utilizadas

- **React 19** + **Vite**
- **TypeScript**
- **Tailwind CSS v4**
- **Zustand** (Gerenciamento de Estado)
- **React Router DOM** (Navegação)
- **Supabase** (Banco de Dados / Backend)
- **Framer Motion** (Animações de interface)
- **React Hook Form** + **Zod** (Formulários e Validação)

## 🛠️ Como executar o projeto localmente

**Pré-requisitos:** Node.js instalado no seu ambiente.

1. Instale as dependências:
   ```bash
   npm install
   ```
2. *(Opcional)* Configure as variáveis de ambiente do Supabase. Crie um arquivo `.env` ou `.env.local` na raiz do projeto e adicione:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```
   *Nota: O projeto funciona perfeitamente utilizando `localStorage` localmente caso o Supabase não esteja configurado.*

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse a aplicação no seu navegador (por padrão em `http://localhost:8080`).

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
