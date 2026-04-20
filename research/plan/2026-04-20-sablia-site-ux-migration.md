---
topic: Port du design UX de sablia-io (Next.js 16 + Tailwind v4) vers sablia-site (React 18 + Vite + Tailwind v3) en gardant toute l'infra tracking/consent/ads/LPs/docs/tests. Puis bascule domaine sablia.io via Vercel.
created: 2026-04-20
agents: [codebase-sablia-io-audit, codebase-sablia-site-audit, external-research-tailwind-fraunces-vercel]
plan: plans/sablia-site-ux-migration.md
---

## Research Findings

### 1. sablia-io (SOURCE) — état actuel

**Stack** : Next.js 16 + React 19 + Tailwind v4 CSS-first (`@theme` dans `globals.css`) + TypeScript strict. Fonts : Fraunces (axes variables SOFT/WONK/opsz), Geist, JetBrains Mono (tous via `next/font/google`). Pas de framer-motion (IntersectionObserver natif via `useReveal` hook + classe `.reveal`).

**9-section homepage stack** (`app/page.tsx`, figé par wireframe-v1 v2) :
1. `SiteHeader` (fixed pill, scroll-detect, nav ancres)
2. `HeroEditorial` (grid 12 col, H1 "Cinq jours. Un PDF. Une décision claire.", CTA primary + Calendly ghost)
3. `Friction` — N° 02 — remplace ProblemSection (H2 "Ce que votre équipe fait, et qu'elle ne devrait plus faire" + 6 items ordonnés)
4. `Offers` — N° 03 — 1 offre unique (Diagnostic 490€) avec triptyque illustratif SVG + VoicePlayer audio (`/audio/charlie-demo.mp3`)
5. `Authority` — Intermède (ADDED post-freeze commit 402e842) — 2 articles IAPreneurs / Sablia, attribution YouTube 200k+ explicite à Yassine Sdiri
6. `WhatReveals` — N° 04 — 3 paths cards (Formation 1500€, Accomp., Dev.)
7. `Method` — N° 05 — fond sombre `--color-encre`, 4 étapes avec timeline verticale
8. `Proof` — N° 06 — stats grid (+40/1200h/98%/0) + 3 témoignages placeholders (Claire M. Nantes, Thomas R. Grenoble, Sophie L. Bordeaux) + liste secteurs
9. `DiagnosticForm` — N° 07 — 4 champs + honeypot + RGPD, POST webhook n8n
10. `Faq` — N° 08 — 7 Q&A accordion (prix/délai/pour-qui/après/remboursement/pourquoi-payant/iapreneurs)
11. `FinalCta` — N° 09 — CTA + signature "Je réponds moi-même" avec `/brice.png` + SignatureMark

**Design tokens** (`design-tokens.md` + `globals.css @theme`) :
- Palette : sable #F4EEDF (bg), encre #1A1613 (text), tuile #B84A1E (accent primary), foret #3B4A3A, ocre #C9A461. Variantes opacité sable-50/100/200/300/400 + encre-30/50/70/90.
- Typo : `.display-xl` clamp(2.75rem→5.75rem) weight 350 opsz 144 SOFT 50, `.display-lg` clamp(2.25→3.75rem) weight 380, `.eyebrow` 0.7rem JetBrains Mono uppercase ls 0.18em, `.folio` 0.75rem Mono ls 0.14em.
- Spacings : `py-24 md:py-32` par section, max-w 1280px, container-editorial padding inline clamp(1.25→3rem), grid 12 col gap-x-6.
- Animations : `--ease-editorial: cubic-bezier(0.22,0.61,0.36,1)`, reveal 900ms opacity+translateY 12px stagger 0-300ms via CSS var `--reveal-delay`.
- Radius 2px→10px (xs/sm/md/lg), shadow paper/elev.
- Grain de papier : `body::before` SVG fractalNoise opacity 0.35 mix-blend-multiply.
- **Règles NE PAS FAIRE** : pas de framer-motion, pas de carousel, pas de parallax, pas de chatbot, pas de photo de stock, pas de "500+ clients invraisemblables", Inter banni (Geist à la place), tuile+ocre jamais même ligne de regard.

**Composants UI** : `Button`+`ButtonLink` CVA (4 variants: primary/secondary/ghost/tuile × 3 sizes), `Reveal` wrapper (IntersectionObserver), `Accordion` (open-one-at-a-time), `LogoMark` SVG sablier 2 triangles, `LogoWordmark`, `VoicePlayer` (audio + progress inline).

**`lib/site.ts`** : constantes centralisées (nom, domain, founder, diagnosticAnchor, diagnosticPrice, diagnosticTurnaround, diagnosticCreditWindow, bookingUrl, diagnosticWebhookUrl, iapreneursUrl).

**`lib/analytics.ts`** : squelette seulement — `GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-XXXXXXXXXX"` (placeholder), `trackEvent`, `trackConversion`. Script GA4+GADS dans `layout.tsx` conditionnel aux env vars. **AUCUN consent banner** — illégal RGPD si activé en prod.

