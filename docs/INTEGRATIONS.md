# Integrations — Sablia Site

**Last updated**: 2026-04-20

---

## Service Overview

| Service | Method | Files | Env Var | Status |
|---------|--------|-------|---------|--------|
| n8n (diagnostic) | POST webhook | DiagnosticForm.tsx | `VITE_DIAGNOSTIC_WEBHOOK_URL` (fallback hardcoded) | Working |
| n8n (contact) | POST webhook | LpAutomatisation.tsx | `VITE_CONTACT_WEBHOOK_URL` (fallback hardcoded) | Working |
| n8n (GAP) | POST webhook | GapForm.tsx, LpAuditGratuit.tsx | `VITE_GAP_WEBHOOK_URL` (fallback hardcoded) | Working |
| Calendly | anchor text link (+ InlineWidget on /thank-you) | HeroSection.tsx, FooterCTABand.tsx, About.tsx, ThankYou.tsx | Hardcoded URL | Working |
| GA4 | gtag.js dynamic load | analytics.ts, use-page-tracking.ts, CookieConsentBanner.tsx, App.tsx | `VITE_GA4_MEASUREMENT_ID` | Working (consent-gated) |
| Google Ads | Conversion tracking via gtag | analytics.ts, form components, ThankYou.tsx | `VITE_GADS_CONVERSION_ID` + 4 labels | Working (consent-gated) |
| Supabase | Drizzle ORM + PostgreSQL | db/schema.ts, db/index.ts | `DATABASE_URL` | Connected but unused at runtime |

---

## n8n Webhooks

All webhooks are centralized in `client/src/lib/form-constants.ts` with env var overrides and hardcoded fallbacks.

### Diagnostic Form (primary funnel, 2026-04-20+)

- **URL**: `https://n8n.sablia.io/webhook/sablia-site-diagnostic`
- **Env var**: `VITE_DIAGNOSTIC_WEBHOOK_URL` (optional override, constant: `WEBHOOK_DIAGNOSTIC`)
- **Workflow**: `mu9odNA8y54Pb4or` ([PROD] sablia-site-diagnostic)
- **webhookId**: `78ed4a4f-8daf-4309-8849-68b80e3392cd` (required for CORS preflight, see memory learning)
- **Used by**: `DiagnosticForm.tsx` (homepage `#diagnostic-form`)
- **Payload**: `{ nom, email, entreprise, processus_couteux?, rgpdConsent, ...utmParams }`
- **Downstream (current)**: Gmail notification to brice@sablia.io
- **Downstream (TODO)**: Stripe payment link (490€ HT), intake questionnaire email, 15-min booking slot

### Contact Form (legacy, still used by LP automatisation)

- **URL**: `https://n8n.sablia.io/webhook/sablia-site-formulaire`
- **Env var**: `VITE_CONTACT_WEBHOOK_URL` (optional override, constant: `WEBHOOK_CONTACT`)
- **Workflow**: `4GqFPLR750ms4GmI`
- **Used by**: `LpAutomatisation.tsx` (homepage ContactFormSection removed 2026-04-20)
- **Payload**: `{ nom, email, entreprise, telephone?, message, rgpdConsent, source_page, ...utmParams }`

### GAP Analysis Form

- **URL**: `https://n8n.sablia.io/webhook/sablia-site-gap`
- **Env var**: `VITE_GAP_WEBHOOK_URL` (optional override, constant: `WEBHOOK_GAP`)
- **Workflow**: `fZwezgtYw9X5kUCd`
- **Used by**: `GapForm.tsx` (driven by `/lp/audit-gratuit`)
- **Payload**: form data + UTM params + `rgpdConsent`

---

## Calendly

- **URL**: `https://calendly.com/brice-gachadoat/30min`
- **Package**: `react-calendly` (InlineWidget on `/thank-you`) / plain `<a>` link elsewhere
- **Surfaces** (2026-04-20+): homepage Hero (secondary text link), FooterCTABand (secondary text link), About page, ThankYou page (InlineWidget link)
- **Note**: InlineWidget removed from homepage `ContactFormSection` (component deleted in homepage v2 refonte)

