# SEO — Sablia Site

**Last updated**: 2026-04-20

---

## Recent Changes

- **2026-04-20 (ux-migration Phase 5)**: Homepage H1 shifts from Inter Tight to Fraunces Variable (display serif). Palette moves navy/parchment → encre/sable. Legal pages (/cgv, /politique-confidentialite, /mentions-legales) restructured via `LegalShell` with updated editorial body copy (SIREN/APE lifted into /mentions-legales, art. 293 B CGI disclosed in /cgv §3, n8n self-host + Data Privacy Framework disclosed in /politique-confidentialite). `/faq` reviewCount on FAQPage schema unchanged (9 Q, JSON-LD via Helmet). Sitemap `lastmod` bumped to 2026-04-20 on 3 legal routes + `/gap` + `/roi`.

---

## Meta-Tags Coverage

All meta-tags are defined in `docs/meta-tags.json` and applied via `react-helmet-async` through the `SEO.tsx` component.

| Route | Title | Description | OG | Twitter | Structured Data |
|-------|-------|-------------|----|---------|----|
| `/` | Sablia - Automatisation IA pour PME \| n8n & Make.com | Yes | Yes (website) | summary_large_image | Organization |
| `/tarifs` | Tarifs Automatisation - Offres & Packages | Yes | Yes | summary_large_image | ItemList (offers) |
| `/gap` | Analyse GAP Gratuite | Yes | Yes | summary | - |
| `/roi` | Calculateur ROI Automatisation | Yes | Yes | summary_large_image | WebApplication |
| `/about` | A propos de Sablia | Yes | Yes | summary | Person |
| `/faq` | FAQ - Questions frequentes | Yes | Yes | summary | FAQPage (inline) |
| `/cas-clients` | Cas clients - Exemples de transformations | Yes | Yes | summary | ItemList |
| `/thank-you` | Merci - Sablia | Yes | - | - | noindex, nofollow |
| `/mentions-legales` | Mentions Legales | Yes | Yes | - | noindex, follow |
| `/politique-confidentialite` | Politique de Confidentialite | Yes | Yes | - | noindex, follow |
| `/cgv` | Conditions Generales de Vente | Yes | Yes | - | noindex, follow |
| `/lp/automatisation-pme` | Automatisez vos processus repetitifs | Yes | - | - | noindex, follow |
| `/lp/audit-gratuit` | Audit Automatisation Gratuit | Yes | - | - | noindex, follow |

---

## Structured Data Inventory

| Page | Schema Type | Source File |
|------|------------|-------------|
| All pages (head) | ProfessionalService + OfferCatalog | index.html (inline JSON-LD) |
| All pages (meta) | Organization | meta-tags.json homepage structuredData, via SEO.tsx |
| All non-home pages | BreadcrumbList | SEO.tsx (dynamic) |
| `/` pricing section | Service (9 offerings) | PricingSection.tsx |
| `/` process section | HowTo (3 steps) | ThreeStepProcess.tsx |
| `/` testimonials | AggregateRating + Review (5 reviews, 4.9/5) | TestimonialsSection.tsx |
| `/` FAQ section | FAQPage | FaqSection.tsx |
| `/about` | Person (Brice Gachadoat) | meta-tags.json via SEO.tsx |
| `/faq` | FAQPage | Faq.tsx (inline Helmet) |
| `/roi` | WebApplication | meta-tags.json |
| `/cas-clients` | ItemList (case studies) | meta-tags.json |
| `/tarifs` | ItemList (offers) | meta-tags.json |

---

## Sitemap

**File**: `client/public/sitemap.xml`
**Routes**: 10 public routes (landing pages and thank-you excluded)
**Last modified**: 2026-03-02

| Route | Priority | Change Freq |
|-------|----------|-------------|
| `/` | 1.0 | weekly |
| `/tarifs` | 0.9 | monthly |
| `/gap` | 0.9 | monthly |
| `/roi` | 0.8 | monthly |
| `/about` | 0.7 | monthly |
| `/faq` | 0.7 | monthly |
| `/cas-clients` | 0.7 | monthly |
| `/mentions-legales` | 0.3 | yearly |
| `/politique-confidentialite` | 0.3 | yearly |
| `/cgv` | 0.3 | yearly |

---

## Robots.txt

**File**: `client/public/robots.txt`

- All user-agents allowed
- Sitemap declared
- AI agent guidance: `AI-Documentation` and `AI-Content` headers pointing to GitHub raw files
- GPTBot: allowed with `Crawl-delay: 10`
- Claude-Web: allowed
- Google-Extended: allowed

---

## Known Issues

From PRD audit (sections 3.3-3.7):

- [x] **Canonical trailing slash inconsistency** — Fixed: index.html canonical now has trailing slash
- [x] **Homepage has 2 JSON-LD blocks** — Fixed: removed duplicate Organization from meta-tags.json, keeping ProfessionalService in index.html
- [x] **`/cas-clients` missing structured data** — Fixed: added ItemList schema to meta-tags.json
- [ ] **www vs non-www redirect** — `sablia.io` redirects 307 to `www.sablia.io` but all canonicals say `https://sablia.io`. Fix via Vercel DNS settings.
- [x] **Stale sitemap lastmod dates** — Fixed: updated to 2026-03-02

---

## Manual Tasks Checklist

Migrated from former `SEO-MANUAL-TASKS.md`:

- [x] GA4 setup — property created, tracking code in analytics.ts, consent-gated
- [x] Google Ads conversion tracking — 3 conversion actions, labels in .env
- [x] GA4 <> Google Ads linked
- [ ] **Fix www redirect** — Vercel DNS: make `sablia.io` primary, `www.sablia.io` redirect to non-www
- [ ] **Google Search Console** — verify domain, submit sitemap, request indexing for key pages
- [ ] **Bing Webmaster Tools** — register, verify (import from GSC), submit sitemap
- [ ] **Social sharing validation** — test OG previews (Facebook Debugger), Twitter Card Validator, Rich Results Test
- [ ] **Backlink strategy** — n8n forum post, Make.com community, French startup directories, LinkedIn profile link

### Rank Tracking Keywords

| Keyword | Target Page |
|---------|-------------|
| automatisation PME | `/` |
| consultant n8n | `/` |
| automatisation entreprise IA | `/` |
| formation n8n | `/tarifs` |
| ROI automatisation | `/roi` |

---

## Related Docs

- [INTEGRATIONS.md](./INTEGRATIONS.md) — GA4 and Google Ads implementation details
- [GOOGLE_ADS.md](./GOOGLE_ADS.md) — Conversion IDs, campaign strategy
- [meta-tags.json](./meta-tags.json) — Full SEO metadata per page
