-- Cardamom Café QR ordering system — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────
-- categories
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  animation_key text not null, -- 'hot-drinks' | 'cold-drinks' | 'sandwiches' | 'desserts' | ...
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- menu_items
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  category_id uuid not null references categories (id) on delete cascade,
  photo_url text, -- null => customer app falls back to the category placeholder
  available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists menu_items_category_id_idx on menu_items (category_id);

-- ─────────────────────────────────────────────────────────────────────────
-- orders
-- order_type: 'dine_in' | 'delivery'
-- dine_in  -> table_number required, customer_name optional
-- delivery -> customer_name + phone required, delivery_address and/or
--             delivery_location_url (Google Maps link from browser geolocation)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_type text not null default 'dine_in' check (order_type in ('dine_in', 'delivery')),
  table_number text,
  customer_name text,
  phone text,
  delivery_address text,
  delivery_location_url text,
  total numeric(10, 2) not null default 0,
  status text not null default 'new' check (status in ('new', 'preparing', 'done')),
  whatsapp_sent boolean not null default false
);

create index if not exists orders_created_at_idx on orders (created_at);

-- ─────────────────────────────────────────────────────────────────────────
-- order_items — snapshots name/price at order time (see spec §2 note:
-- price changes later must not rewrite what past customers paid)
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  menu_item_id uuid references menu_items (id) on delete set null,
  name text not null,
  price numeric(10, 2) not null,
  quantity integer not null default 1,
  notes text
);

create index if not exists order_items_order_id_idx on order_items (order_id);

-- ─────────────────────────────────────────────────────────────────────────
-- cafe_settings — single row, admin-editable
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists cafe_settings (
  id integer primary key default 1,
  cafe_name text not null default 'Cardamom Café',
  logo_url text,
  main_picture_url text,
  whatsapp_number text, -- empty until the client provides it, see spec §5
  external_system_webhook_url text, -- empty until the client's POS/system is known, see spec §11
  external_system_api_key text,
  brand_colors jsonb not null default '{"primary":"#2B1B12","accent":"#B8862E","secondary":"#F3ECDC"}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint cafe_settings_single_row check (id = 1)
);

-- ─────────────────────────────────────────────────────────────────────────
-- Row Level Security: public read on menu/categories/settings (needed for
-- the customer app's anon-key browser client), no public write access.
-- All writes (menu CRUD, settings, order status) go through the
-- password-gated admin server actions using the service-role key, which
-- bypasses RLS. Order INSERT is allowed publicly so the customer app can
-- submit orders directly with the anon key.
-- ─────────────────────────────────────────────────────────────────────────
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table cafe_settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "categories are publicly readable" on categories for select using (true);
create policy "menu items are publicly readable" on menu_items for select using (true);
create policy "cafe settings are publicly readable" on cafe_settings for select using (true);

create policy "anyone can place an order" on orders for insert with check (true);
create policy "anyone can add order items" on order_items for insert with check (true);

-- Storage bucket for logo / main picture / menu item photos
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'photos');
