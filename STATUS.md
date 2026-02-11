# Sablia Site - Status

**Last Updated**: 2026-02-11

---

## Current State

Site is live at https://sablia.io with warm Mediterranean beige palette.

**Pending Deployment**: Logo update (navy-sienna B mark) + PWA manifest + updated OG/Twitter images. Changes are local, not yet committed.

---

## Uncommitted Changes (deploy first)

- [x] Updated OG images (1200x630px) with new branding
- [x] Updated Twitter images (1200x630px) with new branding
- [x] Updated favicons and PWA icons
- [x] Added `manifest.json` for PWA support
- [x] Added `favicon.ico` fallback
- [x] Updated `meta-tags.json` (logo.svg, consolidated OG images)
- [x] Updated `index.html` (theme-color, manifest link, apple-mobile-web-app)
- [ ] **Commit, push, and deploy these changes**

---

## SEO Audit Status

### Completed (Phases A-C)

All code-side SEO work is done:
- Sitemap with correct dates and all pages
- Title/meta tags harmonized (index.html + meta-tags.json + SEO.tsx)
- FAQPage structured data on FAQ section
- Font preloads + DNS prefetch for external services
- Image dimensions for CLS prevention
- Lazy loading for below-fold sections (CalculatorROI, ContactForm, FAQ)
- AnimatedParticles mobile optimization (30 particles, no connections)
- Navigation.tsx proper anchor elements (SEO-friendly)
- BreadcrumbList schema on all pages
- Service schema (9 offerings)
- HowTo schema (3-step process)
- Review/AggregateRating schema (5 reviews, 4.9/5)
- Person schema for About page

### Remaining: Manual/External Tasks (Phase E)

#### Google Search Console (Priority: HIGH)
- [ ] Verify domain ownership (DNS TXT or HTML file)
- [ ] Submit sitemap: https://sablia.io/sitemap.xml
- [ ] Monitor indexing status
- [ ] Check for crawl errors weekly

#### Google Analytics 4
- [ ] Set up GA4 property for sablia.io
- [ ] Configure SEO dashboard (organic traffic, landing pages)
- [ ] Set up conversion tracking (form submissions, Calendly clicks)

#### Bing Webmaster Tools
- [ ] Register sablia.io
- [ ] Submit sitemap

#### Backlink Strategy
- [ ] Post in n8n Community forum (with sablia.io link)
- [ ] Post in Make.com community
- [ ] Consider French startup directories
- [ ] Guest post opportunities (automation blogs)

#### Rank Tracking
- [ ] Set up rank tracking for target keywords:
  - "automatisation PME"
  - "consultant n8n"
  - "automatisation entreprise IA"
  - "formation n8n"

---

## Validation Checklist (after deploying uncommitted changes)

- [ ] Test OG tags: https://developers.facebook.com/tools/debug/
- [ ] Test Twitter cards: https://cards-dev.twitter.com/validator
- [ ] Validate schemas: https://search.google.com/test/rich-results
- [ ] Check Core Web Vitals: https://pagespeed.web.dev/

---

## Next Actions

1. **Now**: Commit + deploy logo/PWA/OG changes
2. **After deploy**: Run validation checklist above
3. **This week**: Set up GSC + submit sitemap
4. **When ready**: Start blog project with `/plan sablia-blog`

---

## References

- **Roadmap**: `docs/ROADMAP.md` (future features)
- **SEO Progress**: `PROGRESS.md` (completed audit details)
- **Meta Tags Config**: `docs/meta-tags.json`
- **Sitemap**: `client/public/sitemap.xml`