**Pages légales** : `/cgv` (12 sections, art. 293 B CGI verbatim §3, crédit post-audit §5), `/confidentialite` (7 sections, n8n self-host mentionné), `/mentions-legales` (SIREN 940 901 127, SIRET 94090112700016, 60 rue François Ier 75008, APE 6201Z, art. 293 B cité).

**Deltas copy vs `copy-v1.md` v2 frozen** :
- Credential hero : "200k+ abonnés YouTube" RETIRÉS du hero (présents seulement dans Authority section)
- Friction (§Problème) : copy entièrement réécrite (liste de 6 items au lieu du body 60 mots du frozen spec)
- Proof (§Témoignages) : placeholders anonymisés (Claire M./Thomas R./Sophie L.) au lieu des noms réels du frozen spec (Yassine/Valentin/Amir)
- ROI Calculator : ABSENT dans sablia-io (copy-v1 §C3§7 le prévoyait)
- Authority : section AJOUTÉE hors wireframe-v1 (post-freeze)

### 2. sablia-site (TARGET) — état actuel

**Stack** : React 18 + Vite 5 + Express + Tailwind v3.4 hardcodé `tailwind.config.ts` + wouter + react-helmet-async + Drizzle + framer-motion 11. TypeScript strict. Biome 2.4.10. Vitest 4 + happy-dom 20 + React Testing Library.

**Tokens actuels** (hex hardcodés, PAS CSS vars) : sablia-text #1a2e4e (navy), sablia-bg #f4efe2 (parchment clair), sablia-surface #eae3d2, sablia-accent #1a2e4e (= navy), sablia-sienna #c45a2c, sablia-alba #d4956a (non utilisé), sablia-border rgba(26,46,78, 0.10). Font-sans Inter Tight, font-display Cormorant Garamond. **Palette COMPLÈTEMENT différente** de sablia-io (qui a sable/encre/tuile).

**Composants landing actuels** (11 fichiers dans `client/src/components/landing/`) : Navigation, HeroSection, ClientLogosStrip, ProblemSection, DiagnosticSection+DiagnosticForm (228 lignes + tests), WhatRevealsSection, TestimonialsSection (3 témoignages lazy), PricingSection (339 lignes lazy réutilisé par /tarifs), CalculatorROI (192 lignes lazy avec `useCountUp` RAF), FaqSection (lazy 146 lignes, 7 Q diagnostic-focused), FooterCTABand.

**Stack Landing.tsx actuelle** (9 sections) : Hero → ClientLogos → Problem → Diagnostic+Form → WhatReveals → Testimonials (lazy) → CalculatorROI (lazy) → Faq (lazy) → FooterCTABand (lazy).

**Infra tracking — SACRO-SAINT à ne pas casser** :
- `lib/analytics.ts` : `getConsentState()`, `setConsentState()`, `initGA4()` (lazy gtag script), `trackPageView()`, `trackEvent()`, `trackConversion()`. Types : `'contact_form' | 'gap_form' | 'calendly_booking' | 'diagnostic_form'`. Env vars : `VITE_GA4_MEASUREMENT_ID`, `VITE_GADS_CONVERSION_ID`, 4 labels conversion.
- `CookieConsentBanner.tsx` : localStorage key `analytics_consent` (accepted/rejected/null). Visible si null. Accepter → initGA4() + trackPageView(). Monté dans `App()` à la racine, dehors Router.
- `form-constants.ts` : WEBHOOK_CONTACT, WEBHOOK_GAP, WEBHOOK_DIAGNOSTIC + inputClasses.
- `utm.ts` : getUTMParams() — lit utm_source/medium/campaign/term/content depuis URL.

**14 routes actives** : `/`, `/tarifs`, `/gap`, `/about`, `/roi`, `/mentions-legales`, `/politique-confidentialite`, `/cgv`, `/faq`, `/cas-clients`, `/thank-you`, `/lp/automatisation-pme` (lazy), `/lp/audit-gratuit` (lazy), `*` (NotFound).

**Tests actuels 12/12** : 5 Footer.test.tsx + 7 DiagnosticForm.test.tsx (schema Zod 5 cas + UI 2 cas, mock fetch, vi.stubGlobal).

**Deps clés** : framer-motion ^11.13.1, wouter ^3.3.5, react-hook-form ^7.53.1, zod ^3.23.8, @hookform/resolvers, react-helmet-async ^2.0.5, lucide-react ^0.453.0, 7 Radix UI primitives, class-variance-authority, clsx + tailwind-merge, tailwindcss-animate, react-calendly.

**Build config** : Vite manualChunks (react-vendor, router, animation, forms, ui), aliases @/@db/@docs, Biome règles warn (pas error) sur unused/any/console, Lighthouse chunk main ~96kb gzip.

**Assets statiques** : logo.svg, 13 SVG intégrations (n8n/make/notion/openai/etc.), favicons PWA, og-image, sitemap.xml, robots.txt.

