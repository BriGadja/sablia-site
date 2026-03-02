# Sablia Site - Status

**Last Updated**: 2026-03-02

---

## Current State

Site is live at https://sablia.io. GA4 + Google Ads infrastructure fully deployed. First GAP form submitted successfully. Conversion import pending GA4 event propagation (few hours).

---

## Google Ads Readiness — Manual Steps

- [x] Create GA4 property (sablia.io, ID: 526481476)
- [x] Set `VITE_GA4_MEASUREMENT_ID=G-JVXKHE3VD8` in Vercel
- [x] Set `VITE_N8N_WEBHOOK_URL=https://n8n.sablia.io/webhook/sablia-site-gap` in Vercel
- [x] Redeploy (building with both env vars)
- [x] Create Google Ads account (424-135-0048, Visa 0705, promo: spend €400 get €400)
- [x] Link GA4 → Google Ads (done during onboarding, metrics + audiences enabled)
- [ ] Import `generate_lead` conversion (form submitted — wait a few hours then Goals > Conversions > Import from GA4)
- [x] Submit sitemap to Google Search Console
- [x] Create n8n GAP webhook (workflow `fZwezgtYw9X5kUCd`, POST at `sablia-site-gap`)

---

## Known Issues

- Footer.test.tsx: "Documentation pour IA" test fails (link was removed, test not updated)
- Footer.test.tsx: TS type errors (missing vitest type augmentation for toBeInTheDocument)
- animations.ts: TS errors (framer-motion Variant type mismatch)

---

## Active Plans

| Plan | Status |
|------|--------|
| sablia-site-master | New — 3 units, PRD approved |
| sablia-site-logo-deployment | Pending (SVG path cleanup) |

---

## Next Actions

1. **Today/Tomorrow**: Import `generate_lead` conversion in Google Ads (Goals > Conversions > New > Import from GA4)
2. **This week**: Create first Google Ads campaign (Search, targeting automation keywords)
3. **When ready**: Logo SVG cleanup (`/execute sablia-site-logo-deployment`)

---

## References

- **Meta Tags Config**: `docs/meta-tags.json`
- **Sitemap**: `client/public/sitemap.xml`
