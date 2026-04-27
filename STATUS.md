# Sablia Site - Status

**Last Updated**: 2026-04-27

---

## Current State

**Site v2 (sablia-site Vite+React UX migration) SHIPPED on https://sablia.io prod 2026-04-20 15:02 UTC** (cutover from sablia-io-preview Next.js). GA4 + Google Ads infrastructure deployed. Pre-design package frozen (product-v1 v2 / wireframe-v1 v2 / copy-v1 v2). Homepage v2 + global cohérence + 9-section stack éditoriale (palette sable/encre/tuile, Fraunces Variable, Diagnostic Sablia 490€ funnel) live. Build + tsc + tests all clean (27/27). **2026-04-27: SEO prerender pipeline live** — fix Google Search Console "Page en double" + per-route static HTML via puppeteer + sparticuz/chromium at build time. Remaining: P3 (Google Ads manual launch — promo expires 2026-05-01), P4 (HITL business decisions + E2E use cases), P5 (tech debt backlog).

---

## Known Issues

- [ ] Import `generate_lead` conversion in Google Ads (Goals > Conversions > Import from GA4)
- [ ] **HITL Brice**: dans Google Search Console → Indexation → Pages, cliquer "Valider la correction" sur les 2 rapports "Page en double" reçus 2026-04-27 (concerne /tarifs, /gap, /roi, /about, /faq, /cas-clients). Re-crawl Google sous 1-2 sem.

---

## Active Plans

| Plan / Brief | Status | Next |
|---|---|---|
| `plans/site-completion-checklist.md` | **P0 + P1 + P2 DONE 2026-04-20**. Homepage v2 shipped (9-section stack, Diagnostic Sablia funnel, n8n workflow live). Cohérence globale propagée. UX migration completée post-bascule 2026-04-20 15:02 UTC. | Brice: launch P3 (Google Ads UI) + trancher HITL P4.1-P4.4 |
| `research/brainstorm/2026-04-17-sablia-acquisition-machine-v1-brief.md` | Amended 2026-04-18. Pre-design unit delivered (v2: 490€ HT + crédit post-audit). Units 3-6 (pricing page redesign, hub pages, case studies, content cadence) backlog | Post P1 completion |

---

## TODO — Strategic Pivot

- [x] ~~Brice ↔ Yassine Sdiri validation~~ — **DONE 2026-04-18**: validated + affiliate link provided (`https://www.iapreneurs.com/?affiliate_code=8b6eda`).
- [ ] Confirm SASU vs auto-entrepreneur status (impact: capacity model, TVA, invoice legitimacy at 990€).
- [ ] Capacity model: lock monthly diagnostic limit (hypothesis: 4-6/mo given existing Qwertys 6j/mo retainer).
- [ ] Case study consent: Nestenn, Qwertys, Stefano, Norloc, CER — named vs anonymized.
- [ ] Elorri / Formation IA Normandie overlap with Sablia "formation d'équipes internes" — clarify boundaries.

---

## Completed (recent)

- **2026-04-27 — SEO prerender pipeline (commits 47e1922, 80f880a, f739d3c)**. Fixed GSC "Page en double" canonical errors. Added puppeteer-based prerender at build (`scripts/prerender.mjs` + `npm run build`). Each of 13 routes now ships its own static HTML with correct title/canonical/og/twitter — no JS rendering required for SEO. Sub-fixes: (a) stripped duplicate-prone meta from static `client/index.html` (Helmet now sole owner of per-page meta), (b) flattened SEO.tsx — replaced React Fragments with per-element conditionals (react-helmet-async v2 silently dropped Fragment children → og:* and twitter:* were absent in prod), (c) switched from `puppeteer` to `puppeteer-core + @sparticuz/chromium` so Vercel build env (no system Chromium libs) can launch headless.

---

## References

- **Meta Tags Config**: `docs/meta-tags.json`
- **Sitemap**: `client/public/sitemap.xml`
- **Prerender script**: `scripts/prerender.mjs` (runs in `npm run build` between vite + esbuild)
