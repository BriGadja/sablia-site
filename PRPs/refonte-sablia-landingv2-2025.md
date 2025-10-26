# PRP: Refonte Sablia Landing Page v2

**Created**: 2025-01-26
**Target**: `/landingv2` route isolée
**Confidence Score**: 9/10

---

## Philosophy: Context is King + Isolation Stricte

Ce PRP suit une validation-loop approach avec **isolation totale** de la version actuelle:
1. **Setup & Isolation**: Créer structure v2 sans toucher à l'existant
2. **Component Development**: Build composants v2 from scratch
3. **Page Assembly**: Composer LandingV2.tsx section par section
4. **Validation Gates**: Type checking, build, visual comparison
5. **Performance & A11y**: Optimisation finale

**RÈGLE ABSOLUE**: Aucune modification des fichiers existants. Tout dans `v2/` et `LandingV2.tsx`.

---

## 1. Goal and Why

**What are we building?**
Une refonte complète de la landing page Sablia.io accessible via `/landingv2`, permettant des comparaisons A/B et un rollback instantané si nécessaire.

**Why are we building it?**
- Nouvelle direction visuelle (Minimalisme Gradient + Swiss Design)
- Architecture d'information optimisée (3 Pathways vs 6 services dispersés)
- Transparence tarifaire = différenciation majeure (seuls 18% des concurrents le font)
- Évolution de l'offre Sablia 2025 avec grille tarifaire structurée
- Tests A/B pour mesurer impact sur conversions

---

## 2. What (Requirements)

### User-Visible Behavior

**Route `/landingv2` affiche** :
1. Hero section avec gradient Navy→Electric Blue
2. Logos clients pour social proof
3. Section problème-first (3 douleurs spécifiques)
4. Solution (3 piliers différenciateurs Sablia)
5. Processus en 3 étapes
6. **3 Pathways pricing** (Découvrir / Transformer / Réaliser)
7. Grille tarifaire détaillée avec transparence
8. Testimonials avec métriques
9. FAQ stratégique
10. Footer

**Route `/` reste intacte** avec la version actuelle.

### Functional Requirements

**Isolation stricte** :
- Tous les nouveaux composants dans `client/src/components/v2/`
- Nouvelle page `client/src/pages/LandingV2.tsx`
- Route `/landingv2` ajoutée dans `App.tsx`
- Couleurs Tailwind préfixées `v2-navy`, `v2-electric`, `v2-cyan`
- Aucune modification dans `components/ui/` ou `pages/Home.tsx`

**Interactivité** :
- Pathways expandable (progressive disclosure)
- Calculateur ROI fonctionnel avec inputs temps réel
- Animations Framer Motion (respect prefers-reduced-motion)
- Navigation sticky avec CTA "Audit Gratuit"
- Formulaires avec validation Zod

**Design System** :
- Palette: Navy #0A2463, Electric Blue #3E92CC, Cyan #52D1DC
- Typographie: Inter (72px → 14px scale)
- Espacement base 8px
- Grid 12 colonnes
- Breakpoints: 640px, 768px, 1024px, 1280px

### Non-Functional Requirements

**Performance** :
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- Bundle JS < 100kb initial

**Accessibility** :
- WCAG 2.1 Level AA
- Contraste 4.5:1 minimum
- Navigation clavier complète
- prefers-reduced-motion respecté

**SEO** (même si route temporaire) :
- Meta tags appropriés
- Semantic HTML
- Alt tags sur images

---

## 3. Success Criteria

The implementation is complete when:

- [ ] Route `/landingv2` accessible et fonctionnelle
- [ ] Route `/` toujours fonctionnelle sans régression
- [ ] Tous les composants v2 créés dans `client/src/components/v2/`
- [ ] Aucun fichier modifié dans `components/ui/` ou `pages/Home.tsx`
- [ ] Couleurs v2 ajoutées à `tailwind.config.ts` (préfixées)
- [ ] 10 sections landing page implémentées
- [ ] Calculateur ROI fonctionnel avec visualisation
- [ ] Pathways expandable working
- [ ] Animations Framer Motion respectant a11y
- [ ] Tests TypeScript: `npm run check` passes
- [ ] Build: `npm run build` succeeds
- [ ] Visual comparison possible entre `/` et `/landingv2`
- [ ] Performance budget respecté (Lighthouse > 90)
- [ ] Accessibility audit passed (WCAG AA)

