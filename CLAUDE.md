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

**Shared TopNav**: **5 items since 2026-09-18 (D10)** — Offres · Méthode · Cas clients · Formations · Contact, plus the booking button. Problèmes, Fondateur and FAQ stay on the page and left the menu. **Offres** -> `/offres/compte-rendu-appel` is a real route, rendered with wouter `Link`; every other entry is a **root-relative** hash (`/#process`, `/#proof`, `/#formations`, `/#contact`) rendered as a plain `<a>` — `NavItem` branches on `href.startsWith('/') && !href.includes('#')`, because wouter's `navigate()` does not scroll to a hash and a bare `#contact` was inert on ThankYou and the legal pages (this nav is their default too, via `LegalShell`). A page can override `items` (the OF-1 page does). `TopNav.test.tsx` pins the exact five in order in BOTH menus, the plain-`<a>` behaviour of a hash item (a wouter Link would `preventDefault`), and that an overriding page gets none of them.

**Homepage sections** (anchors, not routes — `client/src/pages/Landing.tsx`, aligned on the 2026-09-09 audit): Hero (H1 = `of1.title`, `FlowDiagram` instead of the old mock dashboard) → CRMStrip → `#catalogue` (CatalogueSection: OF-1 card with price, OF-2 « en préparation », hors-catalogue brick rule) → `#problemes` (ProblemsSection) → `#process` (ProcessSection) → `#equipe` (TeamSection, « **Notre fondateur** » — voice « nous » on the whole home since 2026-09-18 / D10, so the visitor never reads the team's size; one person on the page stays Brice's 2026-09-09 decision, and the Denis quote MOVED from here to `#formations`) → `#proof` (ProofSection: **2 sector-only case cards, no client named and no quote at all** since 2026-09-17/NS-15 — consent to be named was never traced, so a name goes back up only once its owner has validated its sentence in writing; figures are frozen queries re-measured the same day, 289/326 and 68, replacing the 287/82 % and 44 that no query reproduced; nav label is « Cas clients », not « Témoignages ») → **`#formations`** (FormationsSection, new 2026-09-18/D10: accroche A4, the A5 proof « académie de plus de 1 400 entrepreneurs », the Denis quote, **no price**, and the `#contact` form in the right column; the forbidden-word guard covers the whole page) → CalloutSection (+ second path: guide and `app.sablia.io/questionnaire`) → `#faq` (FaqSection, accordéon 5 Q + FAQPage JSON-LD). The « Portail » link left the public nav on 2026-09-09. `client/public/llms.txt` is guarded by `landing.copy.test.ts` like the TSX sources. Vercel Web Analytics is injected in `main.tsx` (`book_call` event in `BookingModal.tsx`); it needs the toggle ON in the Vercel project. ⚠️ FAQ Q5 (sécurité données) = formulation tier-safe « API commerciale » — à confirmer avec Brice si offre = Anthropic Enterprise. **Prix et délais de la home viennent du module OF-1** (`client/src/content/of1.ts`, formatés par `client/src/lib/format.ts`) : FaqSection, ProcessSection, CalloutSection et la page Guide ne portent aucun chiffre en dur ; `client/src/components/landing/landing.copy.test.ts` rougit si une formule de l'ancien discours (fourchette de prix, « sous 30 jours », implémentation en semaines, devis après audit) revient dans ces sources (2026-09-09).

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
