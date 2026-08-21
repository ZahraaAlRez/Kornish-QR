-- Sultana Restocafe — admin email-based password reset.
-- Run this after 0003_palette_correction.sql, in the Supabase SQL editor.
--
-- Adds a single-use, expiring reset token to cafe_settings so "Forgot
-- password?" can email a real reset link to the recovery email on file,
-- instead of only supporting the manual ADMIN_RECOVERY_KEY fallback.

alter table cafe_settings add column if not exists admin_reset_token text;
alter table cafe_settings add column if not exists admin_reset_token_expires_at timestamptz;
