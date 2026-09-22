# Integrations — Sablia Site

**Last updated**: 2026-09-22

---

## Service Overview

| Service | Method | Files | Env Var | Status |
|---------|--------|-------|---------|--------|
| Calendly | Popup window (window.open) | `BookingModal.tsx` (used by HeroSection, TopNav, CalloutSection) | Hardcoded URL | Working |
| Supabase | Drizzle ORM + PostgreSQL | `db/schema.ts`, `db/index.ts` | `DATABASE_URL` | Connected but unused at runtime |
| GA4 | — | — | `VITE_GA4_MEASUREMENT_ID` | ⚠️ Env var only, no code |
| Google Ads | — | — | `VITE_GADS_CONVERSION_ID`, `VITE_GADS_LABEL_CONTACT` | ⚠️ Env vars only, no code |
| Resend | REST `POST /emails` from the Vercel Function | `api/contact.ts` | `RESEND_API_KEY` | **Live since 2026-09-18** — runtime |
| Supabase (PostgREST) | REST insert with the service role, from the Vercel Function | `api/contact.ts` | `SUPABASE_SERVICE_ROLE_KEY` | **Live since 2026-09-18** — runtime, `sabcrm_leads` |
| Supabase (PostgREST, anon) | REST read, RLS `published=true` only, from the client bundle | `client/src/lib/contenu.ts` | `VITE_SUPABASE_ANON_KEY` | **Live since 2026-09-22** — runtime, `contenu_ressources` |
| Resend + Supabase (PostgREST, service role) | REST read + insert + mail from the Vercel Function | `api/ressources-request.ts` | `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | **Live since 2026-09-22** — runtime, `contenu_ressources` read, `sabcrm_leads` insert |

Lead capture has **three** paths since 2026-09-22: a Calendly booking, the contact form at `sablia.io/#contact`, and the resource-request form at `sablia.io/ressources/{slug}` (see below). There is still **no n8n webhook** wired in the site — every form talks to Resend and Supabase directly from its own Vercel Function.

---

## Calendly

- **URL**: `https://calendly.com/brice-gachadoat/30min` (Brice, depuis le 2026-09-09 ; Raph du 2026-06 au 2026-09-09 — centralisée dans `client/src/lib/site.ts` = `site.bookingUrl`)
- **Implementation**: `client/src/components/landing/BookingModal.tsx` — exports `openBooking()` which opens `site.bookingUrl` in a centered popup window (600×700) via `window.open()`. No `react-calendly` dependency.
- **Surfaces**: All "book a call" CTAs call `openBooking()`:
  - `HeroSection.tsx` — primary hero CTA
  - `TopNav.tsx` — nav button
  - `CalloutSection.tsx` — mid/bottom CTA
- **Post-booking**: Calendly's own confirmation flow. The `/thank-you` route exists (noindex) but is not currently part of the booking redirect.

---

## Supabase (Database)

- **Project**: `qlxoitzdxjqhljjoeqoq`
- **Table prefix**: `site_` (shared instance with n8n-intelligence)
- **ORM**: Drizzle (schema in `db/schema.ts`)
- **Status**: Schema and connection configured via `DATABASE_URL` but **zero runtime queries**. The `db/` layer is present for future use.

---

## Ressources — `/ressources` and `/ressources/:slug`

Live since **2026-09-22** (NS-19, decision D7). The resource library reads a register that this
project does not own: `contenu_ressources` (plus the `contenu-ressources` storage bucket) lives in
the Sablia workspace HUB's content pipeline. The site is a **read-only** consumer — publishing a
resource never requires a redeploy of this site, one per video. This is why `contenu_*` is the one
table prefix exempt from the `site_` convention (see `CLAUDE.md` § Database).

