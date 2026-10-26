# Architecture — Sablia Site (v2)

**Last updated**: 2026-10-26 (v2 build). **Stack**: Next.js 16.4.3 static export / React 19.3.1 / TypeScript 5.9.3 / Tailwind 4.3.3 / Express 4 / Vitest 4.0.4 / Biome 2.4.13 (versions: `package.json`).

The Vite + Wouter + Helmet site this file used to describe is replaced and its tree (`client/`, `vite.config.ts`, `tailwind.config.ts`, `theme.json`, `scripts/prerender.mjs`, `server/vite.ts`) was deleted on 2026-10-26; git history keeps it.

---

## Entry Flow

`src/app/layout.tsx` is the only root layout. It renders, in `<body>`: the skip link (`#contenu`), `SiteHeader`, the page, `SiteFooter`, `MeasurementBoot`, `ConsentBanner`, `OrganizationJsonLd`. `<html lang="fr">` carries the two next/font variables. There is no client router component: navigation is Next's `Link` over the exported RSC payloads, which is why `server/static.ts` serves the payload `.txt` files.

Metadata is per page (`pageMetadata()` in `src/lib/seo.ts`), never in the layout.

---

## Route Map

Routes are the folders of `src/app/`; the manifest used by the sitemap and the export guards is `scripts/seo/routes.mjs`.

| Route | File | Notes |
|-------|------|-------|
| `/` | `src/app/page.tsx` → `HomePage` | nine sections, see below |
| `/formations` | `src/app/formations/page.tsx` | |
| `/accompagnement` | `src/app/accompagnement/page.tsx` | |
| `/offres/compte-rendu-appel` | `src/app/offres/compte-rendu-appel/page.tsx` | OF-1 offer |
| `/offres/compte-rendu-appel/<crm>` | `.../[crm]/page.tsx` | hubspot, zoho, salesforce, pipedrive from `src/content/crm/*.json`; a draft is not built |
| `/offres/compte-rendu-appel/google-sheets`, `/excel-365` | own folders | |
| `/ressources` | `src/app/ressources/page.tsx` | built from Supabase |
| `/ressources/<slug>` | `src/app/ressources/[slug]/page.tsx` | `generateStaticParams` + `dynamicParams = false`, one page per published row |
| `/guides/integrer-l-ia-dans-votre-entreprise` | `src/app/guides/...` | |
| `/cgv`, `/mentions-legales`, `/politique-confidentialite` | own folders | `src/components/legal/` |
| `/thank-you` | `src/app/thank-you/page.tsx` | noindex |
| unknown path | `src/app/not-found.tsx` → `404.html` | status 404 from `server/static.ts` |

`/roi` and `/about` are 301 redirects in `server/static.ts`, not pages. `src/app/error.tsx` is the error boundary.

---

## Component Tree

### Shell (`src/components/shell/`, server components unless noted)
`SiteHeader` (the whole bar is the `<nav>`; `NavToggle` is a client component; links in `nav-links.ts`), `SiteFooter` (+ `ConsentLink`, client), `Cta` (dark or light, md or lg; without `href` it is a `BookingButton`), `BookingButton` (client; the only way to book), `Eyebrow`, `Dune`, `SandIllustration` + `IllHead`, `FinBand` (`<section id="fin">`), `Logo`. One CSS file per component, one `.v2-<scope>` each.

### Home (`src/components/home/`)
`HomePage.tsx` mounts, in `<main id="contenu">`: `top` (hero), `scene` (the sticky scene panel), `automatisations` (five scenes), `construit` (the wall of cards, `cards/`), `formations`, `derriere`, `videos` (async server component reading Supabase), `faq`, then `FinBand`. Each folder holds `index.tsx`, `<section>.css`, `content.ts` and its test; the section root is `<section id="<id>" className="v2-<id>">`.

### Inner pages
`src/components/formations/` (configurator, niveaux, outils, formats, deroule, avis, questions), `src/components/accompagnement/` (hero, situations, parcours, pourquoi, livrables, exemples, questions), `src/components/offre/` (hero, pricing, variants, included/excluded, objections, FAQ, CRM page view, flow diagram), `src/components/ressources/` (card, form, data, poster), `src/components/legal/` (legal pages, CGV view, thanks, not-found and error views).

### Cross-cutting
`VideoFacade` (click-to-play, thumbnail only, no iframe before the click, `youtube-nocookie` after), `consent/ConsentBanner`, `measurement/MeasurementBoot`, `seo/*` JSON-LD components.

---

## Hooks (`src/lib/hooks/`, all `'use client'`, SSR-safe, each with a test)

| Hook | Purpose |
|------|---------|
| `useReducedMotion()` | `prefers-reduced-motion` through `useSyncExternalStore`; false on the server; listens to `change` |
| `useInView(ref, {threshold, once, rootMargin})` | IntersectionObserver; true when unsupported |
| `usePausable({hover})` | `{paused, userPaused, toggle, bind, buttonProps}`; paused by button, hover, focus or hidden document |
| `useTimelineLoop(script, {active, loop, final})` | async script with `wait(ms)` (timers cancel by internal throw); reduced motion calls `final()` once instead |
| `useScrollProgress({target, reference, enabled})` | 0 to 1 scroll progress, rAF-throttled; 0 when reduced or disabled |
| `useCountUp(target, {active, duration})` | counter that returns the final figure before activation (SSR text is final) |
| `useMeasure(ref, fn)` | measure on mount, resize and ResizeObserver; `ref` must be stable |

## Lib (`src/lib/`)

