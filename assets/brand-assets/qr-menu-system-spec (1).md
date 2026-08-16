# Cafe QR Ordering System — Project Spec

Full spec for a QR-code menu ordering system: customer ordering app + admin
dashboard, backed by a real database. This is the brief to hand to Claude
Code as the starting context for the project.

> **Status:** ready to start building. Animation approach is decided
> (§6), preliminary logo/main picture/category placeholders exist and are
> included alongside this file (§7), and both the WhatsApp number and the
> cafe's own system are wired as fill-in-later config points (§5) — none
> of these block starting the build.

---

## 1. System overview

Three connected pieces, one shared database:

```
[QR Code] --> [Customer Web App] --> [Database] <-- [Admin Dashboard]
                                          |
                                          v
                                  [WhatsApp message
                                   to cafe on send]
```

- **Customer app**: main cafe picture on open, menu browsing, cart,
  checkout → creates an order record.
- **Admin dashboard**: menu management (CRUD, photos, prices) + orders
  history with calendar/date search. Password-protected, mobile-friendly
  (owner mainly uses it on his phone).
- **Database**: single source of truth both apps read/write to.
- **WhatsApp**: triggered on order submit (see §5).

---

## 2. Data model

### `menu_items`
| field | type | notes |
|---|---|---|
| id | string/uuid | |
| name | string | |
| description | string | optional |
| price | number | |
| category | string | e.g. "Sandwiches", "Hot Drinks" |
| photo_url | string | uploaded image |
| available | boolean | admin can toggle item on/off without deleting |
| sort_order | number | optional, for manual ordering within a category |

### `categories`
| field | type | notes |
|---|---|---|
| id | string | |
| name | string | e.g. Hot Drinks, Cold Drinks, Sandwiches, Desserts |
| animation_key | string | which animation this category triggers, see §6 |

### `orders`
| field | type | notes |
|---|---|---|
| id | string/uuid | |
| created_at | datetime | needed for calendar/date search |
| table_number | string | optional, from QR code param |
| items | array | see `order_items` below (can be a JSON column or a join table) |
| total | number | |
| status | string | e.g. new / preparing / done (nice-to-have for admin) |

### `order_items` (per line inside an order)
| field | type | notes |
|---|---|---|
| menu_item_id | string | |
| name | string | snapshot of name at order time |
| price | number | snapshot of price at order time |
| quantity | number | |
| notes | string | e.g. "no tomato" |

Snapshotting name/price on the order matters: if the admin changes a price
tomorrow, past orders should still show what the customer actually paid.

### `cafe_settings`
| field | type | notes |
|---|---|---|
| logo_url | string | admin-editable, defaults to the preliminary logo |
| main_picture_url | string | the "Main Pic" shown when the QR is first opened, admin-editable |
| cafe_name | string | |
| whatsapp_number | string | **empty until the client provides it** — order sending is skipped (or shows a "not configured" note in admin) until this is filled in |
| external_system_webhook_url | string | **empty until the client's system is known** — see §11 |
| external_system_api_key | string | optional, depends on what the system needs |
| brand_colors | object | `{primary, accent, secondary}` — seeded from the preliminary logo, editable later |

---

## 3. Customer app — features

- **Opening screen**: shows the cafe's **Main Picture** + name first
  (client to provide this photo — see §8).
- Browse menu by category (tabs/chips), each item shows photo, name,
  description, price.
- Per item: choose **quantity** before adding, optional **notes** field
  (e.g. "no tomato").
- Cart: list of chosen items, each editable (change quantity, edit notes,
  **delete** the line), running **total** updates live.
- Submit order → writes to `orders` in the database, then triggers the
  WhatsApp message (§5).
- Optional: QR code encodes a table number as a URL param
  (`?table=4`) so orders show which table they're from.

---

## 4. Admin dashboard — features

- **Login** (simple password or proper auth — decide based on how many
  staff need access).