---

## 4. Documentation & References

### Official Documentation

**React & Build** :
- Wouter routing: https://github.com/molefrog/wouter
- Framer Motion: https://www.framer.com/motion/
  - whileInView: https://www.framer.com/motion/gestures/#viewport-scroll
  - Variants: https://www.framer.com/motion/animation/#variants
- Tailwind CSS: https://tailwindcss.com/docs

**Forms & Validation** :
- React Hook Form: https://react-hook-form.com/docs
- Zod: https://zod.dev

**Charts** :
- Recharts: https://recharts.org/en-US/
  - Bar Chart: https://recharts.org/en-US/api/BarChart
  - Pie Chart: https://recharts.org/en-US/api/PieChart

### Relevant Code Examples

**Existing patterns to REFERENCE (not modify)** :
- `client/src/App.tsx` - Wouter routing pattern
- `client/src/pages/Home.tsx` - Page structure with sections
- `client/src/components/ui/button.tsx` - cva variants pattern
- `client/src/components/ui/card.tsx` - shadcn/ui pattern
- `client/src/components/HeroSection.tsx` - Hero structure
- `tailwind.config.ts` - Color system avec CSS variables

**DO NOT MODIFY these files** - only use them as reference for patterns.

### External Resources (from INITIAL_refonte.md)

