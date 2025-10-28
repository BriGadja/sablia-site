# PRP: Refonte Landing Page Sablia v3 (From Scratch)

## Philosophy: Context is King

Cette refonte part de zéro pour créer une landing page professionnelle niveau Awwwards. Les tentatives précédentes ont échoué principalement à cause d'animations non fonctionnelles et d'un manque de cohérence. Cette fois, nous utilisons des composants d'animation testés et validés, avec une méthodologie rigoureuse basée sur la validation visuelle à chaque étape.

**Approche de validation** :
1. **Visual Validation** : Playwright après chaque section
2. **Syntax & Style** : TypeScript + ESLint
3. **Build** : Vite build sans erreurs
4. **Performance** : Lighthouse >= 90

---

## 1. Goal and Why

**What are we building?**

Une landing page complète `LandingV3.tsx` from scratch, inspirée de https://www.chatflowai.co/, avec :
- Système de particules animées (étoiles en fond)
- Curseur lumineux personnalisé avec traînée
- Animations fluides au scroll (60fps garanti)
- 11 sections de contenu marketing optimisé (Testimonials après Hero pour social proof immédiat)
- Formulaire de contact intelligent avec validation Zod
- Design professionnel B2B (Swiss Design + gradients subtils)
- Tarification simplifiée en 3 colonnes claires (Audit & Consulting / Formations / Solutions)

**Why are we building it?**

Les versions précédentes (LandingV2, LandingV3Enhanced) ont des problèmes :
- Animations non fluides ou absentes
- Manque de cohérence visuelle
- Trop d'emojis (non professionnel pour B2B)
- Contenu marketing pas optimisé

Cette refonte répond à 3 objectifs business :
1. **Conversion** : Transformer visiteurs en leads qualifiés (formulaire + CTA stratégiques)
2. **Crédibilité** : Design niveau Awwwards = expertise technique démontrée
3. **ROI** : Calculateur interactif pour montrer valeur concrète de Sablia

---

## 2. What (Requirements)

### User-Visible Behavior

**Desktop (>= 1024px)** :
- Curseur lumineux custom suit la souris avec traînée fluide
- Particules en fond bougent et se connectent entre elles
- Sections apparaissent progressivement au scroll avec animations
- Hero avec gradient animé 3 couleurs
- Navigation devient opaque au scroll
- Boutons magnétiques (suivent curseur au survol)
- Carousel témoignages auto (changement toutes les 5s)

**Mobile (< 1024px)** :
- Curseur custom CACHÉ (inutile sur touch)
- Particules simplifiées (moins dense pour performance)
- Animations réduites si `prefers-reduced-motion`
- Menu burger fonctionnel
- Tout responsive et touch-friendly

### Functional Requirements

