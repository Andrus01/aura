# Aura & Ood — Morning Spirit

A cinematic, scroll-driven e-commerce campaign site for the luxury unisex fragrance
**Morning Spirit** ("Koidiku Kaja / The Echo of Dawn"). Estonian-first, mobile-first,
production-ready.

## Stack

- **Next.js 15** (App Router) · **TypeScript** · **Tailwind CSS v3**
- **Framer Motion** — scroll reveals, parallax, pinned storytelling
- **Lenis** — smooth scroll (disabled under `prefers-reduced-motion`)
- **Prisma + SQLite** — products, images, notes, demo orders
- **Zustand** — local cart with `localStorage` persistence
- **sharp / ffmpeg** — asset optimisation pipeline

## Getting started

```bash
npm install                 # installs deps + runs `prisma generate`
npm run assets              # optimise /resources -> /public (webp + mp4/webm + posters)
npx prisma migrate dev      # create SQLite db + run seed (2 products)
npm run dev                 # http://localhost:3000
```

> `npm install` and `npm run assets` and the migration have already been run in this
> workspace. Just `npm run dev` to start.

## Editing content & catalogue

| What | Where |
|---|---|
| Prices, stock, product copy, images, notes | `prisma/seed.ts` → re-run `npx prisma db seed` |
| All on-page Estonian copy (i18n-ready) | `src/lib/content.ts` |
| Brand colours / typography / motion tokens | `tailwind.config.ts` |
| Which source assets map to which slugs | `scripts/optimize-assets.mjs` |

Prices are stored in **euro cents** (`12900` = €129,00). Current placeholders:
Morning Spirit 100 ml = **€129**, Discovery 10 ml = **€29**.

## Structure

```
src/
  app/
    page.tsx            # single cinematic long-scroll page
    checkout/           # demo checkout (form -> /api/orders -> SQLite)
    api/orders/route.ts # server re-prices from DB, saves demo order
    layout.tsx          # fonts, SEO metadata, JSON-LD, SmoothScroll
  components/
    sections/           # Hero, Story, Pyramid, ProductReveal, Shop, Why, Packaging, FinalCta
    site/               # Navigation, CartDrawer, Footer
    motion/             # Reveal, Parallax primitives
    providers/          # SmoothScroll (Lenis)
  lib/                  # db, products, content, format, types, hooks
  store/cart.ts         # zustand cart
prisma/                 # schema.prisma + seed.ts + dev.db
public/optimized/       # webp images   public/video/  mp4+webm+posters
```

## Sections

1. Cinematic hero (parallax bottle, dual CTA, scroll cue)
2. Pinned story "Koidiku Kaja" — dawn-blue → sunrise-amber transition + ambient video
3. Fragrance pyramid — Äratus / Koidiku kuma / Päeva aura with scroll-revealed notes
4. Product reveal — rotating bottle video + premium callouts
5. Shop — 2 product cards, quantity, add-to-cart, cart drawer
6. Why Morning Spirit — 4 benefits
7. Packaging — black & gold gifting
8. Final CTA — "Alusta päeva valgusega."

## Admin (`/admin`)

Password-protected admin panel to edit the catalogue and view orders — no code needed.

```
http://localhost:3000/admin
```

- **Password:** set `ADMIN_PASSWORD` in `.env` (default `aura-admin`). Login sets an
  httpOnly cookie (8h).
- **Tooted (Products):** edit **price (€)** and **stock** inline → saves to SQLite. The
  public homepage is revalidated automatically, so new prices show immediately.
- **Tellimused (Orders):** every demo order with customer details, delivery method,
  comments and line items.

> This is a lightweight demo auth (single shared password). Before going public, replace
> `src/lib/auth.ts` with hashed credentials + real sessions.

For raw DB access you can still use **Prisma Studio**: `npx prisma studio` → localhost:5555.

## Payment & shipping — Montonio (sandbox-ready)

Montonio **bank links (pangalingid)** + **Shipping (parcel machines)** are wired in and
run in **sandbox** out of the box. Without keys the checkout falls back to the demo flow,
so the site always works.

### Enable sandbox

1. Get **Sandbox** keys from the Montonio Partner System (Stores → your store → API keys).
2. Put them in `.env`:
   ```
   MONTONIO_ENV=sandbox
   MONTONIO_ACCESS_KEY=...
   MONTONIO_SECRET_KEY=...
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```
3. Restart `npm run dev`.

### Flow

- **Checkout** (`/checkout`) shows Estonian **bank-link buttons** + a **parcel-machine
  picker** (carrier → pickup point, fetched live via `/api/shipping/pickup-points`).
- **`/api/orders`** creates a `pending` order, then calls Montonio Payments (Stargate)
  `POST /api/orders` (payload signed HS256 with the secret key, `preferredProvider` = the
  chosen bank, `preferredCountry=EE`) and returns the hosted `paymentUrl` to redirect to.
- **Return** (`/checkout/return`) verifies the `order-token` JWT, updates status and
  clears the cart (fast path).
- **Webhook** (`/api/montonio/webhook`) verifies the `orderToken` JWT and sets
  `paymentStatus` (PAID/PENDING/ABANDONED, matched case-insensitively) → `status=paid`.
- **Admin** shows each order's payment status and — for parcel-machine orders — a
  **“Registreeri saadetis”** button that calls Montonio Shipping `POST /api/v2/shipments`.

### Webhooks on localhost

Montonio calls the webhook server-to-server, so it needs a **public URL**. For local
testing run a tunnel and point the callback at it:
```
npx localtunnel --port 3000      # or ngrok http 3000
# then in .env:
MONTONIO_NOTIFICATION_URL=https://<your-tunnel>/api/montonio/webhook
NEXT_PUBLIC_BASE_URL=https://<your-tunnel>
```
The return page also updates status on redirect, so payment status still reflects locally
even without a tunnel.

### Going live

Switch `MONTONIO_ENV=live` and use the **Live** keys. Carriers must be enabled for the
store in the Montonio partner portal (else Shipping returns 401). Consider adding BNPL
(pay-later, ~€100 minimum) and an order-confirmation email on the `PAID` webhook.

Order model already includes: `paymentStatus`, `paymentMethod`, `paymentProvider`,
`montonioUuid`, `shippingCarrier`, `shippingMethodType`, `pickupPointId`,
`pickupPointName`, `shipmentStatus`.

## Accessibility & performance

- Full `prefers-reduced-motion` support (Lenis off, animations neutralised)
- All imagery via `next/image` (AVIF/WebP, responsive); optimised assets total ~3 MB
- Videos are muted, `playsInline`, poster-backed, and compressed (<650 KB each)
