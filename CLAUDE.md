# CLAUDE.md - Sablia Site (v2)

**AI integration agency site** — `sablia.io`. This tree is the v2 build (Sablier charte, Next.js static export); it lives on branch `autopilot/2026-10-26-sablia-io-v2` until the switch to `main`.

## Quick Reference
| Key | Value |
|-----|-------|
| Domain | sablia.io |
| Stack | Next.js 16.4.3 (App Router, `output: 'export'`) / React 19.3.1 / TypeScript 5.9.3 strict / Tailwind 4.3.3 (CSS-first, no preflight) / Express 4 serving the export + `api/*.ts` / Drizzle (unused at runtime) / Biome 2.4.13 / Vitest 4.0.4 |
| Charte | « Sablier »: sand and rose grounds, night `#161B29`, ink `#131620`, one signal gold `#D9A441` (`#835A0C` as text on light), Familjen Grotesk + Fragment Mono self-hosted. Full spec: `DESIGN.md` |
| Animations | CSS plus the hooks in `src/lib/hooks/` (see `DESIGN.md` § Motion); `motion` 14.6.0 is in `package.json` but nothing under `src/` imports it yet |
| Dev | `npm run dev` (`next dev`, port 3000 unless `-p`); pages only, there is no `/api/*` in dev (see Dev story) |
| Lint / format | `npm run lint` · `npm run lint:fix` (Biome) |
| Type-check | `npm run check` (`tsc`) |
| Test | `npx vitest run` (bare `npm test` is watch mode); SEO suite `npm run test:seo` |
| Build | `bash scripts/qa/build.sh` (flock + build env + CSS-parse guard around `npm run build`). Never a bare `next build`: see Build discipline |
| SEO | Before a PR that touches a page's content: `npm run seo:stamp-check`, then `node scripts/seo/stamp-lastmod.mjs --write` if it fails |

## Critical Rules
1. NEVER use `any` type, define proper interfaces.
2. The server listens on `127.0.0.1:$PORT` (default 5000; `HOST`/`PORT` env, `HOST` stays loopback in production: Caddy is the only way in).
3. **Routing is the Next App Router, exported statically** (`next.config.ts`: `output: 'export'`, `trailingSlash: false`, `images.unoptimized`). A page is `src/app/<route>/page.tsx`; the export emits `<route>.html` (never `<route>/index.html`), `ressources/<slug>.html` and `404.html`. `trailingSlash: false` keeps every URL, canonical and Umami `path` identical to the old site. Dynamic resource pages use `generateStaticParams` + `dynamicParams = false`: a slug unlisted at build time is a real 404 until the next build. Not React Router, not Wouter, no `react-helmet-async`: metadata goes through `pageMetadata({path,title,description,noindex?,image?})` from `@/lib/seo`.
4. Use `site_` prefix for all new DB tables (shared Supabase with n8n-intelligence).
5. **Our own Node process serves the export** (lot 0 chain, `deploy/`; Vercel is being retired). `server/app.ts` (`createApp`) serves `dist/public` through `server/static.ts` and mounts the two Fetch handlers of `api/*.ts` through `server/api-adapter.ts` (100 kB body cap, 404 for any other `/api/*`). `server/static.ts`: `/x` and `/x/` both resolve `x.html` (then `x/index.html`); Next's RSC payload `.txt` files are plain 200 `text/plain` files (a 404 there turns every client navigation into a full reload); **an unknown path is a real 404 carrying `404.html`** (the old SPA catch-all to `index.html` is gone); `/404*`, `/_not-found*` and `/ressources/__none*` are 404; `/roi` → `/offres/compte-rendu-appel` and `/about` → `/#derriere` are 301; only `_next/static/` is `immutable`, everything else revalidates. Anything needing a server goes in `api/*.ts` (Web-standard `export default { fetch(Request): Response }`, Node 22), never as an Express handler. The production bundle is ONE self-contained `dist/index.js` (`scripts/build-server.mjs`, no `node_modules` at runtime; keep the `process.env.NODE_ENV === 'development'` test INLINE in `server/index.ts`). `scripts/site-parity.py` (hub) proves the routes against `deploy/parity-baseline.json`, with `deploy/parity-allowed.txt` declaring what v2 changes on purpose.
6. **Prod push verification MANDATORY**: a merge to `main` is deployed by the pull timer on the VPS within ~2 minutes (`deploy/deploy.sh`: build, export check, smoke on a scratch port including « unknown path answers 404 », atomic switch, automatic revert). Verify with `curl -s https://sablia.io/healthz` (its `release` id starts with the merged sha7) and the Playwright MCP walk (`browser_navigate` then `browser_snapshot`), iterate if regressed (cap 3 attempts). One command undoes a bad release: `deploy.sh rollback prod` on the host. Protocol: `.claude/rules/browser-verification.md` (workspace-level).
7. **Build discipline**: Next 16 refuses two `next build` in one tree ("Another next build process is already running") and a type error left by one session fails every other build. So: never run `next build` or `npm run build` directly in a shared tree; use `bash scripts/qa/build.sh` (takes `flock .build.lock`, sources the public build env when readable, and FAILS when the log contains « Parsing CSS source code failed », which Turbopack only warns about). Verify a unit with `npx vitest run <paths>`, `npx tsc --noEmit -p tsconfig.json` and a dev server, not with a build. Never start Express on 5000 (prod slot), 5001 (preview slot) or 5099 (deploy smoke).
8. **CSS discipline** (details and the why in `DESIGN.md` § CSS discipline; enforced by `python3 -I scripts/qa/css-collisions.py`, 0 violations): `globals.css` imports Tailwind without preflight; every other stylesheet is ONE scope, opens with `@layer theme, base, components, utilities;` and then only `@layer components { .v2-<scope> { ... } }`; keyframes and `@font-face` sit beside the rule, keyframe names prefixed by the scope; element selectors only in `base.css`; fonts only through `var(--font-sans|mono)`; colours as hex literals.
9. **SSR content rule**: every section's server-rendered HTML carries its readable text (staged by CSS or JS, or `sr-only`), never an empty shell filled by an effect. The static HTML is what crawlers and `site-check.py` read.
10. **Public repository**: no secret, no banned-names list and no credential ever enters a commit (the banned-names list stays in the hub). Visitor text is French, code and comments English.

