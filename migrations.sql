-- Migration SQL for Afetto - Pegue e Monte
-- Este script configura o banco de dados no Supabase para produção, incluindo tabelas, RLS (Row Level Security) e políticas de acesso.

-- 1. EXTENSÕES
-- Habilitar a extensão uuid-ossp caso ainda não esteja ativa
create extension if not exists "uuid-ossp";

-- 2. TABELA DE PRODUTOS
create table if not exists public.products (
    id text primary key default 'prod-' || encode(gen_random_bytes(6), 'hex'),
    name text not null,
    description text,
    price numeric(10, 2) not null check (price >= 0),
    category text not null,
    image text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para produtos
alter table public.products enable row level security;

-- Políticas de acesso para produtos
create policy "Produtos são visíveis publicamente"
on public.products for select
using (true);

create policy "Apenas administradores podem inserir produtos"
on public.products for insert
to authenticated
with check (true);

create policy "Apenas administradores podem atualizar produtos"
on public.products for update
to authenticated
using (true);

create policy "Apenas administradores podem deletar produtos"
on public.products for delete
to authenticated
using (true);


-- 3. TABELA DE CESTAS SUGERIDAS (CATÁLOGO)
create table if not exists public.baskets (
    id text primary key default 'cesta-' || encode(gen_random_bytes(6), 'hex'),
    name text not null,
    price numeric(10, 2) not null check (price >= 0),
    old_price numeric(10, 2) check (old_price is null or old_price >= 0),
    tag text,
    image text not null,
    items jsonb not null default '[]'::jsonb, -- Array de { productId: string, quantity: number }
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para cestas
alter table public.baskets enable row level security;

-- Políticas de acesso para cestas
create policy "Cestas são visíveis publicamente"
on public.baskets for select
using (true);

create policy "Apenas administradores podem inserir cestas"
on public.baskets for insert
to authenticated
with check (true);

create policy "Apenas administradores podem atualizar cestas"
on public.baskets for update
to authenticated
using (true);

create policy "Apenas administradores podem deletar cestas"
on public.baskets for delete
to authenticated
using (true);


-- 4. TABELA DE PEDIDOS (ORDERS)
create table if not exists public.orders (
    id uuid primary key default gen_random_uuid(),
    customer_name text not null,
    delivery_date date not null,
    card_message text,
    extra_notes text,
    zip_code text,
    shipping_cost numeric(10, 2) not null default 0.00,
    subtotal numeric(10, 2) not null,
    total numeric(10, 2) not null,
    status text not null default 'pendente' check (status in ('pendente', 'pago', 'preparando', 'enviado', 'entregue', 'cancelado')),
    items jsonb not null default '[]'::jsonb, -- Cópia/Snapshot dos itens comprados [{ product: { name, price, image }, quantity }]
    whatsapp_sent boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para pedidos
alter table public.orders enable row level security;

-- Políticas de acesso para pedidos
create policy "Qualquer pessoa pode criar um pedido"
on public.orders for insert
to anon, authenticated
with check (true);

create policy "Apenas administradores podem ler os pedidos"
on public.orders for select
to authenticated
using (true);

create policy "Apenas administradores podem atualizar os pedidos"
on public.orders for update
to authenticated
using (true);

create policy "Apenas administradores podem deletar os pedidos"
on public.orders for delete
to authenticated
using (true);


-- 5. DADOS DE TESTE INICIAIS (Opcional - caso queira popular o banco inicial)
-- Inserir os produtos mock se a tabela estiver vazia
insert into public.products (id, name, price, category, image)
values 
('base-1', 'Cesta de Vime G', 45.00, 'Cesta Base', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Cesta+de+Vime+G'),
('base-2', 'Caixa Rígida Premium', 65.00, 'Cesta Base', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Caixa+Rigida'),
('choc-1', 'Ferrero Rocher 12un', 35.90, 'Chocolates', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Ferrero+Rocher'),
('choc-2', 'Barra Lindt Excellence 100g', 24.90, 'Chocolates', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Lindt'),
('perf-1', 'Perfume Lily Eau de Parfum', 289.90, 'Perfumes', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Perfume+Lily'),
('perf-2', 'Malbec Desodorante Colônia', 189.90, 'Perfumes', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Malbec'),
('flores-1', 'Buquê de Rosas Vermelhas', 120.00, 'Flores', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Rosas'),
('flores-2', 'Orquídea Branca', 85.00, 'Flores', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Orquidea'),
('pelucia-1', 'Urso de Pelúcia M', 75.00, 'Pelúcias', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Urso+Pelucia'),
('cartao-1', 'Cartão com Mensagem', 15.00, 'Cartões', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Cartao')
on conflict (id) do nothing;

-- Inserir as cestas mock se a tabela estiver vazia
insert into public.baskets (id, name, price, old_price, tag, image, items)
values
('cesta-1', 'Cesta Romântica Premium', 350.00, 420.00, 'Mais Vendida', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Cesta+Romantica', 
 '[{"productId": "perf-1", "quantity": 1}, {"productId": "flores-1", "quantity": 1}, {"productId": "choc-1", "quantity": 1}, {"productId": "cartao-1", "quantity": 1}]'::jsonb),
('cesta-2', 'Cesta Doce Encanto', 180.00, null, 'Econômica', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Cesta+Doce',
 '[{"productId": "pelucia-1", "quantity": 1}, {"productId": "choc-2", "quantity": 2}, {"productId": "cartao-1", "quantity": 1}]'::jsonb),
('cesta-3', 'Cesta Classic', 250.00, null, 'Lançamento', 'https://placehold.co/400x400/0B2A5B/FFFFFF?text=Cesta+Classic',
 '[{"productId": "perf-2", "quantity": 1}, {"productId": "choc-1", "quantity": 1}, {"productId": "flores-2", "quantity": 1}]'::jsonb)
on conflict (id) do nothing;
