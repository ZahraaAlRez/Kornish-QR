# Cardamom Café — QR Ordering System

Customer QR-menu ordering app + password-protected admin dashboard, built on
Next.js (App Router) + Supabase, per `assets/brand-assets/qr-menu-system-spec (1).md`.

## Stack

- **Next.js 14** (App Router, TypeScript, Tailwind CSS) — one app, deploys to Vercel.
- **Supabase** — Postgres database + Storage (photos), read via the anon key in
  the customer app, written via the service-role key in admin server actions.
- Category animations are custom-coded CSS/SVG (spec §6, decision B) — no
  external assets or video required to start.

## 1. Create the Supabase project

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then
   `supabase/seed.sql`. This creates all tables (`menu_items`, `categories`,
   `orders`, `order_items`, `cafe_settings`), sets up the public `photos`
   storage bucket, seeds the four categories + one sample item each, and a
   `cafe_settings` row defaulting to the placeholder logo/main picture.
3. In **Project Settings → API**, copy the Project URL, `anon` public key,
   and `service_role` secret key.

## 2. Configure the app

```bash
cp .env.local.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — from step 1.
- `ADMIN_PASSWORD` — the single shared password for `/admin`.
- `ADMIN_SESSION_SECRET` — any long random string (used to sign the admin login cookie).
- `NEXT_PUBLIC_SITE_URL` — used by the admin QR-code generator; update to your real domain once deployed.

## 3. Run it

```bash
npm install
npm run dev
```

- Customer app: [http://localhost:3000](http://localhost:3000)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin) (password = `ADMIN_PASSWORD`)

If `.env.local` isn't filled in yet, the customer app shows a short "connect
Supabase" screen instead of crashing — everything else in this README still
applies once you do.

## What's already wired vs. what's a fill-in-later config point

Per spec §5/§11, these are **intentionally blank** until the client provides
them — the app works end-to-end without them:
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

## Project layout

- `app/page.tsx` + `components/customer/` — the customer app (main picture →
  menu browsing with per-category animations → cart → checkout → confirmation).
- `app/admin/` — password-gated dashboard (`middleware.ts` protects everything
  under `/admin` except `/admin/login`): menu management (CRUD, photos,
  availability), orders (calendar + date search + status), settings (cafe
  info, WhatsApp/webhook config, brand colors, QR generator).
- `supabase/` — SQL migration + seed data.
- `lib/` — Supabase clients, WhatsApp link builder, cafe-system stub, admin
  session helpers.
- `public/brand/` — logo, main picture, and per-category placeholder images
  (shown automatically for any menu item without a real photo uploaded yet).

## Deploying

1. Push this repo to GitHub.
2. Import it in Vercel, add the same environment variables from `.env.local`.
3. Update `NEXT_PUBLIC_SITE_URL` to the deployed domain, then generate the
   real QR code(s) from `/admin/settings`.

## Later upgrades (not needed to launch)

- **WhatsApp Business API** (spec §5, Option B) — replace the body of
  `buildWhatsAppLink`/its call site with an API call once ready to automate
  sending fully; the config point (`whatsapp_number`) doesn't change.
- **Real video-loop category animations** (spec §6, Option A) — the current
  CSS/SVG animations in `components/customer/animations/` are a drop-in
  replacement target if photorealistic clips are sourced later.
