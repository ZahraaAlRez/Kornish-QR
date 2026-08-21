-- Sultana Restocafe — Phase 3 palette correction.
-- Run this after 0002_rebrand_and_i18n.sql, in the Supabase SQL editor.
--
-- Navy is now a text/button accent only — the page background is the warm
-- cream/sand/champagne-gold palette. Re-points cafe_settings' brand color
-- defaults accordingly. Cafes that already customized their colors via
-- /admin/settings keep their own choices (this only updates the row that's
-- still on the Phase 2 defaults).

update cafe_settings
set
  brand_colors = '{"primary":"#1F2B45","accent":"#C8A66A","secondary":"#F4EBDD"}'::jsonb,
  updated_at = now()
where
  id = 1
  and brand_colors = '{"primary":"#1F2B45","accent":"#C9A876","secondary":"#E5D7C3"}'::jsonb;
