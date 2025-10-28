# INITIAL - Refonte Graphique V3 : Sablia Landing Page Premium

## FEATURE:

Transformer la landing page Sablia (LandingV2) en une expérience web sophistiquée, professionnelle et engageante qui évoque compétence, sobriété et innovation technique. Cette refonte v3 doit combler les gaps critiques identifiés entre l'état actuel et les standards d'excellence B2B 2025.

### Objectifs principaux

1. **Design Sophistiqué & Moderne**
   - Implémenter gradients subtils Navy→Electric Blue comme recommandé dans le guide de design
   - Typographie oversized audacieuse (72px hero headlines) avec hiérarchie Swiss-style
   - Whitespace généreux (80px entre sections, system 8px base)
   - Micro-interactions purposeful sur tous les éléments interactifs

2. **Animations Fluides & Performantes**
   - Framer Motion pour fade-in on scroll, staggered children, hover states
   - GSAP ScrollTrigger pour parallax subtil et reveals progressifs
   - Counter animations dans calculateur ROI
   - Background animé avec particules (inspiration chatflowai.co) optionnel
   - **Impératif**: Toutes animations GPU-accelerated (transform/opacity uniquement)

3. **Social Proof Authentique**
   - Remplacer logos "Client 1-8" par vrais logos clients ou descriptions secteur
   - Intégrer 5 vrais témoignages depuis Testimonials.md avec photos et métriques
   - Carousel testimonials avec navigation intuitive

4. **Grille Tarifaire Complète**
   - Ajouter tous les services manquants de la grille officielle 2025
   - Anchoring psychologique (affichage droite→gauche sur desktop)
   - CTAs différenciés par funnel stage (TOFU/MOFU/BOFU)
   - Transparence radicale comme différenciateur clé

5. **Copywriting Spécifique & Concret**
   - Éliminer buzzwords vagues ("solutions intelligentes", "transformation à l'échelle")
   - Exemples ultra-concrets ("Sync Shopify→Amazon→WooCommerce 24/7")
   - Métriques chiffrées partout ("ROI 320%", "15h/semaine gagnées")

### Résultats attendus

- **Perception professionnelle**: 5/10 → 9/10
- **Temps sur page**: 2min → 4-5min
- **Scroll depth**: 50% → 70%+
- **Taux de conversion lead**: 3% → 8-12%
- **Taux de rebond**: 60% → <40%

## EXAMPLES:

### Documents de référence absolus

