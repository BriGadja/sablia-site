> **v1, kept for history (2026-10-26):** the file paths below under `client/` and the `VITE_*` variables describe the deleted Vite site; the Next.js v2 site lives in `src/` (see `docs/ARCHITECTURE.md`). The service facts and `api/` handlers still hold.

**Where it runs**: `api/contact.ts` is a Web-standard Fetch handler (`export default { fetch(Request): Response }`). Since the lot 0 move it is served by the site's own Express process through `server/api-adapter.ts` (it was a Vercel Function before 2026-10-18). The handler itself was not touched; `api/contact.test.ts` and `server/api-adapter.test.ts` (the same behaviours replayed over HTTP) both guard it.

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
| Resend + Supabase (PostgREST, service role) | REST read/insert/update + one confirmation mail, from the site's Express process | `api/newsletter.ts`, `api/_newsletter-person.ts` | `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (the same two, no new secret) | Branch `newsletter` (2026-10-27) — `site_newsletter_pending` read/insert/update/delete, `sabcrm_leads` read/insert/update |

Lead capture has **four** paths: a Calendly booking, the contact form at `sablia.io/#contact`, the resource-request form at `sablia.io/ressources/{slug}` (since 2026-09-22), and the newsletter page `sablia.io/newsletter` (branch `newsletter`, 2026-10-27; a lead row only after the confirmation click, see below). There is still **no n8n webhook** wired in the site — every form talks to Resend and Supabase directly from its own handler.

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
| Request endpoint | `POST /api/ressources-request` (model: `api/contact.ts`) — zod payload `{ prenom, email, slug, contact, newsletter?, telephone?, website, elapsedMs }`; honeypot / < 3 s → `204` before any I/O |
| Newsletter box (US-82, 2026-10-27) | Second box « Recevoir aussi la lettre du mardi (L'IA au travail) », `#ressource-newsletter`, never pre-ticked; absent from an older page = unticked. Ticked: after the insert/dedup, `findPerson(email)` (`api/_newsletter-person.ts`); not opposed → PATCH of the person's OLDEST row `{newsletter_subscribed_at, newsletter_unsubscribed_at: null, newsletter_source: 'ressource'}` (the download row may be it); opposed → nothing. Best effort: a failed lookup or write never costs the visitor the resource. The mail says « Vous recevrez la lettre du mardi : … » (written), offers « Recevoir la lettre du mardi : https://sablia.io/newsletter » (unticked or not written), or says nothing (opposed); the success screen says « Vous recevrez la lettre du mardi. » ticked, links `/newsletter` unticked |
| Phone (2026-10-12) | The form shows « Téléphone (facultatif) » only once the box is ticked; email stays required. `normalizePhone()` stores E.164 like the rest of `sabcrm_leads.phone` (`06…`, `+33 (0)6…`, `0033…` → `+33` + 9 digits; other `+`/`00` numbers kept at 8-15 digits); unreadable → `400` « Numéro de téléphone invalide ». A number sent with the box unticked is dropped. A payload without `telephone` (older cached page) is still accepted |
| CRM row | PostgREST insert into `sabcrm_leads`, service role, `source='contenu'`, `phone` (E.164 or null), `intention` (`veut_un_echange` ticked, `ressource_seule` unticked), `relance_date` (next business day, Paris, Sat/Sun skipped, holidays not; null unticked), `raw={origin:'sablia.io/ressources', slug, contact}`, `project_details='Ressource : {titre}'`, `updated_by='sablia-site/api/ressources-request'` |
| Checkbox → stage/owner | box **unticked** (default) → `stage='nouveau'`, `owner='Brice'`, `next_action='Aucun contact (téléchargement de ressource)'`. Box **ticked** → `stage='a_contacter'`, `owner='Raphael'` (no accent — matches the 51 existing rows), `next_action='Rappeler au {06 …} : a demandé à être contacté depuis /ressources/{slug}'` with a phone, `'Écrire (aucun numéro laissé) : …'` without |
| Dedup | same email + `source='contenu'` + same `raw->>slug` + same `raw->>contact` flag inside 10 minutes → the existing lead id is reused, no second insert |
| Mail to the visitor | Resend, `Sablia <site@send.sablia.io>` → the visitor, subject `Votre ressource Sablia : {titre}`, body lists the file links, the YouTube link if any, the Calendly link and, box ticked only, « Vous avez demandé à être contacté : on vous appelle au {06 …} / on vous répond par mail sous 24 h ouvrées. » (the success screen says « on revient vers vous sous 24 h ouvrées ») |
| Mail to Sablia | sent only when the box was ticked — `Sablia <site@send.sablia.io>` → `brice@sablia.io` (+ Raphaël once his address is confirmed, V3 — Brice alone until then), subject `Demande de contact via une ressource : {prenom}`, names the phone (« Téléphone : aucun, répondre par mail » without one), the resource and the lead id |
| No sequence | nothing on this path writes to `sabcrm_lead_sequences` — same rule as the contact form |
| Response | `200 { ok, files: [{nom, url}], lead: boolean }` — the file links are returned even though they were also mailed, so the visitor sees them immediately |
| Tests | `client/src/lib/contenu.test.ts` (fetch stubbed: list, detail, 404, timeout, missing key) · `api/ressources-request.test.ts` (`decide`, `leadRow` ticked/unticked, dedup, honeypot/too-fast 204, invalid payload, unknown/unpublished slug 404, missing env 500, mail failure 502, nominal 200) |

---

## Newsletter — `/newsletter` and `POST /api/newsletter` (branch `newsletter`, 2026-10-27)

« L'IA au travail », the Tuesday letter (plan `sablia-newsletter-resend`, US-81 and US-83). The site only collects consent and writes the CRM; the hub's `scripts/newsletter.py` syncs Resend Contacts and sends the letter.

| Aspect | Detail |
|---|---|
| Page | `src/app/newsletter/page.tsx` (static) + `src/components/newsletter/NewsletterForm.tsx` (client). The query `?c=` (confirmation mail) or `?t=` (invitation) is read with `window.location.search` in an effect, then dropped with `history.replaceState`; the page shows a button and posts NOTHING on load (a mail scanner that opens the link subscribes nobody). Umami already ignores query strings |
| Endpoint | `POST /api/newsletter`, zod discriminated union on `kind`: `request {prenom, email, foundVia?, website, elapsedMs}`, `confirm {token}`, `invite {token}`. Honeypot / < 3 s → `204` before any I/O; a token that is not a uuid → `404` without I/O |
| `request` | Never writes `sabcrm_leads` (every insert there pages the sales group). Purges unconfirmed `site_newsletter_pending` rows older than 7 days, then: 3 rows per `ip_hash` (sha256 of the last `X-Forwarded-For` entry, set by Caddy) per UTC day and 30 rows per UTC day → `429 {code:'busy'}` + `Retry-After` (the ceiling also logs `newsletter: daily ceiling reached`); a pending row for the address younger than 1 h, or a person already subscribed or opposed → `200 {state:'pending'}` with no write and no mail (the same answer as a new address); else INSERT the pending row, then ONE mail. Mail failure → the row is deleted, `502 {code:'mail_failed'}` |
| Confirmation mail | Resend `POST /emails`, `Brice Gachadoat <brice@send.sablia.io>`, reply-to `brice@sablia.io`, subject « Confirmez votre inscription à L'IA au travail », text + html, link `https://sablia.io/newsletter?c={token}`, header `Idempotency-Key: newsletter-confirm-{token}` (a `409` counts as sent) |
| `confirm` | Pending row by token: none, or unconfirmed and older than 7 days → `404 {code:'unknown_token'}`; already confirmed → `200 {state:'subscribed'}`; person opposed → `410 {code:'opposed'}`, no write. Then the CLAIM (`PATCH …?token=eq.X&confirmed_at=is.null`, representation): no row back = a concurrent click won → `200`. Person exists → PATCH of the OLDEST row (`newsletter_requested_at`, `newsletter_subscribed_at`, `newsletter_unsubscribed_at: null`, `newsletter_source: 'site_form'`; stage, owner, intention untouched); none → INSERT `source='newsletter'`, `intention='newsletter_seule'`, `stage='nouveau'`, owner Brice. A failed lead write releases the claim (`500 {code:'write_failed'}`, the link works again). Finally the pending row keeps only `token`, `created_at`, `confirmed_at`, `lead_id` (email, prénom, ip_hash nulled): the proof of the double opt-in. `200 {state:'subscribed', prenom}` |
| `invite` | The token is a lead's `optout_token` (a bearer secret: whoever holds the mail can subscribe or opt out that address, nobody else's). Row by token: none → `404`; person opposed → `410`; else PATCH of the person's OLDEST row `{newsletter_subscribed_at, newsletter_unsubscribed_at: null, newsletter_source: 'invitation'}`, no insert. `200 {state:'subscribed'}` |
| A person | `lower(email)` across `sabcrm_leads` rows (`api/_newsletter-person.ts`): `email=ilike.<escaped>` then exact lowercase matches, oldest first; opposed if any row has `opted_out_at`; subscribed if any row's subscription is newer than its unsubscription |
| Not here | Nothing on this path writes Resend Contacts or opens a sequence |
| Tests | `api/newsletter.test.ts` (in-memory PostgREST behind a stubbed `fetch`, 26 cases) · `server/app.test.ts` (mounted) · `src/app/newsletter/newsletter.test.tsx` (SSR text, metadata, token modes) |

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
| Routing | mounted before the static server and the SPA fallback (`server/app.ts`); a GET answers 405 `allow: POST` with an empty body, a body over 100 kB answers 413 before parsing, any other `/api/*` is a plain 404 |
| Payload | `name`, `company`, `email`, `teamSize`, `message`, `website` (honeypot), `elapsedMs` — validated with zod `safeParse`, never `.parse()` |
| `teamSize` | the four values the portal questionnaire already writes: `je_suis_seul(e)`, `2_à_5_personnes`, `6_à_20_personnes`, `plus_de_20_personnes` |
| Mail | Resend `POST /emails`, from `Sablia <site@send.sablia.io>`, to `brice@sablia.io`, `reply_to` = the visitor. Subject `Demande via sablia.io : {société}`. The body carries the lead id, so a refused insert is visible in the inbox |
| CRM row | PostgREST insert into `sabcrm_leads` with `source='formation'`, `owner='Brice'`, `stage='nouveau'`, `updated_by='sablia-site/api/contact'`, `raw.origin='sablia.io/#contact'` |
| Dedup | a GET on the last 10 minutes (same email, same source) runs BEFORE the insert. `idx_sabcrm_leads_email` is NOT unique, so a retry after a slow answer would otherwise create a silent duplicate |
| Anti-spam | honeypot field + a 3 s floor measured from form mount. Both answer **204 before any I/O** — no mail, no row. No captcha, by decision (A7) |
| Failure modes | mail fails → `502 { code: 'mail_failed' }` and the visitor sees the fallback address · CRM insert fails → still `200`, `console.error`, the mail goes out anyway · env missing → `500 { code: 'not_configured' }` with zero I/O |
| Keys | server-side only: `/etc/sablia-site/{prod,preview}.env` (600, root:root, read by systemd; `deploy/install-env.sh`). Never in `.env`, never in the client bundle, never in git |
| Tests | `api/contact.test.ts`, 24 cases with a stubbed `fetch` — included in the Vitest run via `{client,server,db,api}/**`. `.vercelignore` carries `api/**/*.test.ts` so the test file never becomes a routable function (proven live: `GET /api/contact.test` → 404) |

