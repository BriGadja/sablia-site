# CLAUDE.md - Sablia Site

**AI integration agency landing page** — `sablia.io`

## Quick Reference
| Key | Value |
|-----|-------|
| Domain | sablia.io |
| Stack | React 18 / TypeScript / Vite / Express / Drizzle ORM / Tailwind v3 |
| Palette | Dark canvas #0f0f12 / Coral primary #cc785c / Teal accent #5db8a6 / Light cream #f5f2ec — full spec in `docs/design-system/DESIGN.md` |
| Typography | Cormorant Garamond Variable (display serif) / Inter Variable (body sans) / JetBrains Mono Variable (mono) |
| Animations | Framer Motion (whileInView + variants) |
| Dev | `npm run dev` → http://localhost:5000 |
| Lint | `npm run lint` (Biome) |
| Format | `npm run format` (Biome) |
| Type-check | `npm run check` |
| Test | `npx vitest run` (Vitest, run once; bare `npm test` = watch mode in a TTY) |
| Build | `npm run build` (Vite + prerender) |

## Critical Rules
1. NEVER use `any` type — define proper interfaces
2. Server always runs on port 5000
3. Client routing uses Wouter (not React Router)
4. Use `site_` prefix for all new DB tables (shared Supabase with n8n-intelligence)
5. **The site deploys STATIC** — `server/` is built but never served on Vercel. Anything needing a server goes in `api/*.ts` (Vercel Function, Node 22). `vercel.json`'s SPA catch-all EXCLUDES `/api/` (`"source": "/((?!api/).*)"`), `api/` is type-checked and Vitest-covered, and `api/**/*.test.ts` is in `.vercelignore` so a test file never becomes a routable function.
6. **Prod push verification MANDATORY** — every push to `main` auto-deploys to `https://sablia.io`. After push: wait propagation (new `x-vercel-id` hash via `curl -sI`), verify via Playwright MCP (`browser_navigate` → `browser_snapshot`; screenshot only if visual-specific), iterate if regressed (cap 3 attempts). Full protocol: `.claude/rules/browser-verification.md` (workspace-level).

## Architecture

### Path Aliases
- `@/` → `client/src/`
- `@db` → `db/`
- `@docs` → `docs/`

### Project Structure
```
client/src/           # React frontend (Vite)
  ├── components/     # UI components (landing/, ui/)
  ├── pages/          # Route pages
  ├── hooks/          # Custom hooks
  └── lib/            # Utilities
api/                  # Vercel Functions (DEPLOYED — unlike server/)
  └── contact.ts      # POST /api/contact: Resend mail + sabcrm_leads row
server/               # Express backend
  ├── index.ts        # Entry point
  └── routes.ts       # HTTP server setup (no API routes)
db/                   # Drizzle ORM schema (connected but unused at runtime)
docs/                 # All documentation
```