## Architecture

### Path Aliases
- `@/` → `src/`
- `@db` → `db/`
- `@docs` → `docs/`

### Project Structure
```
src/app/              # App Router: layout.tsx, globals.css, base.css, fonts.ts, one folder per route
  ├── formations/  accompagnement/  cgv/  mentions-legales/  politique-confidentialite/  thank-you/
  ├── offres/compte-rendu-appel/  (+ google-sheets/ excel-365/ [crm]/)
  ├── ressources/ (+ [slug]/)  guides/integrer-l-ia-dans-votre-entreprise/
  └── not-found.tsx  error.tsx
src/components/       # home/<section>/ (top scene automatisations construit formations derriere videos faq),
                      # formations/, accompagnement/, offre/, ressources/, legal/, shell/ (header, footer, Cta,
                      # Dune, FinBand, SandIllustration, BookingButton), consent/, measurement/, seo/
src/lib/              # seo.ts, analytics.ts, events.ts, consent.ts, contenu.ts, site.ts, booking.ts, format.ts, hooks/
src/content/          # of1.ts (OF-1 module), crm/*.json, proof.ts, legal/ (cgv-v1.ts, cgv-v2.ts), faq-carried.ts
public/               # static files copied as they are into the export (brand/, illus/, photos/, llms.txt, robots.txt…)
api/                  # Fetch handlers (contact, ressources-request), served by server/api-adapter.ts
server/               # Express production server: index.ts, app.ts, static.ts, api-adapter.ts, healthz.ts
scripts/              # build chain (fetch-posters, finalize-export, build-server), seo/, qa/, brand and og-image scripts
deploy/               # host chain: deploy.sh, systemd units, Caddy blocks, parity baseline (see deploy/*.md)
db/                   # Drizzle schema (connected but unused at runtime)
docs/                 # ARCHITECTURE.md, SEO.md, INTEGRATIONS.md, frozen v1 specs
specs/REGISTRY.md     # functional stories (US-*), PRD.md the narrative
```
`client/`, `vite.config.ts`, `tailwind.config.ts`, `theme.json`, `scripts/prerender.mjs` and `server/vite.ts` belong to the Vite site; they are read for reference until the cleanup unit (E5) deletes them. Vitest and `tsc` exclude `client/`.

