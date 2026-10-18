# Architecture — Sablia Site

**Last updated**: 2026-10-18 (Server and Hosting chain sections; the rest predates the 2026-09/10 redesigns)
**Stack**: React 18 / TypeScript / Vite / Express / Drizzle ORM / Tailwind

---

## Entry Flow

```
main.tsx > StrictMode > App.tsx > ErrorBoundary > MotionConfig(reducedMotion="user") > HelmetProvider > Router > AnimatePresence > Routes
```

Global overlays rendered alongside Router: `Toaster`, `ConsentBanner` (lot 0: `components/consent/`, tier-2 consent; the cookieless tier-1 measurement needs none)

---

## Route Map

| Route | Component | Lazy? | Notes |
|-------|-----------|-------|-------|
| `/` | Landing | No | Homepage |
| `/tarifs` | Tarifs | No | Pricing |
| `/gap` | GapForm | No | GAP analysis form |
| `/about` | About | No | About page |
| `/roi` | Roi | No | ROI calculator |
| `/faq` | Faq | No | FAQ (24 questions) |
| `/cas-clients` | CaseStudies | No | Case studies |
| `/thank-you` | ThankYou | No | Post-form confirmation |
| `/mentions-legales` | MentionsLegales | No | Legal notice |
| `/politique-confidentialite` | PolitiqueConfidentialite | No | Privacy policy |
| `/cgv` | CGV | No | Terms of service |
| `/lp/automatisation-pme` | LpAutomatisation | Yes | Ad landing page (noindex) |
| `/lp/audit-gratuit` | LpAuditGratuit | Yes | Ad landing page (noindex) |
| `/offres/compte-rendu-appel` | OffreCompteRenduAppel | No | Offre n°1 product page (prices displayed) |
| `*` | NotFound | No | 404 catch-all |

**Total**: 14 routes (13 static + 1 catch-all)

---

## Component Tree

### Pages (14)

Located in `client/src/pages/`:
Landing, Tarifs, GapForm, About, Roi, Faq, CaseStudies, ThankYou, MentionsLegales, PolitiqueConfidentialite, CGV, LpAutomatisation (lazy), LpAuditGratuit (lazy), not-found

### Landing Components (12)

Located in `client/src/components/landing/`. Order in `Landing.tsx` (9-section editorial stack, ux-migration 2026-04-20):
- Navigation (pill fixed header, 4 anchors, cross-page scroll)
- HeroSection (Fraunces H1, LogoMark aside desktop, 2 CTAs)
- FrictionSection (N° 02 — 6-item ordered list)
- OffersSection (N° 03 — triptych illustration + VoicePlayer + specifs DL)
- AuthoritySection (intermède — Yassine / IAPreneurs credential)
- WhatRevealsSection (N° 04 — 3 post-audit paths with folio numbers)
- MethodSection (N° 05 — fond encre sombre, 4-step timeline, eager)
- ProofSection (N° 06 — stats grid + 3 témoignages placeholders + sector list)
- CalculatorROI (différentiateur sablia-site, lazy)
- DiagnosticForm (N° 07 — Zod + honeypot + WEBHOOK_DIAGNOSTIC, anchor `#diagnostic-form`)
- FaqSection (N° 08 — Accordion editorial, 9 Q, FAQPage JSON-LD, lazy)
- FinalCtaSection (N° 09 — logo oversized opacity 0.07, signature Brice, lazy)
- LegalShell (+ LegalSection helper — used by /cgv, /politique-confidentialite, /mentions-legales)

### Core Components (5)

Located in `client/src/components/`:
- ErrorBoundary
- Footer
- SEO (meta-tags + BreadcrumbList schema)
- RoiCalculator
- CookieConsentBanner

### Animation Components (1)

Located in `client/src/components/animations/`:
- ScrollReveal (scroll-triggered reveal animation, respects `prefers-reduced-motion`)

### UI Components (12 — shadcn/ui)

Located in `client/src/components/ui/`:
button, card, form, input, label, radio-group, select, slider, textarea, toast, toaster, tooltip

---

## Hooks (3)

Located in `client/src/hooks/`:

| Hook | File | Purpose |
|------|------|---------|
| useToast | use-toast.ts | Toast notification state |
| usePageTracking | use-page-tracking.ts | GA4 page view tracking |
| useReducedMotion | useReducedMotion.ts | prefers-reduced-motion detection |

---

## Lib Files (4 + 1 utils)

Located in `client/src/lib/`:

| File | Purpose |
|------|---------|
| analytics.ts | GA4 + Google Ads init, consent, page view tracking, conversion tracking |
| form-constants.ts | Shared form constants: webhook URLs (`WEBHOOK_CONTACT`, `WEBHOOK_GAP`), `inputClasses` |
| utils.ts | `cn()` classname merge utility (clsx + tailwind-merge) |
| utm.ts | UTM parameter extraction from URL search params |