1. **`refonte_graphique/Design professionnel pour Sablia _ Guide complet pour une landing page primée.md`**
   - Palette chromatique exacte à suivre (Navy #0A2463, Electric Blue #3E92CC, Cyan #52D1DC)
   - Scale typographique précise (72/48/32/24/18px avec Inter)
   - Spacing system (base 8px, sections 80px)
   - Patterns d'animations (sous 300ms, GPU-accelerated)
   - Les 7 tendances B2B 2025 à respecter
   - Analyse de 8 sites Awwwards lauréats

2. **`refonte_graphique/Guide Complet _ Refonte du Site Sablia.md`**
   - Architecture 3-pathways (Découvrir/Transformer/Réaliser)
   - Headlines qui convertissent (formules testées)
   - CTAs performants par funnel stage
   - Frameworks narratifs (StoryBrand, Before/After Grid)
   - Gestion objections et microcopy stratégique

3. **`refonte_graphique/📋 RÉSUMÉ COMPLET - GRILLE TARIFAIRE SABLIA 2025.md`**
   - CRITIQUE: Liste exhaustive de TOUS les services à afficher
   - Services de Découverte: Appel gratuit, Audit Express 350€
   - Diagnostic IA: PME 4 500€, ETI 8 000-15 000€ (**MANQUANTS ACTUELLEMENT**)
   - Formations: 4 niveaux de 700€ à 3 300€ (**MANQUANTS ACTUELLEMENT**)
   - Développement: Workflow Simple 2 500-5 000€, Système Standard 8 000-18 000€, Transformation 25 000-60 000€
   - Retainers: 3 niveaux de 1 500€ à 5 000€/mois (**MANQUANTS ACTUELLEMENT**)
   - Règles d'affichage (prix + ROI, fourchettes transparentes, exemples concrets)

4. **`refonte_graphique/Testimonials.md`**
   - 5 témoignages clients réels prêts à intégrer:
     - Hélène (GirlsGang): 90% temps économisé sur génération menus
     - Entreprise confidentielle: Veille concurrentielle transformative
     - Yassine (Norloc): Agent vocal + CRM, taux conversion boostés
     - Valentin (Stefano/Exotic Design): Réactivation BDD avec agents vocaux
     - Amir (BTP): Gestion interventions automatisée
   - Versions longues et courtes disponibles

5. **`refonte_graphique/revue_refonte_v1.md`**
   - Diagnostic brutal des manques actuels
   - Plan d'action 3 semaines détaillé
   - Exemples de code concrets (Hero animé, calculateur avec counter)
   - Checklist validation finale

### Code existant à améliorer (ne PAS réécrire de zéro)

**Structure actuelle à conserver:**
- `client/src/pages/LandingV2.tsx` - Page principale bien structurée
- `client/src/components/v2/` - 15 composants isolés et réutilisables

**Composants nécessitant enrichissements:**

1. **`Hero.tsx`** - À enrichir avec:
   - Gradient animé background (Navy→Electric Blue)
   - Typographie 72px Inter Bold sur H1
   - Parallax subtil (max 20% scroll)
   - Animations Framer Motion (fade-in, stagger CTAs)
   - Microcopy sous CTAs

2. **`LogosCloud.tsx`** - À remplacer:
   - Supprimer "Client 1-8" génériques
   - Intégrer vrais logos ou "Leader SaaS B2B", "Scale-up FinTech 50M€ CA"
   - Minimum 6-8 logos/descriptions crédibles

3. **`TestimonialCarousel.tsx`** - À compléter:
   - Intégrer 5 vrais testimonials depuis Testimonials.md
   - Photos clients (ou avatars élégants si photos indisponibles)
   - Métriques chiffrées en highlight ("90% temps économisé")
   - Navigation carousel fluide avec animations

4. **`PricingGrid.tsx`** - À compléter massivement:
   - Ajouter section "Diagnostic IA" (PME 4 500€, ETI 8-15K€)
   - Ajouter section "Formations" (4 niveaux: 700€, 1 200€, 2 200€, 3 300€)
   - Ajouter section "Retainers" (3 niveaux: 1 500€, 2 500€, 3 000-5 000€)
   - Anchoring: afficher premium d'abord sur desktop (droite→gauche)
   - Badge "PLUS POPULAIRE" sur options cibles
   - ROI attendu affiché pour chaque service

5. **`PricingPathways.tsx`** - À vérifier cohérence:
   - Assurer alignement avec grille tarifaire complète
   - CTAs différenciés par pathway (TOFU/MOFU/BOFU)

6. **`CalculatorROI.tsx`** - À animer:
   - Counter animation progressive (animate 0→targetValue sur 2s)
   - Pas de changement instantané, effet "compteur qui monte"
   - Micro-feedback visuel lors des interactions slider

7. **`ThreeStepProcess.tsx`** - À animer:
   - Reveal progressif au scroll (whileInView)
   - Stagger entre les 3 étapes (délai 0.2s entre chaque)
   - Icons animés subtils

8. **`SolutionSection.tsx`** (3 piliers différenciateurs) - À animer:
   - Stagger children animations
   - Hover states sophistiqués sur cards
   - Icons animés (rotate, bounce léger)

9. **`ProblemSection.tsx`** - À améliorer copywriting:
   - Remplacer abstractions par exemples concrets
   - Métriques chiffrées (40% temps, 8 outils, 30% erreurs)

10. **`FaqSection.tsx`** - À enrichir:
    - Ajouter questions pricing si manquantes
    - Animations smooth expand/collapse
    - Microcopy rassurant

### Sites benchmarks analysés (ne PAS copier, s'inspirer)

**leftclick.ai:**
- ✅ Minimalisme extrême avec impact fort
- ✅ Typographie oversized audacieuse
- ✅ CTA "Let's talk" omniprésent (6+ fois)
- ✅ Sections numérotées claires (01, 02, 03...)
- ✅ Background gris avec effet parallax subtil vertical
- ❌ Trop austère pour notre cible (nous devons être plus chaleureux)
- **À adopter**: Répétition CTA, numérotation sections, typographie grande

**chatflowai.co:**
- ✅ Background noir avec gradient vert lumineux central = effet "wow"
- ✅ Animations particules/étoiles subtiles
- ✅ Processus en 5 étapes visuellement engageant
- ✅ Emojis utilisés stratégiquement (2-3 max, pas dans CTAs)
- ✅ Tabs interactifs pour tarifs (Basique/Pro/Devis)
- ❌ Trop d'emojis pour notre positionnement B2B premium
- **À adopter**: Gradient lumineux effet, animations background, tabs pricing

**Différenciation Sablia vs concurrents:**
- ✅ Transparence tarifaire complète (vs 82% du marché qui cache)
- ✅ Approche formation-first (vs implémentation pure)
- ✅ Stack souverain n8n (vs vendor lock-in)
- ✅ Plus chaleureux que LeftClick, plus sobre que ChatflowAI

## DOCUMENTATION:

### Design System Officiel Sablia

**Palette Chromatique (strictement respecter):**
```css
/* Couleurs Primaires */
--navy-blue: #0A2463;      /* Trust, stabilité - Headlines, texte important */
--electric-blue: #3E92CC;  /* Innovation, tech - Liens, éléments secondaires */
--cyan-accent: #52D1DC;    /* Action - CTAs principaux, highlights */

/* Neutres */
--white: #FFFFFF;          /* Backgrounds principaux */
--off-white: #F8F9FA;      /* Sections alternées, réduit fatigue */
--charcoal: #2D3142;       /* Texte body */

/* Gradients */
--gradient-hero: linear-gradient(45deg, #0A2463 0%, #3E92CC 100%);
--gradient-section: linear-gradient(135deg, #0A2463 0%, #3E92CC 100%);
```

**Typographie Scale (Inter partout):**
```css
/* Headlines */
--h1-hero: 72px/1.1 Inter Bold;      /* Hero uniquement */
--h2-section: 48px/1.2 Inter Bold;   /* Section headers */
--h3-subsection: 32px/1.3 Inter Bold;
--h4-card: 24px/1.4 Inter Bold;

/* Body */
--body-large: 18px/1.6 Inter Regular;
--body-default: 16px/1.5 Inter Regular;
--small: 14px/1.4 Inter Regular;

/* Responsive adjustments */
@media (max-width: 768px) {
  --h1-hero: 48px/1.2;
  --h2-section: 36px/1.3;
}
```

**Spacing System (base 8px):**
```css
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 32px;
--space-xl: 48px;
--space-2xl: 64px;
--space-3xl: 80px;  /* Entre sections majeures */

/* Component padding */
--card-padding: 32px;
--section-padding-y: 80px;
--section-padding-x: 24px;

/* Grid */
--grid-gap: 24px;
--grid-columns: 12;
```

**Animations Guidelines:**

```typescript
// Framer Motion Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerChildren = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: {
    staggerChildren: 0.2,
    delayChildren: 0.1
  }
};

const hoverScale = {
  whileHover: {
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(82,209,220,0.3)",
    transition: { duration: 0.3 }
  },
  whileTap: { scale: 0.98 }
};

// GSAP ScrollTrigger pour parallax
gsap.to(heroElement, {
  y: () => window.innerHeight * 0.2,
  ease: "none",
  scrollTrigger: {
    trigger: heroElement,
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

// Counter animation (calculateur ROI)
import { animate } from "framer-motion";

animate(0, targetValue, {
  duration: 2,
  ease: "easeOut",
  onUpdate: (value) => setDisplayValue(Math.round(value))
});
```

**Règles Accessibilité (WCAG 2.1 AA minimum):**
```css
/* Contraste minimum 4.5:1 */
/* Navy sur blanc: 9.2:1 ✓ */
/* Cyan sur navy: 4.6:1 ✓ */

/* Prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Touch targets minimum 48x48px */
button, a[role="button"] {
  min-height: 48px;
  min-width: 48px;
}
```

### Documentation Technique

**Framer Motion (déjà installé):**
- Doc officielle: https://www.framer.com/motion/
- Guide animations: https://www.framer.com/motion/animation/
- Gestures: https://www.framer.com/motion/gestures/
- Scroll animations: https://www.framer.com/motion/scroll-animations/

**GSAP + ScrollTrigger (à installer):**
```bash
npm install gsap
```
- Doc GSAP: https://greensock.com/docs/
- ScrollTrigger: https://greensock.com/docs/v3/Plugins/ScrollTrigger
- Demos: https://greensock.com/st-demos/

**React Hook Form + Zod (déjà en place):**
- Pattern existant à suivre pour formulaires
- Validation Zod schemas pour tous inputs

**Tailwind CSS:**
- Utiliser utility classes existantes
- Éviter CSS custom sauf pour animations complexes
- Respecter le design system (couleurs, spacing)

### Stack Technique Actuel

```json
{
  "frontend": "React 18 + TypeScript + Vite",
  "routing": "Wouter",
  "ui": "Radix UI + shadcn/ui components",
  "styling": "Tailwind CSS + Tailwind Animate",
  "state": "React Query (TanStack Query)",
  "forms": "React Hook Form + Zod",
  "animations": "Framer Motion (installé) + à ajouter: GSAP"
}
```

## OTHER CONSIDERATIONS:

### Priorisation d'Implémentation (3 Semaines)

**SEMAINE 1: Design & Animations Fondamentales (Impact Max)**

Jour 1-2: Design System
- [ ] Créer fichier `design-tokens.css` avec toutes variables
- [ ] Implémenter gradient hero Navy→Electric Blue
- [ ] Ajuster typographie scale (H1 72px, H2 48px, etc.)
- [ ] Whitespace system (80px sections, 32px cards)
- [ ] Tester contraste accessibilité

Jour 3-4: Animations Core
- [ ] Installer GSAP: `npm install gsap`
- [ ] Hero: Gradient animé + parallax subtil
- [ ] Fade-in sections avec Framer Motion `whileInView`
- [ ] Hover states sur tous boutons (scale 1.02, shadow)
- [ ] Navigation sticky avec blur background au scroll

Jour 5-7: Micro-interactions
- [ ] Cards services avec tilt/lift au hover
- [ ] Icons animés (rotate, bounce) dans 3 piliers
- [ ] Processus 3-étapes reveal progressif
- [ ] Counter animation dans CalculatorROI
- [ ] Scroll indicator animé dans hero
- [ ] Tester `prefers-reduced-motion`

**SEMAINE 2: Social Proof & Contenu (Crédibilité)**

Jour 8-9: Testimonials Authentiques
- [ ] Intégrer 5 vrais témoignages depuis Testimonials.md
- [ ] Photos clients ou avatars élégants professionnels
- [ ] Métriques en highlight ("90% temps économisé")
- [ ] Carousel navigation fluide avec animations
- [ ] Indicateurs pagination (dots) actifs

Jour 10-11: Logos & Crédibilité
- [ ] Remplacer "Client 1-8" par vrais logos OU descriptions
- [ ] "Leader SaaS B2B", "Scale-up FinTech 50M€", "PME Industrie 100 pers"
- [ ] Layout grid responsive (4 cols desktop, 2 tablet, 1 mobile)
- [ ] Grayscale logos avec hover couleur

Jour 12-14: Copywriting Spécifique
- [ ] Audit complet des buzzwords à éliminer
- [ ] Remplacer par exemples concrets ("Sync Shopify→Amazon")
- [ ] Ajouter métriques chiffrées partout (ROI 320%, 15h/semaine)
- [ ] Microcopy rassurant sous CTAs ("30 min, zéro engagement")
- [ ] Headlines problème-first (vs capabilities-first)

**SEMAINE 3: Tarification Complète & Optimisations (Conversion)**

Jour 15-17: Grille Tarifaire Exhaustive
- [ ] Section Diagnostic IA: PME 4 500€, ETI 8-15K€
- [ ] Section Formations: 4 niveaux (700€, 1 200€, 2 200€, 3 300€)
- [ ] Section Retainers: 3 niveaux (1 500€, 2 500€, 3-5K€)
- [ ] Anchoring: Affichage droite→gauche sur desktop
- [ ] Badge "PLUS POPULAIRE" sur options cibles
- [ ] ROI attendu affiché pour CHAQUE service
- [ ] Exemples concrets pour CHAQUE niveau

Jour 18-19: CTAs Optimisés par Funnel Stage
- [ ] TOFU: "Télécharger Guide ROI Automation"
- [ ] MOFU: "Calculez VOTRE ROI", "Audit gratuit"
- [ ] BOFU: "Planifions votre transformation"
- [ ] Microcopy différencié par stage
- [ ] Exit-intent modal avec offre entrée (Appel gratuit)

Jour 20-21: Testing & Validation Finale
- [ ] Build production: `npm run build` (must succeed)
- [ ] TypeScript check: `npm run check` (zero errors)
- [ ] Test Lighthouse: Score 90+ performance, accessibility, SEO
- [ ] Validation Playwright visuelle (screenshots comparaison)
- [ ] Test mobile vrais devices (iOS + Android)
- [ ] Test `prefers-reduced-motion`
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)

