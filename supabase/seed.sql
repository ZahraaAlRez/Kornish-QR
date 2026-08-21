-- Optional: re-applies the Sultana Restocafe cafe_settings defaults.
-- 0002_rebrand_and_i18n.sql already does this as part of the reset, so you
-- normally don't need to run this separately — it's here as an idempotent
-- reference if cafe_settings ever needs to be restored to defaults.

insert into cafe_settings (
  id, cafe_name, logo_url, main_picture_url, brand_colors, updated_at
)
values (
  1,
  'Sultana Restocafe',
  '/brand/sultana-logo-full-light.png',
  null,
  '{"primary":"#1F2B45","accent":"#C8A66A","secondary":"#F4EBDD"}'::jsonb,
  now()
)
on conflict (id) do update set
  cafe_name = excluded.cafe_name,
  logo_url = excluded.logo_url,
  brand_colors = excluded.brand_colors,
  updated_at = now();

-- categories/menu_items are intentionally left empty — the admin adds
-- everything from scratch via /admin/menu (spec §12).