Located in `client/src/utils/`:

| File | Purpose |
|------|---------|
| roi.ts | ROI calculation logic for the calculator |

---

## Server

Since the lot 0 move (plan `sablia-io-lot0-vps`) the site is served by **our own Node process behind Caddy**, no longer by Vercel.

- `server/app.ts` — `createApp()`: security headers (HSTS 2 years, nosniff, referrer policy), `/healthz` (public: `{ok, release}`) and `/healthz/full` (loopback only: which API secrets are present, booleans), the API adapter, the static server with the SPA fallback, a JSON 500 handler that never re-throws.
- `server/static.ts` — Vercel's behaviour measured on 2026-10-18 (`deploy/parity-baseline.json`): a prerendered directory page answers 200 at `/x` and `/x/`, `/escalier-modeles` serves `escalier-modeles.html`, any other unknown path serves `index.html` with 200, only `/assets/*` is `immutable`, `.well-known` is served, other dotfiles never.
- `server/api-adapter.ts` — `api/contact.ts` and `api/ressources-request.ts` stay Web-standard Fetch handlers; the adapter builds a `Request`, caps the body at 100 kB (413), writes status/headers/body back, answers any other `/api/*` with 404.
- `server/index.ts` — `HOST` (default `127.0.0.1`) / `PORT` (default 5000), graceful `SIGTERM`; the Vite dev branch exists only under `tsx` (the build defines `process.env.NODE_ENV`, which removes it from `dist/index.js`).
- Production bundle: `scripts/build-server.mjs` makes ONE `dist/index.js` (no `node_modules` at runtime). A release directory holds `bin/start`, `RELEASE` and `dist/` — the contract a Next.js release (Lot 3) keeps.

## Hosting chain

`deploy/deploy.sh` (systemd timer every minute on the VPS): ref moved → `npm ci --ignore-scripts` → build with `PRERENDER_STRICT=1` → every sitemap URL prerendered → candidate smoke-tested on a scratch port → atomic symlink switch → health check, automatic revert → last 3 releases kept. Two slots: `prod` (port 5000) and `preview` (5001, `preview.sablia.io`, basic auth, noindex). Caddy blocks: `deploy/Caddyfile.sablia-site`. Measurement: self-hosted Umami, tracker under `/m/`. Details: `deploy/*.md` and the hub card `knowledge/infra/sablia-site-vps.md`.

---

## Build Config

**Vite** (`vite.config.ts`):
- Path aliases: `@/` → `client/src/`, `@db` → `db/`, `@docs` → `docs/`
- Output: `dist/public`
- Sourcemaps: disabled
- Bundle visualizer: `dist/stats.html`

**Manual Chunks** (for caching):

| Chunk | Contents |
|-------|----------|
| react-vendor | react, react-dom, react/jsx-runtime |
| router | wouter |
| animation | framer-motion |
| forms | react-hook-form, @hookform/resolvers, zod |
| ui | @radix-ui/react-toast |

---

## Design Tokens

### Sablia Palette (`tailwind.config.ts`)

| Token | Value | Usage |
|-------|-------|-------|
| sablia-text | #1a2e4e | Primary text color |
| sablia-text-secondary | rgba(26, 46, 78, 0.62) | Secondary text |
| sablia-text-tertiary | rgba(26, 46, 78, 0.40) | Tertiary text |
| sablia-accent | #1a2e4e | Accent (same as text) |
| sablia-accent-hover | #0f1c30 | Accent hover state |
| sablia-surface | #eae3d2 | Surface/card background |
| sablia-bg | #f4efe2 | Page background |
| sablia-sienna | #c45a2c | Warm accent (CTAs, highlights) |
| sablia-alba | #d4956a | Warm secondary accent |
| sablia-border | rgba(26, 46, 78, 0.10) | Border color |

### Fonts

| Role | Font | Fallbacks |
|------|------|-----------|
| sans (body) | Inter Tight | Inter, system-ui, sans-serif |
| display (headings) | Cormorant Garamond | Georgia, serif |

### Shadows

| Token | Description |
|-------|-------------|
| warm-sm | Subtle warm shadow |
| warm | Default warm shadow |
| warm-lg | Large warm shadow |

---

## Related Docs

- [INTEGRATIONS.md](./INTEGRATIONS.md) — External services and webhooks
- [SEO.md](./SEO.md) — Meta-tags, structured data, sitemap
- [SITE_CONTENT.md](./SITE_CONTENT.md) — Page content and copy
