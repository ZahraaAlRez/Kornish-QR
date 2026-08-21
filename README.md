# Sultana Restocafe — QR Ordering System

Customer QR-menu ordering app + password-protected admin dashboard, built on
Next.js (App Router) + Supabase. Started from `assets/brand-assets/qr-menu-system-spec (1).md`
and rebranded/polished per `assets/brand-assets/sultana-phase2-final-spec.md`
(bilingual EN/AR, admin-managed categories, site-wide motion system, admin
password hashing).

Per the phase-2 spec §11, the project folder/repo/Supabase project keep the
"Kornish QR" name — only the product's own branding changed.

## Stack

- **Next.js 14** (App Router, TypeScript, Tailwind CSS) — one app, deploys to Vercel.
- **Supabase** — Postgres database + Storage (photos), read via the anon key in
  the customer app, written via the service-role key in admin server actions.
- **Framer Motion** + **Lenis** — the entrance/motion system and site-wide smooth scroll.
- Bilingual EN/AR via a lightweight client `LocaleProvider` (`lib/i18n/`), no
  URL routing — a persistent toggle flips `dir`/`lang` on `<html>`.

## 1. Set up the Supabase project

1. Create a free project at [supabase.com](https://supabase.com) (or reuse an existing one).
2. In the SQL editor, run, **in order**:
   - `supabase/migrations/0001_init.sql` — base schema (skip if already applied).
   - `supabase/migrations/0002_rebrand_and_i18n.sql` — adds bilingual name/description
     columns, category banner photos, and the admin password-hash/recovery-email
     columns; drops the old animation-key column; **resets `menu_items`,
     `categories`, `orders`, and `order_items` to empty** (phase-2 spec §12 —
     the real admin starts from a clean dashboard, not placeholder test data);
     upserts `cafe_settings` with the Sultana Restocafe defaults.
   - `supabase/seed.sql` — optional, just re-applies the `cafe_settings` defaults if you ever need to reset them.
3. In **Project Settings → API**, copy the Project URL, `anon` public key, and `service_role` secret key.

## 2. Configure the app

```bash
cp .env.local.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — from step 1.
- `ADMIN_PASSWORD` — bootstrap password for `/admin`, used only until a real
  password is set from **Settings → Change password** (which stores a scrypt
  hash in `cafe_settings.admin_password_hash` and takes over from then on).
- `ADMIN_SESSION_SECRET` — any long random string (signs the admin login cookie).
- `ADMIN_RECOVERY_KEY` — any long random string, known only to whoever manages
  the server. Lets `/admin/reset-password` rehash a forgotten password without
  needing email sending wired up (spec §9's own documented fallback).
- `NEXT_PUBLIC_SITE_URL` — used by the admin QR-code generator; update to your real domain once deployed.

## 3. Run it

```bash
npm install
npm run dev
```

- Customer app: [http://localhost:3000](http://localhost:3000)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin) (password = `ADMIN_PASSWORD` until changed)

If `.env.local` isn't filled in yet, the customer app shows a short "connect
Supabase" screen instead of crashing.

## What's already wired vs. what's a fill-in-later config point

Per the original spec §5/§11, these are **intentionally blank** until the
client provides them — the app works end-to-end without them:
- **WhatsApp number** (`/admin/settings`) — until set, the order confirmation
  screen shows "WhatsApp sending isn't configured yet" instead of a send
  button; the order is still saved. Fill in the number and it goes live with
  no code changes (`lib/whatsapp.ts`).
- **Cafe's own POS/ordering system** — `lib/cafeSystem.ts` has a
  `sendToCafeSystem()` stub that currently just logs. Once the client picks a
  system, point `external_system_webhook_url` (+ optional API key) at it from
  `/admin/settings` and it starts sending.

## Ordering flow

At checkout the customer picks **Dine-in** or **Delivery**:
- Dine-in: table number (required — pre-filled from a `?table=N` URL param if
  the QR encodes one), name (optional).
- Delivery: name + phone (required), a "Share my location" button (uses the
  browser's geolocation API to attach a Google Maps link), plus a plain
  address field as fallback.

The admin **Settings** page includes a QR code generator — leave the table
number blank for one generic QR (works for both flows), or fill it in to
print a per-table code.

## Bilingual content

- Fixed UI strings live in `lib/i18n/strings.ts` (EN/AR string table).
- Category/menu item names and descriptions are per-row `_en`/`_ar` columns.
  English is required; Arabic is optional and falls back to the English value
  if left blank, so admins aren't blocked from adding items quickly.
- The admin menu forms show both language fields side by side.

## Product photography

When adding real menu photos (or AI-generated placeholders in the meantime),
use this prompt template so every image matches in lighting/background/framing
(only the item name changes):

> Editorial product photography of [ITEM NAME], centered on a soft warm cream
> backdrop (hex E5D7C3), soft diffused lighting from the upper-left, a gentle
> soft-edged shadow beneath the product with a subtle cool navy undertone (hex
> 1F2B45), minimal styling, shallow depth of field, luxury restaurant menu
> aesthetic, product filling roughly 60% of the frame, no text or logos in the
> image, warm gold rim-light accent, consistent natural color grading, square
> 1:1 composition.

Store images as `[category]-[item-name].png` before uploading them through
the admin item photo field.

## Project layout

- `app/page.tsx` + `components/customer/` — the customer app: `Hero.tsx`
  (logo-based entrance with the one-time kinetic sequence) → menu browsing
  with an admin-uploaded category banner → cart → checkout → confirmation.
- `app/admin/` — password-gated dashboard (`middleware.ts` protects everything
  under `/admin` except `/admin/login` and `/admin/reset-password`): menu
  management (CRUD, bilingual fields, photos, availability), orders (calendar
  + date search + status), settings (cafe info, WhatsApp/webhook config,
  brand colors, change password, QR generator).
- `supabase/` — SQL migrations + optional seed.
- `lib/` — Supabase clients, WhatsApp link builder, cafe-system stub, admin
  session + password-hash helpers, i18n.
- `components/motion/` — `DiamondLattice`/`GlowLayer` (site-wide background
  motion, toned down on admin screens) and `LenisProvider` (smooth scroll).
- `public/brand/` — Sultana logo assets + the NEXERA footer credit logo.

## Deploying

1. Push this repo to GitHub.
2. Import it in Vercel, add the same environment variables from `.env.local`.
3. Update `NEXT_PUBLIC_SITE_URL` to the deployed domain, then generate the
   real QR code(s) from `/admin/settings`.

## Later upgrades (not needed to launch)

- **WhatsApp Business API** (spec §5, Option B) — replace the body of
  `buildWhatsAppLink`/its call site with an API call once ready to automate
  sending fully; the config point (`whatsapp_number`) doesn't change.
- **Recovery email** — `cafe_settings.admin_recovery_email` is captured in
  Settings for a future "email me a reset link" flow; today the working
  recovery path is the `ADMIN_RECOVERY_KEY` env var at `/admin/reset-password`.
