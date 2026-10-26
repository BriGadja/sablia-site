# SEO — Sablia Site (v2)

**Last updated**: 2026-10-26 (v2 build: Next.js static export). The Vite-era `meta-tags.json`, `SEO.tsx` and `react-helmet-async` no longer exist.

---

## Where each thing is decided

| What | Source of truth |
|------|-----------------|
| List of pages, indexable or not, priority, change frequency | `scripts/seo/routes.mjs` (`PAGE_ROUTES`): read by the sitemap generator, the export guards and `stamp-lastmod` |
| `<title>`, description, canonical, OG, Twitter, robots of a page | the page's own `metadata` / `generateMetadata`, built by `pageMetadata()` in `src/lib/seo.ts` |
| JSON-LD | `src/components/seo/` (`JsonLd`, `OrganizationJsonLd`, `BreadcrumbJsonLd`, `VideoObjectJsonLd`) and the content modules `src/content/of1-schema.ts`, `src/content/crm/schema.ts` |
| Sitemap dates | `scripts/seo/lastmod.json` (ledger written by `stamp-lastmod.mjs`) |
| Crawler files | `public/robots.txt`, `public/llms.txt`, `public/.well-known/ai.txt`, the IndexNow key file `public/*.txt` |

## Metadata

`pageMetadata({ path, title, description, noindex?, image?, twitterImage? })` returns the whole `Metadata` object:
- `metadataBase` is always `https://sablia.io`, so a preview slot never writes its own host into a canonical or an OG URL;
- the title is absolute (no site suffix appended); the canonical is the path without trailing slash (the home is the bare origin);
- it throws on a trailing slash or an empty title or description;
- it is never used in `src/app/layout.tsx`: anything set there would be inherited by `404.html`, which must carry no canonical.

`/thank-you` is `noindex` and still has a canonical. A resource page of an unknown slug does not exist (`dynamicParams = false`): it is a real 404.

## What the build refuses (`scripts/seo/export-guards.mjs`, run by `npm run build`)

On every `dist/public/**/*.html`: the audience tracker and consent banner absent from the static HTML, exactly one `h1`, canonical equal to the page's own URL, `noindex` exactly where `routes.mjs` says, every indexable route has its page and no unlisted page exists (`404.html`, `_not-found*` and `escalier-modeles.html` are exempt). Resource pages: title and description, `<main data-ready="true">`, no « Chargement », no `<iframe`; `/ressources` lists every published slug and the home video tiles match the slugs and `youtube_id`. Home: exactly one Organization JSON-LD, no « 30 jours », no « dashboards intelligents ». Then `scripts/qa/content-gates.sh --auto` greps the built HTML (banned figures and names, third-party hosts, em dash on proof surfaces, foreign e-mail, « [À CONFIRMER] » when `SABLIA_SLOT=prod`).

## Structured data

| Page | Types | Source |
|------|-------|--------|
| every page | ProfessionalService (founder Person, PostalAddress, OfferCatalog with the OF-1 price and delay read from `of1.ts`; voice agent and custom CRM « sur demande », no price) | `OrganizationJsonLd`, mounted in `layout.tsx` |
| `/offres/compte-rendu-appel` | Service (Offer with UnitPriceSpecification), FAQPage, BreadcrumbList | `of1-schema.ts` + `BreadcrumbJsonLd` |
| the four CRM pages | Service, FAQPage, BreadcrumbList | `CrmPageView.tsx`, `src/content/crm/schema.ts` |
| `/guides/integrer-l-ia-dans-votre-entreprise` | Article, FAQPage, BreadcrumbList | the page file |
| `/ressources/<slug>` | BreadcrumbList, VideoObject (only when the poster is on disk: the thumbnail must be our own file, never `i.ytimg.com`) | `src/app/ressources/[slug]/page.tsx` |

`JsonLd` escapes `<`, U+2028 and U+2029 in the payload.

## Sitemap

