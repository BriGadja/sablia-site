# INITIAL - PRP 3.1 - PricingSection (3 Colonnes)

## FEATURE

Create a simplified 3-column pricing section grouping Sablia's offerings into clear categories.

**Requirements**:
- 3 columns representing service categories:
  1. **Audit & Consulting** - Discovery services (Free call + Audit Express)
  2. **Formations** - Training offerings (⭐ HIGHLIGHTED column)
  3. **Solutions d'automatisation** - Automation development services
- Middle column (Formations) highlighted with cyan border glow
- Each column contains multiple offers with prices, durations, features
- Glassmorphism card styling
- Hover effects: scale + shadow
- CTAs specific to each column
- Responsive: 3 columns desktop → stack mobile (Formations first)

**Visual Deliverable**: Clean 3-column pricing grid with highlighted middle column, clear pricing, and specific CTAs, positioned after ThreeStepProcess section.

**Technical Requirements**:
- Component path: `client/src/components/v3/PricingSection.tsx`
- Use ScrollReveal for section entry
- Framer Motion for card hover effects and stagger reveal
- Integrate into LandingV3.tsx as seventh section

## EXAMPLES

**PricingSection Structure Pattern**:
```typescript
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import MagneticElements from "@/components/animations/MagneticElements";

interface PricingOffer {
  name: string;
  price: string;
  duration?: string;
  description: string;
  features: string[];
  roi?: string;
}

interface PricingColumn {
  id: string;
  title: string;
  subtitle: string;
  offers: PricingOffer[];
  highlight?: boolean;
  ctaPrimary: {
    text: string;
    url: string;
  };
}

const pricingColumns: PricingColumn[] = [
  {
    id: "audit",
    title: "Audit & Consulting",
    subtitle: "Comprendre et qualifier vos besoins",
    offers: [
      {
        name: "Appel Découverte",
        price: "GRATUIT",
        duration: "30 min",
        description: "Visio de qualification pour comprendre vos besoins",
        features: ["Échange personnalisé", "Sans engagement", "Premiers conseils"]
      },
      {
        name: "Audit Express",
        price: "350€",
        duration: "1h30",
        description: "Session stratégique avec recommandations actionnables",
        features: [
          "30 min cadrage + 1h stratégie",
          "Livrable 5-10 pages",
          "Regard expert immédiat"
        ]
      }
    ],
    ctaPrimary: { text: "Réserver un appel", url: "#contact" }
  },
  {
    id: "formations",
    title: "Formations",
    subtitle: "Devenez autonomes sur vos automatisations",
    highlight: true,
    offers: [
      {
        name: "Formation Demi-Journée",
        price: "700€",
        duration: "3h30",
        description: "IA générative, automatisation basics, découverte n8n",
        features: ["Intra-entreprise", "Jusqu'à 10 participants"]
      },
      {
        name: "Formation 1 Jour",
        price: "1 200€",
        duration: "7h",
        description: "IA/automatisation standard, n8n débutant",
        features: ["Cas pratiques inclus", "Support 1 mois post-formation"]
      },
      {
        name: "Formation 2-3 Jours",
        price: "2 200-3 300€",
        duration: "14-21h",
        description: "n8n avancé + certification équipe complète",
        features: ["Formation intensive", "Certification", "Documentation complète"]
      }
    ],
    ctaPrimary: { text: "Voir les formations", url: "#contact" }
  },
  {
    id: "solutions",
    title: "Solutions d'automatisation",
    subtitle: "Développement et déploiement de workflows",
    offers: [
      {
        name: "Workflow Simple",
        price: "2 500-5 000€",
        duration: "3-7 jours",
        description: "1-2 processus automatisés",
        features: [
          "Conception + développement",
          "Documentation",
          "2 semaines support"
        ]
      },
      {
        name: "Système Standard",
        price: "8 000-18 000€",
        duration: "2-4 semaines",
        description: "3-5 processus interconnectés",
        features: [
          "Architecture complète",
          "Formation 1 jour",
          "1 mois support"
        ]
      },
      {
        name: "Transformation Complète",
        price: "25 000-60 000€",
        duration: "6-12 semaines",
        description: "5+ processus multi-départements",
        features: [
          "Audit préalable inclus",
          "Formation 2-3 jours",
          "3 mois support"
        ],
        roi: "ROI année 1 : 50 000-150 000€"
      }
    ],
    ctaPrimary: { text: "Démarrer un projet", url: "#contact" }
  }
];

export default function PricingSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-v2-navy to-v2-charcoal">
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
            Nos offres
          </h2>
          <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Des solutions adaptées à chaque étape de votre transformation
          </p>
        </ScrollReveal>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingColumns.map((column, colIndex) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: colIndex * 0.1 }}
              className={`relative bg-v2-charcoal/30 backdrop-blur-md rounded-2xl p-8 hover:scale-[1.02] transition-transform duration-300 ${
                column.highlight
                  ? "border-2 border-v2-cyan shadow-lg shadow-v2-cyan/50"
                  : "border border-v2-charcoal"
              }`}
            >
              {/* Highlight Badge */}
              {column.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-v2-cyan text-v2-navy px-6 py-2 rounded-full text-sm font-bold">
                  ⭐ RECOMMANDÉ
                </div>
              )}

              {/* Column Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-v2-white mb-2">
                  {column.title}
                </h3>
                <p className="text-v2-off-white/70 text-sm">
                  {column.subtitle}
                </p>
              </div>

              {/* Offers List */}
              <div className="space-y-6 mb-8">
                {column.offers.map((offer, idx) => (
                  <div key={idx} className="border-t border-v2-cyan/20 pt-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="font-semibold text-v2-white text-lg">
                        {offer.name}
                      </h4>
                      <span className="text-v2-cyan font-bold text-xl">
                        {offer.price}
                      </span>
                    </div>
                    {offer.duration && (
                      <p className="text-v2-off-white/50 text-sm mb-2">
                        {offer.duration}
                      </p>
                    )}
                    <p className="text-v2-off-white/80 text-sm mb-3">
                      {offer.description}
                    </p>
                    <ul className="space-y-2">
                      {offer.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-v2-off-white/80 text-sm">
                          <Check size={16} className="text-v2-cyan mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {offer.roi && (
                      <p className="text-v2-cyan text-sm font-semibold mt-3">
                        {offer.roi}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <MagneticElements intensity="medium">
                <a
                  href={column.ctaPrimary.url}
                  className={`block text-center py-4 rounded-lg font-semibold transition-colors duration-300 ${
                    column.highlight
                      ? "bg-v2-cyan text-v2-navy hover:bg-v2-electric"
                      : "bg-v2-charcoal/50 text-v2-white border border-v2-cyan hover:bg-v2-cyan hover:text-v2-navy"
                  }`}
                >
                  {column.ctaPrimary.text}
                </a>
              </MagneticElements>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Reference Existing Component**: Check `client/src/components/v2/PricingPathways.tsx` for existing patterns (but create new v3 version).

## DOCUMENTATION

**Pricing Data** (from official tariff grid):

**Column 1: Audit & Consulting**
- Appel Découverte: GRATUIT, 30 min
- Audit Express: 350€, 1h30

**Column 2: Formations** (⭐ HIGHLIGHTED)
- Formation Demi-Journée: 700€, 3h30
- Formation 1 Jour: 1 200€, 7h
- Formation 2 Jours: 2 200€, 14h
- Formation 3 Jours: 3 300€, 21h

**Column 3: Solutions d'automatisation**
- Workflow Simple: 2 500-5 000€, 3-7 jours
- Système Standard: 8 000-18 000€, 2-4 semaines
- Transformation Complète: 25 000-60 000€, 6-12 semaines, ROI 50-150k€/an
- Projet Enterprise: Sur devis (60k€+) - Optional to show

**Glassmorphism Card Styling**:
```css
background: rgba(45, 49, 66, 0.3);
backdrop-filter: blur(12px);
border: 1px solid rgba(45, 49, 66, 1);