### Dev story
- Pages: `npm run dev` (`next dev`). The dev server compiles per route; it has no `/api/*` (those handlers exist only in Express).
- Resource pages need Supabase: with the public build env sourced they render real slugs; without it set `SABLIA_FIXTURE_SLUGS=a,b` for fixtures.
- API alone: `NODE_ENV=development npx tsx server/index.ts` serves only `/healthz` and `/api/*` (`serveBuild` is off).
- API, forms, built HTML and the real 404: build (`bash scripts/qa/build.sh`), then serve the output with Express on a free port: `PORT=<free> HOST=127.0.0.1 node dist/index.js` (keep 5000, 5001 and 5099 free; they belong to the host chain).
- The build chain (`npm run build`, in order): `node scripts/fetch-posters.mjs` (video posters into `public/_posters/`) → `next build` (writes `out/`) → `node scripts/finalize-export.mjs` (`out/` → `dist/public`, removes the `__none` resource placeholder) → `node scripts/seo/export-guards.mjs` (one h1, own canonical, noindex exactly per `routes.mjs`, every indexable route has its page, no tracker or banner in the static HTML, resource pages complete) → `node scripts/seo/generate-sitemap.mjs` → `node scripts/build-server.mjs` (`dist/index.js`) → `bash scripts/qa/content-gates.sh --auto dist/public`. The environment is `export NEXT_TELEMETRY_DISABLED=1`; `deploy.sh` adds `PRERENDER_STRICT=1` and `SABLIA_SLOT`.
- Tests: `npx vitest run` (`{src,server,db,api}/**/*.test.{ts,tsx}`, happy-dom) · `npm run test:seo` · `bash deploy/deploy.test.sh` · `bash scripts/qa/css-collisions.test.sh`. Gates on a running site: `scripts/qa/` (`score.py`, `contrast.py`, `axe-check.py`, `motion-check.py`, `routes-check.py`, `origin-check.py`, `lh.sh`, `shots.py`), each documents its usage in its header.

### Key Integrations
| Integration | Details |
|-------------|---------|
| Calendly | Every « Réserver 30 min » is `<Cta/>` without `href`, i.e. `BookingButton` (`src/components/shell/BookingButton.tsx`), which opens `site.bookingUrl` through `openBookingUrl` (`src/lib/booking.ts`) and counts exactly one `cta_book`. URL centralized in `src/lib/site.ts` = `https://calendly.com/brice-gachadoat/30min` (Brice, since 2026-09-09). Never a hand-written booking link. |
| Supabase | `qlxoitzdxjqhljjoeqoq`: `contenu_ressources` read at build time (anon key), `sabcrm_leads` written by `api/contact.ts` (service role, server only) |
| Umami (self-hosted, VPS) | Cookieless audience measurement + consent-gated replays/heatmaps. Tracker `/m/a.js`, recorder `/m/r.js`, served from OUR origin (Caddy exposes a fixed allowlist under `/m/`). Dashboard `stats.sablia.io`. Website id per hostname in `src/lib/analytics.ts` (`sablia.io`, `preview.sablia.io`; any other host measures nothing). Hub: `projects/sablia/analytics/umami/README.md` |
| GA4 / Google Ads | ⚠️ Env vars may exist but there is **NO code implementation**. Account IDs in `docs/GOOGLE_ADS.md`. |

## Routes
The list below is `PAGE_ROUTES` of `scripts/seo/routes.mjs` (the single manifest read by the sitemap, the export guards and `stamp-lastmod`); the sitemap table is in `docs/SEO.md`.

