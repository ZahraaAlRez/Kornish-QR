-- Seed data: run after 0001_init.sql. Safe to re-run (uses upserts/guards).
-- NOTE: replace NEXT_PUBLIC_SITE_URL below with your real deployed URL once
-- live — until then these placeholder paths are served from /public/brand
-- by the Next.js app itself.

insert into cafe_settings (id, cafe_name, logo_url, main_picture_url)
values (1, 'Cardamom Café', '/brand/logo.svg', '/brand/main-pic-placeholder.svg')
on conflict (id) do nothing;

insert into categories (name, animation_key, sort_order)
select v.name, v.animation_key, v.sort_order
from (values
  ('Hot Drinks', 'hot-drinks', 1),
  ('Cold Drinks', 'cold-drinks', 2),
  ('Sandwiches', 'sandwiches', 3),
  ('Desserts', 'desserts', 4)
) as v(name, animation_key, sort_order)
where not exists (select 1 from categories where categories.name = v.name);

-- Sample menu items, one per category, using the category placeholder
-- image as photo_url until the admin uploads a real photo.
insert into menu_items (name, description, price, category_id, photo_url, sort_order)
select v.name, v.description, v.price, c.id, v.photo_url, v.sort_order
from (values
  ('Cardamom Latte', 'Espresso, steamed milk, a pinch of cardamom', 3.50, 'Hot Drinks', '/brand/placeholder-hot-drinks.svg', 1),
  ('Iced Cold Brew', 'Slow-steeped cold brew over ice', 3.75, 'Cold Drinks', '/brand/placeholder-cold-drinks.svg', 1),
  ('Halloumi Sandwich', 'Grilled halloumi, tomato, pickles, olive bread', 5.25, 'Sandwiches', '/brand/placeholder-sandwiches.svg', 1),
  ('Chocolate Crepe', 'Warm crepe, chocolate chips, strawberries', 4.50, 'Desserts', '/brand/placeholder-desserts.svg', 1)
) as v(name, description, price, category_name, photo_url, sort_order)
join categories c on c.name = v.category_name
where not exists (
  select 1 from menu_items where menu_items.name = v.name
);
