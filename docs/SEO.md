# SEO — Sablia Site (v2)

**Last updated**: 2026-11-12 (the site restructured around the monthly offer: `/responsable-ia-externalise`, `/conferences`, `/accompagnement` and the old offer address in 301, the organisation block, `llms.txt` and `ai.txt` rewritten, doors and bookings in the measure; earlier: the Tuesday letter pages, training lot 1, `/realisations`). Built on the 2026-10-26 v2 build (Next.js static export). The Vite-era `meta-tags.json`, `SEO.tsx` and `react-helmet-async` no longer exist.

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

On every `dist/public/**/*.html`: the audience tracker and consent banner absent from the static HTML, exactly one `h1`, canonical equal to the page's own URL, `noindex` exactly where `routes.mjs` says, every indexable route has its page and no unlisted page exists (`404.html`, `_not-found*` and `escalier-modeles.html` are exempt). Resource pages: title and description, `<main data-ready="true">`, no « Chargement », no `<iframe`; `/ressources` lists every published slug and the home video tiles match the slugs and `youtube_id`. Issue pages of the letter (`assertLettreHtml`, values compared with spaces squashed on both sides): one page per published issue and no other `/lettre/*` page (a leftover `__none` placeholder fails), title `<titre> · Sablia`, canonical, description = résumé, h1 = title, the résumé visible, `<main data-ready="true">`, exactly one `Article` block with `author.name` and `datePublished` equal to the row's `published_at`, no `<iframe` and no merge tag `{{{` in the page, no `<img` in the body block (`data-body="lettre"`), and that block not empty and carrying, in order, the words of the first `##` heading of `corps_md` (inline code, URLs, reference-link ids and every word holding a character reference are left out; no heading or nothing left: only the non-empty check), so a body that never rendered fails the build and a correct one never does; `/newsletter` links every published issue. Home: exactly one Organization JSON-LD, no « 30 jours », no « dashboards intelligents ». Then `scripts/qa/content-gates.sh --auto` greps the built HTML (banned figures and names, third-party hosts, em dash on proof surfaces, foreign e-mail, « [À CONFIRMER] » when `SABLIA_SLOT=prod`).

## Structured data

| Page | Types | Source |
|------|-------|--------|
| every page | ProfessionalService (founder Person, PostalAddress with locality Rouen and region Normandie, no street and no postal code, `areaServed` Normandie and France, the registered office on the legal pages only (`/mentions-legales`, `/cgv`); the footer says Rouen in visible text, as Google asks for marked-up content; description: what Sablia does today, the monthly offer « Responsable IA externalisé » first, then the training « L'IA au travail », the shorter formats and the conferences on request, no webinar (one dated session); `serviceType` led by « Responsable IA externalisé »; OfferCatalog of four: « Responsable IA externalisé », « L'IA au travail », « Conférences et séminaires », and OF-1, the only one priced, from `of1.ts`; no « Référent IA », no voice agent, no custom CRM). The alternate name is the site tagline (`site.tagline`); no text says « dans les CRM » or « × CRM », nor « référent » or « temps partagé » (`src/components/seo/seo.test.tsx` refuses them; copy deck B6 `org.*`) | `OrganizationJsonLd`, mounted in `layout.tsx` |
| `/offres/compte-rendu-appel` | Service (Offer with UnitPriceSpecification), FAQPage, BreadcrumbList | `of1-schema.ts` + `BreadcrumbJsonLd` |
| the four CRM pages | Service, FAQPage, BreadcrumbList | `CrmPageView.tsx`, `src/content/crm/schema.ts` |
| `/guides/integrer-l-ia-dans-votre-entreprise` | Article, FAQPage, BreadcrumbList | the page file |
| `/responsable-ia-externalise` | none at page level: its questions are visible text only (no FAQPage, whose results Google stopped on 2026-05-07), the organisation block is the layout's | — |
| `/conferences` | none at page level (no `Event`: talks are on request, not dated sessions) | — |
| `/ressources/<slug>` | BreadcrumbList, VideoObject (only when the poster is on disk: the thumbnail must be our own file, never `i.ytimg.com`) | `src/app/ressources/[slug]/page.tsx` |
| `/lettre/<slug>` | Article (author = the founder Person of the organisation block, publisher = its `@id`; `datePublished` = the send instant, the same value the page shows as its Paris date; `dateModified` = `updated_at` only when more than one hour after the send; `image` = the own-hosted poster when the issue has a video, else the default `/og-image.png`, as absolute URLs), BreadcrumbList (Newsletter, then the issue). No VideoObject: a post that embeds a video is not a watch page | `src/components/lettre/article-schema.ts`, `src/app/lettre/[slug]/page.tsx` |

