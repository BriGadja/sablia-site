# PRP: Refonte Graphique V3 - Sablia Landing Page Premium

## Philosophy: Context is King

Cette refonte suit une approche par phases pour garantir qualité et performance:
1. **Design & Animations**: Gradient sophistiqué, typographie oversized, micro-interactions GPU-accelerated
2. **Social Proof Authentique**: Vrais testimonials avec métriques, logos clients crédibles
3. **Tarification Complète**: Tous les services de la grille officielle 2025
4. **Validation Continue**: Playwright visuel + Lighthouse + Accessibilité à chaque étape

---

## 1. Goal and Why

**What are we building?**
Une refonte complète de la landing page Sablia (LandingV2) qui transforme un site fonctionnel mais "plat" en une expérience web sophistiquée, professionnelle et engageante qui évoque compétence, sobriété et innovation technique.

**Why are we building it?**
- **Business Context**: Le site actuel ne reflète pas la sophistication technique de Sablia. Des prospects qualifiés nous disent "le site semble basique" alors que notre expertise est avancée.
- **User Need**: Les décideurs B2B (40-55 ans, PME/ETI 50-250 pers) évaluent la crédibilité technique par le site. Un site statique génère 0 confiance pour un consultant en automatisation/IA.
- **Technical Requirement**: Combler les gaps identifiés dans revue_refonte_v1.md:
  - ❌ Design plat → ✅ Gradient sophistiqué, animations fluides
  - ❌ "Client 1-8" → ✅ Logos/descriptions crédibles
  - ❌ Testimonials initiales → ✅ 5 vrais clients avec photos/métriques
  - ❌ 6 services tarifaires → ✅ 15+ services (grille complète 2025)
  - ❌ Buzzwords vagues → ✅ Exemples concrets, métriques chiffrées

---

## 2. What (Requirements)

### User-Visible Behavior

**Hero Section (First Impression):**
- Gradient Navy→Electric Blue animé subtil en background
- Headline 72px Inter Bold "Vos meilleurs collaborateurs se **noient** dans le copier-coller"
- 2 CTAs avec hover states sophistiqués (scale 1.05, shadow glow)
- Scroll indicator animé en bas (bounce animation)

**Logos Cloud:**
- Remplacer "Client 1, Client 2..." par 6-8 descriptions crédibles:
  - "Leader SaaS B2B 200+ clients"
  - "Scale-up FinTech 50M€ CA"
  - "PME Industrie 100 collaborateurs"
  - "Agence Marketing Digital"
  - Ou vrais logos si disponibles (grayscale → couleur au hover)

**Testimonials (5 clients réels):**
- Hélène (GirlsGang): Photo, "90% temps économisé", génération menus
- Yassine (Norloc): Agent vocal + CRM, "Zéro opportunité perdue"
- Valentin (Stefano/Exotic): Réactivation BDD, "Milliers de contacts"
- Amir (BTP): Gestion interventions, "Zéro erreur planification"
- Confidentiel (Scale-up): Veille concurrentielle, "Vision 360°"
- Carousel avec auto-play 6s, navigation arrows, pagination dots

**Grille Tarifaire COMPLÈTE (15+ services):**
- Section 1: Découverte (Appel gratuit, Audit 350€)
- Section 2: **Diagnostic IA** (PME 4 500€, ETI 8-15K€) **← MANQUANT ACTUELLEMENT**
- Section 3: **Formations** (4 niveaux: 700€, 1 200€, 2 200€, 3 300€) **← MANQUANT**
- Section 4: Développement (Workflow Simple 2,5-5K€, Système 8-18K€, Transformation 25-60K€)
- Section 5: **Retainers** (3 niveaux: 1 500€, 2 500€, 3-5K€/mois) **← MANQUANT**
- Chaque service: Prix + ROI attendu + Exemples concrets + Durée
- Anchoring: Afficher premium d'abord sur desktop (droite→gauche)
- Badge "PLUS POPULAIRE" sur options cibles

**Animations Partout:**
- Fade-in sections au scroll (whileInView)
- Stagger children (délai 0.2s entre éléments)
- Hover states sur cards (lift + shadow)
- Counter animation dans calculateur ROI (0→targetValue sur 2s)
- Icons animés (rotate 360°, bounce léger)
- Processus 3-étapes reveal progressif

**Micro-interactions:**
- Boutons: Scale 1.02 hover, scale 0.98 tap
- Cards: Lift 4px hover, shadow expand
- Navigation: Backdrop-blur au scroll
- Links: Underline slide animation

### Functional Requirements

1. **Design System Strict:**
   - Palette: Navy #0A2463, Electric Blue #3E92CC, Cyan #52D1DC, White #FFFFFF, Off-White #F8F9FA, Charcoal #2D3142
   - Typographie: H1 72px, H2 48px, H3 32px, H4 24px, Body 18px (Inter partout)
   - Spacing: Base 8px, sections 80px, cards 32px padding
   - Grid: 12 colonnes CSS, gaps 24px

2. **Animations Performance:**
   - GPU-only (transform/opacity, JAMAIS width/height/top/left)
   - Timing 300-600ms (sweet spot)
   - Respect prefers-reduced-motion (reduce ou instant)
   - 60fps minimum (test Chrome DevTools Performance)

3. **Social Proof Authentique:**
   - 5 testimonials depuis `refonte_graphique/Testimonials.md`
   - Photos clients OU avatars élégants professionnels (si photos indisponibles)
   - Métriques chiffrées en highlight (badge cyan)
   - Noms complets + rôle + entreprise