/* Highlighted column */
border: 2px solid #52D1DC;
box-shadow: 0 0 30px rgba(82, 209, 220, 0.5);
```

**Responsive Behavior**:
- Desktop: 3 columns side-by-side
- Mobile: Stack vertically, Formations column first (prioritize highlighted offer)

**Mobile Stack Order**:
```typescript
// Option 1: CSS order
<div className="lg:order-1">Audit</div>
<div className="order-first lg:order-2">Formations</div>
<div className="lg:order-3">Solutions</div>

// Option 2: Reorder array on mobile (more complex)
```

## GRADIENT SYSTEM

⚠️ **CRITICAL**: LandingV3 uses a continuous vertical gradient that progresses from sky blue (top) → night (middle) → dawn/sunrise (bottom). This gradient creates a visual metaphor for the customer journey and MUST NOT be interrupted by solid backgrounds on sections.

**📖 Full Reference**: See `refonte_graphique/sequence/INITIAL/GRADIENT_REFERENCE.md` for complete specifications.

**Key Rules**:
- ❌ **DO NOT** use solid backgrounds (`bg-v2-navy`, `bg-v2-electric`, `bg-v2-charcoal`) on `<section>` elements
- ❌ **DO NOT** use local gradients (`bg-gradient-to-b`, etc.) that would conflict with the main gradient
- ✅ **DO** keep sections transparent (no background class) to reveal the main gradient
- ✅ **DO** use light glassmorphism for cards/containers if needed (`bg-v2-charcoal/20 backdrop-blur-md`)
- ✅ **DO** use white text throughout (`text-v2-white`, `text-v2-off-white`)

**Gradient Applied On**: The main wrapper `<motion.div>` in `LandingV3.tsx` via inline style:
```typescript
style={{
  background: "linear-gradient(to bottom, #52D1DC 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)"
}}
```

## OTHER CONSIDERATIONS

**Highlight Treatment**:
- Cyan border: 2px solid
- Shadow glow: `shadow-v2-cyan/50`
- Badge: "⭐ RECOMMANDÉ" (one emoji acceptable for badge)
- Position: Absolute, -top-4, centered
- Different CTA styling: Solid cyan background

**Offer Card Within Column**:
- Separated by top border: `border-t border-v2-cyan/20`
- Name + Price on same line (justify-between)
- Duration, description, features list
- Optional ROI callout for high-value offers

**Typography**:
- Section title: 48px, bold, white
- Section subtitle: 20px, off-white/80
- Column title: 24px, bold, white
- Column subtitle: 14px, off-white/70
- Offer name: 18px, semibold, white
- Offer price: 20px, bold, cyan
- Offer duration: 14px, off-white/50
- Features: 14px, off-white/80

**Feature List with Checkmarks**:
- Use lucide-react `<Check />` icon, size 16px, cyan
- Flexbox layout for alignment
- Gap between icon and text

**CTA Button Variants**:
- Highlighted column: Solid cyan background, navy text
- Other columns: Outline style, white text, border cyan

**Animation**:
- Cards stagger on entry: 0.1s delay between columns
- Hover: scale to 1.02 (subtle lift)
- Smooth transitions: 300ms

**Accessibility**:
- Clear pricing information visible
- Good color contrast (white on charcoal = 10.2:1)
- CTA buttons keyboard accessible
- Badge emoji acceptable (only one, in decorative context)

**Performance**:
- Framer Motion GPU-accelerated
- No heavy computations
- Images optional (text-based pricing works)

**Gotchas**:
- Don't show too many offers per column (max 3-4 for readability)
- Ensure mobile stack order prioritizes highlighted column
- Test hover scale doesn't cause layout shift (use transform)
- Pricing should be exact (from official tariff doc)

**Known Issues to Avoid**:
- If highlight border doesn't glow, check shadow-cyan/50 opacity
- If mobile doesn't reorder, use CSS order or conditional rendering
- If cards are different heights, that's OK (content-driven)
- If features list overflows, limit to 3-4 key features per offer

**Validation Commands**:
```bash
npm run check   # TypeScript compilation
npm run dev     # Start dev server
```

**Visual Validation** (after implementation):
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Scroll to pricing section
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })"
})
mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot
mcp__playwright__browser_take_screenshot({ filename: "prp-3.1-pricing-3col.png" })

// Test mobile (check Formations column first)
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })"
})
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({ filename: "prp-3.1-pricing-mobile.png" })
```