| File | Purpose |
|------|---------|
| `seo.ts` | `pageMetadata()`, `SITE_ORIGIN` |
| `analytics.ts` | Umami loader, website id per hostname, consent-gated recorder |
| `events.ts` | tier-1 and tier-2 event capture (delegated listeners, zones from `section[id]`) |
| `consent.ts` | `sablia_consent` storage, 6 months, silence = refusal |
| `booking.ts`, `site.ts` | `openBookingUrl`, canonical constants (booking URL, contact address) |
| `contenu.ts` | Supabase reads of `contenu_ressources`; `SABLIA_FIXTURE_SLUGS` fixtures |
| `format.ts`, `utils.ts` | price and delay formatting, `cn()` |

Content modules: `src/content/of1.ts` (OF-1 offer, parity-tested against the hub file), `proof.ts`, `crm/`, `legal/`, `faq-carried.ts`, `of1-schema.ts`.

---

## Server

The site is served by **our own Node process behind Caddy** (lot 0 chain; Vercel is being retired).

- `server/app.ts`: `createApp()`: security headers (HSTS 2 years, nosniff, referrer policy), `/healthz` (public: `{ok, release}`) and `/healthz/full` (loopback only: which API secrets are present, booleans), the API adapter, the static server, a JSON 500 handler that never re-throws. `serveBuild` is false when `NODE_ENV=development`: only `/healthz` and `/api` then answer.
- `server/static.ts`: serves `dist/public`. A page is `<route>.html` (or `<route>/index.html`), 200 at `/x` and `/x/`. Unknown path: real 404 with `404.html`. `/404*`, `/_not-found*`, `/ressources/__none*` are 404. `/roi` and `/about` are 301. RSC `.txt` payloads are plain files. Only `_next/static/` is immutable; everything else is `public, max-age=0, must-revalidate`. `.well-known` is served, other dotfiles never. Non-GET/HEAD answers 405. Behaviour proven route by route by `scripts/site-parity.py` (hub) against `deploy/parity-baseline.json`, allowed changes in `deploy/parity-allowed.txt`.
- `server/api-adapter.ts`: `api/contact.ts` and `api/ressources-request.ts` stay Web-standard Fetch handlers; the adapter builds a `Request`, caps the body at 100 kB (413), writes status, headers and body back, answers any other `/api/*` with 404.
- `server/index.ts`: `HOST` (default `127.0.0.1`) and `PORT` (default 5000), graceful `SIGTERM`.
- Production bundle: `scripts/build-server.mjs` makes ONE `dist/index.js` (no `node_modules` at runtime). A release directory holds `bin/start`, `RELEASE` and `dist/` (`dist/index.js` + `dist/public`).

## Build chain

`npm run build` runs, in order and stopping at the first failure:

| Step | What it does |
|------|--------------|
| `scripts/fetch-posters.mjs` | downloads the posters of published resources into `public/_posters/<youtube_id>.webp` (failure logs and exits 0; `posterPath` then falls back to `public/video-thumbs/<id>.webp`, then to a generic drawn poster) |
| `next build` | static export into `out/` (config in `next.config.ts`) |
| `scripts/finalize-export.mjs` | moves `out/` to `dist/public`, removes the `ressources/__none` placeholder (`generateStaticParams` needs one entry) |
| `scripts/seo/export-guards.mjs` | structural checks on the exported HTML (see `docs/SEO.md`) |
| `scripts/seo/generate-sitemap.mjs` | writes `dist/public/sitemap.xml` |
| `scripts/build-server.mjs` | bundles `dist/index.js` |
| `scripts/qa/content-gates.sh --auto dist/public` | content rules; strict (CGV markers) only when `SABLIA_SLOT=prod` |

`bash scripts/qa/build.sh` wraps it with `flock .build.lock` (Next 16 refuses two builds in one tree), the public build env, and a failure when Turbopack only warns « Parsing CSS source code failed ». `next.config.ts` copies `VITE_SUPABASE_ANON_KEY` into `NEXT_PUBLIC_SUPABASE_ANON_KEY` so the host's `build.env` is unchanged.

## Hosting chain

`deploy/deploy.sh` (systemd timer on the VPS): ref moved → `npm ci --ignore-scripts` → build with `PRERENDER_STRICT=1` and `SABLIA_SLOT=<slot>` → export checked → candidate smoke-tested on a scratch port (including « an unknown path answers 404 ») → atomic symlink switch → health check, automatic revert → last releases kept. Two slots: `prod` (port 5000) and `preview` (5001, `preview.sablia.io`, basic auth, noindex). Caddy blocks: `deploy/Caddyfile.sablia-site`. Measurement: self-hosted Umami, tracker under `/m/`. Tests: `bash deploy/deploy.test.sh`. Details: `deploy/*.md` and the hub card `knowledge/infra/sablia-site-vps.md`.

## CSS and tokens

Tokens live in `src/app/globals.css` (`@theme`), global element rules and shared scroll effects in `src/app/base.css`, everything else in one scoped file per component or section. Rules and the colour and type tables: `DESIGN.md`. Enforcer: `python3 -I scripts/qa/css-collisions.py`.

## Quality gates (`scripts/qa/`)

`css-collisions.py`, `content-gates.sh` (+ `.bench.sh`), `score.py` (fixed defects metric), `contrast.py`, `axe-check.py`, `motion-check.py` (loops need a pause, reduced motion shows final states), `routes-check.py` (recorded URL behaviours), `origin-check.py` (no third-party request before consent), `lh.sh` + `lh-baseline.json` (Lighthouse), `shots.py` (screenshots against a base URL). Usage is in each file's header.

---

## Related Docs

- [INTEGRATIONS.md](./INTEGRATIONS.md): external services and webhooks (written for the Vite site, partly stale)
- [SEO.md](./SEO.md): metadata, structured data, sitemap
