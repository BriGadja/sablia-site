# Sablia Site - Status

**Last Updated**: 2026-10-26

---

## Current State

**v2 (Next.js static export, Sablier charte) is built on branch `autopilot/2026-10-26-sablia-io-v2` and NOT yet on production.** `main` (production, served from the VPS) is still the Vite site until Brice's go. The branch is pushed; the preview slot (`preview.sablia.io`) follows the branch ref.

Built on the branch: the nine-section home, `/formations`, `/accompagnement`, the offer page and its six CRM and spreadsheet pages, the resource library (built from Supabase), the guide, the legal pages (the CGV is a draft with visible « [À CONFIRMER] » marks), `/thank-you`, the 404 page, the SEO toolchain, the QA gates, the shell, the motion hooks, the brand assets in gold. Architecture: `docs/ARCHITECTURE.md`. Charte: `DESIGN.md`.

Stories `specs/REGISTRY.md` US-69 to US-80 stay JAMAIS-PASSÉE until the production gate. Plan and run log live in the hub (`plans/sablia-io-v2.md`, `state/autopilot/runs/2026-10-26-sablia-io-v2/`).

---

## Next

- [ ] Full QA pass on the committed head (clean build, preview slot gates, Lighthouse, parity, measurement e2e).
- [ ] First validation with Brice on the preview (recette page): switch or not, CGV text, content remarks.
- [ ] Cleanup unit: delete `client/`, `vite.config.ts`, `tailwind.config.ts`, `theme.json`, `scripts/prerender.mjs`, `server/vite.ts` and the dependencies nothing imports (importer scan first). `vercel.json` and `.vercelignore` stay until Vercel is retired.
- [ ] After the switch: browser verification on production, registry statuses, close-out.

---

## Known Issues

- [ ] `docs/INTEGRATIONS.md`, `docs/README.md` and `docs/GOOGLE_ADS.md` still describe the Vite site (BookingModal, `client/` paths, `meta-tags.json`); not rewritten by the v2 docs pass.
- [ ] `public/llms.txt` still points to `https://sablia.io/#contact` although v2 has no contact form section.
- [ ] The privacy page text is the previous one (still mentions the old diagnostic form and retention); needs a decision from Brice.
- [ ] `src/lib/site.ts` still carries v1 constants (`diagnosticPrice`, `diagnosticAnchor`, `iapreneursUrl`) that the v2 pages do not use.
- [ ] `motion` 14.6.0 is in `package.json` and nothing under `src/` imports it.
- [ ] The two residual `score.py` defects on the home (« Brice » not in the first two screens, one empty band) are the mockup's, kept on purpose.
- [ ] GA4 / Google Ads: no code in the site (unchanged).

---

## References

- Route manifest: `scripts/seo/routes.mjs` · Sitemap generator: `scripts/seo/generate-sitemap.mjs` · Lastmod ledger: `scripts/seo/lastmod.json`
- Build: `bash scripts/qa/build.sh` · Host chain: `deploy/deploy.sh`
- History before v2: `git log` on `main`
