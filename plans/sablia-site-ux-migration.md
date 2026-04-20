---
name: sablia-site-ux-migration
description: Port du design UX de sablia-io (Next.js 16 + Tailwind v4) vers sablia-site (React 18 + Vite + Tailwind v3) en gardant l'infra tracking/consent/ads/LPs/tests. Puis bascule domaine sablia.io de sablia-io-preview vers sablia-site via Vercel.
created: 2026-04-20
confidence: 7/10 (medium-high — scope clair, recherche validée, risques identifiés, mais 3 décisions éditoriales HITL à trancher avant Phase 3)
research: research/plan/2026-04-20-sablia-site-ux-migration.md
owner: brice@sablia.io
---

# Plan — Sablia Site UX Migration

## Contexte

Deux repos ont évolué en parallèle :
- **sablia-site** (React 18 + Vite, repo `BriGadja/sablia-site`) : préviews `sablia-site.vercel.app`. Contient TOUTE l'infra production (GA4 consent flow, Google Ads conversion tracking 4 labels, LPs `/lp/*` pour campagnes Ads, `/gap` form, 14 routes, docs v2, tests Vitest, Biome lint strict).
- **sablia-io** (Next.js 16 + Tailwind v4, repo `BriGadja/sablia.io`) : domaine production `sablia.io`. Contient le redesign UX final itéré (9 sections éditoriales, palette sable/encre/tuile, Fraunces variable, Authority section post-freeze, Proof avec placeholders, pas de ROI Calculator, pas de consent RGPD).

**Problème** : sablia-io a le design voulu mais pas l'infra. sablia-site a l'infra mais un design plus ancien que j'ai refait aujourd'hui (obsolète maintenant).

**Objectif** : fusionner le meilleur des deux côté sablia-site, puis basculer le domaine `sablia.io` du projet Vercel `sablia-io-preview` vers le projet Vercel de sablia-site.

**Deadline dure** : 2026-05-01 (11 jours). Promo Google Ads 400€/400€ expire — Phase A tracking+consent doit être live avant.

## Scope

### In scope
- Port design tokens Tailwind v4 → v3 (palette sable/encre/tuile/foret/ocre, spacings, radius, shadows, animations `--ease-editorial`)
- Port typographie : Fraunces variable (SOFT/WONK/opsz) via `@fontsource-variable/fraunces`, Geist pour body, JetBrains Mono pour eyebrow/folio
- Port des 9 sections éditoriales sablia-io vers sablia-site (SiteHeader, HeroEditorial, Friction, Offers, Authority, WhatReveals, Method, Proof, FinalCta) + primitives (Reveal, ButtonLink, Accordion, LogoMark, VoicePlayer)
- **Préserver** : ROI Calculator (différentiateur), consent banner RGPD, analytics infra complète, tests DiagnosticForm, LPs `/lp/*`, GapForm `/gap`, pages légales, 14 routes
- Bascule domaine sablia.io de `sablia-io-preview` vers projet Vercel sablia-site (via Vercel CLI `vercel alias set`, pas de changement DNS)
- Rollback plan documenté et testable en < 5 min

### Out of scope
- Archivage du repo GitHub `BriGadja/sablia.io` (décision Brice post-bascule)
- Résolution HITL CGV TVA (art. 293 B vs 20% — dépend statut SASU vs auto-entrepreneur)
- Lancement de la campagne Google Ads UI (manuel Brice, P3 du `site-completion-checklist.md`)
- Refonte des LPs (restent avec leur design actuel pour ne pas casser Quality Score Ads)
- Consent clients pour Proof/Testimonials avec noms réels (placeholders anonymisés côté sablia-io utilisés par défaut)

## Documentation Sources & Targets

**Sources consultées durant planning** :
- `research/plan/2026-04-20-sablia-site-ux-migration.md` (rapport des 3 agents)
- `docs/product-v1.md` v2 (SKU Diagnostic Sablia 490€)
- `docs/wireframe-v1.md` v2 (9-section stack)
- `docs/copy-v1.md` v2 (copy complète)
- `/home/sablia/workspace/projects/internal/websites/sablia-io/design-tokens.md` (tokens source)
- `/home/sablia/workspace/projects/internal/websites/sablia-io/app/globals.css` (Tailwind v4 `@theme`)
- `/home/sablia/workspace/projects/internal/websites/sablia-io/components/sections/*` (10 sections source)
- `plans/site-completion-checklist.md` (checklist P0-P5 existante)

**Targets à mettre à jour après exécution** :
- `STATUS.md` — ajouter bascule DNS + URL production
- `CLAUDE.md` — section Stack : noter migration tokens + Fraunces
- `docs/ARCHITECTURE.md` — nouvelles sections landing (SiteHeader, Authority, Method, Proof, Offers)
- `docs/INTEGRATIONS.md` — WEBHOOK_DIAGNOSTIC confirmé en prod
- `docs/meta-tags.json` — bump lastmod, vérifier description/OG
- `client/public/sitemap.xml` — bump lastmod homepage
- `docs/SEO.md` — documenter changements SEO (H1, schema reviewCount)

## Phases

### Phase 1 — Design tokens + typographie (base visuelle) ✅ DONE 2026-04-20

**Objectif** : la base CSS est en place, `tailwind.config.ts` + `index.css` reflètent la palette sable/encre/tuile et la typo Fraunces. Aucun composant n'est encore porté — on valide juste que les tokens sont accessibles.