| Piece | Detail |
|---|---|
| List read | `client/src/lib/contenu.ts` — `fetchRessources()`, anon key, `GET contenu_ressources?select=slug,titre,resume,youtube_id,published_at&published=eq.true&order=published_at.desc` |
| Detail read | `fetchRessource(slug)` — same table, `select` adds `corps_md,fichiers`, filtered on `slug=eq.{slug}` |
| Files | Public storage bucket `contenu-ressources`; `fileUrl(path)` builds `{SUPABASE_URL}/storage/v1/object/public/contenu-ressources/{path}` — URLs are public and unguessable, by decision (D8, "on donne un maximum"): the form captures the lead, it does not lock the file |
| Anon key behaviour | `anonKey()` returns `null` when `VITE_SUPABASE_ANON_KEY` is absent from the build, or on any fetch failure/timeout (6 s) — never an exception. Pages render an explicit "unavailable" state |
| Request endpoint | `POST /api/ressources-request` (model: `api/contact.ts`) — zod payload `{ prenom, email, slug, contact, website, elapsedMs }`; honeypot / < 3 s → `204` before any I/O |
| CRM row | PostgREST insert into `sabcrm_leads`, service role, `source='contenu'`, `raw={origin:'sablia.io/ressources', slug, contact}`, `project_details='Ressource : {titre}'`, `updated_by='sablia-site/api/ressources-request'` |
| Checkbox → stage/owner | box **unticked** (default) → `stage='nouveau'`, `owner='Brice'`, `next_action='Aucun contact (téléchargement de ressource)'`. Box **ticked** → `stage='a_contacter'`, `owner='Raphael'` (no accent — matches the 51 existing rows), `next_action='Rappeler : a demandé à être contacté depuis /ressources/{slug}'` |
| Dedup | same email + `source='contenu'` + same `raw->>slug` inside 10 minutes → the existing lead id is reused, no second insert |
| Mail to the visitor | Resend, `Sablia <site@send.sablia.io>` → the visitor, subject `Votre ressource Sablia : {titre}`, body lists the file links, the YouTube link if any, and the Calendly link |
| Mail to Sablia | sent only when the box was ticked — `Sablia <site@send.sablia.io>` → `brice@sablia.io` (+ Raphaël once his address is confirmed, V3 — Brice alone until then), subject `Demande de contact via une ressource : {prenom}`, names the resource and the lead id |
| No sequence | nothing on this path writes to `sabcrm_lead_sequences` — same rule as the contact form |
| Response | `200 { ok, files: [{nom, url}], lead: boolean }` — the file links are returned even though they were also mailed, so the visitor sees them immediately |
| Tests | `client/src/lib/contenu.test.ts` (fetch stubbed: list, detail, 404, timeout, missing key) · `api/ressources-request.test.ts` (`decide`, `leadRow` ticked/unticked, dedup, honeypot/too-fast 204, invalid payload, unknown/unpublished slug 404, missing env 500, mail failure 502, nominal 200) |

---

## Contact form — `POST /api/contact`

Live since **2026-09-18** (decision D10). Rendered in the `#formations` section of the home, linked from
the nav entry « Contact » and from the footer's « Nous écrire ».

**Why a Vercel Function and not `server/`**: this project deploys STATIC (`outputDirectory: dist/public`,
`framework: null`). The Express bundle under `server/` is built by `npm run build` and never served. A file
under `api/` IS deployed, on the Node 22 runtime.