`JsonLd` escapes `<`, U+2028 and U+2029 in the payload.

## Sitemap

Written to `dist/public/sitemap.xml` by `node scripts/seo/generate-sitemap.mjs` at build time: every indexable route of `routes.mjs` dated from the ledger, plus every published `/ressources/<slug>` and `/lettre/<slug>` (priority 0.6, monthly, dated from its row: `updated_at`, else `published_at`). `/ressources` is dated max(ledger, latest resource) and `/newsletter` max(ledger, latest issue), so a new issue moves the list page too; the `/newsletter` sources also include `src/components/lettre/content.ts` and `date.ts` (the strings and dates of its list). A Supabase read failure fails the build (for the issues: on a strict build only). `/realisations` is dated by `src/app/realisations/` + `src/components/realisations/`; the home by its ten band folders under `src/components/home/`, in page order (`top mensuel automatisations offre formations conferences videos derriere webinaire faq`), plus `HomePage.tsx` and `home-metadata.ts`: `scene` (now on the CRM offer page), `construit` (now under `/realisations`) and `apres` (gone on 12/11) no longer date the home. The offer page `/responsable-ia-externalise` (US-99, US-105) is dated by `src/app/responsable-ia-externalise/` + `src/components/temps-partage/`, `/conferences` (US-107) by `src/app/conferences/` + `src/components/conferences/` (the shell's `WebinarReminder` it mounts is not a source: shell changes date no page). The legal pages and `/thank-you` share `src/components/legal/` as a source, so a change of the thank-you text re-dates the three legal pages too. The table below is the indexable part of `PAGE_ROUTES`, generated from the file on 2026-11-12 (regenerate it when `routes.mjs` changes):

| Route | Priority | Change Freq |
|-------|----------|-------------|
| `/` | 1.0 | weekly |
| `/realisations` | 0.7 | monthly |
| `/formations` | 0.8 | monthly |
| `/conferences` | 0.8 | monthly |
| `/responsable-ia-externalise` | 0.9 | monthly |
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
| `/newsletter` | 0.6 | monthly |
| `/webinaire` | 0.7 | weekly |
| `/ressources/<slug>` (one per published resource) | 0.6 | monthly |
| `/lettre/<slug>` (one per published issue of the letter) | 0.6 | monthly |

Built but kept out of the sitemap: `/thank-you`, `/webinaire/merci`, `/webinaire/apres-reservation`, `/webinaire/questionnaire` (all noindex). `/roi`, `/about` and `/lettre` are 301 in `server/static.ts` (to `/offres/compte-rendu-appel`, `/#derriere` and `/newsletter`), and so are `/responsable-ia-temps-partage` and `/accompagnement` (to `/responsable-ia-externalise`, since 12/11): none is in the sitemap.

### `lastmod`

The date of a page is the day its own sources last changed, not the build day. `scripts/seo/lastmod.json` holds `{ "/path": { lastmod, hash } }`; `hash` is the sha256 of the `sources` listed in `routes.mjs` (a directory source = every non-test file under it). `npm run seo:stamp-check` fails when a page's hash drifted; `node scripts/seo/stamp-lastmod.mjs --write` stamps it. v2 rewrote every page, so the ledger was restamped on 2026-10-26 for the 15 rewritten routes: the first production deploy's IndexNow ping therefore covers every changed URL.

### IndexNow

`deploy/deploy.sh` runs `scripts/seo/indexnow.mjs` after each production switch: it submits the URLs whose `<lastmod>` differs from the previous release's sitemap (new URL or changed date), never a date window. `INDEXNOW_ENABLED` turns it off; the GitHub workflow is a manual fallback. Rejections (400/403) raise an alert, 422/429 only warn.

## Robots and AI-search files

- `public/robots.txt`: all user agents allowed, sitemap declared, explicit blocks for GPTBot (`Crawl-delay: 10`), OAI-SearchBot, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot and Google-Extended, all `Allow: /`.
- `public/llms.txt`: markdown summary for LLMs (copy deck B6 `llms.*`, B3 `llms.offre.*`): a first line saying what Sablia does today, then the monthly offer « Responsable IA externalisé » with its URL and no amount (its price is on its page) and the call report sold without a monthly contract, the training « L'IA au travail » with no price, the conferences and seminars on request with their three topics and URL, the free webinar, the réalisations, the trainer, the questions, the resources and the contact; no « Après la formation » nor « référent IA » any more. It is a proof surface for `content-gates.sh` (no em dash, no banned figure); `scripts/seo/head-hygiene.test.mjs` pins its first line, its URLs, the offer before the training, and no amount. `public/.well-known/ai.txt` points to it; its `description:` line says the same in one sentence. Both are served by the static server (`.well-known` is the one dotted folder opened).

## Reading the measurement: doors and bookings (US-110)

What the tier-1 events of `src/lib/events.ts` answer in Umami (`stats.sablia.io`; access and UTM links: hub `projects/sablia/analytics/umami/README.md`). No threshold, no dashboard, no cron: three reads, done by hand.

- **Which doors are taken**: the `click` events grouped by their property `dest` (Umami, Events page, « Properties » tab, which breaks a property down by value; the filter panel narrows to one value). Five values: `responsable-ia` (the monthly offer, `/responsable-ia-externalise`), `formations`, `conferences`, `realisations`, `webinaire`. A click carries `dest` on a link to one of these five pages wherever the link sits (menu, home, footer, any page; one trailing slash, a hash or a query does not change it); a link to any other page carries none. `offre` is NOT a door: it stays a ZONE, the home's training panel (`#offre`). To see where a door was taken, add `zone`: `hero` (the home's first screen: the four doors and its buttons), `mensuel`, `offre`, `conferences`, `videos` (home bands), `rappel` (the webinar reminder of `/formations` and `/conferences`), `bar`. The menu AND the footer both read `nav` (the footer's link list is a `<nav>` and `zoneOf` takes the nearest `nav` before `footer`): the measure cannot tell a menu click from a footer click, it counts them together.
- **Where a booking was made**: the `cta_book` events by page path and `zone`. Most booking buttons read « Réserver 30 min », so the label alone says nothing; on one page no two booking buttons share a (zone, label) pair (`src/lib/doors.test.tsx`). Zones today: `/` `hero`, `webinaire` (while the session is ahead), `fin`; `/responsable-ia-externalise` `top`, `conditions`, `fin`; `/formations` and `/conferences` `top`, `fin`; `/realisations` `besoin`, `fin`; the header button `nav` (from the 03/12 session start, and on `/offres/**`).
- **From a door to a booking**: an Umami funnel (Reports, Funnel) of two steps, « Viewed page » the door page's URL (e.g. `/responsable-ia-externalise`), then « Triggered event » `cta_book`, with a window in minutes between the steps (https://docs.umami.is/docs/funnel, read 2026-11-12).
- The campaign tag `utm_campaign=webinaire-2026-11-19` keeps its name although the session moved to 03/12: links already handed out carry it, and it is a label, not a date.

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