- **Menu management**:
  - Add / edit / delete items
  - Upload / replace photos
  - Change prices
  - Toggle item availability (e.g. "sold out today") without deleting it
  - Manage categories
  - Upload/replace the cafe's **Main Picture**
- **Orders view**:
  - Live list of incoming orders
  - **Calendar view**: click a day → see all orders/sales for that day
  - **Search/filter** by year, month, day (e.g. "show me July 2025")
  - Per-day or per-range totals (basic sales summary)
- Designed mobile-first since the owner mainly checks this on his phone.

---

## 5. WhatsApp integration — two options

**Option A — free, manual send (good for launch)**
`wa.me` link pre-fills a WhatsApp message with the order and opens it on
the *customer's* phone; the customer still taps Send themselves.
No approval process, no cost, works today.

**Option B — WhatsApp Business API, automatic (grow into this later)**
Order is sent automatically to the cafe's WhatsApp Business number, no
action needed from the customer. Requires a verified WhatsApp Business
account with Meta, a provider (e.g. Twilio, 360dialog, or Meta's own Cloud
API), and a backend endpoint that triggers the send. Has a small monthly
cost and a short approval process with Meta.

Recommendation: build on Option A first since it works immediately, keep
the order-sending logic in one function so swapping to Option B later is a
config change, not a rewrite.

**Build now, fill in later:** the WhatsApp number goes in one config spot
(e.g. `cafe_settings.whatsapp_number` / an env variable) — build the send
logic against that variable now with a placeholder value, and it becomes
live the moment the client provides the real number, no code changes
needed.

### Café's own ordering system — same approach

The client also wants orders to eventually reach the cafe's own internal
system (POS or whatever they use), but that system isn't chosen yet. Build
`sendToCafeSystem(order)` now as a clearly-marked stub function that logs
the order (or no-ops) — once the client picks a system, this becomes a
single API call/webhook to that system's endpoint. Keeping the order data
already structured (§2) means this is a small follow-up task later, not a
redesign.

---

## 6. Categories & per-category animations

Each category has its own signature motion, shown while browsing that
section (e.g. as a background/hero animation on the category screen):

| Category | Animation concept |
|---|---|
| **Hot Drinks** | Coffee beans fall/pour into a cup, cup fills with coffee |
| **Cold Drinks** | Ice cubes drop into a glass, drink pours in, condensation forms |
| **Sandwiches** | Two bread halves with lettuce, tomato, pickles, and meat between them close together (like a burger stacking/closing) |
| **Desserts** | A plate of crepe gets sprinkled with chocolate chips, cookie crumbs, and strawberries |

*(More categories can be added the same way — each just needs its own
short animation concept like the ones above.)*

**Two ways to actually build these — this decision changes what I need
from you:**

**A) Real video loops (most realistic look)**
Short muted background video clips (mp4/webm, a few seconds, looping) —
like the polished "ingredients falling into place" clips you see on food
delivery apps. These need to be *sourced or produced*: either licensed
stock footage (e.g. from Storyblocks/Envato), an AI video generation tool,
or a motion designer commissioned to make them. I can wire up whatever
clips you provide, but I can't produce photorealistic video footage
myself.

**B) Custom-coded animation (I can build this directly, no assets needed)**
A stylized, illustrated version of the same idea — e.g. simple SVG coffee
bean shapes animating into a cup, ice cube icons dropping in, bread layers
sliding together. Looks clean and on-brand rather than photorealistic, but
needs zero outside assets and I can build it right away.

**DECIDED: starting with (B), custom-coded animation.** If it doesn't
look convincing enough once built, fall back to (A) — an AI-generated
video clip per category — as a drop-in replacement, since the animation
is one swappable piece, not the whole app.

---

## 7. Main Picture

The first thing a customer sees when they scan the QR: a full-screen
"Main Pic" of the cafe with its name over it, before they tap into the
menu. This is just a photo the client uploads through the admin panel
(stored as `cafe_settings.main_picture_url`) — the app is built to expect
one, and you swap it in whenever the real photo is ready. No need to wait
for the photo to keep building everything else.