| Route | Page |
|-------|------|
| `/` | Home: nine sections in `src/components/home/`, assembled by `HomePage.tsx` (top, scene, automatisations, construit, formations, derriere, videos, faq, then the shell `FinBand`) |
| `/formations` | Trainings page (configurator, formats, levels, tools, quotes, questions), « je » voice |
| `/accompagnement` | Support page (hero, situations, path in five steps `#parcours`, deliverables, examples, questions), « je » voice |
| `/offres/compte-rendu-appel` | OF-1 offer page, content module `src/content/of1.ts` (parity test against the hub OF-1 file) |
| `/offres/compte-rendu-appel/{hubspot,zoho,salesforce,pipedrive}` | CRM pages, content in `src/content/crm/<crm>.json` (`status` draft/published; a draft is not built, not in the sitemap; `crm.doorway.test.ts` forbids any 8-word run shared by two published pages) |
| `/offres/compte-rendu-appel/{google-sheets,excel-365}` | Spreadsheet pages (`src/content/crm/spreadsheets.ts`) |
| `/ressources` and `/ressources/<slug>` | Resource library, built from Supabase at build time (video poster fetched at build, video behind `VideoFacade`, no iframe before a click). Publishing, editing or unpublishing a resource needs a redeploy (`python3 scripts/site-redeploy.py --apply` from the hub, then `site-check.py --only /ressources/<slug>`) |
| `/guides/integrer-l-ia-dans-votre-entreprise` | Cornerstone guide (Article + FAQPage JSON-LD) |
| `/cgv`, `/mentions-legales`, `/politique-confidentialite` | Legal pages (`src/components/legal/`, text in `src/content/legal/`). The CGV page ships the v2 draft with visible « [À CONFIRMER] » marks; `content-gates.sh --auto` fails a prod build while one remains (switch `cgvV2` to `cgvV1` in `src/app/cgv/page.tsx` to restore the old text) |
| `/thank-you` | Post-booking confirmation (noindex, with a canonical) |
| `/roi`, `/about` | 301 in `server/static.ts` (old pages Google lists as soft 404s) |
| any other path | `404.html`, status 404 |