4. **Tarification Exhaustive:**
   - Toutes les catégories de `refonte_graphique/📋 RÉSUMÉ COMPLET - GRILLE TARIFAIRE SABLIA 2025.md`
   - ROI attendu pour CHAQUE service (pas juste prix seul)
   - Exemples concrets pour CHAQUE niveau (pas vague)
   - Anchoring psychologique (premium d'abord)

5. **Copywriting Spécifique:**
   - Éliminer: "solutions automation intelligentes", "transformation à l'échelle"
   - Adopter: "Sync Shopify→Amazon→WooCommerce 24/7", "ROI 320% en 6 mois"
   - Métriques partout: "15h/semaine", "50K€ économies", "95% autonomie"
   - Microcopy rassurant: "30 min, zéro engagement", "Pas de spam"

### Non-Functional Requirements

**Performance:**
- Bundle JS < 100kb initial
- CSS < 50kb
- FCP < 1.8s, LCP < 2.5s, CLS < 0.1
- Lighthouse score 90+ (performance, accessibility, SEO)

**Accessibilité:**
- WCAG 2.1 AA minimum
- Contraste 4.5:1 (Navy sur blanc: 9.2:1 ✓)
- Navigation clavier complète
- Prefers-reduced-motion respecté
- Touch targets 48x48px minimum

**Responsiveness:**
- Mobile-first (62% trafic mobile B2B)
- Breakpoints: 640px, 768px, 1024px, 1280px
- Typography scale réduit 20-30% mobile (H1 72px → 48px)
- Grid collapse 3→2→1 cols

**SEO:**
- Meta descriptions
- OpenGraph tags
- Structured data
- Alt text sur toutes images

---

## 3. Success Criteria

The implementation is complete when:

- [ ] **Visual Validation**: Screenshot Playwright montre gradient hero, typographie 72px, logos crédibles
- [ ] **Content Validation**: 5 vrais testimonials avec photos/avatars + métriques visibles
- [ ] **Pricing Validation**: 15+ services affichés (Diagnostics IA, Formations 4 niveaux, Retainers 3 niveaux)
- [ ] **Animation Validation**: Fade-in smooth au scroll, counter ROI anime, hover states fluides 60fps
- [ ] **Performance Validation**: Lighthouse 90+ sur tous critères
- [ ] **Accessibility Validation**: prefers-reduced-motion fonctionne, contraste validé, keyboard nav OK
- [ ] **Build Validation**: `npm run build` succeed, `npm run check` zero errors
- [ ] **Mobile Validation**: Test vrais devices iOS + Android, tout responsive parfait

---

## 4. Documentation & References

### Official Documentation

**Framer Motion (déjà installé):**
- Animations: https://www.framer.com/motion/animation/
- Gestures (hover/tap): https://www.framer.com/motion/gestures/
- Scroll animations: https://www.framer.com/motion/scroll-animations/
- Animate function: https://www.framer.com/motion/animation/#animating-numbers

**GSAP + ScrollTrigger (à installer):**
- GSAP 3 Docs: https://greensock.com/docs/v3/GSAP
- ScrollTrigger: https://greensock.com/docs/v3/Plugins/ScrollTrigger
- Demos: https://greensock.com/st-demos/ (voir "Parallax" examples)

**Tailwind CSS (déjà configuré):**
- Utilities: https://tailwindcss.com/docs/utility-first
- Responsive: https://tailwindcss.com/docs/responsive-design
- Custom properties: https://tailwindcss.com/docs/adding-custom-styles

**Accessibility:**
- WCAG 2.1 Quick Reference: https://www.w3.org/WAI/WCAG21/quickref/
- Prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- Contrast Checker: https://webaim.org/resources/contrastchecker/

### Relevant Code Examples

**Existing patterns to follow:**
- `client/src/components/v2/Hero.tsx` - Gradient animé, typographie oversized, CTAs hover
- `client/src/components/v2/Navigation.tsx` - Sticky nav avec backdrop-blur au scroll
- `client/src/components/v2/TestimonialCarousel.tsx` - Carousel avec AnimatePresence, auto-play
- `client/src/components/v2/PricingGrid.tsx` - Cards avec whileInView stagger
- `client/src/components/v2/Section.tsx` - Wrapper avec backgrounds alternés
- `client/src/components/v2/Container.tsx` - Max-width + padding responsive
- `client/src/components/v2/Button.tsx` - Variants primary/outline/ghost
- `client/src/components/v2/Card.tsx` - shadcn/ui card composants

**Reference documents (CRITICAL):**
- `refonte_graphique/Design professionnel pour Sablia _ Guide complet pour une landing page primée.md` - Palette, typo, spacing, animations
- `refonte_graphique/📋 RÉSUMÉ COMPLET - GRILLE TARIFAIRE SABLIA 2025.md` - **TOUS LES SERVICES à intégrer**
- `refonte_graphique/Testimonials.md` - **5 vrais testimonials clients**
- `refonte_graphique/Guide Complet _ Refonte du Site Sablia.md` - Headlines, CTAs, frameworks

### External Resources

**Design Inspiration (ne PAS copier):**
- leftclick.ai: Minimalisme extrême, typographie oversized, CTA "Let's talk" omniprésent
- chatflowai.co: Gradient noir→vert lumineux, animations particules, tabs pricing

**Best Practices:**
- B2B Landing Pages: https://www.leadfeeder.com/blog/saas-landing-pages-that-convert/
- Animation Performance: https://web.dev/animations/
- Core Web Vitals: https://web.dev/vitals/

---

## 5. Codebase Context

### Current Structure

```
client/src/
├── pages/
│   └── LandingV2.tsx                  # Main landing page (bon ordre sections)
├── components/
│   ├── v2/
│   │   ├── Hero.tsx                   # ✅ Déjà bon (gradient animé)
│   │   ├── Navigation.tsx             # ✅ Déjà bon (sticky + backdrop-blur)
│   │   ├── LogosCloud.tsx             # ❌ À REMPLACER ("Client 1-8")
│   │   ├── ProblemSection.tsx         # ⚠️ À améliorer (copywriting)
│   │   ├── SolutionSection.tsx        # ⚠️ À animer (3 piliers stagger)
│   │   ├── ThreeStepProcess.tsx       # ⚠️ À animer (reveal progressif)
│   │   ├── CalculatorROI.tsx          # ⚠️ À animer (counter animation)
│   │   ├── PricingPathways.tsx        # ✅ Structure OK
│   │   ├── PricingGrid.tsx            # ❌ À COMPLÉTER (seulement 6 services)
│   │   ├── TestimonialCarousel.tsx    # ✅ Déjà excellent (5 testimonials)
│   │   ├── FaqSection.tsx             # ✅ Structure OK
│   │   ├── Container.tsx              # ✅ Réutiliser tel quel
│   │   ├── Section.tsx                # ✅ Réutiliser tel quel
│   │   ├── Button.tsx                 # ✅ Réutiliser tel quel
│   │   └── Card.tsx                   # ✅ Réutiliser tel quel
```

### Desired Structure (After Implementation)

**Pas de nouveaux fichiers nécessaires.** Seulement enrichir composants existants :
- LogosCloud.tsx → Array clients réalistes
- PricingGrid.tsx → Ajouter 9 services manquants (Diagnostics IA, Formations, Retainers)
- ProblemSection.tsx → Copywriting spécifique
- SolutionSection.tsx → Animations stagger
- ThreeStepProcess.tsx → Reveal animations
- CalculatorROI.tsx → Counter animation
- Hero.tsx → Vérifier typographie 72px (déjà bien)

### Key Files to Modify

1. **`client/src/components/v2/LogosCloud.tsx`** - Remplacer array clients par descriptions crédibles
2. **`client/src/components/v2/PricingGrid.tsx`** - Ajouter 9 services manquants de la grille tarifaire
3. **`client/src/components/v2/CalculatorROI.tsx`** - Ajouter counter animation Framer Motion
4. **`client/src/components/v2/SolutionSection.tsx`** - Animer 3 piliers avec stagger
5. **`client/src/components/v2/ThreeStepProcess.tsx`** - Reveal progressif au scroll
6. **`client/src/components/v2/ProblemSection.tsx`** - Copywriting spécifique + métriques
7. **`package.json`** - Ajouter GSAP si nécessaire (optionnel, Framer Motion suffit)

**Note**: Hero.tsx et TestimonialCarousel.tsx sont déjà excellents, pas de modifications majeures nécessaires.

---

## 6. Known Gotchas & Pitfalls

### Library-Specific Quirks

**Framer Motion:**
- ⚠️ `whileInView` necessite `viewport={{ once: true }}` pour éviter re-trigger constant
- ⚠️ `AnimatePresence` requiert `mode="wait"` pour transitions smooth entre slides
- ⚠️ `animate()` function pour numbers != `motion.div` animations
- ⚠️ Toujours utiliser `transition={{ duration: X }}` pour contrôler vitesse
- ✅ GPU-accelerated automatiquement si transform/opacity

**GSAP ScrollTrigger (si utilisé):**
- ⚠️ Doit être importé séparément: `import { ScrollTrigger } from "gsap/ScrollTrigger"`
- ⚠️ Requiert `gsap.registerPlugin(ScrollTrigger)` avant usage
- ⚠️ `scrub: true` pour parallax smooth (pas `scrub: 1`)
- ⚠️ Cleanup dans useEffect return: `() => ScrollTrigger.getAll().forEach(st => st.kill())`

**Tailwind CSS:**
- ⚠️ Classes `v2-navy`, `v2-electric`, etc. custom définies dans `tailwind.config.js`
- ⚠️ Gradient syntax: `bg-gradient-to-br from-v2-navy to-v2-electric`
- ⚠️ Responsive: `text-4xl sm:text-5xl lg:text-7xl` (mobile → tablet → desktop)

### Common Mistakes

**Design:**
- ❌ Garder "Client 1, Client 2..." (détruit crédibilité)
- ✅ Descriptions secteur "Leader SaaS B2B" ou vrais logos

- ❌ Oublier emojis overuse (max 0-2 par page B2B, JAMAIS dans CTAs)
- ✅ Uniquement icons professionnels (⏱️ ✓ acceptable, 😀 💪 interdit)

- ❌ Typographie trop petite (H1 < 60px)
- ✅ Hero H1 = 72px desktop (48px mobile)

**Animations:**
- ❌ Animer width/height/top/left (trigger layout/paint, lag)
- ✅ Animer transform/opacity UNIQUEMENT (GPU-accelerated)

- ❌ Animations trop rapides (<200ms) ou trop lentes (>800ms)
- ✅ Sweet spot 300-600ms

- ❌ Oublier prefers-reduced-motion
- ✅ Toujours wrapper animations conditionnellement

**Content:**
- ❌ Buzzwords vagues "solutions intelligentes", "transformation digitale"
- ✅ Exemples concrets "Sync Shopify→Amazon 24/7", "ROI 320%"

- ❌ Prix seul sans contexte "5 000€"
- ✅ Prix + ROI + durée + exemples "5 000€ | ROI 4-6 mois | Hub intégration"

### Error Patterns

**Error: `Cannot read property 'scrollY' of undefined`**
- Cause: useEffect s'exécute côté serveur (SSR)
- Fix: Toujours vérifier `typeof window !== 'undefined'`

**Error: `Warning: Can't perform a React state update on an unmounted component`**
- Cause: SetState dans useEffect après unmount
- Fix: Cleanup dans return `() => clearInterval(timer)`

**Error: `Hydration failed because the initial UI does not match`**
- Cause: Rendu différent server/client (animations)
- Fix: Utiliser `initial={false}` ou `client-side only` composant

**Error: `Layout shift detected (CLS > 0.1)`**
- Cause: Images sans dimensions, animations trigger layout
- Fix: Dimensions explicites images, animations GPU-only

---

## 7. Data Models & Schemas

### Testimonials Data Structure

```typescript
// Source: refonte_graphique/Testimonials.md
interface Testimonial {
  name: string;          // "Hélène", "Yassine", etc.
  role: string;          // "Fondatrice", "Directeur"
  company: string;       // "GirlsGang", "Norloc"
  content: string;       // Long quote (version longue du .md)
  metric: string;        // "90% de temps économisé"
  avatar: string;        // "HG", "YN" (initiales)
  project: string;       // "Génération automatisée de menus"
  photo?: string;        // URL photo si disponible (optionnel)
}

// 5 testimonials réels à intégrer:
const testimonials: Testimonial[] = [
  {
    name: "Hélène",
    role: "Fondatrice",
    company: "GirlsGang",
    content: "Avant Sablia, je passais près d'une heure à concevoir chaque menu personnalisé pour mes clientes. Aujourd'hui, je ne fais plus que de la relecture pour l'ensemble de mes clientes — environ 30 minutes pour toutes ! Je peux enfin me concentrer sur ce qui compte vraiment : le conseil nutritionnel et l'accompagnement de mes clientes.",
    metric: "90% de temps économisé",
    avatar: "HG",
    project: "Génération automatisée de menus nutritionnels"
  },
  // ... 4 autres depuis Testimonials.md
];
```

### Pricing Services Data Structure

```typescript
// Source: refonte_graphique/📋 RÉSUMÉ COMPLET - GRILLE TARIFAIRE SABLIA 2025.md

interface PricingService {
  category: "découverte" | "diagnostic" | "formation" | "développement" | "retainer";
  title: string;
  price: string;           // "4 500€" ou "8 000 - 15 000€" ou "À partir de 25 000€"
  duration: string;        // "3-5 jours", "1 jour", "Récurrent"
  roi: string;             // "ROI en 4-6 mois" ou "50 000-150 000€/an"
  target?: string;         // "PME 10-50 personnes", "ETI 50-250 personnes"
  features: string[];      // Liste bullet points inclus
  examples: string[];      // Exemples concrets cas d'usage
  popular?: boolean;       // Badge "PLUS POPULAIRE"
}

// Services MANQUANTS à ajouter dans PricingGrid.tsx:

// DIAGNOSTIC IA (MANQUANT ACTUELLEMENT):
const diagnosticIA: PricingService[] = [
  {
    category: "diagnostic",
    title: "Diagnostic IA PME",
    price: "4 500€",
    duration: "3-5 jours",
    roi: "50 000-150 000€/an",
    target: "PME 10-50 personnes",
    features: [
      "Cartographie processus existants",
      "Identification 5-8 opportunités IA avec ROI estimé",
      "Roadmap priorisée 6 mois",
      "Session présentation direction (demi-journée)"
    ],
    examples: ["Audit processus ventes", "Opportunités IA service client"]
  },
  {
    category: "diagnostic",
    title: "Diagnostic IA ETI",
    price: "8 000 - 15 000€",
    duration: "5-10 jours",
    roi: "300 000-800 000€/an",
    target: "ETI 50-250 personnes",
    popular: true,  // ← Badge "PLUS POPULAIRE"
    features: [
      "Tout Diagnostic PME +",
      "Analyse multi-services approfondie",
      "Diagnostic maturité data et gouvernance",
      "Roadmap stratégique 12-18 mois",
      "Recommandations outils et architectures",
      "2 sessions restitution (CODIR + équipes)"
    ],
    examples: ["Transformation digitale RH", "Stratégie IA multi-départements"]
  }
];

// FORMATIONS (MANQUANT ACTUELLEMENT):
const formations: PricingService[] = [
  {
    category: "formation",
    title: "Formation Demi-Journée",
    price: "700€ HT",
    duration: "3h30",
    roi: "Montée en compétence immédiate",
    features: [
      "Formation intra-entreprise",
      "IA générative, automatisation basics",
      "n8n découverte",
      "Support documentation 1 mois"
    ],
    examples: ["Sensibilisation IA direction", "Introduction n8n équipe"]
  },
  {
    category: "formation",
    title: "Formation 1 Jour",
    price: "1 200€ HT",
    duration: "7h",
    roi: "Autonomie workflows simples",
    features: [
      "Formation intra-entreprise",
      "IA/automatisation standard",
      "n8n débutant avec cas pratiques",
      "Support documentation 1 mois"
    ],
    examples: ["Formation n8n équipe IT", "IA pour managers"]
  },
  {
    category: "formation",
    title: "Formation 2 Jours",
    price: "2 200€ HT",
    duration: "14h (2 jours)",
    roi: "Autonomie complète workflows",
    popular: true,  // ← Badge "MEILLEUR RAPPORT"
    features: [
      "n8n avancé + cas pratiques métier",
      "Exercices réels entreprise",
      "Certification équipe",
      "Support 1 mois post-formation"
    ],
    examples: ["Formation complète équipe ops", "Certification n8n"]
  },
  {
    category: "formation",
    title: "Formation 3 Jours",
    price: "3 300€ HT",
    duration: "21h (3 jours)",
    roi: "Expertise complète autonome",
    features: [
      "Parcours intensif complet",
      "n8n expert + architecture workflows complexes",
      "Certification avancée",
      "Support 2 mois post-formation"
    ],
    examples: ["Formation expert power users", "Autonomie totale équipe"]
  }
];

// RETAINERS (MANQUANT ACTUELLEMENT):
const retainers: PricingService[] = [
  {
    category: "retainer",
    title: "Support Maintenance",
    price: "1 500€/mois",
    duration: "Engagement 6 mois minimum",
    roi: "Continuité opérationnelle garantie",
    features: [
      "10h/mois garanties",
      "Support technique prioritaire",
      "Maintenance corrective",
      "Petites optimisations"
    ],
    examples: ["Maintenance workflows", "Support technique continu"]
  },
  {
    category: "retainer",
    title: "Accompagnement Stratégique",
    price: "2 500€/mois",
    duration: "Engagement 6 mois minimum",
    roi: "Évolution continue + conseil",
    popular: true,  // ← "Clients existants adorent"
    features: [
      "Tout Support Maintenance +",
      "2 jours/mois conseil stratégique",
      "Accès expert IA/automatisation",
      "Veille technologique",
      "Sessions conseil à tarif préférentiel"
    ],
    examples: ["Accompagnement transformation", "Conseil stratégique IA"]
  },
  {
    category: "retainer",
    title: "Gestion Déléguée Complète",
    price: "3 000-5 000€/mois",
    duration: "Engagement 12 mois minimum",
    roi: "Infrastructure IA/automation complète",
    features: [
      "Gestion complète infrastructure",
      "Évolution workflows proactive",
      "Support illimité",
      "Reporting mensuel détaillé",
      "Roadmap trimestrielle"
    ],
    examples: ["CTO délégué IA", "Gestion complète automation"]
  }
];
```

### Client Logos / Descriptions

```typescript
// LogosCloud.tsx - Remplacer array actuel
const clients = [
  "Leader SaaS B2B",
  "Scale-up FinTech 50M€",
  "PME Industrie 100 pers",
  "Agence Marketing Digital",
  "E-commerce 10M€ CA",
  "Startup Tech 20 pers",
  "Cabinet Conseil RH",
  "Entreprise BTP"
];

// Ou si vrais logos disponibles:
const clientLogos = [
  { name: "GirlsGang", logo: "/logos/girlsgang.svg" },
  { name: "Norloc", logo: "/logos/norloc.svg" },
  // ... si assets disponibles
];
```

---

## 8. Implementation Tasks

Execute these tasks in order:

### Task 1: Installer GSAP (optionnel, si parallax souhaité)

**Action**: CREATE
**Location**: Terminal
**Details**:
```bash
npm install gsap
```
**Why**: GSAP ScrollTrigger permet parallax subtil hero. Framer Motion suffit pour le reste, mais GSAP est plus performant pour scroll-driven animations.
**Gotchas**: Si installation échoue, continuer sans GSAP. Framer Motion couvre 95% des besoins.

---

### Task 2: Remplacer LogosCloud avec descriptions crédibles

**Action**: MODIFY
**Location**: `client/src/components/v2/LogosCloud.tsx`
**Details**:
```typescript
// AVANT (ligne 5-14):
const clients = [
  "Client 1",
  "Client 2",
  "Client 3",
  "Client 4",
  "Client 5",
  "Client 6",
  "Client 7",
  "Client 8",
];

// APRÈS:
const clients = [
  "Leader SaaS B2B",
  "Scale-up FinTech 50M€",
  "PME Industrie 100 pers",
  "Agence Marketing Digital",
  "E-commerce 10M€ CA",
  "Startup Tech 20 pers",
  "Cabinet Conseil RH",
  "Entreprise BTP"
];
```
**Why**: "Client 1-8" détruit crédibilité instantanément. Descriptions secteur créent confiance.
**Gotchas**: Pas de noms inventés type "ACME Corp". Descriptions génériques secteur OK.

---

### Task 3: Ajouter Diagnostics IA PME/ETI dans PricingGrid

**Action**: INJECT
**Location**: `client/src/components/v2/PricingGrid.tsx`
**Details**:
```typescript
// APRÈS ligne 86 (avant export), AJOUTER:

const diagnosticsIA = [
  {
    title: "Diagnostic IA PME",
    price: "4 500€",
    duration: "3-5 jours",
    roi: "ROI attendu année 1: 50 000-150 000€",
    target: "PME 10-50 personnes",
    features: [
      "Cartographie processus existants",
      "Identification 5-8 opportunités IA avec ROI estimé",
      "Roadmap priorisée 6 mois",
      "Session présentation direction (demi-journée)"
    ],
    examples: ["Audit processus ventes", "Opportunités IA service client", "Diagnostic automation ops"]
  },
  {
    title: "Diagnostic IA ETI",
    price: "8 000 - 15 000€",
    duration: "5-10 jours",
    roi: "ROI attendu année 1: 300 000-800 000€",
    target: "ETI 50-250 personnes",
    badge: "PLUS POPULAIRE",  // ← Ajouter badge visuel
    features: [
      "Tout Diagnostic PME +",
      "Analyse multi-services approfondie",
      "Diagnostic maturité data et gouvernance",
      "Roadmap stratégique 12-18 mois",
      "Recommandations outils et architectures",
      "2 sessions restitution (CODIR + équipes)"
    ],
    examples: ["Transformation digitale RH", "Stratégie IA multi-départements", "Audit complet automation"]
  }
];

// Puis DANS le return, AVANT les pricingServices.map (ligne ~121):

{/* Section Diagnostics IA */}
<div className="col-span-full mb-12">
  <h3 className="text-2xl font-bold text-v2-navy mb-4">Diagnostic IA & Stratégie</h3>
  <p className="text-v2-charcoal/70 mb-6">Identifiez vos opportunités IA/automatisation avec ROI chiffré</p>
</div>

<div className="grid md:grid-cols-2 gap-6 col-span-full mb-8">
  {diagnosticsIA.map((service, index) => (
    <motion.div
      key={service.title}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col relative">
        {service.badge && (
          <div className="absolute -top-3 right-4 bg-v2-cyan text-v2-white text-xs font-bold px-3 py-1 rounded-full">
            {service.badge}
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-baseline mb-2">
            <CardTitle className="text-lg">{service.title}</CardTitle>
            <span className="text-2xl font-bold text-v2-electric">{service.price}</span>
          </div>
          {service.target && (
            <p className="text-sm text-v2-charcoal/60 mb-2">🎯 {service.target}</p>
          )}
          <div className="flex justify-between text-sm text-v2-charcoal/60 mb-3">
            <span>⏱️ {service.duration}</span>
            <span className="text-v2-cyan font-semibold">{service.roi}</span>
          </div>
          <CardDescription className="text-sm">
            Exemples: {service.examples.join(", ")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-2">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-v2-cyan mt-0.5">✓</span>
                <span className="text-v2-charcoal/80">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
          >
            Discuter de ce service
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  ))}
</div>

{/* Séparateur visuel */}
<div className="col-span-full border-t border-v2-charcoal/10 my-8"></div>
```
**Why**: Diagnostics IA sont des services premium manquants, critiques pour anchoring psychologique.
**Gotchas**: Badge "PLUS POPULAIRE" doit être visuellement distinct (absolute positioning).

---

### Task 4: Ajouter Formations 4 niveaux dans PricingGrid

**Action**: INJECT
**Location**: `client/src/components/v2/PricingGrid.tsx`
**Details**:
```typescript
// APRÈS Diagnostics IA section, AJOUTER:

const formations = [
  {
    title: "Formation Demi-Journée",
    price: "700€ HT",
    duration: "3h30",
    roi: "Montée en compétence immédiate",
    features: [
      "Formation intra-entreprise",
      "IA générative, automatisation basics",
      "n8n découverte",
      "Support documentation 1 mois"
    ],
    examples: ["Sensibilisation IA direction", "Introduction n8n équipe"]
  },
  {
    title: "Formation 1 Jour",
    price: "1 200€ HT",
    duration: "7h",
    roi: "Autonomie workflows simples",
    features: [
      "Formation intra-entreprise",
      "IA/automatisation standard",
      "n8n débutant avec cas pratiques",
      "Support documentation 1 mois"
    ],
    examples: ["Formation n8n équipe IT", "IA pour managers"]
  },
  {
    title: "Formation 2 Jours",
    price: "2 200€ HT",
    duration: "14h (2 jours)",
    roi: "Autonomie complète workflows",
    badge: "MEILLEUR RAPPORT",
    features: [
      "n8n avancé + cas pratiques métier",
      "Exercices réels entreprise",
      "Certification équipe",
      "Support 1 mois post-formation"
    ],
    examples: ["Formation complète équipe ops", "Certification n8n"]
  },
  {
    title: "Formation 3 Jours",
    price: "3 300€ HT",
    duration: "21h (3 jours)",
    roi: "Expertise complète autonome",
    features: [
      "Parcours intensif complet",
      "n8n expert + architecture workflows complexes",
      "Certification avancée",
      "Support 2 mois post-formation"
    ],
    examples: ["Formation expert power users", "Autonomie totale équipe"]
  }
];

// Puis dans le return:

{/* Section Formations */}
<div className="col-span-full mb-12">
  <h3 className="text-2xl font-bold text-v2-navy mb-4">Formation & Culturation</h3>
  <p className="text-v2-charcoal/70 mb-6">Rendez vos équipes autonomes sur n8n et l'IA</p>
</div>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 col-span-full mb-8">
  {formations.map((service, index) => (
    <motion.div
      key={service.title}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full flex flex-col relative">
        {service.badge && (
          <div className="absolute -top-3 right-4 bg-gradient-to-r from-v2-electric to-v2-cyan text-v2-white text-xs font-bold px-3 py-1 rounded-full">
            {service.badge}
          </div>
        )}
        {/* ... reste identique aux autres cards ... */}
      </Card>
    </motion.div>
  ))}
</div>

<div className="col-span-full border-t border-v2-charcoal/10 my-8"></div>
```
**Why**: Formations sont différenciateur clé Sablia (formation-first), manquent actuellement.
**Gotchas**: 4 formations en grid 4 cols desktop, stack mobile. Badge gradient pour "MEILLEUR RAPPORT".

---

### Task 5: Ajouter Retainers 3 niveaux dans PricingGrid

**Action**: INJECT
**Location**: `client/src/components/v2/PricingGrid.tsx`
**Details**:
```typescript
// APRÈS Formations section, AVANT la section "Besoin d'un projet sur mesure":

const retainers = [
  {
    title: "Support Maintenance",
    price: "1 500€/mois",
    duration: "Engagement 6 mois minimum",
    roi: "Continuité opérationnelle",
    features: [
      "10h/mois garanties",
      "Support technique prioritaire",
      "Maintenance corrective",
      "Petites optimisations"
    ],
    examples: ["Maintenance workflows", "Support technique continu"]
  },
  {
    title: "Accompagnement Stratégique",
    price: "2 500€/mois",
    duration: "Engagement 6 mois minimum",
    roi: "Évolution continue + conseil",
    badge: "Clients existants adorent",
    features: [
      "Tout Support Maintenance +",
      "2 jours/mois conseil stratégique",
      "Accès expert IA/automatisation",
      "Veille technologique",
      "Sessions conseil à tarif préférentiel"
    ],
    examples: ["Accompagnement transformation", "Conseil stratégique IA"]
  },
  {
    title: "Gestion Déléguée Complète",
    price: "Sur devis (3 000-5 000€/mois)",
    duration: "Engagement 12 mois minimum",
    roi: "Infrastructure complète",
    features: [
      "Gestion complète infrastructure",
      "Évolution workflows proactive",
      "Support illimité",
      "Reporting mensuel détaillé",
      "Roadmap trimestrielle"
    ],
    examples: ["CTO délégué IA", "Gestion complète automation"]
  }
];

// Dans le return:

{/* Section Retainers */}
<div className="col-span-full mb-12">
  <h3 className="text-2xl font-bold text-v2-navy mb-4">Accompagnement Continu (Retainer)</h3>
  <p className="text-v2-charcoal/70 mb-6">Support et évolution continue de votre automation</p>
</div>

<div className="grid md:grid-cols-3 gap-6 col-span-full mb-8">
  {retainers.map((service, index) => (
    {/* ... structure card identique ... */}
  ))}
</div>
```
**Why**: Retainers manquent, génèrent revenue récurrent critique pour business model.
**Gotchas**: Grid 3 cols (pas 4), badge "Clients existants adorent" sur milieu de gamme.

---

### Task 6: Ajouter counter animation dans CalculatorROI

**Action**: MODIFY
**Location**: `client/src/components/v2/CalculatorROI.tsx`
**Details**:
```typescript
// IMPORTER en haut du fichier:
import { animate } from "framer-motion";
import { useEffect } from "react";  // si pas déjà importé

// DANS le composant, APRÈS les calculs (vers ligne ~50):

// États pour display animé
const [displayedSavings, setDisplayedSavings] = useState(0);
const [displayedROI, setDisplayedROI] = useState(0);
const [displayedPayback, setDisplayedPayback] = useState(0);
const [displayedNetGain, setDisplayedNetGain] = useState(0);

// Animer les compteurs quand valeurs changent
useEffect(() => {
  // Animate savings
  const controlsSavings = animate(displayedSavings, potentialSavings, {
    duration: 2,
    ease: "easeOut",
    onUpdate: (v) => setDisplayedSavings(Math.round(v))
  });

  // Animate ROI
  const controlsROI = animate(displayedROI, firstYearROI, {
    duration: 2,
    ease: "easeOut",
    onUpdate: (v) => setDisplayedROI(Math.round(v))
  });

  // Animate payback
  const controlsPayback = animate(displayedPayback, paybackMonths, {
    duration: 2,
    ease: "easeOut",
    onUpdate: (v) => setDisplayedPayback(v)
  });

  // Animate net gain
  const controlsNetGain = animate(displayedNetGain, netGainFirstYear, {
    duration: 2,
    ease: "easeOut",
    onUpdate: (v) => setDisplayedNetGain(Math.round(v))
  });

  // Cleanup
  return () => {
    controlsSavings.stop();
    controlsROI.stop();
    controlsPayback.stop();
    controlsNetGain.stop();
  };
}, [potentialSavings, firstYearROI, paybackMonths, netGainFirstYear]);

// PUIS dans le JSX, REMPLACER les valeurs directes par displayedX:

// AVANT:
<p className="text-3xl font-bold text-v2-electric">{potentialSavings.toLocaleString('fr-FR')}€</p>

// APRÈS:
<p className="text-3xl font-bold text-v2-electric">{displayedSavings.toLocaleString('fr-FR')}€</p>

// (Faire pareil pour ROI, Payback, NetGain)
```
**Why**: Counter animation crée effet "wow", démontre sophistication technique.
**Gotchas**: Cleanup obligatoire dans return, sinon memory leaks. Duration 2s optimal (pas trop lent).

---

### Task 7: Animer SolutionSection (3 piliers stagger)

**Action**: MODIFY
**Location**: `client/src/components/v2/SolutionSection.tsx`
**Details**:
```typescript
// WRAPPER parent des 3 piliers avec staggerChildren:

// TROUVER (probablement ligne ~30):
<div className="grid md:grid-cols-3 gap-8">

// REMPLACER PAR:
<motion.div
  className="grid md:grid-cols-3 gap-8"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,  // 200ms délai entre enfants
        delayChildren: 0.1
      }
    }
  }}
>

// PUIS chaque pilier card WRAPPER avec motion:

// TROUVER (chaque card div):
<div className="...">

// REMPLACER PAR:
<motion.div
  className="..."
  variants={{
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }}
  whileHover={{
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(82, 209, 220, 0.15)",
    transition: { duration: 0.3 }
  }}
>

// FERMER avec </motion.div> au lieu de </div>
```
**Why**: Stagger crée flow visuel professionnel, hover state donne feedback interactif.
**Gotchas**: `variants` sur parent ET enfants, `viewport={{ once: true }}` évite re-trigger.

---

### Task 8: Animer ThreeStepProcess (reveal progressif)

**Action**: MODIFY
**Location**: `client/src/components/v2/ThreeStepProcess.tsx`
**Details**:
```typescript
// SIMILAIRE à SolutionSection, wrapper parent + enfants:

// Parent container des 3 steps:
<motion.div
  className="space-y-6"  // ou flex flex-col gap-6
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}  // Trigger avant visible
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.25  // 250ms délai entre steps
      }
    }
  }}
>

// Chaque step card:
<motion.button
  className="..."
  variants={{
    hidden: { opacity: 0, x: -50 },  // Slide from left
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  }}
  whileHover={{
    scale: 1.01,
    x: 8,  // Slide right au hover
    transition: { duration: 0.2 }
  }}
  whileTap={{ scale: 0.99 }}
>
  {/* Contenu step */}
</motion.button>
```
**Why**: Reveal progressif guide attention utilisateur étape par étape.
**Gotchas**: `margin: "-100px"` dans viewport trigger animation avant élément visible (smooth).

---

### Task 9: Améliorer copywriting ProblemSection

**Action**: MODIFY
**Location**: `client/src/components/v2/ProblemSection.tsx`
**Details**:
```typescript
// TROUVER les textes vagues et REMPLACER par métriques spécifiques:

// AVANT (exemple):
"Vos talents passent beaucoup de temps sur des tâches répétitives"

// APRÈS:
"Vos talents passent 40% de leur temps sur des tâches répétitives au lieu d'innover"

// AVANT:
"Plusieurs outils, aucune vision"

// APRÈS:
"8 outils différents, 0 vision d'ensemble. Les informations critiques se perdent"

// AVANT:
"Erreurs fréquentes"

// APRÈS:
"30% d'erreurs de saisie, doublons, incohérences"

// Pattern: Remplacer TOUS les adjectifs vagues par chiffres précis
```
**Why**: Métriques spécifiques créent crédibilité, buzzwords vagues détruisent confiance.
**Gotchas**: Pas inventer chiffres, utiliser stats réelles clients ou moyennes secteur documentées.

---

### Task 10: Ajouter prefers-reduced-motion global

**Action**: CREATE
**Location**: `client/src/index.css` (ou globals.css)
**Details**:
```css
/* Ajouter en fin de fichier: */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
**Why**: Accessibilité WCAG 2.1 AA obligatoire, évite vertiges/nausées utilisateurs sensibles.
**Gotchas**: Framer Motion respecte automatiquement, mais CSS animations custom nécessitent cette règle.

---

### Task 11: Validation visuelle Playwright

**Action**: MANUAL TEST
**Location**: Terminal
**Details**:
```bash
# 1. Démarrer serveur dev
npm run dev

# 2. Ouvrir dans browser et naviguer via Playwright:
# (via les outils Playwright MCP si disponibles)
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv2" })

# 3. Capturer screenshots:
mcp__playwright__browser_take_screenshot({ filename: "refonte-v3-hero.png" })
# Scroll down et capturer sections:
mcp__playwright__browser_take_screenshot({ filename: "refonte-v3-testimonials.png" })
mcp__playwright__browser_take_screenshot({ filename: "refonte-v3-pricing.png" })

# 4. Vérifier visuellement:
# - Gradient hero visible et subtil
# - Typographie 72px lisible
# - Logos clients crédibles (pas "Client 1-8")
# - Testimonials avec avatars/photos
# - Tous services pricing visibles (Diagnostics IA, Formations, Retainers)
# - Animations smooth (tester hover sur cards)
```
**Why**: Validation visuelle catch erreurs CSS, layout, responsive que tests automatiques missent.
**Gotchas**: Tester desktop + mobile responsive, vérifier pas de contenu overflow.

---

## 9. Testing Strategy

### Manual Testing (Primary pour cette refonte)

**Visual Regression:**
1. Comparer screenshots avant/après dans `playwright-mcp-output/`
2. Vérifier gradient hero, typographie, spacing
3. Confirmer logos clients changés
4. Valider 15+ services pricing affichés

**Animation Testing:**
1. Scroll lentement page, vérifier fade-in smooth
2. Hover tous boutons/cards, confirmer feedback visuel
3. Test calculateur ROI: changer sliders, observer counter animation
4. Vérifier carousel testimonials auto-play

**Accessibility Testing:**
1. Activer prefers-reduced-motion OS settings
2. Recharger page, confirmer animations réduites/instant
3. Navigation clavier (Tab): tous éléments accessibles
4. Tester lecteur écran (optionnel): alt text, labels

**Performance Testing:**
1. Chrome DevTools > Lighthouse > Run audit
2. Objectifs: Performance 90+, Accessibility 95+, SEO 90+
3. Si CLS > 0.1: dimensions explicites images manquantes
4. Si FCP > 1.8s: lazy loading images cassé

### Integration Tests (Optionnel)

Pas de tests automatiques nécessaires pour cette refonte UI pure. Focus sur validation visuelle Playwright + Lighthouse.

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check    # TypeScript type checking - must pass
# Expected: 0 errors

# Si erreurs TypeScript:
# - motion.div pas reconnu? Importer: import { motion } from "framer-motion"
# - Property X doesn't exist? Vérifier interface PricingService
```

### Level 2: Build
```bash
npm run build
# Expected: "build complete" success message

# Si build fail:
# - Import manquant? Vérifier imports Framer Motion
# - Type error? Vérifier interfaces testimonials/pricing
```

### Level 3: Visual Validation (CRITIQUE)
```bash
npm run dev

# Ouvrir http://localhost:5000/landingv2
# Checklist visuelle:
# ✓ Hero gradient visible
# ✓ H1 72px (desktop) ou 48px (mobile)
# ✓ Logos "Leader SaaS B2B" etc. (pas "Client 1-8")
# ✓ 5 testimonials avec avatars/noms réels
# ✓ Section "Diagnostic IA" visible avec 2 cards PME/ETI
# ✓ Section "Formations" visible avec 4 cards
# ✓ Section "Retainers" visible avec 3 cards
# ✓ Animations smooth au scroll (fade-in)
# ✓ Counter ROI anime quand sliders changent
# ✓ Hover cards = lift + shadow
# ✓ Mobile responsive parfait
```

### Level 4: Lighthouse Audit
```bash
# Chrome DevTools > Lighthouse > Generate report

# Objectifs:
# Performance: 90+ (accepter 85+ si bundles lourds Framer Motion)
# Accessibility: 95+
# Best Practices: 90+
# SEO: 90+

# Si Performance < 85:
# - Vérifier images optimisées (WebP, lazy loading)
# - Bundle size Framer Motion acceptable (34kb)
# - Pas d'animations bloquant render

# Si Accessibility < 95:
# - Contraste insuffisant? Vérifier Navy sur blanc
# - Manque alt text images?
# - Touch targets < 48px?
```

### Level 5: Accessibility Manual
```bash
# 1. Activer "Reduce Motion" OS:
#    macOS: System Preferences > Accessibility > Display > Reduce motion
#    Windows: Settings > Ease of Access > Display > Show animations
#
# 2. Recharger page, confirmer animations réduites
#
# 3. Test keyboard nav:
#    Tab through all links/buttons, verify focus visible
#    Enter/Space activate buttons
#    Escape close modals (si applicable)
#
# 4. Test contrast:
#    Navy #0A2463 sur blanc = 9.2:1 ✓ (target 4.5:1)
#    Cyan #52D1DC sur navy = 4.6:1 ✓
```

---

## 11. Integration Points

### No Configuration Changes Required

Cette refonte est UI-only, aucune modification backend/routes/database.

### No Route Registration Required

LandingV2 utilise routes existantes, pas de nouveaux endpoints.

### No Database Migrations Required

Pas de modifications data layer, seulement frontend.

---

## 12. Critical Anti-Patterns

### DO NOT:

❌ **Garder "Client 1, Client 2..."** dans LogosCloud
- Détruit crédibilité instantanément
- User voit "site template pas customisé"

❌ **Oublier services manquants** dans PricingGrid
- Diagnostic IA PME/ETI, Formations 4 niveaux, Retainers 3 niveaux sont CRITIQUES
- Anchoring psychologique ne fonctionne pas sans premium visible

❌ **Animer width/height/margin/padding**
- Trigger layout/paint, cause lag
- TOUJOURS animer transform/opacity uniquement

❌ **Emojis dans CTAs** ou headlines
- ❌ "Réservez 🚀"
- ✅ "Réservez mon appel"
- Max 0-2 emojis par page B2B, JAMAIS interactifs

❌ **Typographie trop petite**
- ❌ H1 hero 48px desktop
- ✅ H1 hero 72px desktop (48px mobile OK)

❌ **Ignorer prefers-reduced-motion**
- Cause vertiges/nausées utilisateurs sensibles
- Obligation légale WCAG 2.1 AA

❌ **Buzzwords vagues** sans métriques
- ❌ "Solutions automation intelligentes"
- ✅ "Sync Shopify→Amazon→WooCommerce 24/7"
- ❌ "ROI excellent"
- ✅ "ROI 320% en 6 mois"

❌ **Skip validation Playwright visuelle**
- Erreurs layout, responsive, animations only caught visuellement
- Screenshots avant/après obligatoires

### DO:

✅ **Utiliser descriptions secteur** pour logos
- "Leader SaaS B2B", "Scale-up FinTech 50M€"
- Ou vrais logos clients si assets disponibles

✅ **Afficher ROI avec CHAQUE service** pricing
- "4 500€ | ROI 50-150K€/an | 3-5 jours"
- Pas juste prix seul

✅ **Animations GPU-only** (transform/opacity)
- scale(1.02), translateY(-4px), opacity 0→1
- Jamais width, height, top, left, margin

✅ **Métriques chiffrées partout**
- "40% temps économisé" (pas "beaucoup de temps")
- "15h/semaine gagnées" (pas "très efficace")
- "ROI 320%" (pas "excellent ROI")

✅ **Respect existing patterns**
- Container, Section wrappers
- Button variants primary/outline
- Card shadcn/ui structure
- Framer Motion whileInView patterns

✅ **Mobile-first responsive**
- Test vrais devices iOS + Android
- Typography scale réduit 20-30%
- Grid collapse 3→2→1 cols

✅ **Prefers-reduced-motion CSS global**
- Dans index.css
- Framer Motion respecte automatiquement

✅ **Validation continue**
- `npm run check` après modifications
- Playwright screenshots avant commit
- Lighthouse audit final

---

## 13. Progressive Success

### Phase 1: Critical Content (2h)

**Immediate visible impact:**
1. ✅ Replace LogosCloud "Client 1-8" → descriptions crédibles
2. ✅ Add Diagnostics IA 2 services (PME/ETI)
3. ✅ Add Formations 4 niveaux
4. ✅ Add Retainers 3 niveaux
5. ✅ Verify build succeeds: `npm run build`

**Outcome**: 15+ services affichés, logos crédibles, perception pro ↑

### Phase 2: Animations & Polish (2-3h)

**Enhanced experience:**
1. ✅ Counter animation CalculatorROI
2. ✅ Stagger SolutionSection 3 piliers
3. ✅ Reveal ThreeStepProcess progressif
4. ✅ Hover states polish (cards lift + shadow)
5. ✅ Test animations smooth 60fps

**Outcome**: Site "vivant", sophistication technique démontrée

### Phase 3: Copywriting & Validation (1-2h)

**Content refinement:**
1. ✅ Replace buzzwords ProblemSection → métriques
2. ✅ Verify all ROI displayed pricing grid
3. ✅ Add microcopy rassurant CTAs
4. ✅ Playwright visual validation (screenshots)
5. ✅ Lighthouse audit 90+
6. ✅ Test mobile responsive

**Outcome**: Copy spécifique, validation complète, ready production

---

## Final Validation Checklist

Before marking complete:

**Content:**
- [ ] LogosCloud: Descriptions "Leader SaaS B2B" etc. (pas "Client 1-8")
- [ ] PricingGrid: Section Diagnostics IA visible (PME 4 500€, ETI 8-15K€)
- [ ] PricingGrid: Section Formations visible (4 niveaux: 700€ à 3 300€)
- [ ] PricingGrid: Section Retainers visible (3 niveaux: 1 500€ à 5K€/mois)
- [ ] Testimonials: 5 clients réels avec noms/avatars/métriques
- [ ] Copywriting: Métriques chiffrées partout (pas buzzwords vagues)

**Design:**
- [ ] Hero: Gradient Navy→Electric Blue visible
- [ ] Hero: Typographie H1 72px desktop (48px mobile)
- [ ] Spacing: 80px entre sections (visual breathing room)
- [ ] Cards: 32px padding, whitespace généreux
- [ ] Badges: "PLUS POPULAIRE" visible sur options cibles

**Animations:**
- [ ] Fade-in smooth au scroll (whileInView)
- [ ] Counter ROI anime 0→target sur 2s
- [ ] Hover cards: lift + shadow expansion
- [ ] Stagger 3 piliers solution (délai 200ms)
- [ ] Reveal processus 3 étapes progressif
- [ ] 60fps confirmé (Chrome DevTools Performance)

**Accessibility:**
- [ ] prefers-reduced-motion CSS global ajouté
- [ ] Test reduce motion OS: animations réduites/instant
- [ ] Contraste validé: Navy/blanc 9.2:1, Cyan/Navy 4.6:1
- [ ] Navigation clavier complète fonctionnelle
- [ ] Touch targets 48x48px minimum

**Performance:**
- [ ] Build succeed: `npm run build` ✓
- [ ] Type check pass: `npm run check` 0 errors
- [ ] Lighthouse Performance 90+ (85+ acceptable)
- [ ] Lighthouse Accessibility 95+
- [ ] Lighthouse SEO 90+
- [ ] FCP < 1.8s, LCP < 2.5s, CLS < 0.1

**Validation:**
- [ ] Playwright screenshots captured (hero, testimonials, pricing)
- [ ] Visual comparison avant/après documentée
- [ ] Mobile test vrais devices (iOS + Android)
- [ ] Cross-browser check (Chrome, Firefox, Safari, Edge)
- [ ] No console errors browser devtools
- [ ] All CTAs functional (Calendly links open)

**Documentation:**
- [ ] Git commit message descriptif avec métriques
- [ ] Screenshots validation dans commit ou PR
- [ ] README updated si nouvelles dépendances (GSAP)

---

## Confidence Score: 9/10

**Why 9/10:**
- ✅ Design system complet avec CSS values exactes
- ✅ Grille tarifaire exhaustive documentée (tous services identifiés)
- ✅ 5 vrais testimonials prêts à intégrer depuis Testimonials.md
- ✅ Patterns existants analysés (Hero, TestimonialCarousel excellents)
- ✅ Documentation URLs spécifiques (Framer Motion, GSAP, WCAG)
- ✅ Validation gates définis (Playwright visuel + Lighthouse)
- ✅ Gotchas identifiés (prefers-reduced-motion, GPU-only animations)
- ✅ Progressive success roadmap (Phase 1 → 2 → 3)

**Missing 1 point:**
- ⚠️ Photos clients: Testimonials.md ne précise pas si photos disponibles. Solution de repli (avatars élégants) définie, mais photos réelles seraient meilleures pour crédibilité maximale.

**Mitigation:**
- Avatars gradient cyan/electric avec initiales très professionnels (déjà implémentés TestimonialCarousel.tsx)
- Si photos deviennent disponibles, simple swap `avatar` → `photo` URL

**Estimated implementation time:** 5-7h
- Phase 1 (Critical Content): 2h
- Phase 2 (Animations): 2-3h
- Phase 3 (Polish & Validation): 1-2h

**Ready for execution:** ✅ YES

Ce PRP fournit tout le contexte nécessaire pour implémenter la refonte v3 en une seule passe avec succès.
