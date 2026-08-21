# Sultana Restocafe QR Ordering System — Phase 2 (Final Polish + Rebrand)

This supersedes the earlier "Cardamom Café" placeholder branding entirely.
Hand this to Claude Code as the next build brief on top of the working v1
app (customer ordering + admin dashboard + Supabase + Vercel deploy).

---

## 1. Rebrand: Cardamom Café → Sultana Restocafe

Replace every instance of the old placeholder name/branding with:

- **Name**: سلطانة (Sultana) — مطعم واستراحة سلطانة / Sultana Restocafe
- **Colors**: Primary navy `#1F2B45`, Cream `#E5D7C3`, Accent gold `#C9A876`
  (pulled from the logo's own gradient — used for gradient buttons,
  highlights, and the diamond motif)
- **Logo assets** (already placed in `assets/brand-assets/`):
  - `sultana-logo-icon.png` — icon mark, transparent — use for favicon/app icon
  - `sultana-logo-full-light.png` — cream wordmark, transparent — use on
    navy backgrounds (hero, footer, admin nav)
  - `sultana-logo-navy-bg.png` — full lockup with navy baked in — usable
    directly as a hero banner image where a self-contained graphic is
    needed
  - `nexera-logo.png` — for the footer credit (§7)
- Update `cafe_settings` seed defaults, page `<title>`/meta, and any
  hardcoded "Cardamom Café" strings across customer app, admin dashboard,
  and README.
- `cafe_settings` defaults should be updated to: `logo_url` →
  `sultana-logo-full-light.png`, `brand_colors` → primary `#1F2B45`,
  accent `#C9A876`, secondary `#E5D7C3`. `main_picture_url` is superseded
  by the logo-based hero (§5) — safe to leave unused rather than deleting
  the column, in case it's wanted later.

## 2. Bilingual — English default, Arabic toggle

- Site loads in **English by default**; a toggle (EN / عربي) is always
  visible (top corner, both customer app and admin) letting the customer
  switch to Arabic, which flips to RTL layout.
- Data model: every customer-facing text field needs an English and
  Arabic value —
  - `categories`: `name_en`, `name_ar`
  - `menu_items`: `name_en`, `name_ar`, `description_en`, `description_ar`
  - Fixed UI strings (buttons, labels, section headers) need an EN/AR
    string table.
- Admin forms for adding/editing categories and items must have both
  language fields side by side, English required, Arabic optional (falls
  back to English display if empty, so admin isn't blocked from adding
  items quickly).
- `dir="rtl"` should apply cleanly to layout, not just mirror text — check
  icon directions (e.g. arrows), spacing, and the cart drawer alignment
  when toggled.

## 3. Admin-managed categories (no hardcoded per-category animation)

This replaces the earlier "one custom animation per category" plan
entirely, since categories are now fully admin-created/edited, not fixed.

- `categories` gains an optional `photo_url` — admin can upload a banner
  image per category, shown as a header/banner at the top of that
  category's item list.
- Delete the four hardcoded animation components
  (`HotDrinksAnimation.tsx`, `ColdDrinksAnimation.tsx`,
  `SandwichesAnimation.tsx`, `DessertsAnimation.tsx`) and all
  `animation_key` wiring — no longer needed.
- Visual identity now comes from: (a) the category's uploaded photo, and
  (b) the site-wide background motion system below — not from
  category-specific code.

## 4. Site-wide background motion system

Applies across the customer app (and subtly in admin, toned down further
there for legibility during data entry).

**Base layer, everywhere:**
- **Diamond lattice**: the four-diamond shape from the actual logo mark,
  scattered at very low opacity (5–10%) across the navy background,
  varied sizes, slow independent drift/rotation per diamond, subtle
  parallax on scroll. Built from the real logo geometry, not a generic
  shape.
- **Soft gold glow**: a slow-breathing, blurred gold/navy glow shifting
  gently behind content — calm, atmospheric, never distracting from
  prices or photos.

**Entrance screen only:**
- **Kinetic typography moment**: on first load, the diamond motif
  animates into place (as previewed), then the wordmark and tagline rise
  in sequence, then the CTA button — a one-time "wow" beat. Does not
  repeat on every page navigation, only on initial entry.

Performance: keep this GPU-cheap (transform/opacity only, no heavy
filters) since this is primarily a phone-scanned experience — test on a
mid-range Android device, not just desktop.

## 5. Hero section

