# Architecture — Sablia Site

**Last updated**: 2026-03-02
**Stack**: React 18 / TypeScript / Vite / Express / Drizzle ORM / Tailwind

---

## Entry Flow

```
main.tsx > StrictMode > App.tsx > ErrorBoundary > MotionConfig(reducedMotion="user") > HelmetProvider > Router > AnimatePresence > Routes
```

Global overlays rendered alongside Router: `Toaster`, `CookieConsentBanner`

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

Express on port 5000. No API routes — all forms submit directly to n8n webhooks. Server only handles static file serving and SPA routing.

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
