# CLAUDE.md - Sablia Site

**Business automation consulting website** — `sablia.io`

## Quick Reference
| Key | Value |
|-----|-------|
| Domain | sablia.io |
| Stack | React 18 / TypeScript / Vite / Express / Drizzle ORM / Tailwind v3 |
| Palette | `sable` (fond) / `encre` (texte) / `tuile` (accent) / `foret` / `ocre` — ported from sablia-io 2026-04-20. Legacy `sablia-*` tokens kept as shims for LPs + GapForm. |
| Typography | Fraunces Variable (display, full SOFT/WONK/opsz axes) / Geist (sans) / JetBrains Mono (mono/folio/eyebrow) — `@fontsource-variable/fraunces` + `@fontsource/geist` |
| Animations | Framer Motion + CSS `Reveal` wrapper (`.reveal` / `.is-visible`, ease-editorial) |
| Dev | `npm run dev` → http://localhost:5000 |
| Lint | `npm run lint` (Biome) |
| Format | `npm run format` (Biome) |
| Type-check | `npm run check` |
| Test | `npm test` (Vitest) |
| Build | `npm run build` |

## Critical Rules
1. NEVER use `any` type — define proper interfaces
2. Server always runs on port 5000
3. Client routing uses Wouter (not React Router)
4. Use `site_` prefix for all new DB tables (shared Supabase with n8n-intelligence)

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
server/               # Express backend
  ├── index.ts        # Entry point
  └── routes.ts       # HTTP server setup (no API routes)
db/                   # Drizzle ORM schema
docs/                 # All documentation
```

### Key Integrations
| Integration | Details |
|-------------|---------|
| n8n (contact) | `WEBHOOK_CONTACT` from `form-constants.ts` → `https://n8n.sablia.io/webhook/sablia-site-formulaire` |
| n8n (GAP) | `WEBHOOK_GAP` from `form-constants.ts` → `https://n8n.sablia.io/webhook/sablia-site-gap` |
| Calendly | `https://calendly.com/brice-gachadoat/30min` (react-calendly InlineWidget) |
| GA4 | `VITE_GA4_MEASUREMENT_ID` — consent-gated |
| Google Ads | `VITE_GADS_CONVERSION_ID` + 3 labels — consent-gated |
| Supabase | `qlxoitzdxjqhljjoeqoq` — `site_*` tables (**connected but unused at runtime**) |

## Routes
| Route | Page |
|-------|------|
| `/` | Landing (homepage) |
| `/gap` | GAP analysis form |
| `/about` | About page |
| `/tarifs` | Pricing |
| `/roi` | ROI calculator |
| `/faq` | FAQ (9 questions diagnostic-focused post-refonte 2026-04-20) |
| `/cas-clients` | Case studies |
| `/thank-you` | Post-form confirmation (noindex) |
| `/mentions-legales` | Legal notice |
| `/politique-confidentialite` | Privacy policy |
| `/cgv` | Terms of service |
| `/lp/automatisation-pme` | Ad landing page — automation (noindex) |
| `/lp/audit-gratuit` | Ad landing page — free audit (noindex) |

## Documentation

| Doc | Purpose |
|-----|---------|
| `docs/ARCHITECTURE.md` | Component tree, routes, hooks, server, build config, design tokens |
| `docs/INTEGRATIONS.md` | n8n, Calendly, GA4, Google Ads, Supabase, UTM, consent flow |
| `docs/SEO.md` | Meta-tags, structured data, sitemap, manual tasks |
| `docs/GOOGLE_ADS.md` | Ads IDs, conversion tracking, campaign strategy, keywords |
| `docs/SITE_CONTENT.md` | ⚠️ **ARCHIVED 2026-04-20** — homepage copy now in `docs/copy-v1.md`. Kept for historical reference. |
| `docs/OFFRES.md` | ⚠️ **ARCHIVED 2026-04-20** — product SKU now in `docs/product-v1.md`. Kept for historical reference. |
| `docs/product-v1.md` | **Frozen SKU v2** (Diagnostic Sablia 490€ HT, crédit intégral si signature Dév/Accomp. dans 90 j, 3 post-audit paths) — authoritative |
| `docs/wireframe-v1.md` | **Frozen homepage wireframe** (9 sections, 2 CTAs, DiagnosticForm spec) — authoritative |
| `docs/copy-v1.md` | **Frozen homepage copy** (hero, narrative arc, cards, FAQ, tone glossaire §C8) — authoritative |
| `docs/FAQ.md` | ⚠️ **ARCHIVED 2026-04-20** — 9 FAQs now in `copy-v1.md §C5-C6` + `FaqSection.tsx` + `Faq.tsx`. |
| `docs/ROADMAP.md` | Future initiatives, tech debt backlog |
| `docs/meta-tags.json` | SEO meta-tags per page |
| `docs/content-index.json` | Structured JSON of all pages/sections |
| `docs/README.md` | LLM guide to docs/ |

When modifying site content, update the corresponding doc (see `docs/README.md` for sync table).

## Database
- Drizzle ORM + PostgreSQL (Supabase)
- Schema: `db/schema.ts`
- Migrations: `npm run db:push`
- Table prefix: `site_`
- **Status**: Connected but no runtime queries — forms submit directly to n8n webhooks

## Testing
- Framework: Vitest + React Testing Library (already configured)
- Run: `npm test` (unit) | `npm run test:coverage`

## Environment Variables
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NODE_ENV` | Environment (development/production) |
| `VITE_GA4_MEASUREMENT_ID` | GA4 measurement ID |
| `VITE_GADS_CONVERSION_ID` | Google Ads conversion ID |
| `VITE_GADS_LABEL_CONTACT` | Ads label: contact form |
| `VITE_GADS_LABEL_GAP` | Ads label: GAP form |
| `VITE_GADS_LABEL_CALENDLY` | Ads label: Calendly booking |
| `VITE_CONTACT_WEBHOOK_URL` | Contact form webhook URL (optional, fallback hardcoded) |
| `VITE_GAP_WEBHOOK_URL` | GAP form webhook URL (optional, fallback hardcoded) |