**What the insert fires** (read live 2026-09-18): `sabcrm_leads_normalize_raw` (no-op on this `raw`), and two
`pg_net` webhooks to n8n workflows that are inactive. **Nothing enrols the lead in `sabcrm_lead_sequences`** —
the only function that inserts there is the `sabcrm_mark_no_show` RPC, a manual gesture. The `crm-enrich` cron
does pick a new `nouveau` lead up within 15 minutes and writes `enrichment` (expected, ~0.07 $ on the
subscription).

---

## Audience measurement — Umami (self-hosted, lot 0)

Cookieless tracker `/m/a.js` and consent-gated recorder `/m/r.js`, served from our own origin; Umami 3.4.0 on the VPS (`127.0.0.1:3100`, dashboard `stats.sablia.io`). Event map and consent rules: `CLAUDE.md` § Measurement and consent. Credentials never in this repository (`UMAMI_CREDENTIALS` file for the e2e).

## Analytics & Ads — NOT IMPLEMENTED (Google)

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
| `RESEND_API_KEY` | Yes (function) | Resend key for `api/contact.ts`, `api/ressources-request.ts` and `api/newsletter.ts` (send-only is enough). `/etc/sablia-site/*.env` (600) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (function) | Service-role key for `sabcrm_leads` and `site_newsletter_pending`. Same storage. RLS on both tables has zero policies, so this is the only write path |
| `VITE_SUPABASE_ANON_KEY` | Yes (client) | Anon key for `client/src/lib/contenu.ts`, ships in the bundle by design — RLS on `contenu_ressources` exposes only `published=true` rows. Vercel project settings, plain, Preview + Production (T33) |

---

## Related Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Component tree, routes, build config
- [GOOGLE_ADS.md](./GOOGLE_ADS.md) — Account IDs, conversion labels (for future re-implementation)
- [SEO.md](./SEO.md) — Meta-tags, structured data