### Preliminary placeholder assets (ready now)

Since the real logo/photos aren't ready yet, a placeholder set was made
so the app looks finished from day one, using the palette already
established (espresso brown, cream, gold, olive):

- `logo.svg` — preliminary logo (coffee cup + steam mark, "Cardamom Café"
  wordmark). Cafe name is also a placeholder — swap both once branding is
  final.
- `main-pic-placeholder.svg` — the full-screen opening image.
- `placeholder-hot-drinks.svg`, `placeholder-cold-drinks.svg`,
  `placeholder-sandwiches.svg`, `placeholder-desserts.svg` — one generic
  illustrated image per category, used as the default photo for any menu
  item that doesn't have a real photo uploaded yet.

**Every one of these must be replaceable from the admin panel** — logo,
main picture, and each menu item's photo — via a simple image upload
control, not a code change. Until the client uploads a real photo, the
matching category placeholder above should be shown automatically.

---

## 8. What I need from you

**Assets / content:**
- [ ] Main Picture (hero photo of the cafe)
- [ ] Photos for each menu item
- [ ] Cafe logo — ~~if there is one~~ using the preliminary logo (§7) until
      real branding is ready
- [ ] Cafe's WhatsApp number (for Option A sending)
- [ ] Final category list + any items you want in each
- [ ] Whichever ordering/POS system the cafe ends up using (§5), whenever
      that's decided
- [ ] The design reference you mentioned sending (colors/type/look)

**Decisions:**
- [ ] One QR code for the whole cafe, or one per table (table number
      tracking)?
- [ ] Single admin login, or multiple staff accounts?

---

## 9. What you need to install / set up

Since you'll be building this in **Claude Code inside VS Code**, here's
what needs to be on your machine and which accounts to create:

**On your computer:**
- **Node.js** (LTS version) — Claude Code will need this to run and test
  the project locally. Download from nodejs.org if not already installed.
- **VS Code** — you already have this.
- **Claude Code extension/CLI** — you already have this set up.
- **Git** — for version control (usually comes with VS Code setup, or
  installed separately from git-scm.com).

**Accounts to create (free tiers are enough to start):**
- **Supabase** account (or Firebase, whichever we pick) — this is the
  database + photo storage + admin login backend.
- **GitHub** account — to store the project's code and make deploying
  easy.
- **Vercel** (or Netlify) account — to host the live site once it's ready,
  connects directly to GitHub.

Nothing here costs money to start — all of the above have free tiers
sufficient for a project this size.

---

## 10. The path — step by step

1. **Gather assets** (§8 checklist) — doesn't need to be 100% complete to
   start building, but the sooner the better.
2. **Set up the project in Claude Code**: initialize the repo, install
   dependencies, connect the Supabase project.
3. **Build the database**: create the tables from §2 (menu_items,
   categories, orders, order_items, cafe_settings).
4. **Build the customer app**: Main Picture screen → menu browsing → cart
   (quantity, notes, delete) → submit order.
5. **Build the admin dashboard**: login → menu management (add/edit/
   delete/photos/prices) → orders view with calendar + date search.
6. **Wire up WhatsApp** (Option A — the `wa.me` link).
7. **Build the category animations** (per the choice in §6).
8. **Generate the actual QR code(s)** pointing at the live customer app
   URL (with `?table=` if per-table QR codes were chosen).
9. **Test end-to-end** on a real phone: scan → order → check it arrives
   on WhatsApp and shows up in the admin dashboard.
10. **Deploy**: push to GitHub, connect to Vercel, go live. Connect a
    custom domain if the client wants one instead of the default Vercel
    URL.
11. **(Later, optional)** Upgrade WhatsApp sending to the Business API
    (Option B) once ready to automate it fully.

This spec (steps 1–11) is what to hand to Claude Code as the starting
brief — it has the full data model, feature list, and order of
operations to follow.