### Pièges Mortels à Éviter Absolument

**Design & Visuel:**
- ❌ **Emojis overuse**: Max 0-2 par page B2B. JAMAIS dans CTAs, navigation, headlines
- ❌ **Gradients oversaturés**: Rester monochromatic ou analogous uniquement
- ❌ **Photos stock génériques**: Équipe diverse souriante, handshakes = RED FLAG
- ❌ **Cluttered design**: Plus de 4-5 couleurs, plus de 3 fontes = confusion
- ❌ **Zero whitespace**: Contenu doit respirer (80px entre sections obligatoire)

**Animations & Performance:**
- ❌ **Animer width/height/top/left**: Trigger layout/paint = lag. GPU only (transform/opacity)
- ❌ **Animations trop rapides (<200ms) ou lentes (>800ms)**: Sweet spot 300-600ms
- ❌ **Oublier prefers-reduced-motion**: Accessibilité critique, tests obligatoires
- ❌ **Background videos lourds**: Max 2MB, fallback image requis
- ❌ **Parallax excessif**: Max 20% scroll, peut déclencher vertiges

**Contenu & Copywriting:**
- ❌ **Phrases IA clichés**: "delve into", "ever-evolving landscape", "game-changer"
- ❌ **Buzzword bingo**: synergy, ecosystem, paradigm shift, thought leadership
- ❌ **Témoignages génériques**: Initiales (SD, ML) ou "Un client satisfait" = 0 crédibilité
- ❌ **Métriques vagues**: "Très efficace", "ROI excellent" vs "ROI 320%", "15h/semaine"
- ❌ **Value prop cachée**: Visiteur doit comprendre "ce que vous faites" en 10s max