Written to `dist/public/sitemap.xml` by `node scripts/seo/generate-sitemap.mjs` at build time: every indexable route of `routes.mjs` dated from the ledger, plus every published `/ressources/<slug>` (priority 0.6, monthly, dated from its row). A Supabase read failure fails the build. The table below is the indexable part of `PAGE_ROUTES`, generated from the file on 2026-10-26 (regenerate it when `routes.mjs` changes):

| Route | Priority | Change Freq |
|-------|----------|-------------|
| `/` | 1.0 | weekly |
| `/formations` | 0.8 | monthly |
| `/accompagnement` | 0.8 | monthly |
| `/mentions-legales` | 0.3 | yearly |
| `/politique-confidentialite` | 0.3 | yearly |
| `/cgv` | 0.3 | yearly |
| `/guides/integrer-l-ia-dans-votre-entreprise` | 0.7 | monthly |
| `/offres/compte-rendu-appel` | 0.9 | monthly |
| `/offres/compte-rendu-appel/hubspot` | 0.8 | monthly |
| `/offres/compte-rendu-appel/zoho` | 0.8 | monthly |
| `/offres/compte-rendu-appel/salesforce` | 0.8 | monthly |
| `/offres/compte-rendu-appel/pipedrive` | 0.8 | monthly |
| `/offres/compte-rendu-appel/google-sheets` | 0.8 | monthly |
| `/offres/compte-rendu-appel/excel-365` | 0.8 | monthly |
| `/ressources` | 0.8 | weekly |
| `/ressources/<slug>` (one per published resource) | 0.6 | monthly |

Built but kept out of the sitemap: `/thank-you` (noindex). `/roi` and `/about` are 301 in `server/static.ts` (to `/offres/compte-rendu-appel` and `/#derriere`).

### `lastmod`

The date of a page is the day its own sources last changed, not the build day. `scripts/seo/lastmod.json` holds `{ "/path": { lastmod, hash } }`; `hash` is the sha256 of the `sources` listed in `routes.mjs` (a directory source = every non-test file under it). `npm run seo:stamp-check` fails when a page's hash drifted; `node scripts/seo/stamp-lastmod.mjs --write` stamps it. v2 rewrote every page, so the ledger was restamped on 2026-10-26 for the 15 rewritten routes: the first production deploy's IndexNow ping therefore covers every changed URL.

### IndexNow

`deploy/deploy.sh` runs `scripts/seo/indexnow.mjs` after each production switch: it submits the URLs whose `<lastmod>` differs from the previous release's sitemap (new URL or changed date), never a date window. `INDEXNOW_ENABLED` turns it off; the GitHub workflow is a manual fallback. Rejections (400/403) raise an alert, 422/429 only warn.

## Robots and AI-search files

- `public/robots.txt`: all user agents allowed, sitemap declared, explicit blocks for GPTBot (`Crawl-delay: 10`), OAI-SearchBot, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot and Google-Extended, all `Allow: /`.
- `public/llms.txt`: markdown summary for LLMs (offer, CRM and spreadsheet pages, pages list); it is a proof surface for `content-gates.sh` (no em dash, no banned figure). `public/.well-known/ai.txt` points to it. Both are served by the static server (`.well-known` is the one dotted folder opened).

## Manual tasks

Done (from the Vite era, still true): GA4 and Google Ads infrastructure exists but has no code in the site; Google Search Console domain property `sc-domain:sablia.io` verified, sitemap submitted; Bing Webmaster Tools imported from GSC (this is also ChatGPT Search's path); `www.sablia.io` redirects 308 to the apex.

Open: social sharing validation (Facebook Debugger, Twitter Card Validator, Rich Results Test) once the v2 head is on production; backlink strategy.

### Rank tracking keywords

None defined for v2 yet (the Vite-era list targeted pages that no longer exist). To be set with Brice.

---

## Related Docs

- [INTEGRATIONS.md](./INTEGRATIONS.md): GA4 and Google Ads details (written for the Vite site)
- [GOOGLE_ADS.md](./GOOGLE_ADS.md): conversion IDs, campaign strategy
- [ARCHITECTURE.md](./ARCHITECTURE.md): build chain and server
