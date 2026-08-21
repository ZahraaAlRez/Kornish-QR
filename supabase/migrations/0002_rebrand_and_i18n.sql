-- Sultana Restocafe rebrand + bilingual support (Phase 2).
-- Run this after 0001_init.sql, in the Supabase SQL editor.
--
-- This resets menu_items/categories/orders/order_items to empty — the
-- "Cardamom Café" placeholder seed data is gone, and the real admin starts
-- from a clean dashboard. Existing test orders are cleared too (spec §12).

-- ── categories: bilingual name + banner photo, drop the old animation key ──
alter table categories add column if not exists name_en text;
alter table categories add column if not exists name_ar text;
alter table categories add column if not exists photo_url text;

update categories set name_en = name where name_en is null;

alter table categories alter column name_en set not null;
alter table categories drop column if exists name;
alter table categories drop column if exists animation_key;

-- ── menu_items: bilingual name + description ──
alter table menu_items add column if not exists name_en text;
alter table menu_items add column if not exists name_ar text;
alter table menu_items add column if not exists description_en text;
alter table menu_items add column if not exists description_ar text;

update menu_items set name_en = name where name_en is null;
update menu_items set description_en = description where description_en is null;

alter table menu_items alter column name_en set not null;
alter table menu_items drop column if exists name;
alter table menu_items drop column if exists description;

-- ── cafe_settings: hashed admin password + recovery email ──
alter table cafe_settings add column if not exists admin_password_hash text;
alter table cafe_settings add column if not exists admin_recovery_email text;

-- ── full reset: clear all test/placeholder data ──
delete from order_items;
delete from orders;
delete from menu_items;
delete from categories;

-- ── rebrand cafe_settings defaults ──
insert into cafe_settings (
  id, cafe_name, logo_url, main_picture_url, brand_colors, updated_at
)
values (
  1,
  'Sultana Restocafe',
  '/brand/sultana-logo-full-light.png',
  null,
  '{"primary":"#1F2B45","accent":"#C9A876","secondary":"#E5D7C3"}'::jsonb,
  now()
)
on conflict (id) do update set
  cafe_name = excluded.cafe_name,
  logo_url = excluded.logo_url,
  brand_colors = excluded.brand_colors,
  updated_at = now();