**Composants shadcn UI (12)** : button, card, form, input, label, radio-group, select, slider, textarea, toast, toaster, tooltip. Utilisés par GapForm et /not-found uniquement — Landing n'importe aucun shadcn.

### 3. External research — Tailwind v4→v3, Fraunces, Vercel migration

**Tailwind v4 → v3** :
- `@theme { --color-* }` → `theme.extend.colors` dans `tailwind.config.ts` (mappage mécanique top-down)
- `@theme { --font-* }` → `theme.extend.fontFamily`
- `@theme { --animate-* } + @keyframes` → `theme.extend.animation` + `theme.extend.keyframes`
- `@import "tailwindcss"` v4 → `@tailwind base/components/utilities` v3 (PIÈGE : ne jamais copier v4 directive)
- Container queries v4 natif → plugin `@tailwindcss/container-queries` en v3 (`npm install`)
- oklch v4 → convertir en hex pour v3 (sablia-io utilise déjà hex donc OK)
- Syntaxe opacité `bg-black/50` compatible v4 et v3 (ne rien changer)

**Fraunces dans React/Vite** :
- **Recommandé : `@fontsource-variable/fraunces`** (bundlé via Vercel Edge, hash-stable, preload possible)
- Setup : `npm install @fontsource-variable/fraunces` + `@import '@fontsource-variable/fraunces/wght.css';` dans `index.css`
- Preload LCP : `<link rel="preload" as="font" href="..." crossorigin>` dans `index.html` (utiliser `?url` Vite pour hash)
- `font-variation-settings: "opsz" 72, "SOFT" 30, "WONK" 0` — **WONK 0 pour B2B serious** (pas 1)
- Scope Fraunces : **H1/H2 display uniquement** (Geist reste pour body). Réduire les weights chargés pour LCP.

**Vercel domain migration safe (< 10 min, rollback < 5 min)** :
- DNS pointe déjà vers `cname.vercel-dns.com` Anycast → **aucun changement DNS nécessaire**. Bascule purement interne Vercel (< 30s propagation).
- Procédure :
  1. `vercel ls sablia-site --scope brices-projects-c5e1ba72` → copier deployment URL
  2. `vercel alias set [deployment-url] sablia.io` (< 30s)
  3. Vérifier `curl -I https://sablia.io` répond depuis nouveau projet
  4. Dashboard : remove `sablia.io` de projet `sablia-io-preview`
  5. Dashboard : add `sablia.io` dans projet `sablia-site`
  6. SSL cert auto-réémis Let's Encrypt en < 2 min
- Rollback : `vercel alias set [old-deployment-url] sablia.io` — < 5 min
- Preview URLs `.vercel.app` de l'ancien projet restent actives, inchangées

**Sources clés** :
- tailwindcss.com/docs/upgrade-guide
- tailwindcss.com/docs/theme
- vercel.com/kb/guide/how-to-move-a-domain-between-vercel-projects-with-zero-downtime
- fontsource.org/fonts/fraunces/install
- fontsource.org/docs/getting-started/preload
- github.com/tailwindlabs/tailwindcss/discussions/16688 (opacity codemod miss)
- ui.shadcn.com/docs/tailwind-v4

## Décisions éditoriales à trancher dans le plan (HITL)

1. **Témoignages Proof section** : placeholders sablia-io (Claire M./Thomas R./Sophie L.) OU noms réels copy-v1 (Yassine/Valentin/Amir) ? → **Recommandation : garder placeholders anonymisés jusqu'à consentement clients validé** (voir STATUS.md TODO Pivot : case study consent Nestenn/Qwertys/Stefano/Norloc/CER en attente).
2. **ROI Calculator** : absent dans sablia-io mais présent sablia-site et spec dans copy-v1 §C3§7 → **Recommandation : GARDER** (différentiateur, ROI immédiat pour prospect, spec frozen le prévoit). Le porter avec tokens sable/encre/tuile.
3. **Section Authority** : ajoutée post-freeze dans sablia-io → **Recommandation : PORTER** (sablia-io est ultérieur au freeze, représente itération finale validée par Brice).
4. **Credential hero "200k+ YouTube"** : sablia-io la retire du hero, la met dans Authority uniquement → **Recommandation : suivre sablia-io** (attribution correcte à Yassine, évite ambiguïté "communauté IAPreneurs a 200k abonnés").
5. **Friction copy réécrite vs copy-v1 §3 Problème** : sablia-io a une liste de 6 items (recopier devis CRM, relances paiements, etc.) plus concrète que le body 60 mots frozen → **Recommandation : suivre sablia-io** (plus fort opérationnellement, confirmé post-freeze).
6. **FAQ nombre de Q&A** : sablia-io 7 Q vs sablia-site 9 Q (sablia-site ajoute outils n8n + sécurité données) → **Recommandation : 9 Q** (les 2 items techniques répondent à des objections Google Ads).