**Tarification & Conversion:**
- ❌ **Tout en "Nous contacter"**: 70% acheteurs B2B abandonnent sites opaques
- ❌ **Prix seuls sans contexte**: Toujours accompagner de ROI attendu, exemples
- ❌ **Navigation 7+ items**: Paralysie décisionnelle, max 5-6 items
- ❌ **CTAs génériques partout**: "En savoir plus", "Nous contacter" = faible conversion
- ❌ **Formulaires longs sans microcopy**: Friction maximale, abandon garanti

### Validation Visuelle Obligatoire (comme CLAUDE.md)

**Avant CHAQUE commit sur LandingV2:**

```bash
# 1. Démarrer serveur dev
npm run dev

# 2. Ouvrir Playwright et naviguer
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv2" })

# 3. Capturer état actuel
mcp__playwright__browser_take_screenshot({ filename: "refonte-v3-[feature].png" })

# 4. Optionnel: Snapshot accessibilité
mcp__playwright__browser_snapshot()
```

**Checklist validation visuelle:**
- [ ] Gradient hero visible et subtil
- [ ] Typographie oversized (72px H1) lisible
- [ ] Animations fluides 60fps
- [ ] Hover states fonctionnels
- [ ] Pas d'emojis dans CTAs
- [ ] Logos clients crédibles
- [ ] Testimonials avec photos/noms
- [ ] Tous services tarifaires affichés
- [ ] Mobile responsive parfait
- [ ] Aucun contenu qui déborde

