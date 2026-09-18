# Integrations — Sablia Site

**Last updated**: 2026-09-18

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

Lead capture has **two** paths since 2026-09-18: a Calendly booking, and the contact form at `sablia.io/#contact` (see below). There is still **no n8n webhook** wired in the site — the form talks to Resend and Supabase directly from its Vercel Function.

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

---

## Related Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Component tree, routes, build config
- [GOOGLE_ADS.md](./GOOGLE_ADS.md) — Account IDs, conversion labels (for future re-implementation)
- [SEO.md](./SEO.md) — Meta-tags, structured data