**Design Inspiration** :
- Awwwards Igloo Inc (Site de l'Année 2024)
- Awwwards Kriss.ai
- Awwwards Shopify Plus

**Competitor Analysis** :
- Flowmondo.com/n8n-experts (structure pathways)
- MQLFlow.com (transparence tarifaire)
- Bitovi.com/n8n-automation-consulting (offre gratuite)

---

## 5. Codebase Context

### Current Structure
```
client/src/
├── pages/
│   ├── Home.tsx              ← EXISTING (DO NOT MODIFY)
│   ├── About.tsx
│   ├── Roi.tsx
│   ├── GapForm.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/                   ← EXISTING shadcn/ui (DO NOT MODIFY)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ... (45+ components)
│   ├── HeroSection.tsx       ← EXISTING (DO NOT MODIFY)
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ...
├── App.tsx                   ← WILL MODIFY (add route)
├── lib/
│   └── utils.ts
└── hooks/
    └── use-mobile.tsx
```

### Desired Structure (After Implementation)
```
client/src/
├── pages/
│   ├── Home.tsx              ← UNTOUCHED
│   └── LandingV2.tsx         ← ✨ NEW
├── components/
│   ├── ui/                   ← UNTOUCHED
│   └── v2/                   ← ✨ NEW FOLDER
│       ├── Hero.tsx
│       ├── Container.tsx
│       ├── Section.tsx
│       ├── Button.tsx        (variants v2)
│       ├── Card.tsx          (Swiss design style)
│       ├── PricingPathways.tsx
│       ├── PathwayCard.tsx
│       ├── PricingGrid.tsx
│       ├── PricingCard.tsx
│       ├── CalculatorROI.tsx
│       ├── ThreeStepProcess.tsx
│       ├── TestimonialCard.tsx
│       ├── TestimonialGrid.tsx
│       ├── FaqSection.tsx
│       ├── LogosCloud.tsx
│       └── Navigation.tsx
└── App.tsx                   ← Route `/landingv2` added
```

### Key Files to Modify

**1. `tailwind.config.ts`**
- **Action**: INJECT
- **Location**: In `theme.extend.colors`
- **What**: Add v2 color palette
- **Why**: New colors for v2 design
- **Gotcha**: Use prefixes to avoid conflicts

**2. `client/src/App.tsx`**
- **Action**: INJECT
- **Location**: In `<Switch>` before `<Route component={NotFound} />`
- **What**: Add route `<Route path="/landingv2" component={LandingV2} />`
- **Why**: Enable access to new landing page
- **Gotcha**: Import LandingV2 at top

**3. `client/src/pages/LandingV2.tsx`**
- **Action**: CREATE
- **Location**: New file
- **What**: Main landing page v2 component
- **Why**: The refonte itself

**4. All files in `client/src/components/v2/`**
- **Action**: CREATE
- **Location**: New folder and files
- **What**: All new v2 components
- **Why**: Isolation from existing components

---

## 6. Known Gotchas & Pitfalls

### Library-Specific Quirks

**Tailwind with CSS Variables** :
- Current config uses `hsl(var(--primary))` pattern
- v2 colors must follow same pattern for consistency
- Add CSS variables in `client/src/index.css` or use direct hex

**Framer Motion** :
- Already imported in project
- `prefers-reduced-motion` is respected automatically by Framer Motion
- BUT animations must have fallback (no motion = instant appearance)

**Wouter Routing** :
- Uses `<Route path="/path" component={Component} />`
- NO `exact` prop needed (automatically exact)
- Nested routes use parent path

### Common Mistakes to Avoid

❌ **Modifying existing components**
- Don't touch `components/ui/button.tsx`
- Create `components/v2/Button.tsx` instead

❌ **Importing from wrong path**
- Don't: `import { Button } from '@/components/ui/button'` in v2 files
- Do: `import { Button } from '@/components/v2/Button'`
- Exception: If explicitly reusing base component, import explicitly

❌ **Tailwind color naming conflicts**
- Don't: `navy: '#0A2463'` (conflicts if exists)
- Do: `v2-navy: '#0A2463'`

❌ **Forgetting breakpoints**
- Mobile-first: `text-4xl md:text-6xl` not `text-6xl md:text-4xl`

❌ **Animation without reduced-motion fallback**
```tsx
// ❌ Bad
<motion.div animate={{ x: 100 }}>

// ✅ Good
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 0.3 }}
  // Framer Motion auto-respects prefers-reduced-motion
>
```

### Error Patterns

**Error**: `Module not found: Can't resolve '@/components/v2/Hero'`
- **Cause**: v2 folder not created or component not exported
- **Fix**: Ensure folder exists and component has `export default`

**Error**: `Type error in LandingV2.tsx`
- **Cause**: Missing types on component props
- **Fix**: Add TypeScript interfaces for all props

**Error**: `Build fails with "Cannot read property of undefined"`
- **Cause**: Accessing Tailwind colors that don't exist
- **Fix**: Ensure v2 colors added to tailwind.config.ts before using

---

## 7. Data Models & Schemas

### Tailwind Colors Configuration

```typescript
// In tailwind.config.ts, add to theme.extend.colors:
{
  'v2-navy': '#0A2463',
  'v2-electric': '#3E92CC',
  'v2-cyan': '#52D1DC',
  'v2-white': '#FFFFFF',
  'v2-off-white': '#F8F9FA',
  'v2-charcoal': '#2D3142',
}
```

### Component Props Types

```typescript
// PathwayCard props
interface PathwayCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  highlighted?: boolean;
  expandable?: boolean;
  children?: React.ReactNode;
}

// PricingCard props
interface PricingCardProps {
  title: string;
  price: string;
  duration?: string;
  features: string[];
  roi?: string;
  examples?: string[];
  ctaText: string;
  ctaHref: string;
}

// CalculatorROI state
interface ROICalculatorState {
  employees: number;
  hoursPerWeek: number;
  hourlyRate: number;
  manualProcesses: number;
}

interface ROIResults {
  annualCost: number;
  potentialSavings: number;
  roiPercentage: number;
  timeSaved: number;
}
```

### Content Data Structures

```typescript
// Pathways data
const pathways = [
  {
    id: 'discover',
    title: 'DÉCOUVRIR',
    subtitle: 'Voir si l\'automation a du sens',
    items: [
      {
        name: 'Appel gratuit',
        price: 'GRATUIT',
        duration: '30 min',
        features: ['Qualification besoins', 'Première recommandation'],
        ctaText: 'Réserver mon appel',
        ctaHref: 'https://calendly.com/...',
      },
      {
        name: 'Audit Express',
        price: '350€',
        duration: '1h30',
        features: ['Document 5-10 pages', 'Recommandations actionnables'],
        ctaText: 'Commander un audit',
        ctaHref: '/contact',
      },
    ],
  },
  // ... TRANSFORMER, RÉALISER
];
```

---

## 8. Implementation Tasks

Execute these tasks in strict order:

### PHASE 1: Setup & Configuration (Critical Foundation)

#### Task 1.1: Add v2 colors to Tailwind
**Action**: INJECT
**Location**: `tailwind.config.ts` line 63 (in `theme.extend.colors`)
**Details**:
```typescript
// Add after existing colors, before closing brace:
'v2-navy': '#0A2463',
'v2-electric': '#3E92CC',
'v2-cyan': '#52D1DC',
'v2-white': '#FFFFFF',
'v2-off-white': '#F8F9FA',
'v2-charcoal': '#2D3142',
```
**Why**: Enable v2 color palette in Tailwind classes
**Gotchas**:
- Don't remove existing colors
- Ensure comma after previous color entry
- Follow exact hex codes from INITIAL_refonte.md

#### Task 1.2: Create v2 components folder
**Action**: CREATE
**Location**: `client/src/components/v2/` (new folder)
**Details**: Create empty folder
**Why**: Organize all v2 components separately
**Gotchas**: Path alias `@/components/v2/` should work automatically

#### Task 1.3: Create Container component (base layout)
**Action**: CREATE
**Location**: `client/src/components/v2/Container.tsx`
**Details**:
```typescript
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "default" | "narrow" | "wide";
}

export default function Container({
  children,
  className,
  maxWidth = "default"
}: ContainerProps) {
  const widths = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1400px]",
  };

  return (
    <div className={cn(
      "container mx-auto px-4 sm:px-6 lg:px-8",
      widths[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}
```
**Why**: 12-column grid container with consistent spacing
**Gotchas**: Reuses existing `cn` utility from shadcn/ui

#### Task 1.4: Create Section wrapper component
**Action**: CREATE
**Location**: `client/src/components/v2/Section.tsx`
**Details**:
```typescript
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  background?: "white" | "off-white" | "navy";
  spacing?: "default" | "tight" | "loose";
}

export default function Section({
  children,
  className,
  background = "white",
  spacing = "default"
}: SectionProps) {
  const backgrounds = {
    white: "bg-v2-white",
    "off-white": "bg-v2-off-white",
    navy: "bg-v2-navy text-v2-white",
  };

  const spacings = {
    tight: "py-12 sm:py-16",
    default: "py-16 sm:py-20 lg:py-24",
    loose: "py-24 sm:py-32 lg:py-40",
  };

  return (
    <section className={cn(
      backgrounds[background],
      spacings[spacing],
      className
    )}>
      {children}
    </section>
  );
}
```
**Why**: Consistent section spacing (80px = py-20)
**Gotchas**: Uses v2 color classes

---

### PHASE 2: Core v2 Components (Building Blocks)

#### Task 2.1: Create v2 Button component
**Action**: CREATE
**Location**: `client/src/components/v2/Button.tsx`
**Details**:
```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-v2-electric focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-v2-cyan text-v2-white hover:bg-v2-cyan/90 shadow-sm hover:shadow-md",
        secondary: "bg-v2-electric text-v2-white hover:bg-v2-electric/90",
        outline: "border-2 border-v2-navy text-v2-navy hover:bg-v2-navy hover:text-v2-white",
        ghost: "text-v2-navy hover:bg-v2-off-white",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```
**Why**: v2-specific button styles with new color palette
**Gotchas**:
- Uses `cva` pattern like existing button.tsx
- v2-cyan for primary CTA (not orange)
- Inter font-semibold (not medium)

#### Task 2.2: Create v2 Card component (Swiss design)
**Action**: CREATE
**Location**: `client/src/components/v2/Card.tsx`
**Details**:
```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-v2-white shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6 sm:p-8", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-bold tracking-tight text-v2-navy",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base text-v2-charcoal/80", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 sm:p-8 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 sm:p-8 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```
**Why**: Clean Swiss design cards for pricing/features
**Gotchas**:
- Subtle shadow (not heavy like neumorphic)
- v2-navy for titles
- Generous padding (24-32px = p-6 sm:p-8)

---

### PHASE 3: Hero Section (First Impression)

#### Task 3.1: Create Hero component
**Action**: CREATE
**Location**: `client/src/components/v2/Hero.tsx`
**Details**:
```typescript
import { motion } from "framer-motion";
import { Button } from "./Button";
import Container from "./Container";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-v2-navy via-v2-navy to-v2-electric overflow-hidden">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-v2-navy/20" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-v2-white mb-6 leading-tight"
          >
            Vos meilleurs collaborateurs se{" "}
            <span className="text-v2-cyan">noient</span> dans le copier-coller
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-v2-white/90 mb-12 leading-relaxed"
          >
            Formation-first automation qui donne à votre équipe les moyens
            de posséder les systèmes qui pilotent la croissance
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              variant="primary"
              onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
            >
              Diagnostic gratuit 30 min
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-v2-white text-v2-white hover:bg-v2-white hover:text-v2-navy"
              onClick={() => {
                const calculator = document.getElementById('calculator-roi');
                calculator?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Calculer mon ROI automation
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
```
**Why**: Gradient hero with clear value prop, 2 CTAs (TOFU + MOFU)
**Gotchas**:
- Gradient Navy → Electric Blue at 45deg (via Tailwind `bg-gradient-to-br`)
- Text 72px = text-7xl (mobile scales down)
- Framer Motion animations auto-respect prefers-reduced-motion
- Smooth scroll to calculator (not hard jump)

---

### PHASE 4: Navigation (Sticky Header)

#### Task 4.1: Create Navigation component
**Action**: CREATE
**Location**: `client/src/components/v2/Navigation.tsx`
**Details**:
```typescript
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-v2-white/95 backdrop-blur-sm shadow-md"
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/">
            <a className={cn(
              "text-2xl font-bold transition-colors",
              isScrolled ? "text-v2-navy" : "text-v2-white"
            )}>
              Sablia
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#solutions"
              className={cn(
                "text-sm font-medium transition-colors hover:text-v2-electric",
                isScrolled ? "text-v2-charcoal" : "text-v2-white"
              )}
            >
              Solutions
            </a>
            <a
              href="#tarifs"
              className={cn(
                "text-sm font-medium transition-colors hover:text-v2-electric",
                isScrolled ? "text-v2-charcoal" : "text-v2-white"
              )}
            >
              Tarifs
            </a>
            <a
              href="#cas-clients"
              className={cn(
                "text-sm font-medium transition-colors hover:text-v2-electric",
                isScrolled ? "text-v2-charcoal" : "text-v2-white"
              )}
            >
              Cas Clients
            </a>
            <Link href="/about">
              <a className={cn(
                "text-sm font-medium transition-colors hover:text-v2-electric",
                isScrolled ? "text-v2-charcoal" : "text-v2-white"
              )}>
                À propos
              </a>
            </Link>

            <Button
              size="sm"
              variant="primary"
              onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
            >
              Audit Gratuit
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            aria-label="Menu"
          >
            <svg className={cn("w-6 h-6", isScrolled ? "text-v2-navy" : "text-v2-white")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
```
**Why**: Sticky nav with background change on scroll, CTA always visible
**Gotchas**:
- Transparent when at top, white when scrolled
- Smooth transition (300ms)
- Desktop-first navigation (hamburger mobile TODO if needed)
- Anchor links for smooth scroll to sections

---

### PHASE 5: Main Landing Page Assembly

#### Task 5.1: Create LandingV2.tsx page
**Action**: CREATE
**Location**: `client/src/pages/LandingV2.tsx`
**Details**:
```typescript
import { motion } from "framer-motion";
import Navigation from "@/components/v2/Navigation";
import Hero from "@/components/v2/Hero";
import Footer from "@/components/Footer"; // Reuse existing footer for now

export default function LandingV2() {
  return (
    <motion.div
      className="min-h-screen bg-v2-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Navigation />
      <main>
        <Hero />

        {/* TODO: Add sections as they're built */}
        {/* <LogosCloud /> */}
        {/* <ProblemSection /> */}
        {/* <SolutionSection /> */}
        {/* <ThreeStepProcess /> */}
        {/* <PricingPathways /> */}
        {/* <PricingGrid /> */}
        {/* <TestimonialGrid /> */}
        {/* <FaqSection /> */}

        <div className="py-20 text-center">
          <p className="text-v2-charcoal">
            🚧 LandingV2 en construction - Sections à venir
          </p>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
}
```
**Why**: Page structure ready to receive sections
**Gotchas**:
- Reuses existing Footer (acceptable for now)
- Sections commented out until built
- White background (not dark like current)

#### Task 5.2: Add route in App.tsx
**Action**: INJECT
**Location**: `client/src/App.tsx` line 10 (after imports)
**Details**:
```typescript
// Add import at top:
import LandingV2 from "@/pages/LandingV2";

// In Router function, add route before NotFound:
<Route path="/landingv2" component={LandingV2} />
```
**Why**: Make `/landingv2` accessible
**Gotchas**:
- Must be BEFORE `<Route component={NotFound} />`
- Wouter doesn't need `exact` prop

---

### PHASE 6: Validation Gate 1 (Checkpoint)

#### Task 6.1: Type checking
**Action**: VALIDATE
**Command**: `npm run check`
**Expected**: No TypeScript errors
**Fix if fails**: Check all imports, prop types, missing exports

#### Task 6.2: Build test
**Action**: VALIDATE
**Command**: `npm run build`
**Expected**: Build succeeds without errors
**Fix if fails**: Check Tailwind classes, imports, syntax

#### Task 6.3: Visual verification
**Action**: MANUAL TEST
**Steps**:
1. Run `npm run dev`
2. Visit `http://localhost:5000/`
3. Verify existing site works (no regression)
4. Visit `http://localhost:5000/landingv2`
5. Verify Hero section displays with gradient
6. Verify Navigation sticky behavior works
7. Verify CTAs clickable

---

### PHASE 7: Remaining Sections (Continue build)

Due to PRP length constraints, remaining sections follow same pattern:

#### Task 7.1: LogosCloud
- Create `components/v2/LogosCloud.tsx`
- Display 10-20 client logos in grid
- Add to LandingV2.tsx after Hero

#### Task 7.2: ProblemSection
- "Vous êtes coincé entre croissance et burnout"
- 3 douleurs spécifiques with icons
- Before/After Grid pattern

#### Task 7.3: SolutionSection
- 3 piliers: Formation, Stack souverain, ROI
- Cards avec icônes, headlines audacieux, métriques

#### Task 7.4: ThreeStepProcess
- Timeline visuelle 3 étapes
- Expandable details
- CTA "Commencez par l'étape 1"

#### Task 7.5: PricingPathways
- 3 colonnes: Découvrir / Transformer / Réaliser
- Progressive disclosure (expandable)
- Anchoring (Premium à gauche)
- Badge "Plus populaire" sur TRANSFORMER

#### Task 7.6: PricingGrid
- Grille détaillée 6 services
- Transparence: prix + ROI + exemples
- Cards avec hover effects

#### Task 7.7: CalculatorROI
- Inputs: employees, heures, salaire, processus
- Calculs temps réel (debounced 300ms)
- Recharts visualisation (Bar + Pie)
- CTA après résultats

#### Task 7.8: TestimonialGrid
- 5-8 testimonials avec photos
- Nom + fonction + entreprise
- Métriques spécifiques
- Grid responsive

#### Task 7.9: FaqSection
- Accordion pattern (reuse shadcn/ui Accordion)
- Gestion objections pricing
- Pourquoi n8n vs Zapier

#### Task 7.10: Final polish
- Smooth scroll between sections
- Animations on scroll (Framer Motion whileInView)
- Mobile responsive adjustments
- Dark mode support (optional)

---

## 9. Testing Strategy

### Unit Tests (Optional but recommended)

Location: `client/src/components/v2/__tests__/`

Test critical components:
- CalculatorROI: calculs corrects
- PricingPathways: expand/collapse works
- Navigation: scroll behavior

### Integration Tests

Manual testing checklist:

**Navigation** :
- [ ] Sticky behavior works
- [ ] Links scroll to sections
- [ ] CTA opens Calendly
- [ ] Works on mobile

**Hero** :
- [ ] Gradient displays correctly
- [ ] CTAs functional
- [ ] Responsive on mobile
- [ ] Animations smooth (or disabled with reduced-motion)

**Forms** (if any):
- [ ] Validation works
- [ ] Error messages clear
- [ ] Success feedback

**CalculatorROI** :
- [ ] Inputs accept numbers only
- [ ] Calculations correct
- [ ] Charts render
- [ ] Mobile friendly

### Accessibility Tests

- [ ] Keyboard navigation works
- [ ] Focus visible on all interactive elements
- [ ] ARIA labels present
- [ ] Color contrast 4.5:1 minimum (use WebAIM checker)
- [ ] Screen reader compatible (test with NVDA)
- [ ] prefers-reduced-motion respected

### Performance Tests

```bash
# Lighthouse audit
lighthouse http://localhost:5000/landingv2 --view

# Target scores:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 85+ (temp route so less critical)
```

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check     # TypeScript validation
```
**Must pass**: No TypeScript errors

### Level 2: Build
```bash
npm run build
```
**Must pass**: Build completes successfully

### Level 3: Visual Comparison
**Manual test**:
1. Visit `/` - verify no regression
2. Visit `/landingv2` - verify new design
3. Compare side-by-side
4. Screenshot both for comparison

### Level 4: Performance
```bash
lighthouse http://localhost:5000/landingv2 --only-categories=performance,accessibility --view
```
**Target**:
- Performance > 90
- Accessibility > 95

---

## 11. Integration Points

### Configuration Changes
- [x] Add v2 colors to `tailwind.config.ts`
- [ ] Add route to `App.tsx`
- [ ] Import LandingV2 in `App.tsx`

### Route Registration
```typescript
// In App.tsx Router function
<Route path="/landingv2" component={LandingV2} />
```

### Navigation Links (Temporary)

Add to existing site for easy testing:
```typescript
// In Footer.tsx or Navbar.tsx (TEMPORARILY for dev)
<Link href="/landingv2">
  <a className="text-xs text-gray-500">Preview V2</a>
</Link>
```

Remove before production or keep for A/B testing.

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ Modify `client/src/components/ui/` files
- ❌ Modify `client/src/pages/Home.tsx`
- ❌ Use unprefixed color names in Tailwind config
- ❌ Import from `@/components/ui/` in v2 components (unless explicitly reusing)
- ❌ Create animations without reduced-motion fallback
- ❌ Use hardcoded colors (always use Tailwind classes)
- ❌ Forget mobile responsiveness
- ❌ Skip TypeScript types on components

### DO:
- ✅ Create all new components in `v2/`
- ✅ Use `v2-` prefixed colors
- ✅ Test `/` after every change
- ✅ Commit after each major section
- ✅ Follow existing patterns (cva, cn, Radix UI)
- ✅ Add TypeScript interfaces for all props
- ✅ Use Framer Motion for animations
- ✅ Mobile-first responsive design

---

## 13. Progressive Success

### Milestone 1: Foundation (Week 1)
- [x] Tailwind colors added
- [x] v2 folder created
- [x] Container, Section, Button, Card components
- [x] Hero section working
- [x] Navigation working
- [x] Route `/landingv2` accessible
- [x] No regression on `/`

### Milestone 2: Content Sections (Weeks 2-3)
- [ ] LogosCloud
- [ ] ProblemSection
- [ ] SolutionSection
- [ ] ThreeStepProcess

### Milestone 3: Pricing (Weeks 4-5)
- [ ] PricingPathways with expand/collapse
- [ ] PricingGrid detailed
- [ ] CalculatorROI functional

### Milestone 4: Social Proof (Week 6)
- [ ] TestimonialGrid
- [ ] FaqSection

### Milestone 5: Polish (Week 7-8)
- [ ] Animations
- [ ] Mobile optimization
- [ ] Performance tuning
- [ ] Accessibility audit

---

## 14. Final Validation Checklist

Before marking complete:

**Functionality** :
- [ ] Route `/landingv2` works
- [ ] Route `/` unchanged and working
- [ ] All 10 sections present
- [ ] All CTAs functional
- [ ] Forms validate
- [ ] Calculator calculates correctly
- [ ] Pathways expand/collapse

**Code Quality** :
- [ ] `npm run check` passes
- [ ] `npm run build` succeeds
- [ ] No console errors
- [ ] No console warnings
- [ ] TypeScript types on all components
- [ ] Comments on complex logic

**Design System** :
- [ ] All colors use v2- prefix
- [ ] Typography scale respected
- [ ] Spacing consistent (8px base)
- [ ] Grid 12 columns working
- [ ] Mobile responsive

**Performance** :
- [ ] Lighthouse Performance > 90
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Images optimized

**Accessibility** :
- [ ] Lighthouse Accessibility > 95
- [ ] Keyboard navigation complete
- [ ] Focus visible
- [ ] ARIA labels present
- [ ] Color contrast 4.5:1+
- [ ] prefers-reduced-motion respected

**Comparison** :
- [ ] Side-by-side screenshots taken
- [ ] Performance comparison documented
- [ ] User feedback collected (if possible)

---

## 15. Confidence Score & Reasoning

**Score: 9/10**

**Why 9** :
- ✅ Existing codebase uses Wouter, Framer Motion, Tailwind (all needed)
- ✅ shadcn/ui patterns already established (easy to follow)
- ✅ INITIAL_refonte.md extremely detailed (1000+ lines)
- ✅ Isolation strategy clear and safe
- ✅ All design specs provided (colors, typography, spacing)
- ✅ Content structure defined (3 Pathways, 10 sections)
- ✅ Validation gates specified
- ✅ Gotchas documented

**Why not 10** :
- ⚠️ CalculatorROI requires Recharts integration (not yet in dependencies)
- ⚠️ Some content missing (exact client logos, real testimonials)
- ⚠️ Mobile menu not fully spec'd (desktop-first)

**Missing for 10/10** :
1. Add Recharts to package.json
2. Provide actual client logos/images
3. Provide real testimonial content with photos
4. Spec mobile hamburger menu behavior

**Confidence by section** :
- Setup & Foundation: 10/10 ✅
- Hero & Navigation: 9/10 ✅
- Content Sections: 8/10 (need real content)
- Pricing: 9/10 ✅ (data provided in INITIAL)
- Calculator: 7/10 (Recharts dependency)
- Polish & Animations: 9/10 ✅

**Overall**: This PRP provides everything needed for a successful implementation in one pass, with only minor gaps (content/images) that can be filled with placeholders initially.

---

## Next Steps After Execution

1. **Test Both Versions** : Compare `/` vs `/landingv2` thoroughly
2. **Collect Feedback** : Show to stakeholders, get input
3. **A/B Testing** : If possible, split traffic 50/50
4. **Metrics** : Compare conversion rates, bounce rates, time on page
5. **Decision** : Choose rollout strategy (switch complete, progressive, or keep both)

**Success Metrics to Track** :
- Conversion rate (CTA clicks)
- Time on page
- Scroll depth
- Bounce rate
- Calendly bookings (if trackable)

If v2 performs better (expected based on research in INITIAL_refonte.md), plan migration strategy from INITIAL_refonte.md section "Migration Finale".