Replace the "Main Picture" concept with the logo itself as the primary
entrance visual (per the approved preview): navy background, diamond
lattice + glow behind it, `sultana-logo-full-light.png` (or the diamond
mark animating into the full lockup) as the centerpiece, tagline below,
gradient CTA button into the menu.

## 6. Buttons — gradient treatment

Primary buttons (Add to cart, View Menu, Send Order, admin primary
actions) use a gradient built from the palette — gold `#C9A876` toward a
deeper gold/bronze tone — with a subtle shift in gradient angle or
brightness on hover/press. Maintain WCAG AA contrast for button text.

## 7. Footer — "Powered by NEXERA" (fixed, non-editable)

- Present on **every page**, customer app and admin dashboard alike.
- Uses `nexera-logo.png` alongside the text "Powered by NEXERA".
- Hardcoded into the layout — not exposed in any admin setting, cannot be
  removed or edited by the cafe.
- Small and unobtrusive but polished: simple logo + wordmark lockup,
  subtle hover state (slight brightness/opacity shift) is enough motion —
  this is a credit line, not a feature.

## 8. Motion & scroll stack

- **Framer Motion**: page/category transitions, add-to-cart micro-
  interaction (item visually moves toward the cart icon), cart line-item
  enter/exit animations, live total count-up when it changes, button
  hover/press states, the entrance sequence in §4.
- **Lenis** for smooth scrolling site-wide (customer app + admin).
- A subtle skeleton/shimmer loading state (matching the motion language,
  not a plain spinner) for the brief moment before menu data loads from
  Supabase.

## 9. Admin authentication upgrade

- **Change Password**: add to `/admin/settings` — logged-in admin can set
  a new password, stored properly hashed (not the plaintext env var
  going forward).
- **Forgot Password**: "Forgot password?" link on `/admin/login`. Given
  single-admin scope, simplest reliable approach: a reset link emailed to
  one configured recovery email in settings, or a clearly documented
  manual recovery path via environment variables if email sending isn't
  wired up yet.

## 10. Product photography consistency

Real menu photos, when provided, or AI-generated placeholders in the
meantime, should follow this exact prompt template (only the item name
changes) so every image matches in lighting, background, and framing:

> Editorial product photography of [ITEM NAME], centered on a soft warm
> cream backdrop (hex E5D7C3), soft diffused lighting from the
> upper-left, a gentle soft-edged shadow beneath the product with a
> subtle cool navy undertone (hex 1F2B45), minimal styling, shallow depth
> of field, luxury restaurant menu aesthetic, product filling roughly 60%
> of the frame, no text or logos in the image, warm gold rim-light
> accent, consistent natural color grading, square 1:1 composition.

Store generated/uploaded images as `[category]-[item-name].png` in
`assets/brand-assets/` before wiring them into the admin-uploaded photo
fields.

## 11. Do NOT rename the project

The project folder, GitHub repo, and Supabase project stay named
"Kornish QR" — decided against renaming. This is purely internal/cosmetic
and not worth the risk of breaking the GitHub ↔ Vercel ↔ Supabase
connections that are already working. Do not touch folder names, repo
name, or the Supabase project name as part of this rebrand.

## 12. Database & old asset cleanup

- This is a full rebrand, not just a palette swap — the app currently has
  seeded placeholder categories/items from the "Cardamom Café" era
  (Halloumi Sandwich, etc.) plus old placeholder SVG assets
  (`logo.svg`, `main-pic-placeholder.svg`, the four
  `placeholder-*.svg` category images). Remove/replace these.
- Since the real admin (Sultana's owner/staff) will be adding every
  category and item themselves from scratch, **reset `menu_items` and
  `categories` to empty** rather than reseeding fake placeholder data —
  the admin should land on an empty, ready-to-fill dashboard, not
  leftover test content they need to delete first.
- The `orders` table has only test orders so far from earlier testing —
  fine to clear these too as part of this reset, given nothing here is a
  real customer order yet.
- New columns (`categories.name_en/name_ar/photo_url`,
  `menu_items.name_en/name_ar/description_en/description_ar`) need a new
  migration file (e.g. `0002_rebrand_and_i18n.sql`) rather than editing
  `0001_init.sql` directly, to keep migration history honest.

---

This is a visual/UX and rebrand pass on top of the existing working app —
not a rebuild. Preserve all working functionality (ordering flow, cart,
Supabase persistence, WhatsApp/system integration points, admin CRUD,
orders calendar) exactly as-is while applying the above.
