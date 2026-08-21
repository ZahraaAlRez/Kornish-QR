# Sultana Restocafe — Phase 3: Bug Fix + Design Direction Correction

This supersedes the background/hero/motion sections of Phase 2
(`sultana-phase2-final-spec.md` §4, §5, §6, §8) entirely. The navy-dominant
background tested poorly — too dark, doesn't invite the customer in. Keep
Phase 2's infrastructure (i18n system, admin auth upgrade, Lenis, Framer
Motion, NEXERA footer, bilingual data model) — this phase corrects the
*visual direction*, not the architecture.

---

## 1. Critical bug — order placement fails on checkout

**Symptom**: submitting an order throws
`null value in column "name" of relation "order_items" violates not-null
constraint`.

**Root cause**: the checkout/order-submission code still reads a plain
`item.name` field when snapshotting each line into `order_items`. That
field no longer exists post-rebrand — items now have `name_en`/`name_ar`.
This resolves to `undefined`/null, which the database rejects.

**Fix required**:
- Update the order-submission logic to snapshot the item name as
  `name_en` (falling back to `name_ar` if `name_en` is somehow empty) —
  same resolution rule used for display elsewhere in the app.
- **Secondary issue, fix alongside it**: client-side cart state persists
  in localStorage and was not cleared when the database was reset in
  Phase 2's migration. A cart can currently hold references to menu items
  that no longer exist, which would cause this same failure independent
  of the field-name issue above. Add a validation check on app load (and
  again right before checkout) that drops any cart line whose
  `menu_item_id` no longer resolves to a real item, and shows a brief
  "this item is no longer available and was removed from your cart"
  notice if that happens.
- Confirm (this part was already correct, just verify it stays true) that
  the customer's own Name field on checkout remains fully optional and
  never blocks order submission.

## 2. Palette correction — navy is an accent, not the background

Full navy page backgrounds are out. Navy becomes a **text and button**
color only. The actual page background uses the warm palette below:

| Role | Color |
|---|---|
| Warm cream (primary background) | `#F4EBDD` |
| Soft sand (secondary surface) | `#E5D7C3` |
| Champagne gold (accent/highlight) | `#C8A66A` |
| Terracotta (secondary accent) | `#B97858` |
| Navy (text + buttons only) | `#1F2B45` |

Update `cafe_settings` brand color defaults accordingly. Remove/replace
any full-viewport navy background sections app-wide, including the
current empty-category gradient rectangle (§4 below explains its
replacement).

## 3. Adopt this as the complete hero, motion, and interaction brief

This replaces Phase 2's diamond-lattice/glow background system and the
navy-based hero entirely. Implement as written:

### 3.1 Main entrance: "The Sultana Reveal" (first visit only, 2.5–3s)

1. Page begins on warm cream background with a very subtle paper texture.
2. A thin champagne-gold light travels across the screen.
3. The three shapes from the Sultana icon enter separately — left shape
   slides from the left, right shape from the right, upper curved shape
   descends gently.
4. Pieces connect to form the official icon; a soft shadow appears
   beneath for depth.
5. The Arabic Sultana wordmark reveals bottom-to-top via mask animation.
6. "SULTANA RESTOCAFE" appears with expanding letter spacing.
7. "SCAN · BROWSE · ORDER" fades in.
8. The VIEW MENU button rises slightly with one gentle light sweep.

Returning visitors (session-based, not per-page-load) get a fast
0.5-second logo fade instead of the full sequence — straight to the menu.

### 3.2 Hero design

- Warm editorial background (cream/sand gradient, not solid navy).
- Logo placed upper-middle. Beneath it: "SCAN · BROWSE · ORDER", a large
  VIEW MENU button, and a composed product scene (one drink, one coffee,
  one dessert) once real/generated photos exist — use a tasteful
  illustrated placeholder scene in the same palette until then, never an
  empty box.
- Product imagery moves only 4–8px on scroll for subtle depth, not a
  distracting parallax.

### 3.3 Hero-to-menu scroll transition (the signature interaction)

As the customer scrolls from hero into the menu:
1. Hero product photography moves downward and fades.
2. The large logo shrinks.
3. The logo travels smoothly into the sticky nav bar, becoming the small
   nav logo.
4. Cream hero background transitions to a slightly lighter menu
   background.
5. VIEW MENU compresses into the active category indicator.
6. "Our Menu" reveals upward behind a soft mask.
7. Category pills enter horizontally with a short stagger.

This must read as one continuous scene, not two stacked sections. Easing:
`cubic-bezier(0.22, 1, 0.36, 1)`.

### 3.4 Menu navigation

Sticky nav containing: small Sultana icon, search, language selector,
cart with quantity badge. Below it, horizontally scrollable category
pills (Hot Drinks / Cold Drinks / Sandwiches / Desserts, or whatever the
admin has actually created — this must stay dynamic per Phase 2 §3, not
hardcoded).

Category switching: selected pill glides via a shared animated indicator;
product cards cross-fade and move up ~12px; background accent tone can
shift subtly per category (see table below); never a hard reload.