| Piece | Detail |
|---|---|
| Endpoint | `POST /api/contact` — any other method answers `405` with `allow: POST` |
| Routing | `vercel.json`'s SPA catch-all excludes it: `{ "source": "/((?!api/).*)" }`. Without that exclusion the rewrite swallows `/api/*` and the function is unreachable |
| Payload | `name`, `company`, `email`, `teamSize`, `message`, `website` (honeypot), `elapsedMs` — validated with zod `safeParse`, never `.parse()` |
| `teamSize` | the four values the portal questionnaire already writes: `je_suis_seul(e)`, `2_à_5_personnes`, `6_à_20_personnes`, `plus_de_20_personnes` |
| Mail | Resend `POST /emails`, from `Sablia <site@send.sablia.io>`, to `brice@sablia.io`, `reply_to` = the visitor. Subject `Demande via sablia.io : {société}`. The body carries the lead id, so a refused insert is visible in the inbox |
| CRM row | PostgREST insert into `sabcrm_leads` with `source='formation'`, `owner='Brice'`, `stage='nouveau'`, `updated_by='sablia-site/api/contact'`, `raw.origin='sablia.io/#contact'` |
| Dedup | a GET on the last 10 minutes (same email, same source) runs BEFORE the insert. `idx_sabcrm_leads_email` is NOT unique, so a retry after a slow answer would otherwise create a silent duplicate |
| Anti-spam | honeypot field + a 3 s floor measured from form mount. Both answer **204 before any I/O** — no mail, no row. No captcha, by decision (A7) |
| Failure modes | mail fails → `502 { code: 'mail_failed' }` and the visitor sees the fallback address · CRM insert fails → still `200`, `console.error`, the mail goes out anyway · env missing → `500 { code: 'not_configured' }` with zero I/O |
| Keys | server-side only, on the Vercel project (`sensitive`, Preview + Production). Never in `.env`, never in the client bundle |
| Tests | `api/contact.test.ts`, 24 cases with a stubbed `fetch` — included in the Vitest run via `{client,server,db,api}/**`. `.vercelignore` carries `api/**/*.test.ts` so the test file never becomes a routable function (proven live: `GET /api/contact.test` → 404) |

**What the insert fires** (read live 2026-09-18): `sabcrm_leads_normalize_raw` (no-op on this `raw`), and two
`pg_net` webhooks to n8n workflows that are inactive. **Nothing enrols the lead in `sabcrm_lead_sequences`** —
the only function that inserts there is the `sabcrm_mark_no_show` RPC, a manual gesture. The `crm-enrich` cron
does pick a new `nouveau` lead up within 15 minutes and writes `enrichment` (expected, ~0.07 $ on the
subscription).

---

## Analytics & Ads — NOT IMPLEMENTED

GA4 and Google Ads tracking was lost during the 2026-04 redesign. Env vars (`VITE_GA4_MEASUREMENT_ID`, `VITE_GADS_CONVERSION_ID`, `VITE_GADS_LABEL_CONTACT`) are still defined in Vercel but **no code reads them**. There is no `analytics.ts`, no `gtag.js` injection, no consent banner, no page-view tracking, no conversion events.

Account IDs and conversion labels are documented in [`GOOGLE_ADS.md`](./GOOGLE_ADS.md) for when tracking is re-implemented. Re-implementation work is not currently scheduled.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes (server) | PostgreSQL connection string (Supabase) |
| `NODE_ENV` | Yes | development / production |
| `VITE_GA4_MEASUREMENT_ID` | — | GA4 measurement ID — declared but unused (see above) |
| `VITE_GADS_CONVERSION_ID` | — | Google Ads conversion ID — declared but unused (see above) |
| `VITE_GADS_LABEL_CONTACT` | — | Ads conversion label — declared but unused (see above) |
| `RESEND_API_KEY` | Yes (function) | Resend key for `api/contact.ts`. Vercel project settings, `sensitive`, Preview + Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (function) | Service-role key for the `sabcrm_leads` insert. Same storage. RLS on that table has zero policies, so this is the only write path |
| `VITE_SUPABASE_ANON_KEY` | Yes (client) | Anon key for `client/src/lib/contenu.ts`, ships in the bundle by design — RLS on `contenu_ressources` exposes only `published=true` rows. Vercel project settings, plain, Preview + Production (T33) |

---

## Related Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Component tree, routes, build config
- [GOOGLE_ADS.md](./GOOGLE_ADS.md) — Account IDs, conversion labels (for future re-implementation)
- [SEO.md](./SEO.md) — Meta-tags, structured data