**Shell**: `SiteHeader` (the whole bar is the `<nav>`: logo, links Compte rendu d'appel · Formations · Accompagnement · Réalisations, from `nav-links.ts`, menu button on phones, booking CTA), `SiteFooter` (legal links, « Gérer mes choix » reopens the consent banner), `FinBand` (`<section id="fin">`, copy per page). API of the shell components, the hooks and the measurement zones: read the files, they are small and tested (`src/components/shell/shell.test.tsx`, `src/lib/hooks/*.test.tsx`).

**Brand**: two sources in `public/brand/`, `symbol.svg` (stroked S-hourglass) and `badge.svg` (night rounded square, gold S). Regenerate favicons, app icons, OG and Twitter images and lockups with `python3 scripts/brand-assets.py` then `node scripts/og-image.mjs`; guard `python3 scripts/brand-check.py` (also fails on any coral).

## Measurement and consent (lot 0, US-65 / US-66; unchanged by v2)
- **Tier 1, no consent needed** (cookieless, our origin): `click`, `cta_book`, `outbound`, `scroll_25/50/75/100` (`src/lib/events.ts`). Labels are our own button texts, outbound destinations are reduced to a short host list, query strings are dropped. Sections are named by their `section[id]` (top … fin, plus nav and footer). **Tier 2, only after « Tout accepter »**: `video_*`, `form_*` (field NAMES and error codes only, never a value) and the session recorder (replays + heatmaps, forms blocked entirely).
- **Consent** (`src/lib/consent.ts`, `src/components/consent/ConsentBanner.tsx`): `localStorage['sablia_consent'] = {v:1, replay, at}`, 6 months, silence = refusal, both buttons share one class string, Escape = stored refusal, footer link « Gérer mes choix » reopens the banner, withdrawing an acceptance reloads the page (the recorder has no stop). The banner is closed in the static HTML and opens in an effect.
- **The export must stay clean**: `MeasurementBoot` injects the tracker at runtime; `scripts/seo/export-guards.mjs` (through `prerender-guards.mjs`) fails the build if the static HTML carries the banner, `/m/a.js` or `/m/r.js`, or an `<iframe>` in a resource page.
- **Proof**: `UMAMI_CREDENTIALS=<json> node scripts/analytics-e2e.mjs --base https://preview.sablia.io [--netrc FILE] [--replay]` (real Chrome, reads back what Umami stored; 32 checks, +2 with a video, +3 with `--replay`); `deploy/caddy.test.sh` proves the `/m/` allowlist and the preview auth on a private Caddy.

## Documentation

| Doc | Purpose |
|-----|---------|
| `DESIGN.md` | The Sablier charte: tokens with hex, type scale, rules, sand drawings, motion |
| `docs/ARCHITECTURE.md` | Build chain, routes, component tree, hooks, server, hosting chain |
| `docs/INTEGRATIONS.md` | Calendly, contact form (`api/contact.ts` → Resend + Supabase), GA4, Google Ads (partly stale: written for the Vite site) |
| `docs/SEO.md` | Metadata, structured data, sitemap (generated from `routes.mjs`), robots, llms.txt |
| `docs/GOOGLE_ADS.md` | Ads account IDs, conversion labels, campaign strategy |
| `docs/product-v1.md`, `wireframe-v1.md`, `copy-v1.md` | Frozen v1 package (Diagnostic Sablia 490 € era), kept for history |
| `specs/REGISTRY.md` | Functional stories US-*, statuses |
| `PRD.md` | Narrative requirements, incl. the v2 section |
| `docs/README.md` | LLM guide to docs/ (not yet updated for v2) |

When modifying site content, update the corresponding doc.

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
- **`contenu_*` is an exception to the `site_` prefix rule**: the register lives in the HUB (Sablia workspace's "machine de contenu"), not in this project. `src/lib/contenu.ts` and `api/ressources-request.ts` read `contenu_ressources` (and the `contenu-ressources` storage bucket) — **read-only** for the site, anon key client-side, service-role key from the server (`api/ressources-request.ts`). This project never migrates or writes that table's schema.


## Testing
- Framework: Vitest + React Testing Library (happy-dom), config `vitest.config.ts`, setup `vitest.setup.ts`.
- Run: `npx vitest run` (all) or `npx vitest run <paths>`; coverage `npm run test:coverage`.
- Test-first for anything with a deterministic oracle: the test goes RED (non-zero exit) before the implementation and GREEN after.

## Environment Variables
| Variable | Description | Status |
|----------|-------------|--------|
| `DATABASE_URL` | PostgreSQL connection string | Active (server) |
| `NODE_ENV` | Environment (development/production) | Active |
| `HOST` / `PORT` | Where the server listens (default `127.0.0.1` / `5000`) | Active (set per slot: prod 5000, preview 5001) |
| `RELEASE_FILE` | File holding the release id reported by `/healthz` (default `<dist>/../RELEASE`) | Active |
| `PRERENDER_STRICT` | `1` = a build without the anon key or with a failing Supabase read fails instead of shipping without resource pages; set by `deploy.sh` and `scripts/qa/build.sh` callers | Build time |
| `SABLIA_SLOT` | `prod` or `preview`, exported by `deploy.sh` to the build: `content-gates.sh --auto` is strict (fails on any « [À CONFIRMER] ») only when it is `prod` | Build time |
| `SABLIA_FIXTURE_SLUGS` | Comma list of resource slugs: `src/lib/contenu.ts` serves fixtures instead of calling Supabase (offline tests and builds) | Test tooling |
| `UMAMI_CREDENTIALS` | JSON file with the Umami API key and website ids, for `scripts/analytics-e2e.mjs` | Test tooling |
| `VITE_GA4_MEASUREMENT_ID` | GA4 measurement ID | ⚠️ No code reads this |
| `VITE_GADS_CONVERSION_ID` | Google Ads conversion ID | ⚠️ No code reads this |
| `VITE_GADS_LABEL_CONTACT` | Ads label: contact form | ⚠️ No code reads this |
| `RESEND_API_KEY` | Resend key used by `api/contact.ts` to mail brice@sablia.io | **Server-side only** — `/etc/sablia-site/{prod,preview}.env` (600, read by systemd only; written by `deploy/install-env.sh`). Never in `.env`, never in the bundle, never in git |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key used by `api/contact.ts` to insert into `sabcrm_leads` | **Server-side only** — same files. RLS on `sabcrm_leads` has zero policies, so this key is the only write path, by design |
| `VITE_SUPABASE_ANON_KEY` | Anon key to read `contenu_ressources` (`published=true` only, by RLS). The name is kept so `/etc/sablia-site/build.env` needs no change: `next.config.ts` copies it into `NEXT_PUBLIC_SUPABASE_ANON_KEY`, which `src/lib/contenu.ts` reads | **Build time, public by design** (the key is in the build output). Missing key on a strict build → the build FAILS |