### Key Integrations
| Integration | Details |
|-------------|---------|
| Calendly | `openBooking()` from `BookingModal.tsx` — opens `site.bookingUrl` in popup window. URL centralized in `client/src/lib/site.ts` = `https://calendly.com/brice-gachadoat/30min` (Brice, since 2026-09-09; it was Raphaël's from the 2026-06 CRM refonte until Brice took acquisition and sales alone on 2026-09-01). `ThankYou.tsx` uses the same `site.bookingUrl`. Product page OF-1 uses `OF1_BOOKING_URL` (same Brice link) via `openBookingUrl`. |
| Supabase | `qlxoitzdxjqhljjoeqoq` — `site_*` tables (**connected but unused at runtime**) |
| GA4 / Google Ads | ⚠️ Env vars exist (`VITE_GA4_MEASUREMENT_ID`, `VITE_GADS_*`) but **NO code implementation** — tracking was lost during 2026-04 redesign. Needs re-implementation. Account IDs in `docs/GOOGLE_ADS.md`. |

## Routes
| Route | Page |
|-------|------|
| `/` | Landing (homepage) |
| `/mentions-legales` | Legal notice |
| `/politique-confidentialite` | Privacy policy |
| `/cgv` | Terms of service |
| `/thank-you` | Post-booking confirmation (noindex) |
| `/offres/compte-rendu-appel` | Offre n°1 product page (OF-1, prices displayed; content module client/src/content/of1.ts, parity test against the hub OF-1 file) |
| `/ressources` | Resource library, read live from Supabase (`client/src/lib/contenu.ts`) — no rebuild needed to publish a resource |
| `/ressources/:slug` | One resource (YouTube embed, body, files behind `RessourceForm`) — NOT prerendered (parametric, client-side fetch); own `<Helmet>`, `noindex` on an unknown/unpublished slug |

**Shared TopNav**: **3 items since 2026-09-28 (grill, decision 3)** — Offre · Formations · Ressources, plus the « Réserver 30 min » button. « Cas clients » and « Contact » left the bar with the sections they pointed at; the footer keeps « Nous écrire » → `/#contact`. The 3-item default is **site-wide on purpose**: `LegalShell` (3 legal pages), `ThankYou`, `Ressources` and `Ressource` render `<TopNav />` without `items`. **Offre** -> `/offres/compte-rendu-appel` and **Ressources** -> `/ressources` are real routes, rendered with wouter `Link`; **Formations** is a **root-relative** hash (`/#formations`) rendered as a plain `<a>` — `NavItem` branches on `href.startsWith('/') && !href.includes('#')`, because wouter's `navigate()` does not scroll to a hash and a bare `#formations` is inert on the other pages. Prop `tone: 'dark' | 'light'` (default dark; the home passes `light`: cream bar, ink word). The bar and the footer draw **`client/src/components/Logo.tsx`** (US-12, 2026-09-29): Brice's Claude Design mark 3 inline (`SYMBOL_PATH`, #D97757) + « Sablia » in the display font; the old `wordmark-*.svg` (derived from a client's brand) are deleted. A page can override `items` (the OF-1 page does). `TopNav.test.tsx` pins the exact three in order in BOTH menus, the CTA label, the light tone, the plain-`<a>` behaviour of a hash item, and that an overriding page gets none of them.

**Homepage sections** (grill of 2026-09-28, `client/src/pages/Landing.tsx`; the whole home is LIGHT, footer stays dark): **HeroSection** (H1 = `of1.title`, one « Réserver 30 min » button, the photo `client/public/photos/accueil-meetup-ecran-*.webp` — QR and slide text blurred in the asset by `scripts/prepare-photos.py` — with **RecordCard** over it: the CRM record « Catherine Durand » whose 4 bars fill in CSS, the ONLY animated moment; `fetchpriority` passes lowercase through a spread because react-dom 18.3.1 maps neither casing) → **CRMStrip** (scrolling marquee, list rendered twice, static wrap under reduced motion) → **`#offre` OffreSection** (OF-1 card: title, promise, price, « Livré en {of1.delay.days} jours », guarantee, link to the offer page; the demo video `d5fo00AFqVM` as a click-to-play facade — local thumbnail, NO iframe before the click, then `youtube-nocookie.com/embed/…?autoplay=1`; the proof line « Plus de 20 clients accompagnés depuis 2025. », dossier row P-15, no call figure since 2026-09-29) → **`#formations`** (FormationsSection: vertical photo `accueil-meetup-public-*.webp`, the 2026-09-18 accroche, the academy proof, the Denis quote, then the two quote cards `FORMATION_QUOTES` of `home.ts` (dossier rows P-16/P-17, first name and role only, clamped to 3 lines behind an `aria-expanded` « Lire la suite »), **no price**, the `#contact` form) → **CalloutSection** (title « Trente minutes pour voir si ça tourne chez vous. », + second path: guide and `app.sablia.io/questionnaire`). Home words live in `client/src/content/home.ts` (video, proof line, final-call title, photo descriptors, Formations quotes; the proof line and the quotes are pinned to their proof-dossier rows by `landing.copy.test.ts`) and in the OF-1 module; **the home delay is rendered from `of1.delay.days`, never hardcoded** (decision 5 was reversed by Brice the same day: the home shows it). Deleted on 2026-09-28: ProblemsSection, ProcessSection, TeamSection, ProofSection, FaqSection, CatalogueSection. The home FAQ's five questions moved to the offer page (`client/src/content/faq-carried.ts`, appended AFTER `of1.faq` in `OffreFaq.tsx` and in the FAQPage JSON-LD of `of1-schema.ts`, so `of1.parity.test.ts`'s anchors keep their indices). `client/public/llms.txt` is guarded by `landing.copy.test.ts` like the TSX sources. Vercel Web Analytics is injected in `main.tsx` (`book_call` event in `BookingModal.tsx`); it needs the toggle ON in the Vercel project. ⚠️ FAQ « sécurité données » = formulation tier-safe « API commerciale » — à confirmer avec Brice si offre = Anthropic Enterprise. **Prix et délais de la home viennent du module OF-1** (`client/src/content/of1.ts`, formatés par `client/src/lib/format.ts`) ; `client/src/components/landing/landing.copy.test.ts` rougit si une formule de l'ancien discours revient, si un « 7 jours » est tapé en dur dans une source de la home, si la nav perd son ordre, ou si les deux phrases nouvelles quittent `home.ts`.

**Brand (US-12, Brice's pick of 2026-09-29, Claude Design round 3)**: two sources in `client/public/brand/` — `symbol.svg` (mark 3, the stroked S-hourglass: nav, footer, schema.org `logo.svg`, OG images, lockups) and `badge.svg` (mark 12: the SAME path cut out of a #D97757 rounded square by an SVG `<mask>`, for every slot needing its own background: `favicon.svg/png/ico`, `icon-192/512/1024`; `apple-touch-icon` and `icon-maskable-*` are its full-bleed tile). Regenerate everything with `python3 scripts/brand-assets.py` then `node scripts/og-image.mjs` (OG/Twitter 1200×630 + `brand/lockup-{horizontal,vertical}-{light,dark}.png`, site fonts); guard `python3 scripts/brand-check.py` (old md5s banned, ICO frames exactly 16/32/48, badge cuts the symbol's own `d`). The logo colour #D97757 differs from the site coral token #CC785C on purpose until Brice decides.

## Documentation

| Doc | Purpose |
|-----|---------|
| `docs/design-system/DESIGN.md` | Design system — colors, typography, components, spacing |
| `docs/ARCHITECTURE.md` | Component tree, routes, hooks, server, build config |
| `docs/INTEGRATIONS.md` | Calendly, contact form (`api/contact.ts` → Resend + Supabase), GA4, Google Ads |
| `docs/SEO.md` | Meta-tags, structured data, sitemap |
| `docs/GOOGLE_ADS.md` | Ads account IDs, conversion labels, campaign strategy |
| `docs/product-v1.md` | **Frozen SKU v2** — Diagnostic Sablia 490€ HT, 3 post-audit paths |
| `docs/wireframe-v1.md` | **Frozen homepage wireframe** — 9 sections, 2 CTAs |
| `docs/copy-v1.md` | **Frozen homepage copy** — hero, narrative arc, FAQ, tone guide |
| `docs/meta-tags.json` | SEO meta-tags per page |
| `docs/README.md` | LLM guide to docs/ |

When modifying site content, update the corresponding doc (see `docs/README.md` for sync table).

## CRM Business Context

`docs/crm/` is a symlink to `projects/sablia-crm/` — the business context for the "Intégrer Claude dans votre CRM" offering. When redesigning the site for CRM focus, read:
- `docs/crm/CLAUDE.md` — offering overview, team, architecture
- `docs/crm/briefs/` — creative briefs, LP structure
- `docs/crm/clients/` — client context (CRM type, needs, meetings)
- `docs/crm/templates/` — proposal and email templates

## Database
- Drizzle ORM + PostgreSQL (Supabase)
- Schema: `db/schema.ts`
- Migrations: `npm run db:push`
- Table prefix: `site_`
- **Status**: DB layer exists (schema, drizzle config) but zero runtime usage. Connected but unused.
- **`contenu_*` is an exception to the `site_` prefix rule**: the register lives in the HUB (Sablia workspace's "machine de contenu"), not in this project. `client/src/lib/contenu.ts` and `api/ressources-request.ts` read `contenu_ressources` (and the `contenu-ressources` storage bucket) — **read-only** for the site, anon key client-side, service-role key from the Vercel Function. This project never migrates or writes that table's schema.

## Testing
- Framework: Vitest + React Testing Library
- Run: `npm test` (unit) | `npm run test:coverage`

## Environment Variables
| Variable | Description | Status |
|----------|-------------|--------|
| `DATABASE_URL` | PostgreSQL connection string | Active (server) |
| `NODE_ENV` | Environment (development/production) | Active |
| `VITE_GA4_MEASUREMENT_ID` | GA4 measurement ID | ⚠️ No code reads this |
| `VITE_GADS_CONVERSION_ID` | Google Ads conversion ID | ⚠️ No code reads this |
| `VITE_GADS_LABEL_CONTACT` | Ads label: contact form | ⚠️ No code reads this |
| `RESEND_API_KEY` | Resend key used by `api/contact.ts` to mail brice@sablia.io | **Server-side only** — Vercel project settings, `sensitive`, Preview + Production. Never in `.env`, never in the bundle |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key used by `api/contact.ts` to insert into `sabcrm_leads` | **Server-side only** — same. RLS on `sabcrm_leads` has zero policies, so this key is the only write path, by design |
| `VITE_SUPABASE_ANON_KEY` | Anon key read by `client/src/lib/contenu.ts` to fetch `contenu_ressources` (`published=true` only, by RLS) | **Client-side, in the bundle by design** — Vercel project settings, plain, Preview + Production (T33). Missing key → `anonKey()` returns `null`, pages render the explicit "indisponible" state, never an exception |