| Category | Accent |
|---|---|
| Hot Drinks | Warm caramel |
| Cold Drinks | Pale citrus |
| Sandwiches | Soft olive |
| Desserts | Muted rose |

Since categories are admin-created (not fixed), map accent tones by
category *position* or let the admin pick one from a small preset palette
when creating a category — don't hardcode by name.

### 3.5 Product cards

Large square photo, name, one short description, price, circular `+`
button, optional "Popular"/"New" badge. Editorial feel, not generic
delivery-app cards.

- On scroll into view: image reveals first, info rises 8px, price/add
  button fade in together, ~60ms stagger between cards.
- On press: image scales to 0.98, `+` rotates into a checkmark, a small
  thumbnail flies toward the cart, cart badge bumps with a soft spring —
  no large bounce.

### 3.6 Product-image consistency

All photos (once real/generated) must look like one shoot: same warm
cream background, same upper-left lighting, similar angle, product at
~60% of frame, soft navy-tinted shadow, no text/logos/hands/props, square
1:1. (Same prompt template as Phase 2 §10 — palette reference updates to
match the new cream tones above.)

### 3.7 Category & item placeholder images — replaces the empty gradient box

Until the admin uploads a real photo, do not render an empty/plain
gradient rectangle (the current behavior looks broken). Instead:
- Each category without a photo shows a simple, tasteful illustrated
  placeholder in the new warm palette (a plain iconographic scene — a cup
  for drinks, a plate for food — not literal per-category artwork, just
  enough that the menu never looks empty or unfinished).
- Same fallback for individual items without a photo.
- The moment the admin uploads a real photo (per Phase 2's admin
  category/item photo upload), it replaces the placeholder automatically.
- No AI-video or generated-photo dependency for this fallback — it's a
  static, on-brand placeholder graphic shipped with the app, not
  something generated per-category at runtime.

### 3.8 Fonts

- English: **Instrument Serif** for large editorial headings, **Manrope**
  for prices/buttons/descriptions/nav.
- Arabic: **Noto Kufi Arabic** for buttons/categories/small UI text,
  **Noto Sans Arabic** for descriptions/longer text. Keep the official
  Arabic Sultana logo artwork unchanged (it's a fixed asset, not
  re-rendered in a web font).

```
Hero heading: Instrument Serif, 56–68px
Section heading: Instrument Serif, 40–48px
Product name: Manrope, 17–19px, 600
Description: Manrope, 12–14px, 400
Price: Manrope, 16–18px, 700
Buttons: Manrope, 13px, 700, uppercase
Arabic UI: Noto Kufi Arabic
```

### 3.9 Kinetic typography behind categories

Large, low-opacity phrases drifting slowly behind category content —
never reducing readability:
- Hot Drinks: ROASTED · WARM · AROMATIC
- Cold Drinks: FRESH · BRIGHT · CHILLED
- Sandwiches: GRILLED · FRESH · SATISFYING
- Desserts: SWEET · DELICATE · INDULGENT

(Same admin-created-category caveat as §3.4 — these four are the current
seed suggestions; make this configurable per category rather than
hardcoded, so it doesn't break when the admin adds a category we didn't
anticipate.)

Headings animate via mask reveal + gentle upward movement + letter-
spacing contraction + opacity — not per-letter animation.

### 3.10 Cart experience

Bottom sheet on mobile: background gets a soft blur, cart rises with
spring motion, items enter individually, quantity changes animate
smoothly, total counts up (already built in Phase 2 via AnimatedNumber),
SEND ORDER stays fixed at the bottom. On success, a subtle animation
based on the Sultana icon — not generic confetti.

### 3.11 Language switching

Text fades and shifts 4px, direction flips LTR/RTL, cards stay in place
rather than disappearing, Arabic layout properly mirrors nav/cart
controls, product photos never reload during the switch.

### 3.12 Small premium details

Subtle custom cursor (desktop only), warm paper grain at 2–3% opacity,
gold highlight following button hover, skeleton loading cards matching
real layout, cart state preserved on page close, the NEXERA footer with
a controlled hover glow (per Phase 2 §7 — same requirement, just styled
to this palette now), light haptic feedback on supported phones after
add-to-cart, smooth return to previous scroll position.

### 3.13 Motion timing rules

- Micro-interactions: 150–250ms
- Card/category transitions: 350–550ms
- Major hero transitions: 800–1200ms
- Full entrance sequence: never exceeds 3 seconds
- Respect `prefers-reduced-motion`
- Target 60fps on ordinary phones, not just desktop

### Customer journey reference

```
QR Scan → Sultana Logo Reveal → Hero & View Menu → Logo Shrinks into
Navbar → Category Navigation → Editorial Product Cards → Add-to-Cart
Motion → Order Bottom Sheet → Send & Confirmation
```

The logo's transformation from large hero mark into the small sticky nav
logo during scroll is the single most important interaction here — it's
what should make this feel custom-built rather than templated.

---

Test after implementing: place a full test order end-to-end (dine-in and
delivery) to confirm §1's bug is actually resolved, not just visually
changed.
