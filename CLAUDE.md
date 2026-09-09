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
5. **Prod push verification MANDATORY** — every push to `main` auto-deploys to `https://sablia.io`. After push: wait propagation (new `x-vercel-id` hash via `curl -sI`), verify via Playwright MCP (`browser_navigate` → `browser_snapshot`; screenshot only if visual-specific), iterate if regressed (cap 3 attempts). Full protocol: `.claude/rules/browser-verification.md` (workspace-level).

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

**Shared TopNav**: `NAV_ITEMS` opens with **Offres** -> `/offres/compte-rendu-appel` (a real route, rendered with wouter `Link`; the other entries are in-page anchors and stay `<a>`). It is the default nav, so the entry also shows on ThankYou and the legal pages via `LegalShell`. A page can override `items` (the OF-1 page does). `TopNav.test.tsx` pins both: the default keeps every Landing anchor plus Offres, and an overriding page gets none of them.

**Homepage sections** (anchors, not routes — `client/src/pages/Landing.tsx`, refonte CRM 2026-06): Hero → CRMStrip → `#problemes` (ProblemsSection) → UseCases → `#process` (ProcessSection) → `#equipe` (TeamSection, 4 portraits `/team/*.webp`) → `#proof` (ProofSection, Valentin/VB Mobilier réel + 3 placeholders) → CalloutSection → `#faq` (FaqSection, accordéon 5 Q + FAQPage JSON-LD). ⚠️ FAQ Q5 (sécurité données) = formulation tier-safe « API commerciale » — à confirmer avec Brice si offre = Anthropic Enterprise. **Prix et délais de la home viennent du module OF-1** (`client/src/content/of1.ts`, formatés par `client/src/lib/format.ts`) : FaqSection, ProcessSection, CalloutSection et la page Guide ne portent aucun chiffre en dur ; `client/src/components/landing/landing.copy.test.ts` rougit si une formule de l'ancien discours (fourchette de prix, « sous 30 jours », implémentation en semaines, devis après audit) revient dans ces sources (2026-09-09).

## Documentation

| Doc | Purpose |
|-----|---------|
| `docs/design-system/DESIGN.md` | Design system — colors, typography, components, spacing |
| `docs/ARCHITECTURE.md` | Component tree, routes, hooks, server, build config |
| `docs/INTEGRATIONS.md` | Calendly, GA4, Google Ads, Supabase |
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
