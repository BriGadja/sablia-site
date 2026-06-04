# Integrations — Sablia Site

**Last updated**: 2026-06-04

---

## Service Overview

| Service | Method | Files | Env Var | Status |
|---------|--------|-------|---------|--------|
| Calendly | Popup window (window.open) | `BookingModal.tsx` (used by HeroSection, TopNav, CalloutSection) | Hardcoded URL | Working |
| Supabase | Drizzle ORM + PostgreSQL | `db/schema.ts`, `db/index.ts` | `DATABASE_URL` | Connected but unused at runtime |
| GA4 | — | — | `VITE_GA4_MEASUREMENT_ID` | ⚠️ Env var only, no code |
| Google Ads | — | — | `VITE_GADS_CONVERSION_ID`, `VITE_GADS_LABEL_CONTACT` | ⚠️ Env vars only, no code |

There are currently **no forms and no n8n webhooks** wired in the site. Lead capture happens exclusively via Calendly bookings.

---

## Calendly

- **URL**: `https://calendly.com/raphael-espo-pro/30min` (Raph, depuis refonte CRM 2026-06 — centralisée dans `client/src/lib/site.ts` = `site.bookingUrl`)
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

---

## Related Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Component tree, routes, build config
- [GOOGLE_ADS.md](./GOOGLE_ADS.md) — Account IDs, conversion labels (for future re-implementation)
- [SEO.md](./SEO.md) — Meta-tags, structured data