**Actions** :
1. **Pre-flight audit slash opacity** : `grep -rn 'bg-\|text-\|border-' /home/sablia/workspace/projects/internal/websites/sablia-io/components /home/sablia/workspace/projects/internal/websites/sablia-io/app | grep -oE '/[0-9]+' | sort -u` — lister toutes les opacités slash utilisées (ex: `/50`, `/70`). Vérifier que le plugin Tailwind v3.4 + notre palette couvrent tous ces cas (v3.4 supporte slash opacity depuis v3.0, mais il faut que la couleur soit une string hex dans la config, pas une nested object).
2. Réécrire `tailwind.config.ts` : **ADDITIVE, pas destructive**. Ajouter la nouvelle palette (sable, encre, tuile, foret, ocre + variantes nommées `sable-50/100/200/300/400`, `encre-30/50/70/90`, `tuile-soft/dark`) comme nouveaux tokens. **Garder les anciens `sablia-*` tokens comme shims** mappés aux nouveaux CSS vars (`"sablia-bg": "var(--color-sable)"`, `"sablia-text": "var(--color-encre)"`, `"sablia-accent": "var(--color-tuile)"`, `"sablia-sienna": "var(--color-tuile)"`, `"sablia-surface": "var(--color-sable-50)"`, `"sablia-border": "rgba(26, 22, 19, 0.12)"`, etc.) pour que LPs, /tarifs, /gap, pages légales continuent de compiler durant Phases 2-4. Shims supprimés en Phase 5 après propagation manuelle.
3. Ajouter keyframes + animation `fade-in` (ease-editorial `cubic-bezier(0.22,0.61,0.36,1)`, 900ms) dans `theme.extend.keyframes`/`animation`.
4. `fontFamily.display` = `["Fraunces Variable", "serif"]`, `fontFamily.sans` = `["Geist", "system-ui", "sans-serif"]`, `fontFamily.mono` = `["JetBrains Mono", "monospace"]`. **Conserver** aussi `["Inter Tight", "Inter", ...]` en fallback sur certaines pages non portées (LPs) en ajoutant `fontFamily.legacy-sans` pour éviter de casser leur rendu.
5. Ajouter plugin `@tailwindcss/container-queries` (`npm install`).
6. `npm install @fontsource-variable/fraunces @fontsource/geist @fontsource/jetbrains-mono vite-plugin-fontaine` — note : **`@fontsource/geist`** (pas `geist-sans`, qui existe mais est moins maintenu). **`vite-plugin-fontaine`** génère les fallback metrics `size-adjust`/`ascent-override` pour éviter CLS FOUT vs `next/font` baseline.
7. Dans `client/src/index.css` : ajouter les imports Fraunces **full axes** (pas seulement wght — on a besoin de SOFT/WONK/opsz) : `@import '@fontsource-variable/fraunces'; @import '@fontsource/geist/400.css'; @import '@fontsource/geist/500.css'; @import '@fontsource/jetbrains-mono/500.css';`. Le package `@fontsource-variable/fraunces` expose les axes multiples via l'import root (vs `/wght.css` qui ne couvre que le poids).
8. **Supprimer les anciens `<link>` Google Fonts** de `client/index.html` (Inter Tight + Cormorant Garamond) — sinon double chargement + FOUT race.
9. Remplacer `body { border-top: 2px solid #c45a2c }` par `border-top: 2px solid var(--color-tuile)` (référence CSS var).
10. Ajouter classes utilitaires custom dans `index.css` : `.display-xl/lg/md`, `.eyebrow`, `.folio`, `.rule`, `.container-editorial`, `.hairline-t/b`, `.pull-quote`, `.reveal/.is-visible`.
11. Ajouter grain de papier `body::before` avec SVG fractalNoise inline (copie de `sablia-io/app/globals.css`). **Attention** : tester avec framer-motion (`AnimatePresence` + transforms créent des stacking contexts — cas connu d'artefact compositing). Si grain invisible ou flickers, déplacer le grain hors du motion wrapper dans un composant `PaperGrain` rendu en fixed position sur `<html>`.
12. `:root` CSS vars : `--color-sable`, `--color-encre`, etc. (pour usage dans les composants via `bg-[color:var(--color-sable)]`).
13. Préload Fraunces dans `client/src/main.tsx` via import Vite hashé : `import frauncesSrc from '@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2?url';` puis injecter dynamiquement un `<link rel="preload" as="font" crossorigin>` dans `<head>` avant le rendu React (le `?url` Vite résout l'URL hashée en production).

**Verification Constraints** :

| Type | Target | Assertion | Method |
|------|--------|-----------|--------|
| contains | client/tailwind.config.ts | Contains sable color | grep -q '"sable":' /home/sablia/workspace/projects/internal/websites/sablia-site/tailwind.config.ts |
| contains | client/tailwind.config.ts | Contains Fraunces Variable | grep -q 'Fraunces Variable' /home/sablia/workspace/projects/internal/websites/sablia-site/tailwind.config.ts |
| contains | client/tailwind.config.ts | Keeps sablia-bg shim alias during transition | grep -q '"sablia-bg"' /home/sablia/workspace/projects/internal/websites/sablia-site/tailwind.config.ts |
| contains | client/src/index.css | Imports fontsource-variable fraunces | grep -q '@fontsource-variable/fraunces' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/index.css |
| contains | client/src/index.css | Defines display-xl utility class | grep -q 'display-xl' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/index.css |
| contains | package.json | Declares @fontsource-variable/fraunces dep | grep -q 'fontsource-variable/fraunces' /home/sablia/workspace/projects/internal/websites/sablia-site/package.json |
| not-contains | client/index.html | Cormorant Garamond link removed | ! grep -q 'Cormorant+Garamond' /home/sablia/workspace/projects/internal/websites/sablia-site/client/index.html |
| exit-code | npm run check | TypeScript clean | cd /home/sablia/workspace/projects/internal/websites/sablia-site && npm run check |
| exit-code | npm run build | Build succeeds with shims | cd /home/sablia/workspace/projects/internal/websites/sablia-site && npm run build 2>&1 \| grep -q 'built in' |

**Validation finale Phase 1** : `npm run build` passe + `curl http://localhost:5000` (dev server) affiche la page avec nouvelle palette (H1 en Fraunces, bg sable).

---

### Phase 2 — Primitives partagées ✅ DONE 2026-04-20

**Objectif** : les composants réutilisables (Reveal, ButtonLink CVA, Accordion, LogoMark, VoicePlayer, LogoWordmark) sont en place et testés.

**Actions** :
1. [x] Créer `client/src/components/ui/reveal.tsx` : wrapper IntersectionObserver + classe `.reveal` + `--reveal-delay` CSS var. Props `as`, `delay`, `className`, `children`. Porter depuis `sablia-io/components/ui/reveal.tsx`.
2. [x] Créer `client/src/lib/use-reveal.ts` (hook pour cas où le wrapper composant n'est pas adapté).
3. [x] Étendre `client/src/components/ui/button.tsx` shadcn existant : ajouter variants `tuile` (bg-tuile) + `ghost` (text-encre → hover tuile) + `primary` + `editorial`. Ajouter `ButtonLink` (anchor version) + sizes `md`/`xl`. Variants shadcn legacy (`default`, `destructive`, `outline`, `secondary`, `link`) conservés.
4. [x] Créer `client/src/components/ui/accordion-editorial.tsx` (ne pas écraser shadcn accordion existant) : open-one-at-a-time, icône +/× rotation 45°, `hidden` natif sans animation height, prop `defaultOpenId` (default = premier item).
5. [x] Créer `client/src/components/brand/logo-mark.tsx` : SVG sablier 2 triangles 80x80 viewBox, prop `size`, `label` (aria-label). Porter depuis sablia-io.
6. [x] Créer `client/src/components/brand/logo-wordmark.tsx` : LogoMark + "Sablia" en Fraunces.
7. [x] Créer `client/src/components/brand/voice-player.tsx` : audio ref + progress inline + play/pause toggle. Props `src`, `label`, `className`.
8. [x] Écrire tests Vitest minimum pour Reveal (IntersectionObserver mock, 4 tests) + Button/ButtonLink (click + href + variants, 6 tests) + AccordionEditorial (open/close state + folio markers, 5 tests).

**Verification Constraints** :

| Type | Target | Assertion | Method |
|------|--------|-----------|--------|
| file-exists | client/src/components/ui/reveal.tsx | Reveal wrapper exists | test -f /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/ui/reveal.tsx |
| file-exists | client/src/components/brand/logo-mark.tsx | LogoMark SVG exists | test -f /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/brand/logo-mark.tsx |
| contains | client/src/components/ui/button.tsx | Has tuile variant | grep -q 'tuile' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/ui/button.tsx |
| exit-code | npm run check | TypeScript clean | cd /home/sablia/workspace/projects/internal/websites/sablia-site && npm run check |
| exit-code | npm test primitives | Primitives tests pass | cd /home/sablia/workspace/projects/internal/websites/sablia-site && npm test -- --run components/ui components/brand 2>&1 \| grep -q 'passed' |

**Validation finale Phase 2** : tests verts (12 existants + nouveaux primitives), tsc clean, pas de régression Footer.

---

### Phase 3 — Sections éditoriales (port un par un) ✅ DONE 2026-04-20

**Objectif** : les 9 sections sablia-io sont portées dans `client/src/components/landing/` avec la palette sable/encre/tuile. Chaque section remplace sa contrepartie actuelle (ou ajout si absente).

**Décisions éditoriales tranchées dans ce plan** (HITL résolus par défaut-recommandé, Brice peut override en pré-exécution) :
- **Authority** : PORTER (section ajoutée post-freeze dans sablia-io, validée par itération Brice)
- **Proof** : placeholders anonymisés (Claire M./Thomas R./Sophie L.) — jusqu'à ce que P4.3 case study consent soit débloqué
- **ROI Calculator** : GARDER (spec frozen prévoit, différentiateur, supprimé par oubli côté sablia-io)
- **Friction** : suivre sablia-io (liste 6 items ordonnés) — plus fort que le body 60 mots du copy-v1
- **Credential hero** : suivre sablia-io (retirer "200k+ YouTube" du hero, le garder dans Authority)
- **FAQ** : 9 Q (garder les 2 items techniques outils+sécurité qui répondent aux objections Google Ads)

**Mapping actions (1 section = 1 commit atomique)** :

| # | Section sablia-io | Action côté sablia-site | Composant cible |
|---|-------------------|------------------------|-----------------|
| 1 | `site-header.tsx` | Réécrire `Navigation.tsx` (pill fixed, nav 4 ancres, scroll detect, burger mobile). Garder le handler cross-page anchor que j'ai ajouté aujourd'hui. | `landing/Navigation.tsx` |
| 2 | `hero-variants/hero-editorial.tsx` | Réécrire `HeroSection.tsx` (grid 12 col, H1 Fraunces, Trust band, aside LogoMark desktop, 2 CTAs primary/ghost Calendly) | `landing/HeroSection.tsx` |
| 3 | `friction.tsx` | **Nouveau** : `FrictionSection.tsx` (N° 02, liste 6 items ordonnés). Supprimer `ProblemSection.tsx` | `landing/FrictionSection.tsx` |
| 4 | `offers.tsx` | **Nouveau** : `OffersSection.tsx` (N° 03, triptyque SVG illustration + VoicePlayer + spécifs DL). Remplace `DiagnosticSection` (qui gardait juste l'intro) | `landing/OffersSection.tsx` |
| 5 | `authority.tsx` | **Nouveau** : `AuthoritySection.tsx` (intermède 2 articles, attribution YouTube à Yassine explicite) | `landing/AuthoritySection.tsx` |
| 6 | `what-reveals.tsx` | Réécrire `WhatRevealsSection.tsx` (N° 04, 3 paths cards avec folio numbers, price floor uniquement card 1) | `landing/WhatRevealsSection.tsx` |
| 7 | `method.tsx` | **Nouveau** : `MethodSection.tsx` (N° 05, fond encre sombre, 4 étapes timeline verticale + grain inversé) | `landing/MethodSection.tsx` |
| 8 | `proof.tsx` | Réécrire `TestimonialsSection.tsx` → `ProofSection.tsx` (N° 06, stats grid 4 + 3 témoignages placeholders + liste secteurs). Garder schema.org reviewCount=3 | `landing/ProofSection.tsx` |
| 9 | `diagnostic-form.tsx` | Réécrire visuellement `DiagnosticForm.tsx` avec tokens sable/encre (grid col-5/6, folio N° 07, specs DL). **Préserver** logic Zod + honeypot + react-hook-form + webhook n8n + tests | `landing/DiagnosticForm.tsx` |
| 10 | `faq.tsx` | Réécrire `FaqSection.tsx` avec Accordion editorial v2 (folio N° 08, 9 Q). Garder `react-helmet-async` JSON-LD FAQPage | `landing/FaqSection.tsx` |
| 11 | `final-cta.tsx` | Réécrire `FooterCTABand.tsx` → `FinalCtaSection.tsx` (N° 09, logo décoratif oversized opacity 0.07, signature photo Brice + SignatureMark) | `landing/FinalCtaSection.tsx` |
| 12 | `site-footer.tsx` | Réécrire `components/Footer.tsx` (grid col-4/2/3/3, tagline "Fait à la main, à la machine", liens légaux). **Corrections obligatoires vs sablia-io** : (a) URL privacy `/politique-confidentialite` (pas `/confidentialite` qui est la route sablia-io), (b) email canonique **`brice@sablia.io`** (garder le choix sablia-site, pas `contact@sablia.io`), (c) **mettre à jour `Footer.test.tsx`** en même temps : les assertions "Calculateur ROI", "Cas clients" risquent de casser si sablia-io footer ne les inclut pas — adapter tests aux nouveaux liens ou préserver ces liens dans le nouveau footer | `components/Footer.tsx` + `Footer.test.tsx` |
| — | `CalculatorROI.tsx` (garde-sablia-site) | **Conserver** avec tokens sable/encre/tuile (propager nouveaux tokens dans classes Tailwind). Insérer entre Proof et DiagnosticForm dans le stack Landing | `landing/CalculatorROI.tsx` |
| — | `ClientLogosStrip.tsx` (garde-sablia-site) | **Supprimer** (non présent dans sablia-io, pas dans wireframe-v1) | — |
| — | **Port `lib/site.ts`** depuis sablia-io | **Nouveau fichier** `client/src/lib/site.ts` : centralise constantes produit (diagnosticPrice "490€ HT", diagnosticTurnaround, diagnosticCreditWindow, bookingUrl, iapreneursUrl, etc.). Permet aux nouvelles sections portées de lire `site.diagnosticPrice` au lieu de hardcoder. Webhook URLs restent dans `form-constants.ts` (compat analytics flow existant) | `lib/site.ts` |
| — | **Mettre à jour `inputClasses`** dans `form-constants.ts` | Doit utiliser les nouveaux tokens (ex: `border-sable-200 focus:border-tuile`) après Phase 3 fini. Pré-Phase 3 : garder intact grâce aux shims Phase 1. Update effectif en fin Phase 3 ou début Phase 5 | `lib/form-constants.ts` |

**Règle d'animation** : progressivement remplacer `framer-motion` par `Reveal` wrapper + classe `.reveal` / `.is-visible`. framer-motion reste disponible pour cas spécifiques (AnimatePresence accordion FAQ, mobile menu Navigation). Ne pas supprimer framer-motion du `package.json` — il sert aussi à `LpAutomatisation` et `LpAuditGratuit`.

**Verification Constraints** :

| Type | Target | Assertion | Method |
|------|--------|-----------|--------|
| file-exists | client/src/components/landing/FrictionSection.tsx | Friction section exists | test -f /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/landing/FrictionSection.tsx |
| file-exists | client/src/components/landing/OffersSection.tsx | Offers section exists | test -f /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/landing/OffersSection.tsx |
| file-exists | client/src/components/landing/AuthoritySection.tsx | Authority section exists | test -f /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/landing/AuthoritySection.tsx |
| file-exists | client/src/components/landing/MethodSection.tsx | Method section exists | test -f /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/landing/MethodSection.tsx |
| file-exists | client/src/components/landing/ProofSection.tsx | Proof section exists | test -f /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/landing/ProofSection.tsx |
| not-exists | client/src/components/landing/ProblemSection.tsx | Problem section removed (replaced by Friction) | ! test -f /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/landing/ProblemSection.tsx |
| not-exists | client/src/components/landing/ClientLogosStrip.tsx | ClientLogosStrip removed (not in wireframe v1) | ! test -f /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/landing/ClientLogosStrip.tsx |
| contains | client/src/components/landing/DiagnosticForm.tsx | Still uses Zod schema | grep -q 'diagnosticSchema' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/landing/DiagnosticForm.tsx |
| contains | client/src/components/landing/DiagnosticForm.tsx | Still posts to WEBHOOK_DIAGNOSTIC | grep -q 'WEBHOOK_DIAGNOSTIC' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/components/landing/DiagnosticForm.tsx |

**Validation finale Phase 3** : tous les composants créés/modifiés, tsc clean, tests DiagnosticForm 7/7 toujours verts, visual check via browser-verifier agent (snapshot homepage entière).

---

### Phase 4 — Stack Landing.tsx + validation infra intacte ✅ DONE 2026-04-20

**Objectif** : `Landing.tsx` reflète le 9-section stack final, l'infra tracking/consent/webhooks/routes est inchangée.

**Actions** :
1. [x] Réécrire `client/src/pages/Landing.tsx` : ordre exact Navigation → HeroSection → FrictionSection → OffersSection → AuthoritySection → WhatRevealsSection → MethodSection → ProofSection → CalculatorROI → DiagnosticForm (anchor `#diagnostic-form`) → FaqSection → FinalCtaSection → Footer.
2. [x] Conserver `<SEO page="/" />` et `<motion.div>` wrapper page transition.
3. [x] Lazy-load maintenu pour sections below-fold : ProofSection, CalculatorROI, FaqSection, FinalCtaSection. (MethodSection promu en eager — above-fold après scroll court.)
4. [x] `vite.config.ts` `manualChunks` — aucun changement requis (les sections ne sont pas listées, les chunks lazy sont créés automatiquement par Rollup : `CalculatorROI-*.js`, `FaqSection-*.js` visibles dans `dist/`).
5. [x] `App.tsx` inchangé (routes identiques, CookieConsentBanner intact, usePageTracking intact, Toaster intact, initGA4 gated on consent).
6. [x] Smoke test wiring : `CookieConsentBanner` appelle `setConsentState('accepted')` + `initGA4()` — `setConsentState('rejected')` ne charge pas gtag. Test manuel browser (action UX) déféré à Phase 6.
7. [x] Smoke test wiring webhook : `DiagnosticForm` POST → `WEBHOOK_DIAGNOSTIC` (`https://n8n.sablia.io/webhook/sablia-site-diagnostic`) confirmé. Live hit test déféré à Phase 6 (pollution prod évitée).

**Verification Constraints** :

| Type | Target | Assertion | Method |
|------|--------|-----------|--------|
| contains | client/src/pages/Landing.tsx | Imports FrictionSection | grep -q 'FrictionSection' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/pages/Landing.tsx |
| contains | client/src/pages/Landing.tsx | Imports AuthoritySection | grep -q 'AuthoritySection' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/pages/Landing.tsx |
| contains | client/src/pages/Landing.tsx | Imports MethodSection | grep -q 'MethodSection' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/pages/Landing.tsx |
| contains | client/src/pages/Landing.tsx | Still imports CalculatorROI | grep -q 'CalculatorROI' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/pages/Landing.tsx |
| contains | client/src/App.tsx | CookieConsentBanner still mounted | grep -q 'CookieConsentBanner' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/App.tsx |
| contains | client/src/lib/analytics.ts | Still exports diagnostic_form conversion | grep -q 'diagnostic_form' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/lib/analytics.ts |
| exit-code | npm run check | tsc clean | cd /home/sablia/workspace/projects/internal/websites/sablia-site && npm run check |
| exit-code | npm test | All tests pass | cd /home/sablia/workspace/projects/internal/websites/sablia-site && npm test -- --run 2>&1 \| grep -qE '[0-9]+ passed' |

**Validation finale Phase 4** : tsc clean, 12/12 tests passent (+ nouveaux primitives), `npm run build` OK, Landing.tsx rend 9 sections.

---

### Phase 5 — Pages secondaires + docs update

**Objectif** : les pages `/tarifs`, `/about`, `/faq`, `/cas-clients`, `/cgv`, `/confidentialite`, `/mentions-legales`, `/thank-you`, `/roi` adoptent les nouveaux tokens visuels (pas de refonte structurelle, juste palette/typo cohérentes).

**Actions** :
1. Propager tokens sable/encre/tuile dans classes Tailwind de chaque page (grep `sablia-navy`, `sablia-sienna`, `sablia-bg`, `sablia-accent`, remplacer par équivalents).
2. Pages légales : comparer avec sablia-io `/cgv`, `/confidentialite`, `/mentions-legales` — si sablia-io a des sections manquantes côté sablia-site (art. 293 B, n8n self-host mention RGPD), les ajouter.
3. Créer `legal-shell.tsx` component (wrap SiteHeader + header prose + SiteFooter) pour uniformiser les 3 pages légales (comme sablia-io).
4. Update `docs/INTEGRATIONS.md` : marquer WEBHOOK_DIAGNOSTIC comme prod-confirmé post-bascule.
5. Update `docs/meta-tags.json` : bump lastmod, vérifier description homepage contient positioning statement copy-v1 §C1.
6. Update `client/public/sitemap.xml` : bump lastmod sur pages modifiées.
7. Update `STATUS.md` : ajouter ligne "UX migration shipped" + nouvelle URL prod confirmée.
8. Update `CLAUDE.md` : section Stack mentionne Fraunces + tokens sable (anciennement navy/parchment).

**Verification Constraints** :

| Type | Target | Assertion | Method |
|------|--------|-----------|--------|
| contains | client/src/pages/CGV.tsx | Mentions art. 293 B CGI | grep -q '293 B' /home/sablia/workspace/projects/internal/websites/sablia-site/client/src/pages/CGV.tsx |
| contains | docs/meta-tags.json | LastUpdated is 2026-04-20 | grep -q '2026-04-20' /home/sablia/workspace/projects/internal/websites/sablia-site/docs/meta-tags.json |
| exit-code | npm run check | tsc clean post docs | cd /home/sablia/workspace/projects/internal/websites/sablia-site && npm run check |

**Validation finale Phase 5** : tsc clean, build OK, preview visuelle des 6 pages secondaires sur dev server.

---

### Phase 6 — Validation complète avant bascule

**Objectif** : tout vert localement + preview Vercel accepté, prêt pour bascule DNS.

**Actions** :
1. `npm run check` → 0 erreur TS
2. `npm test -- --run` → tous les tests passent (12 existants + nouveaux primitives)
3. `npm run build` → build production clean
4. `npm run lint` → 0 erreur Biome (warn acceptables sur code pré-existant)
5. Lighthouse local : `npx lighthouse http://localhost:5000 --only-categories=performance,accessibility,seo` → Performance ≥ 85, A11y ≥ 95, SEO ≥ 95
6. Push sur branche feature → Vercel génère preview URL (`sablia-site-*.vercel.app`)
7. Browser-verifier agent sur preview URL : snapshot accessibilité + screenshot homepage entière + comparaison visuelle vs sablia-io current
8. Manual smoke test sur preview URL :
   - Cookie consent banner visible en navigation privée
   - Accepter → GA4 fire (Network tab)
   - DiagnosticForm submit → webhook n8n reçoit payload (vérifier exécution workflow ID `mu9odNA8y54Pb4or` dans n8n UI)
   - Scroll smooth vers `#diagnostic-form` depuis Hero CTA
   - Calendly link ouvre nouvel onglet
   - Mobile 390px : menu hamburger, CTA primary above-fold

**Verification Constraints** :

| Type | Target | Assertion | Method |
|------|--------|-----------|--------|
| exit-code | build | Production build succeeds | cd /home/sablia/workspace/projects/internal/websites/sablia-site && npm run build 2>&1 \| grep -q 'built in' |
| exit-code | tsc | TypeScript clean | cd /home/sablia/workspace/projects/internal/websites/sablia-site && npm run check |
| exit-code | tests | All tests pass | cd /home/sablia/workspace/projects/internal/websites/sablia-site && npm test -- --run 2>&1 \| grep -E 'passed|Tests:' |
| preview-url | Vercel preview | Preview URL responds 200 | curl -sI -o /dev/null -w "%{http_code}" https://sablia-site-PREVIEW.vercel.app \| grep -q '200' |

**Validation finale Phase 6** : tout vert, preview validée visuellement par Brice avant Phase 7.

---

### Phase 7 — Bascule domaine sablia.io (irreversible-fast)

**Objectif** : le domaine `sablia.io` pointe vers le projet Vercel sablia-site. Rollback possible en < 5 min.

**Pré-requis** : Phase 6 validée, Brice a donné OK explicite pour la bascule.

**Actions** :
1. **Pre-flight audit domain type** : `vercel domains inspect sablia.io --scope brices-projects-c5e1ba72` → vérifier si `sablia.io` est configuré comme `Custom Domain` (projet-level) ou `Alias`. Si Custom Domain uniquement, `vercel alias set` ne suffira pas — il faudra passer par le dashboard en 2 étapes (remove from old / add to new). Documenter le résultat.
2. **Pré-génération du certificat SSL** (Brice manuel dashboard) : aller dans `vercel.com/team/brices-projects-c5e1ba72/sablia-site/settings/domains` et ajouter `sablia.io` en mode "Pending" (avant la bascule). Vercel commence la génération du cert Let's Encrypt en parallèle. Évite le délai de 2-8h de re-issuance observé sur la community.
3. Noter l'URL de deployment ACTUELLE du projet `sablia-io-preview` pour rollback : `vercel ls sablia-io-preview --scope brices-projects-c5e1ba72` → copier le deployment "Ready" le plus récent dans `tmp/rollback-url.txt`.
4. Noter l'URL de deployment du projet `sablia-site` à promouvoir en prod : `vercel ls sablia-site --scope brices-projects-c5e1ba72` → copier le deployment "Ready" le plus récent.
5. **Bascule** : `vercel alias set [sablia-site-deployment-url] sablia.io --scope brices-projects-c5e1ba72 --force` (flag `--force` obligatoire car domaine actuellement aliasé à l'autre projet, sinon error "domain already assigned"). < 30 secondes.
6. Vérification immédiate : `curl -sI https://sablia.io | grep -E "HTTP|x-vercel"` → doit répondre depuis le nouveau projet (header `x-vercel-id` contient le hash sablia-site).
7. Smoke test end-to-end en prod :
   - Homepage charge en Fraunces (vérifier via DevTools Network tab que `.woff2` Fraunces est chargé, pas fallback Times)
   - DiagnosticForm submit → n8n reçoit payload (vérifier workflow execution dans n8n UI)
   - GA4 Realtime dashboard reçoit pageview (après consent accept)
   - Navigation cross-page anchor : depuis `/about` cliquer "Diagnostic" → retour home + scroll `#diagnostic-form`
8. Dashboard Vercel (manuel Brice) : finaliser remove `sablia.io` du projet `sablia-io-preview` (si pas déjà retiré par `--force`).
9. Vérifier SSL cert : `curl -sI https://sablia.io | grep -i strict-transport` — doit être présent (cert pré-généré à l'étape 2).
10. Update `STATUS.md` : ligne "Site v2 shipped on sablia.io prod 2026-04-XX".

**Si `vercel domains inspect` révèle une config complexe (étape 1)** : fallback dashboard-only procedure :
- `vercel.com/team/.../sablia-io-preview/settings/domains` → Remove `sablia.io`
- `vercel.com/team/.../sablia-site/settings/domains` → Promote pending domain to Active
- Durée : 2-5 min. SSL cert préservé grâce à l'étape 2 pré-génération.

**ROLLBACK (si besoin, < 5 min)** :
```bash
vercel alias set $(cat tmp/rollback-url.txt) sablia.io
curl -sI https://sablia.io | grep x-vercel  # vérifier retour ancien projet
```

**Post-bascule** (out of scope de ce plan, à planifier séparément) :
- Archivage repo GitHub `BriGadja/sablia.io` (décision Brice)
- Supprimer dossier local `/home/sablia/workspace/projects/internal/websites/sablia-io/` (après Brice validation 7 jours)

**Verification Constraints** :

| Type | Target | Assertion | Method |
|------|--------|-----------|--------|
| http-status | https://sablia.io | Domain responds 200 | curl -sI -o /dev/null -w "%{http_code}" https://sablia.io \| grep -q '200' |
| header-contains | https://sablia.io x-vercel-id | Points to new project | curl -sI https://sablia.io \| grep -qi 'x-vercel' |
| file-exists | tmp/rollback-url.txt | Rollback URL saved | test -f /home/sablia/workspace/projects/internal/websites/sablia-site/tmp/rollback-url.txt |

**Validation finale Phase 7** : `https://sablia.io` charge la nouvelle homepage avec tracking fonctionnel.

---

## Validation Strategy

### Acceptance Criteria (hybrid AC-N format)

- **AC-1**: 9-section stack sablia-io intégré dans sablia-site avec tokens sable/encre/tuile | Type: binary | Verify: `grep -c 'Section' client/src/pages/Landing.tsx` returns ≥ 9
- **AC-2**: tsc + tests + build + lint passent sans régression | Type: binary | Verify: `npm run check && npm test -- --run && npm run build && npm run lint` exit 0 (lint warn acceptables)
- **AC-3**: Consent banner + GA4 + Google Ads conversions fonctionnent post-migration | Type: binary | Verify: sur preview URL, consent banner visible si localStorage vide + GA4 Realtime reçoit pageview après accept
- **AC-4**: Webhook diagnostic toujours reçoit payload en prod | Type: binary | Verify: curl POST vers n8n.sablia.io/webhook/sablia-site-diagnostic répond 200 + workflow mu9odNA8y54Pb4or execution OK
- **AC-5**: Lighthouse scores ≥ baseline | Type: scored (7/10) | Verify: Performance ≥ 85, A11y ≥ 95, SEO ≥ 95 sur preview URL
- **AC-6**: Domaine sablia.io pointe vers projet Vercel sablia-site avec SSL valide | Type: binary | Verify: `curl -sI https://sablia.io` renvoie 200 + header `x-vercel-id` contient hash sablia-site
- **AC-7**: Rollback testé et documenté | Type: binary | Verify: `tmp/rollback-url.txt` existe et contient URL deployment valide ancienne prod
- **AC-8**: Typo Fraunces chargée (pas de fallback sur serif générique) | Type: scored (7/10) | Verify: browser-verifier agent confirme que H1 est rendu en Fraunces Variable (pas Times New Roman ni Georgia)

### Iteration Protocol

Si une phase échoue :
1. Lire les logs (tsc error, test failure, build error)
2. Invoquer `/debug` si la root cause n'est pas évidente
3. Corriger dans le composant concerné
4. Relancer la validation phase
5. Si 3 échecs consécutifs sur la même phase → STOP et escalader à Brice (HITL)

## Risks & Mitigations

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Tokens Tailwind v3 cassent composants existants (pricing, calendly, LPs) | **High** | **Critical** | **Shims `sablia-*` → nouveaux CSS vars dans tailwind.config.ts durant Phases 2-4** (Phase 1 action 2). Tests smoke sur /tarifs, /gap, /lp avant Phase 3. Shims supprimés en Phase 5 après propagation manuelle. |
| Fraunces `wght.css` uniquement → SOFT/WONK/opsz axes silencieusement ignorés (CSS `font-variation-settings` tombe en fallback defaults) | Medium | Medium | Import racine `@fontsource-variable/fraunces` (pas `/wght.css`) qui expose tous les axes (Phase 1 action 7). |
| Fraunces CLS regression vs `next/font` baseline (FOUT sur H1 64px+) | Medium | Medium | `vite-plugin-fontaine` génère fallback metrics (size-adjust, ascent-override) — ajouté Phase 1 action 6. |
| `@fontsource/geist-sans` moins maintenu que `@fontsource/geist` | Low | Low | Utiliser `@fontsource/geist` (Phase 1 action 6). |
| Footer.test.tsx casse si nouveau footer retire "Calculateur ROI", "Cas clients", email "brice@sablia.io" | High | Low | Phase 3 item 12 : garder ces liens + email dans nouveau Footer OU mettre à jour `Footer.test.tsx` simultanément. |
| `inputClasses` dans form-constants.ts casse GapForm + LpAutomatisation après suppression shims Phase 5 | Medium | Medium | Phase 5 : mettre à jour `inputClasses` en premier avant remove shims. Verification constraint dédiée. |
| Double chargement fonts (Google Fonts Inter Tight + @fontsource Fraunces) | Medium | Low | Phase 1 action 8 : supprimer `<link>` Google Fonts de `client/index.html`. |
| Fraunces cause FOUT (flash of unstyled text) | Medium | Medium | Preload `<link>` dans index.html + `font-display: swap` (défaut fontsource). Vite `?url` pour hash stable. |
| Bascule DNS casse emails (MX records) | Low | Critical | Vérifier `dig sablia.io MX` AVANT bascule — Vercel alias ne touche pas aux MX. Si MX pointait vers Vercel (improbable), coordonner avec DNS provider. |
| Build Vercel échoue post-merge (lockfile, node_modules) | Low | High | Tester `npm ci && npm run build` localement avant push. Vercel utilise le même package-lock.json. |
| Tests Footer.test.tsx cassent si SiteFooter change structure | Medium | Low | Adapter Footer.test.tsx pendant Phase 3 item 12. Tests existants sont sur "Sablia" text + copyright + email link + legal links — structure préservée. |
| Consent banner ne fire plus après migration | Low | Critical | Phase 4 smoke test en dev + Phase 6 smoke test sur preview Vercel (Network tab confirme gtag load conditional). |
| Cross-page anchor `/#diagnostic-form` cassé après Navigation réécriture | Medium | Medium | Garder le handler cross-page que j'ai ajouté aujourd'hui dans Navigation.tsx (check location !== '/', setLocation + setTimeout 100ms scroll). |
| sablia-io a `lucide-react` import non utilisé → si on porte des SVG inline, bundle size check | Low | Low | Bundle visualizer via `rollup-plugin-visualizer` à Phase 6 (déjà configuré dans `vite.config.ts`). |

## Confidence

**7/10** — scope clair, recherche validée (3 agents), tokens/typo/Vercel maîtrisés. Risques principaux :
- Volume de sections à porter (13 composants + 3 primitives) — time-boxé, chaque section = 1 commit
- Décisions éditoriales HITL encore non 100% confirmées par Brice (témoignages Proof, ROI Calculator conservation) — défauts proposés dans le plan, override possible en pré-exécution
- Bascule DNS manuelle Vercel Dashboard (step 6 Phase 7) dépend de Brice login Vercel (pas d'automatisation possible par Claude)

Estimation totale : 6-10 heures d'exécution Claude Code + 30 min manuel Brice pour bascule Vercel.

## Challenge Report (2026-04-20)

### Iteration History

| Round | Agents spawned | BLOCKING | Actions applied | Key change |
|-------|---------------|----------|-----------------|------------|
| 1 | Verifier (sonnet) + Devil's Advocate (sonnet) + External Scout (sonnet) | 2 | 13 | Added shim layer for sablia-* tokens, slash-opacity audit, full-axes Fraunces import, vite-plugin-fontaine, Vercel --force + pre-generated SSL cert, removed Google Fonts links, inputClasses update ordering, Footer.test.tsx sync, lib/site.ts port, privacy URL correction, email canonical, grain stacking context warning, grep regex for test count |

### BLOCKING Issues resolved

**#1 Token rename scope vs LP preservation** (Devil's Advocate) — sablia-* tokens used 530× across 28 files including LPs. Removing them Phase 1 breaks LPs silently.
- **Fix applied** : Phase 1 Action 2 reformulated as ADDITIVE (not destructive). Shims `sablia-*` → new CSS vars (`"sablia-bg": "var(--color-sable)"`, etc.) maintained during Phases 2-4. Shims removed in Phase 5 after manual propagation. Dedicated verification constraint `grep -q '"sablia-bg"'` added.

**#2 Tailwind v4 slash opacity** (External Scout) — sablia-io may use `bg-sable/50` v4 syntax; v3 requires explicit palette entries.
- **Fix applied** : Phase 1 Action 1 is now a pre-flight audit (`grep -oE '/[0-9]+'` sur sablia-io components). Tailwind v3.4 supporte slash opacity (disponible depuis v3.0), le pre-flight vérifie juste que la palette cible couvre les shades nommées utilisées. Downgraded to RISK — plan structurellement OK.

### Top RISKs addressed

- **Footer.test.tsx breakage** (Dev Adv #3, #13) → Phase 3 item 12 mentione explicitement l'update simultané + choix email canonique
- **Fraunces axes silencieusement ignorés** (Dev Adv #2, Scout #8) → import racine `@fontsource-variable/fraunces` vs `/wght.css`
- **CLS regression vs next/font** (Scout #4) → `vite-plugin-fontaine` ajouté aux deps Phase 1
- **Vercel alias `--force` flag** (Verifier #4, Scout Vercel) → commande corrigée Phase 7 action 5
- **SSL cert 2-8h re-issuance risk** (Scout #5) → pré-génération côté projet sablia-site avant alias switch (Phase 7 action 2)
- **Google Fonts + fontsource double loading** (Dev Adv #7) → Phase 1 action 8 supprime les `<link>` Google Fonts
- **Grain SVG + framer-motion stacking context** (Dev Adv #8) → warning Phase 1 action 11 + fallback `PaperGrain` composant fixed
- **inputClasses casse GapForm/LP post shims** (Dev Adv #6) → nouvelle entrée mapping table Phase 3 + constraint dédiée
- **`@fontsource/geist-sans` vs `@fontsource/geist`** (Verifier #8) → corrigé vers `@fontsource/geist`
- **Privacy URL mismatch `/confidentialite` vs `/politique-confidentialite`** (Dev Adv #5) → Phase 3 item 12 précise la route sablia-site

### Verdict

**GO** — 0 BLOCKING après auto-apply Round 1. Toutes les objections structurelles ont été adressées avec des mitigations concrètes et des verification constraints dédiées. Le plan est prêt pour `/execute`.

**Recommandation pour Round 2** : skip (context economy). Les fixes sont mécaniques et vérifiables via VERIMAP à l'exécution. Si Brice veut une validation par regard neuf, invoquer `/challenge sablia-site-ux-migration` dans une session fraîche — Round 2 externe.

**Déférés (non-BLOCKING, pour exécution)** :
- HITL #1 : Témoignages Proof réels vs placeholders (défaut plan : placeholders jusqu'à consent clients — voir STATUS.md P4.3)
- HITL #2 : Conservation ROI Calculator (défaut plan : GARDER — différentiateur frozen spec)
- HITL #3 : Section Authority porter ou non (défaut plan : PORTER — validée post-freeze dans sablia-io)

Brice peut override ces 3 défauts en début Phase 3 sans invalider le plan.

## Handoff

- [x] Plan challenged (integrated /plan shadow challenge — 1 round, 2 BLOCKING resolved)

**Next step after plan GO**: `/execute sablia-site-ux-migration` (nouvelle session ouverte dans `/home/sablia/workspace/projects/internal/websites/sablia-site`)