---

## Google Analytics 4 (GA4)

- **Measurement ID**: `G-JVXKHE3VD8` (env: `VITE_GA4_MEASUREMENT_ID`)
- **Property ID**: 526481476
- **Web Stream ID**: 13689650940
- **Implementation**: Dynamic gtag.js load via `analytics.ts`
- **Page tracking**: Manual SPA page views via `usePageTracking` hook (`send_page_view: false` in config)
- **Consent-gated**: Only loads after user accepts cookies

### Consent Flow

```
User arrives → CookieConsentBanner shown
  → "Accept" → setConsentState('accepted') → initGA4() → scripts load
  → "Reject" → setConsentState('rejected') → no tracking
  → Already accepted (localStorage) → initGA4() on mount (App.tsx useEffect)
```

Storage: `localStorage.analytics_consent` = `'accepted' | 'rejected'`

---

## Google Ads Conversion Tracking

- **Account**: 424-135-0048
- **Conversion ID**: `AW-17987411130` (env: `VITE_GADS_CONVERSION_ID`)
- **GA4 <> Ads linked**: Yes

### Conversion Labels

| Type | Label | Env Var | Trigger |
|------|-------|---------|---------|
| diagnostic_form | TBD (create when campaign refreshed) | `VITE_GADS_LABEL_DIAGNOSTIC` | Diagnostic form submit |
| contact_form | `v-CoCPq02YEcELq5iIFD` | `VITE_GADS_LABEL_CONTACT` | Contact form submit (LP only) |
| gap_form | `0t07CP202YEcELq5iIFD` | `VITE_GADS_LABEL_GAP` | GAP form submit |
| calendly_booking | `sZJBCPi12YEcELq5iIFD` | `VITE_GADS_LABEL_CALENDLY` | Calendly booking |

### Conversion Flow

```
Form submit → trackEvent('form_submit', { type }) → redirect /thank-you → trackConversion(type)
  ↓ GA4: 'generate_lead' event with event_label
  ↓ Google Ads: 'conversion' event with send_to: AW-ID/label
```

---

## Anti-Spam

- **Method**: Honeypot field `website` (hidden)
- **Used by**: DiagnosticForm.tsx, GapForm.tsx, LpAutomatisation.tsx (internal form)
- **Logic**: If `website` field is filled, form submission is silently dropped (fake-success redirect, no webhook POST)

---

## UTM Tracking

- **File**: `client/src/lib/utm.ts`
- **Function**: `getUTMParams()` — extracts `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` from URL search params
- **Forwarded to**: All webhook submissions (diagnostic form, contact form, GAP form)

---

## Supabase (Database)

- **Project**: `qlxoitzdxjqhljjoeqoq`
- **Table prefix**: `site_`
- **ORM**: Drizzle (schema in `db/schema.ts`)
- **Status**: Connected via `DATABASE_URL` env var but **not used at runtime** — no production queries. Forms submit directly to n8n webhooks.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Build only | PostgreSQL connection string (Supabase) |
| `NODE_ENV` | Yes | development / production |
| `VITE_GA4_MEASUREMENT_ID` | Prod | GA4 measurement ID (G-JVXKHE3VD8) |
| `VITE_GADS_CONVERSION_ID` | Prod | Google Ads conversion ID (AW-17987411130) |
| `VITE_GADS_LABEL_CONTACT` | Prod | Ads label for contact form conversion |
| `VITE_GADS_LABEL_GAP` | Prod | Ads label for GAP form conversion |
| `VITE_GADS_LABEL_CALENDLY` | Prod | Ads label for Calendly booking conversion |
| `VITE_CONTACT_WEBHOOK_URL` | Optional | n8n contact form webhook URL (fallback hardcoded) |
| `VITE_GAP_WEBHOOK_URL` | Optional | n8n GAP form webhook URL (fallback hardcoded) |

---

## Related Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — Component tree, routes, build config
- [GOOGLE_ADS.md](./GOOGLE_ADS.md) — Campaign strategy, keywords, ad copy
- [SEO.md](./SEO.md) — Analytics setup, structured data