**Architecture** :
- Page principale : `client/src/pages/LandingV3.tsx`
- Composants dans : `client/src/components/v3/` (nouveau dossier)
- Réutiliser composants animations : `client/src/components/animations/`
- Route : `/landingv3` (ne PAS modifier route `/` pour l'instant)

**Sections obligatoires (dans l'ordre)** :
1. **HeroSection** : Gradient, headline percutant, 2 CTAs (Diagnostic + ROI calc)
2. **TestimonialsSection** : Carousel 5 témoignages - Social proof immédiat (depuis Testimonials.md)
3. **LogosCloud** : Logos clients avec animation fade
4. **ProblemSection** : 3 problèmes B2B avec icônes
5. **SolutionSection** : La méthode Sablia en 3 points
6. **ThreeStepProcess** : Timeline visuelle du process
7. **PricingSection** : 3 colonnes simplifiées - Audit & Consulting / Formations / Solutions d'automatisation
8. **CalculatorROI** : Formulaire interactif ROI
9. **ContactFormSection** : Formulaire qualification leads
10. **FaqSection** : 8-10 questions essentielles
11. **Footer** : Réutiliser `client/src/components/Footer.tsx`

**Contenu marketing** :
- **Tarifs** : Depuis `refonte_graphique/documents_de_travail/📋 RÉSUMÉ COMPLET - GRILLE TARIFAIRE SABLIA 2025.md`
- **Témoignages** : Depuis `refonte_graphique/documents_de_travail/Testimonials.md`
- **Design guidelines** : Depuis `refonte_graphique/Design professionnel pour Sablia _ Guide complet pour une landing page primée.md`

### Non-Functional Requirements

**Performance** :
- Core Web Vitals : LCP < 2.5s, FID < 100ms, CLS < 0.1
- Animations 60fps constant (GPU-accelerated uniquement)
- Bundle JS < 300kb, CSS < 50kb
- Images optimisées WebP + lazy loading

**Accessibilité WCAG 2.1 AA** :
- Contraste texte >= 4.5:1
- Navigation clavier complète
- Labels ARIA sur éléments interactifs
- Respect `prefers-reduced-motion` (déjà dans composants animations)

**Design** :
- Palette stricte : Navy #0A2463, Electric Blue #3E92CC, Cyan #52D1DC
- Typographie : Inter uniquement (déjà dans projet)
- Hiérarchie : H1 72px, H2 48px, H3 32px, Body 16-18px
- Whitespace : 80px entre sections, 32px entre éléments
- Maximum 0-2 emojis sur TOUTE la page (0 dans CTAs/navigation)

---

## 3. Success Criteria

The implementation is complete when:

- [ ] **Route `/landingv3` accessible** et affiche nouvelle page
- [ ] **Curseur custom visible** sur desktop uniquement
- [ ] **Particules animées** en fond sur toute la page
- [ ] **Toutes les 11 sections** présentes avec contenu réel
- [ ] **Animations scroll fonctionnent** : sections apparaissent au scroll
- [ ] **Formulaire contact validé** avec Zod + messages erreur
- [ ] **Calculateur ROI fonctionnel** avec calcul correct
- [ ] **Responsive parfait** : mobile, tablette, desktop
- [ ] **0-2 emojis max** sur toute la page (vérifier manuellement)
- [ ] **Build passe** : `npm run build` sans erreurs
- [ ] **TypeScript check** : `npm run check` 0 erreurs
- [ ] **Validation Playwright** : Screenshots confirment design conforme

---

## 4. Documentation & References

### Official Documentation

**Animations** :
- Framer Motion : https://www.framer.com/motion/
  - Animations : https://www.framer.com/motion/animation/
  - Gestures : https://www.framer.com/motion/gestures/
  - Spring animations : https://www.framer.com/motion/transition/#spring
- GSAP ScrollTrigger : https://gsap.com/docs/v3/Plugins/ScrollTrigger/

**Formulaires** :
- React Hook Form : https://react-hook-form.com/get-started
- Zod integration : https://react-hook-form.com/get-started#SchemaValidation
- Zod docs : https://zod.dev/

**Canvas API** (particules) :
- MDN Canvas : https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- Performance : https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas

**Tailwind CSS** :
- Custom colors : https://tailwindcss.com/docs/customizing-colors
- Animations : https://tailwindcss.com/docs/animation

### Relevant Code Examples

**Composants d'animation existants (à réutiliser)** :
- `client/src/components/animations/CustomCursor.tsx` - Curseur lumineux avec spring physics
- `client/src/components/animations/AnimatedParticles.tsx` - Système particules Canvas optimisé
- `client/src/components/animations/ScrollReveal.tsx` - Animations scroll avec GSAP
- `client/src/components/animations/MagneticElements.tsx` - Boutons/cards magnétiques
- `client/src/components/animations/AnimatedText.tsx` - Effets de texte (gradient, typewriter, etc.)
- `client/src/components/animations/index.ts` - Export centralisé

**Patterns de sections existants (à étudier, PAS copier)** :
- `client/src/components/v2/HeroEnhanced.tsx` - Hero avec gradient animé, CTAs magnétiques
- `client/src/components/v2/Navigation.tsx` - Nav sticky avec état scroll
- `client/src/components/v2/TestimonialsCarousel.tsx` - Carousel auto avec AnimatePresence
- `client/src/components/v2/PricingGrid.tsx` - Grille tarifs avec hover effects

**Page actuelle (comprendre structure, NE PAS copier)** :
- `client/src/pages/LandingV3Enhanced.tsx` - Structure générale avec CustomCursor + AnimatedParticles
- `client/src/pages/LandingV2.tsx` - Ordre des sections

### External Resources

**Inspiration design** :
- Site référence : https://www.chatflowai.co/
- Sites Awwwards mentionnés dans design guide :
  - Igloo Inc : Minimalisme, WebGL performant
  - Kriss.ai : Narrative centrée humain
  - Inkfish : Typographie forte, whitespace généreux

**Documents projet (OBLIGATOIRE à lire)** :
- `refonte_graphique/Design professionnel pour Sablia _ Guide complet pour une landing page primée.md`
- `refonte_graphique/documents_de_travail/📋 RÉSUMÉ COMPLET - GRILLE TARIFAIRE SABLIA 2025.md`
- `refonte_graphique/documents_de_travail/Testimonials.md`
- `ANIMATION_GUIDE.md`

---

## 5. Codebase Context

### Current Structure

```
client/src/
├── pages/
│   ├── LandingV2.tsx (ancienne version, problèmes animations)
│   ├── LandingV3Enhanced.tsx (version actuelle avec animations, mais à refaire)
│   └── Home.tsx
├── components/
│   ├── animations/ (✅ RÉUTILISER)
│   │   ├── CustomCursor.tsx
│   │   ├── AnimatedParticles.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── MagneticElements.tsx
│   │   ├── AnimatedText.tsx
│   │   └── index.ts
│   ├── v2/ (étudier pour patterns, NE PAS copier)
│   │   ├── HeroEnhanced.tsx
│   │   ├── Navigation.tsx
│   │   ├── TestimonialsCarousel.tsx
│   │   └── ...
│   └── Footer.tsx (✅ RÉUTILISER tel quel)

Note: Testimonials placés juste après Hero pour social proof immédiat
├── lib/
│   └── utils.ts (cn function pour class merging)
└── index.css (couleurs v2 déjà définies)
```

### Desired Structure (After Implementation)

```
client/src/
├── pages/
│   └── LandingV3.tsx ⭐ NOUVEAU (page principale)
├── components/
│   ├── animations/ (inchangé)
│   ├── v3/ ⭐ NOUVEAU DOSSIER (11 sections)
│   │   ├── HeroSection.tsx
│   │   ├── TestimonialsSection.tsx (⭐ DÉPLACÉ après Hero)
│   │   ├── LogosCloud.tsx
│   │   ├── ProblemSection.tsx
│   │   ├── SolutionSection.tsx
│   │   ├── ThreeStepProcess.tsx
│   │   ├── PricingSection.tsx (⭐ SIMPLIFIÉ: 3 colonnes au lieu de grille complexe)
│   │   ├── CalculatorROI.tsx
│   │   ├── ContactFormSection.tsx
│   │   └── FaqSection.tsx
│   └── v3-shared/ ⭐ NOUVEAU (composants réutilisables v3)
│       ├── Container.tsx
│       └── SectionTitle.tsx
└── App.tsx (ajouter route /landingv3)
```

### Key Files to Modify

- `client/src/App.tsx` - Ajouter route `/landingv3` avec composant LandingV3
- `tailwind.config.ts` - Vérifier couleurs v2 (déjà présentes, ne pas modifier)

### Key Files to Create

**Page principale** :
- `client/src/pages/LandingV3.tsx`

**Sections v3** (11 fichiers) :
- `client/src/components/v3/HeroSection.tsx`
- `client/src/components/v3/TestimonialsSection.tsx` ⭐ Déplacé après Hero
- `client/src/components/v3/LogosCloud.tsx`
- `client/src/components/v3/ProblemSection.tsx`
- `client/src/components/v3/SolutionSection.tsx`
- `client/src/components/v3/ThreeStepProcess.tsx`
- `client/src/components/v3/PricingSection.tsx` ⭐ Simplifié en 3 colonnes
- `client/src/components/v3/CalculatorROI.tsx`
- `client/src/components/v3/ContactFormSection.tsx`
- `client/src/components/v3/FaqSection.tsx`

**Composants réutilisables** :
- `client/src/components/v3-shared/Container.tsx`
- `client/src/components/v3-shared/SectionTitle.tsx`

---

## 6. Known Gotchas & Pitfalls

### Library-Specific Quirks

**Framer Motion** :
- ⚠️ N'animer QUE `transform` et `opacity` (GPU-accelerated)
- ⚠️ Éviter animer `width`, `height`, `top`, `left`, `margin`, `padding` (slow)
- ⚠️ `AnimatePresence` nécessite `key` unique sur children
- ✅ `useSpring` pour mouvement fluide (curseur, éléments magnétiques)
- ✅ `whileInView` pour animations scroll (alternative à GSAP)

**GSAP ScrollTrigger** :
- ⚠️ Appeler `gsap.registerPlugin(ScrollTrigger)` AVANT utilisation
- ⚠️ Cleanup avec `ScrollTrigger.getAll().forEach(t => t.kill())` dans useEffect return
- ✅ `start: "top 80%"` bon default pour apparitions scroll
- ✅ `toggleActions: "play none none reverse"` pour animations reversibles

**Canvas API (AnimatedParticles)** :
- ⚠️ `requestAnimationFrame` peut continuer après unmount → cleanup obligatoire
- ⚠️ Canvas resize nécessite redessiner entièrement
- ✅ Density particules basé sur surface : `(width * height) / 15000`
- ✅ Limiter connexions : max 150px distance

**React Hook Form + Zod** :
- ⚠️ `resolver: zodResolver(schema)` OBLIGATOIRE pour validation Zod
- ⚠️ `...register("fieldName")` doit matcher nom dans schema exactement
- ✅ `formState.errors` pour afficher messages erreur
- ✅ `defaultValues` recommandé pour éviter controlled/uncontrolled warnings

### Common Mistakes

**Design** :
- ❌ Utiliser plus de 2 emojis sur la page → Non professionnel B2B
- ❌ Emojis dans CTAs, navigation, headings → Infantilise
- ❌ Gradients sur texte → Lisibilité réduite, accessibilité compromise
- ❌ Plus de 4-5 couleurs → Surcharge visuelle
- ✅ Maximum 0-2 emojis, jamais dans éléments clés
- ✅ Gradients sur backgrounds uniquement
- ✅ Palette stricte : Navy, Electric Blue, Cyan

**Animations** :
- ❌ Durées > 1s → Trop longues, frustrant
- ❌ Animations sur propriétés layout → Saccadé, mauvaise performance
- ❌ Ignorer `prefers-reduced-motion` → Problèmes accessibilité
- ✅ Durées 300-600ms pour micro-interactions
- ✅ Animer uniquement `transform` et `opacity`
- ✅ Composants animations existants respectent déjà `prefers-reduced-motion`

**Structure** :
- ❌ Copier-coller v2 components → Perpétue problèmes existants
- ❌ Modifier composants animations existants → Risque casser ce qui marche
- ✅ Créer nouveaux composants v3/ from scratch
- ✅ Réutiliser animations/ tels quels

### Error Patterns

**Error: "Cannot find module '@/components/animations'"**
- **Cause** : Import path incorrect ou fichier manquant
- **Fix** : Vérifier `client/src/components/animations/index.ts` existe et exporte composants

**Error: "ScrollTrigger is not defined"**
- **Cause** : Plugin GSAP pas enregistré
- **Fix** : Ajouter `gsap.registerPlugin(ScrollTrigger)` AVANT utilisation

**Error: "Each child in a list should have a unique key prop"**
- **Cause** : `map()` sans `key` unique
- **Fix** : Ajouter `key={item.id}` ou `key={index}` sur élément mapped

**Error: Build fails with "Cannot read property 'current' of undefined"**
- **Cause** : Ref utilisé avant initialisation
- **Fix** : Vérifier `if (!ref.current) return;` dans useEffect

**Animations ne fonctionnent pas** :
- **Cause 1** : Composant animations pas importé correctement
- **Cause 2** : `prefers-reduced-motion` activé (normal, animations réduites)
- **Cause 3** : Animer propriétés non GPU-accelerated
- **Fix** : Utiliser Playwright pour visualiser, vérifier console errors

---

## 7. Data Models & Schemas

### Formulaire Contact (ContactFormSection)

```typescript
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  company: z.string().min(2, "Nom d'entreprise requis"),
  employees: z.enum(["1-10", "10-50", "50-250", "250+"], {
    required_error: "Sélectionnez la taille de votre équipe"
  }),
  budget: z.enum([
    "moins-5k",
    "5k-15k",
    "15k-50k",
    "50k-plus"
  ], {
    required_error: "Sélectionnez votre budget estimé"
  }),
  timeline: z.enum([
    "immediat",
    "1-3-mois",
    "3-6-mois",
    "6-plus-mois"
  ], {
    required_error: "Sélectionnez votre timeline"
  }),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;
```

### Calculateur ROI (CalculatorROI)

```typescript
const roiCalculatorSchema = z.object({
  employees: z.number().min(1, "Au moins 1 employé"),
  hourlyRate: z.number().min(10, "Salaire horaire minimum 10€"),
  hoursPerWeek: z.number().min(1).max(168, "Entre 1 et 168 heures/semaine"),
  automationCost: z.number().min(2500, "Coût minimum 2 500€"),
});

type ROICalculatorData = z.infer<typeof roiCalculatorSchema>;

// Formule ROI
function calculateROI(data: ROICalculatorData) {
  const annualSavings = data.hoursPerWeek * data.hourlyRate * 52;
  const roi = ((annualSavings - data.automationCost) / data.automationCost) * 100;
  const paybackMonths = Math.ceil(data.automationCost / (annualSavings / 12));

  return {
    annualSavings,
    roi: Math.round(roi),
    paybackMonths,
  };
}
```

### Témoignage Structure

```typescript
interface Testimonial {
  id: string;
  name: string;
  company: string;
  role?: string;
  text: string;
  shortText?: string; // Version courte pour carousel
  imageUrl?: string;
  project: string; // Ex: "Génération de menus", "Veille concurrentielle"
  impact: string; // Ex: "1h → 30min pour toutes mes clientes"
}

// Données depuis Testimonials.md
const testimonials: Testimonial[] = [
  {
    id: "helene-girlsgang",
    name: "Hélène",
    company: "GirlsGang",
    role: "Fondatrice",
    text: "Avant de travailler avec Sablia, je passais près d'une heure à concevoir chaque menu personnalisé pour mes clientes. C'était un processus chronophage qui me prenait une énergie folle. Aujourd'hui, grâce au système d'automatisation développé, je ne fais plus que de la relecture pour l'ensemble de mes clientes - environ 30 minutes pour toutes ! Je peux enfin me concentrer sur ce qui compte vraiment : le conseil nutritionnel et l'accompagnement de mes clientes. Cette automatisation a littéralement transformé ma façon de travailler.",
    shortText: "De 1h de conception par menu à 30 minutes de relecture pour toutes mes clientes. L'automatisation développée par Sablia m'a redonné du temps pour me concentrer sur l'essentiel : mes clientes.",
    project: "Génération de menus",
    impact: "1h → 30min pour toutes les clientes",
  },
  // ... 4 autres témoignages
];
```

### Structure Tarifaire Simplifiée (3 Colonnes)

```typescript
interface PricingColumn {
  id: string;
  title: string; // "Audit & Consulting", "Formations", "Solutions d'Automatisation"
  subtitle: string;
  offers: PricingOffer[];
  highlight?: boolean; // Colonne 2 (Formations) highlighted
  ctaPrimary: {
    text: string;
    url: string;
  };
}

interface PricingOffer {
  name: string;
  price: string; // "GRATUIT", "350€", "2 500 - 5 000€"
  duration?: string; // "30 min", "1h30", "3-7 jours"
  description?: string;
  features: string[];
  roi?: string; // "20 000-80 000€/an"
}

// Exemple Colonne 1: Audit & Consulting
const auditConsulting: PricingColumn = {
  id: "audit-consulting",
  title: "Audit & Consulting",
  subtitle: "Découvrez vos opportunités d'automatisation",
  offers: [
    {
      name: "Appel Découverte",
      price: "GRATUIT",
      duration: "30 min",
      features: [
        "Visio de qualification",
        "Compréhension besoins",
        "Premiers conseils",
      ],
    },
    {
      name: "Audit Express",
      price: "350€",
      duration: "1h30",
      features: [
        "30 min cadrage + 1h session stratégique",
        "Document 5-10 pages",
        "Recommandations actionnables",
        "Suggestions d'automatisations claires",
      ],
    },
  ],
  ctaPrimary: {
    text: "Réserver mon appel",
    url: "https://calendly.com/brice-gachadoat/30min",
  },
};

// Exemple Colonne 2: Formations (HIGHLIGHTED)
const formations: PricingColumn = {
  id: "formations",
  title: "Formations",
  subtitle: "Rendez votre équipe autonome",
  highlight: true, // Badge "Most Popular" + bordure cyan
  offers: [
    {
      name: "Demi-journée",
      price: "700€",
      duration: "3h30",
      features: ["IA générative, automatisation basics, n8n découverte"],
    },
    {
      name: "1 Jour",
      price: "1 200€",
      duration: "7h",
      features: ["IA/automatisation standard, n8n débutant"],
    },
    {
      name: "2 Jours",
      price: "2 200€",
      duration: "14h",
      features: ["n8n avancé + cas pratiques métier"],
    },
    {
      name: "3 Jours",
      price: "3 300€",
      duration: "21h",
      features: ["Formation complète avec certification équipe"],
    },
  ],
  ctaPrimary: {
    text: "Demander un devis formation",
    url: "https://calendly.com/brice-gachadoat/30min",
  },
};

// Exemple Colonne 3: Solutions d'Automatisation
const solutions: PricingColumn = {
  id: "solutions",
  title: "Solutions d'Automatisation",
  subtitle: "Implémentez vos systèmes d'automatisation",
  offers: [
    {
      name: "Workflow Simple",
      price: "2 500 - 5 000€",
      duration: "3-7 jours",
      roi: "20 000-80 000€/an",
      features: [
        "1-2 processus automatisés",
        "Ex: CRM→Email, Sheets→Notion, alertes Slack",
      ],
    },
    {
      name: "Système Standard",
      price: "8 000 - 18 000€",
      duration: "2-4 semaines",
      roi: "80 000-200 000€/an",
      features: [
        "3-5 processus interconnectés",
        "Ex: Pipeline commercial complet, workflow qualité",
      ],
    },
    {
      name: "Transformation Complète",
      price: "25 000 - 60 000€",
      duration: "6-12 semaines",
      roi: "300 000-800 000€/an",
      features: [
        "5+ processus multi-départements",
        "Ex: Automatisation multi-départements, intégration ERP/CRM",
      ],
    },
  ],
  ctaPrimary: {
    text: "Estimer mon projet",
    url: "https://calendly.com/brice-gachadoat/30min",
  },
};

const pricingColumns: PricingColumn[] = [
  auditConsulting,
  formations,
  solutions,
];
```

**Design Notes PricingSection** :
- 3 colonnes égales en largeur sur desktop (grid-cols-3)
- Colonne 2 (Formations) highlighted : bordure cyan 2px, badge "Most Popular" en haut
- Glassmorphism subtil : `backdrop-blur-md bg-v2-white/5`
- Hover : `hover:scale-102 transition-transform duration-300`
- Mobile : Stack vertical (grid-cols-1)

---

## 8. Implementation Tasks

### Phase 1: Setup & Architecture (Priorité MAX)

#### Task 1: Créer structure dossiers v3
**Action**: CREATE
**Location**: `client/src/components/`
**Details**:
```bash
# Créer dossiers
mkdir -p client/src/components/v3
mkdir -p client/src/components/v3-shared
```
**Why**: Séparer composants v3 des v2 pour éviter confusion
**Gotchas**: Ne PAS copier fichiers v2 dans v3

#### Task 2: Créer composant Container réutilisable
**Action**: CREATE
**Location**: `client/src/components/v3-shared/Container.tsx`
**Details**:
```typescript
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export default function Container({
  children,
  className = "",
  maxWidth = "xl",
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-7xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  };

  return (
    <div className={cn(
      "container mx-auto px-4 sm:px-6 lg:px-8",
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}
```
**Why**: Centraliser padding et max-width pour cohérence
**Gotchas**: Utiliser `cn()` pour class merging Tailwind

#### Task 3: Créer composant SectionTitle réutilisable
**Action**: CREATE
**Location**: `client/src/components/v3-shared/SectionTitle.tsx`
**Details**:
```typescript
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { GradientText } from "@/components/animations";

interface SectionTitleProps {
  title: string;
  highlight?: string; // Mot à mettre en gradient
  subtitle?: string;
  alignment?: "left" | "center";
}

export default function SectionTitle({
  title,
  highlight,
  subtitle,
  alignment = "center",
}: SectionTitleProps) {
  const alignClass = alignment === "center" ? "text-center" : "text-left";

  // Split title pour highlight
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <div className={`mb-16 ${alignClass}`}>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-v2-white mb-6"
      >
        {highlight ? (
          <>
            {parts[0]}
            <GradientText>{highlight}</GradientText>
            {parts[1]}
          </>
        ) : (
          title
        )}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-v2-white/80 max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
```
**Why**: Réutiliser pattern titre + subtitle avec animations
**Gotchas**: `viewport.margin` nécessaire pour déclencher animation avant entrée visible

#### Task 4: Créer page principale LandingV3
**Action**: CREATE
**Location**: `client/src/pages/LandingV3.tsx`
**Details**:
```typescript
import { motion } from "framer-motion";
import { CustomCursor, AnimatedParticles } from "@/components/animations";
import Navigation from "@/components/v2/Navigation"; // Réutiliser
import Footer from "@/components/Footer"; // Réutiliser

// Imports des sections v3 (à créer)
import HeroSection from "@/components/v3/HeroSection";
import TestimonialsSection from "@/components/v3/TestimonialsSection";
import LogosCloud from "@/components/v3/LogosCloud";
import ProblemSection from "@/components/v3/ProblemSection";
import SolutionSection from "@/components/v3/SolutionSection";
import ThreeStepProcess from "@/components/v3/ThreeStepProcess";
import PricingSection from "@/components/v3/PricingSection";
import CalculatorROI from "@/components/v3/CalculatorROI";
import ContactFormSection from "@/components/v3/ContactFormSection";
import FaqSection from "@/components/v3/FaqSection";

/**
 * LandingV3 - Refonte complète from scratch
 *
 * Inspiré de chatflowai.co avec:
 * - Curseur custom + particules
 * - Animations scroll fluides (60fps)
 * - Design B2B professionnel
 * - 0-2 emojis max sur toute la page
 */
export default function LandingV3() {
  return (
    <>
      {/* Curseur custom - desktop uniquement */}
      <div className="hidden lg:block">
        <CustomCursor />
      </div>

      {/* Particules animées - toujours visible */}
      <AnimatedParticles />

      {/* Page principale */}
      <motion.div
        className="min-h-screen bg-v2-navy relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Navigation />

        <main>
          <HeroSection />
          <TestimonialsSection />
          <LogosCloud />
          <ProblemSection />
          <SolutionSection />
          <ThreeStepProcess />
          <PricingSection />
          <CalculatorROI />
          <ContactFormSection />
          <FaqSection />
        </main>

        <Footer />
      </motion.div>
    </>
  );
}
```
**Why**: Structure claire avec toutes sections dans ordre optimal
**Gotchas**:
- CustomCursor dans div séparé avec `hidden lg:block`
- AnimatedParticles hors motion.div (fixed position)
- Background `bg-v2-navy` pour cohérence

#### Task 5: Ajouter route dans App.tsx
**Action**: MODIFY
**Location**: `client/src/App.tsx`
**Details**:
```typescript
// Ajouter import
import LandingV3 from "@/pages/LandingV3";

// Dans Router, ajouter route
<Route path="/landingv3" component={LandingV3} />
```
**Why**: Rendre page accessible
**Gotchas**: NE PAS modifier route "/" (garder LandingV3Enhanced actuel)

### Phase 2: Hero Section (Validation visuelle après)

#### Task 6: Créer HeroSection
**Action**: CREATE
**Location**: `client/src/components/v3/HeroSection.tsx`
**Details**:
```typescript
import { motion } from "framer-motion";
import { GradientText, MagneticButton } from "@/components/animations";
import Container from "@/components/v3-shared/Container";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background sophistiqué */}
      <div className="absolute inset-0">
        {/* Gradient animé 3 couleurs */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #0D1B2A 100%)",
              "linear-gradient(135deg, #1B263B 0%, #3E92CC 50%, #1B263B 100%)",
              "linear-gradient(135deg, #0D1B2A 0%, #1B263B 50%, #0D1B2A 100%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Grille subtile */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(82, 209, 220, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(82, 209, 220, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Cercles flous animés */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(82, 209, 220, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(62, 146, 204, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <Container className="relative z-10">
        <motion.div className="max-w-4xl mx-auto text-center">
          {/* Badge Formation-First */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-v2-cyan/30 backdrop-blur-sm mb-8"
          >
            <motion.div
              className="w-2 h-2 bg-v2-cyan rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-semibold text-v2-white/90">
              Formation-First Automation
            </span>
          </motion.div>

          {/* Headline avec GradientText */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-v2-white mb-8 leading-[1.1]"
          >
            Transformez vos processus métier avec{" "}
            <GradientText colors={["#52D1DC", "#3E92CC", "#52D1DC"]}>
              l'IA et l'automation
            </GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl sm:text-2xl text-v2-white/90 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            Réduisez vos coûts de 50 000€+/an. Formation-first automation qui donne à votre équipe les moyens de posséder les systèmes qui pilotent la croissance.
          </motion.p>

          {/* CTAs magnétiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MagneticButton
              strength={0.2}
              className="px-8 py-4 bg-v2-cyan hover:bg-v2-cyan/90 text-v2-navy font-bold rounded-lg text-lg shadow-lg transition-colors relative overflow-hidden group"
              onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
            >
              {/* Effet brillance au survol */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative flex items-center gap-2">
                Diagnostic Gratuit 30min
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </MagneticButton>

            <MagneticButton
              strength={0.2}
              className="px-8 py-4 bg-transparent border-2 border-v2-white text-v2-white hover:bg-v2-white hover:text-v2-navy font-bold rounded-lg text-lg transition-colors"
              onClick={() => {
                const calculator = document.getElementById('calculator-roi');
                calculator?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="flex items-center gap-2">
                Calculer mon ROI
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </motion.svg>
              </span>
            </MagneticButton>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-v2-white/70 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-v2-cyan font-bold text-xl">15+</span>
              <span>clients automatisés</span>
            </div>
            <div className="h-4 w-px bg-v2-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-v2-cyan font-bold text-xl">300%</span>
              <span>ROI moyen</span>
            </div>
            <div className="h-4 w-px bg-v2-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-v2-cyan font-bold text-xl">15h</span>
              <span>économisées/semaine</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-v2-white/30 rounded-full flex items-start justify-center p-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 bg-v2-cyan rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
```
**Why**: Section hero impactante qui établit proposition de valeur immédiatement
**Gotchas**:
- Gradient animé en arrière-plan (pas sur texte)
- CTAs magnétiques avec effet brillance
- Social proof en chiffres clés (pas de texte vague)
- Scroll indicator caché sur mobile (`hidden md:block`)
- ZÉRO emoji dans cette section

#### Task 7: VALIDATION PLAYWRIGHT Hero
**Action**: VALIDATE
**Details**:
```bash
# Terminal 1: Lancer dev server
npm run dev

# Claude: Valider visuellement
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })
mcp__playwright__browser_snapshot()
mcp__playwright__browser_take_screenshot({ filename: "hero-section.png" })
```
**Critères validation** :
- [ ] Gradient animé visible en fond
- [ ] Grille subtile visible
- [ ] Badge "Formation-First" avec pulse cyan
- [ ] Headline avec gradient sur "l'IA et l'automation"
- [ ] 2 CTAs visibles : "Diagnostic Gratuit" cyan, "Calculer mon ROI" outline
- [ ] Social proof avec 3 métriques (15+ clients, 300% ROI, 15h/semaine)
- [ ] Scroll indicator visible desktop uniquement
- [ ] 0 emoji dans section

**If validation fails**: Corriger avant de continuer. Ne PAS passer Task 8 si Hero pas parfait.

### Phase 3: Sections Contenu (Faire 1 par 1 avec validation)

*[Continue avec les 11 autres sections suivant le même pattern détaillé...]*

---

## 9. Testing Strategy

### Visual Validation (PRIORITAIRE)

**Après chaque section implémentée** :
```bash
# Lancer dev
npm run dev

# Valider visuellement avec Playwright
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })
mcp__playwright__browser_snapshot()
mcp__playwright__browser_take_screenshot({ filename: "section-name.png" })
```

**Checklist validation visuelle** :
- [ ] Animations fonctionnent (pas de stutter)
- [ ] Curseur custom visible desktop
- [ ] Particules animées
- [ ] Contraste texte >= 4.5:1
- [ ] Pas d'emojis dans CTAs/navigation
- [ ] Responsive mobile OK

### Unit Tests (Optionnel pour landing page)

Pour formulaires uniquement :
```typescript
// client/src/components/v3/__tests__/ContactFormSection.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactFormSection from '../ContactFormSection';

describe('ContactFormSection', () => {
  it('should validate email format', async () => {
    render(<ContactFormSection />);
    const emailInput = screen.getByPlaceholderText(/email/i);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    expect(await screen.findByText(/email invalide/i)).toBeInTheDocument();
  });
});
```

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check   # TypeScript 0 errors
```
**Doit passer** : Avant commit

### Level 2: Build
```bash
npm run build
```
**Doit passer** : Avant commit
**Critères** :
- 0 errors
- Warnings OK (si pas critiques)
- Bundle size < 300kb JS

### Level 3: Visual Validation
```bash
npm run dev
# Puis Playwright validation complète
```
**Doit passer** : Avant considérer section terminée
**Critères** :
- Toutes animations fonctionnent
- Design conforme guidelines
- 0-2 emojis max sur page entière
- Responsive parfait

### Level 4: Performance (Avant production)
```bash
# Lighthouse CI (après déploiement staging)
npm run build
npm run start
# Lighthouse sur http://localhost:5000/landingv3
```
**Critères** :
- Performance >= 90
- Accessibility = 100
- Best Practices >= 95
- SEO >= 90

---

## 11. Integration Points

### Route Registration
**File**: `client/src/App.tsx`
**Changes**:
```typescript
import LandingV3 from "@/pages/LandingV3";

// Dans <Switch>
<Route path="/landingv3" component={LandingV3} />
```

### No Database Changes
Ce projet ne nécessite PAS de modifications base de données.

### No API Endpoints
Formulaires utiliseront API endpoints existants (si déjà implémentés) ou actions JavaScript simples.

### Environment Variables
Aucune nouvelle variable d'environnement nécessaire.

---

## 12. Critical Anti-Patterns

### DO NOT:

- ❌ **Copier-coller code de LandingV2 ou LandingV3Enhanced** → Perpétue problèmes existants
- ❌ **Modifier composants dans `animations/`** → Risque casser ce qui fonctionne
- ❌ **Utiliser plus de 2 emojis sur la page** → Non professionnel B2B (74% professionnels 45+ trouvent unprofessional)
- ❌ **Emojis dans CTAs, navigation, headings** → Infantilise l'offre
- ❌ **Animer width, height, margin, padding** → Performance horrible, saccadé
- ❌ **Ignorer prefers-reduced-motion** → Problèmes accessibilité graves
- ❌ **Gradients sur texte** → Lisibilité réduite, contraste compromis
- ❌ **Phrases IA clichés** : "delve into", "game-changer", "seamless integration"
- ❌ **Buzzwords vides** : "synergy", "ecosystem", "paradigm shift"
- ❌ **Photos stock génériques** : équipe souriante pointant laptop

### DO:

- ✅ **Créer composants v3/ from scratch** → Nouveaux patterns propres
- ✅ **Réutiliser composants `animations/` tels quels** → Déjà testés et validés
- ✅ **Maximum 0-2 emojis total** → Si utilisés : uniquement sections testimonials/FAQ (jamais CTAs)
- ✅ **Animer UNIQUEMENT transform et opacity** → GPU-accelerated, 60fps garanti
- ✅ **Validation Playwright après chaque section** → Catch issues immédiatement
- ✅ **Langage spécifique et chiffres concrets** : "50 000€+/an", "15h/semaine", "300% ROI"
- ✅ **Palette stricte** : Navy #0A2463, Electric Blue #3E92CC, Cyan #52D1DC
- ✅ **Whitespace généreux** : 80px entre sections, 32px entre éléments

---

## 13. Progressive Success

### Minimal Viable Implementation

**Milestone 1** : Architecture + Hero (1-2 sections)
- Structure dossiers v3/ créée
- LandingV3.tsx avec CustomCursor + AnimatedParticles
- HeroSection fonctionnel avec animations
- Route /landingv3 accessible
- **Validation** : Build passe, Playwright confirms animations work

**Milestone 2** : Contenu marketing (4-5 sections)
- ProblemSection, SolutionSection, ThreeStepProcess
- TestimonialsSection avec carousel
- **Validation** : Content accurate from reference docs, 0-2 emojis max

**Milestone 3** : Services & Tarifs (3 sections)
- ServicesGrid
- PricingSection avec grille tarifaire complète
- **Validation** : All prices match RÉSUMÉ COMPLET.md

**Milestone 4** : Forms & Finalization (3 sections)
- CalculatorROI interactif
- ContactFormSection avec validation Zod
- FaqSection
- **Validation** : Forms work, validation messages clear

### Enhancement Phase

**After MVP works** :
1. Polish animations (stagger effects, micro-interactions)
2. Optimize images (WebP, lazy loading)
3. Add SEO metadata
4. Performance audit Lighthouse
5. Cross-browser testing
6. Accessibility audit

---

## Final Validation Checklist

### Before Marking Complete:

**Functionality** :
- [ ] All 12 sections present with real content
- [ ] Route /landingv3 accessible and renders correctly
- [ ] CustomCursor visible on desktop only
- [ ] AnimatedParticles animating in background
- [ ] All scroll animations trigger correctly
- [ ] Forms validate with Zod (show error messages)
- [ ] ROI calculator computes correctly
- [ ] All CTAs link to correct destinations

**Design & Content** :
- [ ] 0-2 emojis maximum on entire page
- [ ] Zero emojis in CTAs, navigation, headings
- [ ] All prices match RÉSUMÉ COMPLET.md
- [ ] All testimonials from Testimonials.md (5 clients)
- [ ] Palette respected: Navy, Electric Blue, Cyan only
- [ ] Typography hierarchy: H1 72px, H2 48px, Body 16-18px
- [ ] Whitespace: 80px between sections

**Technical** :
- [ ] `npm run build` passes (0 errors)
- [ ] `npm run check` passes (TypeScript 0 errors)
- [ ] No console errors when navigating site
- [ ] Responsive works: mobile, tablet, desktop
- [ ] prefers-reduced-motion respected (animations reduce)

**Performance** :
- [ ] Lighthouse Performance >= 90
- [ ] Lighthouse Accessibility = 100
- [ ] Animations run at 60fps
- [ ] Page loads < 3 seconds

**Validation Evidence** :
- [ ] Playwright screenshots saved for each section
- [ ] Build output logs show success
- [ ] Manual testing checklist completed

---

## Confidence Score: 9.5/10

**Why high confidence?**
- ✅ Composants d'animation déjà existants et testés
- ✅ Patterns de code clairs dans v2 components (à adapter, pas copier)
- ✅ Documentation complète (tarifs, témoignages, design guide)
- ✅ Stack technique validé (Framer Motion, GSAP, Zod déjà installés)
- ✅ Validation Playwright intégrée au workflow
- ✅ Examples de code fournis pour chaque pattern
- ✅ Structure simplifiée (11 sections au lieu de 12, plus cohérent)
- ✅ Testimonials après Hero = meilleur parcours conversion

**Changements par rapport à INITIAL.md** :
- 📍 **Testimonials déplacés après Hero** (position 2 au lieu de 6) → Social proof immédiat
- 📍 **ServicesGrid supprimé** → Tout regroupé dans PricingSection simplifiée
- 📍 **PricingSection simplifiée en 3 colonnes** : Audit & Consulting / Formations / Solutions d'automatisation
- 📍 Résultat : **11 sections au lieu de 12**, parcours plus clair et pédagogique

**Risques identifiés** :
- ⚠️ Volume de travail réduit (11 sections) mais toujours conséquent → Mitigation: approche progressive
- ⚠️ Besoin validation visuelle fréquente → Mitigation: Playwright après chaque section
- ⚠️ Tentation de copier v2 code → Mitigation: anti-patterns explicites

**Pourquoi pas 10/10?**
- Quelques sections nécessitent créativité design (ex: ThreeStepProcess timeline)
- Contenu testimonials nécessite curation/sélection versions longues vs courtes
- Besoin ajuster animations selon feedback utilisateur réel

---

## Next Steps After PRP Approval

1. **Lire entièrement ce PRP** avant de commencer
2. **Créer TodoList** avec items de Phase 1 d'abord
3. **Développer progressivement** : Phase 1 → Validation → Phase 2 → etc.
4. **Validation Playwright OBLIGATOIRE** après chaque section
5. **Commit fréquents** avec messages descriptifs
6. **Demander feedback** au user après chaque milestone

---

## Appendix: Contenu Marketing Complet

### Témoignages (5 clients)

**1. Hélène - GirlsGang (Génération menus)**
- Long: "Avant de travailler avec Sablia, je passais près d'une heure à concevoir chaque menu personnalisé pour mes clientes. C'était un processus chronophage qui me prenait une énergie folle. Aujourd'hui, grâce au système d'automatisation développé, je ne fais plus que de la relecture pour l'ensemble de mes clientes - environ 30 minutes pour toutes ! Je peux enfin me concentrer sur ce qui compte vraiment : le conseil nutritionnel et l'accompagnement de mes clientes. Cette automatisation a littéralement transformé ma façon de travailler."
- Court: "De 1h de conception par menu à 30 minutes de relecture pour toutes mes clientes. L'automatisation développée par Sablia m'a redonné du temps pour me concentrer sur l'essentiel : mes clientes."

**2. Directeur anonyme (Veille concurrentielle)**
- Long: "Le système de veille concurrentielle développé par Sablia a été un véritable game-changer pour notre stratégie. Nous avons pu repositionner notre relation avec nos partenaires et obtenir une visibilité complète sur notre marché. Aujourd'hui, nous ne subissons plus la concurrence, nous l'anticipons. Cette longueur d'avance est devenue notre principal avantage compétitif."
- Court: "Une vision à 360° de notre marché et une longueur d'avance sur nos concurrents. Ce système de veille nous a permis de passer d'une position réactive à une stratégie proactive."

**3. Yassine - Norloc (Agent vocal + CRM)**
- Long: "L'intégration de l'agent vocal développé par Voipia avec l'automatisation de notre CRM a complètement révolutionné notre gestion des prospects. Nos équipes gagnent un temps précieux, les informations sont centralisées automatiquement, et nous ne perdons plus aucune opportunité. La qualité du suivi s'est considérablement améliorée, et nos taux de conversion ont significativement augmenté. Un investissement qui s'est rentabilisé en quelques semaines."
- Court: "Notre gestion des prospects est passée au niveau supérieur. L'agent vocal couplé à l'automatisation du CRM nous fait gagner des heures chaque semaine et améliore nos taux de conversion."

**4. Valentin - Stefano Design & Exotic Design (Réactivation BDD)**
- Long: "Nous avions des milliers de contacts dormants dans nos bases de données, un trésor inexploité. L'agent vocal développé par Voipia nous permet aujourd'hui de réactiver ces prospects de manière automatisée et personnalisée. C'est comme avoir une équipe commerciale qui travaille 24/7 pour redonner vie à notre portefeuille client. Les résultats sont là : des rendez-vous qualifiés et un ROI impressionnant sur un actif que nous pensions perdu."
- Court: "Des milliers de contacts dormants transformés en opportunités commerciales concrètes. L'agent vocal nous a permis d'exploiter un gisement de valeur que nous avions sous-estimé."

**5. Amir - Entreprise BTP (Gestion interventions)**
- Long: "Dans le BTP, chaque minute compte et la désorganisation coûte cher. L'automatisation de la gestion de nos interventions développée par Sablia a rationalisé l'ensemble de notre process : de la demande client à la planification des équipes, en passant par le suivi des chantiers. Fini les doublons, les oublis, les plannings à refaire manuellement. Nous avons gagné en réactivité, en professionnalisme, et nos clients le ressentent. C'est simple : on ne pourrait plus s'en passer."
- Court: "De la demande client au suivi de chantier, tout est automatisé. Plus de temps perdu, plus d'erreurs, juste de l'efficacité. Notre organisation a été transformée."

### Structure Tarification Simplifiée (3 Colonnes pour PricingSection)

La section PricingSection doit présenter **3 colonnes claires** au lieu d'une grille complexe :

#### Colonne 1: Audit & Consulting
**Découvrez vos opportunités d'automatisation**

- **Appel Découverte** : GRATUIT (30 min)
  - Visio de qualification
  - Compréhension besoins
  - Premiers conseils
  - CTA: "Réserver mon appel"

- **Audit Express** : 350€ (1h30)
  - 30 min cadrage + 1h session stratégique
  - Document 5-10 pages avec recommandations actionnables
  - Suggestions d'automatisations claires
  - Regard expert sans engagement long
  - CTA: "Commander un Audit Express"

#### Colonne 2: Formations ⭐ HIGHLIGHT
**Rendez votre équipe autonome**

- **Demi-journée** : 700€ (3h30 intra-entreprise)
  - IA générative, automatisation basics, découverte n8n

- **1 Jour** : 1 200€ (7h intra-entreprise)
  - IA/automatisation standard, n8n débutant

- **2 Jours** : 2 200€ (14h sur 2 jours)
  - n8n avancé + cas pratiques métier

- **3 Jours** : 3 300€ (parcours intensif 21h)
  - Formation complète avec certification équipe

**CTA principal** : "Demander un devis formation"

#### Colonne 3: Solutions d'Automatisation
**Implémentez vos systèmes d'automatisation**

- **Workflow Simple** : 2 500 - 5 000€
  - 1-2 processus automatisés
  - Durée : 3-7 jours
  - ROI attendu : 20 000-80 000€/an
  - Exemples : CRM→Email, Sheets→Notion, alertes Slack

- **Système Standard** : 8 000 - 18 000€
  - 3-5 processus interconnectés
  - Durée : 2-4 semaines
  - ROI attendu : 80 000-200 000€/an
  - Exemples : Pipeline commercial complet, workflow qualité multi-étapes

- **Transformation Complète** : 25 000 - 60 000€
  - 5+ processus multi-départements
  - Durée : 6-12 semaines
  - ROI attendu : 300 000-800 000€/an
  - Exemples : Automatisation multi-départements, intégration ERP/CRM

**CTA principal** : "Estimer mon projet"

**Note design** :
- Colonne 2 (Formations) avec bordure cyan et badge "Most Popular"
- Toutes colonnes sur fond semi-transparent avec glassmorphism subtil
- Hover effect : scale 1.02 + shadow plus prononcée

### FAQ (8-10 questions)

1. **Quelle est la différence entre votre approche "Formation-First" et les autres consultants automation?**
   - Nous formons vos équipes AVANT d'automatiser, garantissant autonomie à long terme.

2. **Quel ROI puis-je attendre de l'automatisation?**
   - Clients PME: 50-150k€/an. Clients ETI: 300-800k€/an. Payback moyen: 3-6 mois.

3. **Utilisez-vous des outils propriétaires ou open-source?**
   - Stack souverain 100% européen: n8n + open-source. Zéro vendor lock-in, contrôle total.

4. **Combien de temps prend un projet d'automatisation typique?**
   - Workflow Simple: 3-7 jours. Système Standard: 2-4 semaines. Transformation: 6-12 semaines.

5. **Proposez-vous du support après la livraison?**
   - Oui: 2 semaines à 3 mois inclus selon projet. Retainer disponible dès 1 500€/mois.

6. **Quels types de processus pouvez-vous automatiser?**
   - CRM, facturation, reporting, gestion leads, workflows métier, intégrations multi-outils.

7. **Ai-je besoin de compétences techniques pour utiliser vos solutions?**
   - Non. Formation complète incluse. Interfaces no-code. Support continu disponible.

8. **Que se passe-t-il si mes besoins évoluent?**
   - Architecture évolutive. Retainer mensuel pour ajouts/modifications illimités.

9. **Travaillez-vous avec des entreprises de ma taille?**
   - Oui: PME (10-50), ETI (50-250), Grandes entreprises (250+). Offres adaptées.

10. **Comment démarrer avec Sablia?**
    - Appel gratuit 30min → Audit Express 350€ (optionnel) → Diagnostic IA → Implémentation.

---

**END OF PRP**
