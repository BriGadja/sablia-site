# Sablia site

Source of https://sablia.io: the marketing site of Sablia (Claude integration into sales teams' CRM, trainings and support). This tree is the **v2 build**: a Next.js static export in the « Sablier » charte, served by a small Express server on our own VPS.

| | |
|---|---|
| Framework | Next.js 16.4.3 (App Router, `output: 'export'`), React 19.3.1, TypeScript 5.9.3 (strict) |
| Styling | Tailwind CSS 4.3.3 (CSS-first, no preflight) + one scoped stylesheet per component |
| Server | Express 4 serving the export and two Fetch handlers in `api/` (contact form, resource request) |
| Quality | Biome 2.4.13, Vitest 4.0.4, scripts in `scripts/qa/` and `scripts/seo/` |
| Content language | French for visitors; code, comments and docs in English |

Exact versions are in `package.json`.

## Run it

Requirements: Node 22 and npm.

```bash
npm install --ignore-scripts      # or npm ci --ignore-scripts
cp .env.example .env              # only what you need; never commit it
npm run dev                       # next dev: pages only, no /api/*
```

Resource pages read Supabase at build time. Without the public anon key, set `SABLIA_FIXTURE_SLUGS=a,b` to render fixtures.

## Check it

```bash
npx vitest run                    # unit and component tests
npm run check                     # tsc
npm run lint                      # Biome
npm run test:seo                  # SEO and export-guard tests
python3 -I scripts/qa/css-collisions.py   # CSS discipline, must report 0 violations
```

## Build it

```bash
bash scripts/qa/build.sh          # the one way to run a full build
```

It takes a lock (Next 16 refuses two builds in one tree), then runs `npm run build`: poster fetch, `next build`, export finalisation, export guards, sitemap, server bundle, content gates. The result is `dist/public` (the site) and `dist/index.js` (the server). Serve it locally on a free port with `PORT=<port> node dist/index.js`. Ports 5000, 5001 and 5099 belong to the host's deploy chain.

## Deploy

Merging to `main` is enough: a timer on the VPS runs `deploy/deploy.sh` (build, checks, smoke test including a real 404, atomic switch, automatic revert). `curl -s https://sablia.io/healthz` returns the release id; `deploy.sh rollback prod` on the host undoes a release. Details: `deploy/*.md`, `docs/ARCHITECTURE.md`.

## Layout

```
src/app/         routes (one folder per page), layout, global CSS, fonts
src/components/  home sections, inner pages, shell (header, footer, buttons), consent, SEO
src/lib/         seo, measurement, consent, booking, Supabase reads, motion hooks
src/content/     offer module, CRM pages, legal text, proof
public/          static files copied into the export
api/  server/    Fetch handlers and the Express server
scripts/         build chain, SEO, QA gates, brand assets
deploy/          host chain (systemd, Caddy, parity baseline)
docs/  specs/    architecture, SEO, stories (REGISTRY.md)
```

`client/` and the other Vite-era files remain only until the cleanup step removes them.

## Documentation

- `CLAUDE.md`: rules and conventions for working in this repository (also the best human onboarding)
- `DESIGN.md`: the charte (colours, type, motion, illustration rule)
- `docs/ARCHITECTURE.md`, `docs/SEO.md`, `PRD.md`, `specs/REGISTRY.md`

## Licence

MIT