### Métriques de Succès Post-Refonte

**Objectifs Quantifiés:**

| Métrique | Avant (V2 actuelle) | Cible (V3 refonte) | Méthode mesure |
|----------|---------------------|-------------------|----------------|
| Temps sur page | ~2 min | 4-5 min | Google Analytics |
| Taux rebond | ~60% | <40% | Google Analytics |
| Scroll depth | ~50% | >70% | GA + Hotjar |
| Conversion lead | ~3% | 8-12% | Formulaires + Calendly |
| Perception "pro" | 5/10 | 9/10 | Survey post-démo |
| Mobile speed (Lighthouse) | ? | 90+ | Lighthouse CI |
| Accessibility score | ? | 95+ | Lighthouse + axe |

**Signaux Qualitatifs:**
- ✅ Commentaires prospects: "Wow, site pro"
- ✅ Durée sessions sales qualifiées augmente
- ✅ Taux fermeture deals améliore (cycle plus court)
- ✅ Équipe fière de partager le lien site

### Git Workflow (comme spécifié dans CLAUDE.md)

**Pour LandingV2, push direct sur main autorisé après validation:**

```bash
# 1. Validation visuelle Playwright (voir ci-dessus)

# 2. Build production
npm run build  # Must succeed

# 3. Type checking
npm run check  # Zero errors

# 4. Commit et push
git add client/src/pages/LandingV2.tsx client/src/components/v2/*
git commit -m "feat(landing): Refonte v3 - [description spécifique]

- [Changement 1 avec métrique si applicable]
- [Changement 2]
- [Design compliance: emoji count, contrast ratios, etc.]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

### Performance Budgets (CI/CD)

```json
{
  "budgets": {
    "javascript": "< 100kb initial load",
    "css": "< 50kb",
    "fonts": "< 100kb (Inter woff2)",
    "images": "< 500kb total (lazy loaded)",
    "animations": "< 50kb (Framer + GSAP)",
    "total_bundle": "< 300kb"
  },
  "metrics": {
    "FCP": "< 1.8s",
    "LCP": "< 2.5s",
    "FID": "< 100ms",
    "CLS": "< 0.1",
    "TTI": "< 3.8s"
  }
}
```

### Ressources Supplémentaires

**Inspirations Design (ne PAS copier):**
- Igloo Inc (Awwwards 2024 SOTY): Sophistication technique démontrée
- Kriss.ai: IA centrée humain, concept dollhouse
- Inkfish: Minimalisme extrême, typographie editorial
- Shopify Plus: Enterprise sans ennui, couleurs chaudes

**Outils Recommandés:**
- Figma (si maquettes nécessaires): figma.com
- Coolors (palettes): coolors.co
- Type Scale: typescale.com
- Contrast Checker: webaim.org/resources/contrastchecker/
- Can I Use: caniuse.com (compatibilité animations)

**Learning Resources:**
- Framer Motion tutorials: youtube.com/@samselikoff
- GSAP ScrollTrigger demos: codepen.io/GreenSock
- B2B landing page teardowns: growthunhinged.com
- Conversion optimization: cxl.com/blog

---

## VALIDATION FINALE AVANT EXÉCUTION

**Ce fichier INITIAL_refonte_v3.md est maintenant prêt pour:**

```bash
/generate-prp INITIAL_refonte_v3.md
```

**Le PRP généré devra inclure:**
1. ✅ Tous les composants v2 à modifier avec code snippets
2. ✅ Liste exhaustive des services tarifaires à ajouter
3. ✅ 5 testimonials réels à intégrer (depuis Testimonials.md)
4. ✅ Design tokens CSS complets
5. ✅ Animations Framer Motion + GSAP avec exemples
6. ✅ Validation gates (build, type check, Playwright, Lighthouse)
7. ✅ Checklist 3 semaines avec todo items actionnables

**Confidence Score Attendu: 9/10**
- Context complet: design guide + grille tarifaire + testimonials + benchmarks
- Code existant analysé: 15 composants v2 + LandingV2.tsx
- Exemples concrets: animations, gradients, pricing display
- Validation: Playwright + Lighthouse + accessibilité