**Manual Testing Checklist**:
- [ ] 3 columns visible on desktop
- [ ] Middle column (Formations) highlighted with cyan border + glow
- [ ] Highlight badge "⭐ RECOMMANDÉ" above Formations column
- [ ] Each column has title + subtitle
- [ ] Offers display: name, price, duration, description, features
- [ ] Feature lists have cyan checkmarks
- [ ] Optional ROI callout on Transformation Complète offer
- [ ] CTA buttons specific to each column
- [ ] Magnetic hover effect on CTAs
- [ ] Cards hover scale to 1.02
- [ ] Mobile: Formations column appears first
- [ ] Mobile: All 3 columns stack vertically
- [ ] Glassmorphism blur effect visible
- [ ] No console errors
- [ ] Performance: 60fps

**Success Criteria**:
- ✅ 3-column pricing layout (Audit & Consulting / Formations / Solutions)
- ✅ Middle column (Formations) highlighted with cyan border + glow + badge
- ✅ Each column contains multiple offers with prices, durations, features
- ✅ Glassmorphism card styling (backdrop-blur, transparent bg)
- ✅ Hover effects: scale 1.02 + shadow
- ✅ CTAs specific to each column with magnetic effect
- ✅ Responsive: stack on mobile with Formations first
- ✅ Staggered reveal animation (0.1s delay between columns)
- ✅ Feature lists with cyan checkmarks
- ✅ Optional ROI callout for high-value offers
- ✅ Positioned after ThreeStepProcess section
- ✅ No console errors
- ✅ TypeScript check passes

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 3.1 - PricingSection (3 Colonnes)
- **Prochaine étape**: PRP 3.2 - CalculatorROI (Interactif)
