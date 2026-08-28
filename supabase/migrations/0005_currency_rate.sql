-- Configurable USD -> LBP conversion rate for the customer-facing currency
-- toggle, editable from Settings without a code change.
alter table cafe_settings
  add column if not exists usd_to_lbp_rate numeric not null default 90000;
