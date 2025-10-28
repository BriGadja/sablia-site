# INITIAL - PRP 4.2 - FaqSection (Accordéon)

## FEATURE

Create an FAQ section with accordion-style collapsible questions.

**Requirements**:
- 8-10 frequently asked questions with answers
- Accordion component with smooth animation (Framer Motion)
- Only 1 question open at a time (exclusive accordion)
- Icons +/- with rotation animation on toggle
- 2-column layout on desktop, 1 column on mobile
- Questions sourced from appendix PRP or realistic B2B automation FAQs

**Visual Deliverable**: Clean FAQ accordion with smooth animations, positioned after ContactFormSection (second to last section before Footer).

**Technical Requirements**:
- Component path: `client/src/components/v3/FaqSection.tsx`
- Use Framer Motion for accordion animations
- lucide-react icons: Plus, Minus (or ChevronDown with rotation)
- State management for active question
- Integrate into LandingV3.tsx as tenth section

## EXAMPLES

**FaqSection Structure Pattern**:
```typescript
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: 1,
    question: "Quels sont les outils d'automatisation que vous utilisez ?",
    answer: "Nous travaillons principalement avec n8n (auto-hébergeable) et Make.com, deux outils européens qui garantissent la souveraineté de vos données. Ces plateformes no-code/low-code permettent à vos équipes de devenir autonomes sur l'automatisation."
  },
  {
    id: 2,
    question: "Combien de temps faut-il pour automatiser un processus ?",
    answer: "Un workflow simple peut être développé en 3-7 jours. Pour un système complet avec plusieurs processus interconnectés, comptez 2-4 semaines. Chaque projet inclut une phase d'audit pour vous donner un calendrier précis."
  },
  {
    id: 3,
    question: "Mes équipes doivent-elles avoir des compétences techniques ?",
    answer: "Non. Notre approche Formation-First permet à vos équipes de maîtriser les outils, même sans background technique. Les formations sont adaptées au niveau de chacun et incluent des cas pratiques métier."
  },
  {
    id: 4,
    question: "Quel est le ROI typique d'un projet d'automatisation ?",
    answer: "En moyenne, nos clients économisent entre 50 000€ et 150 000€ par an pour une transformation complète. Le ROI se mesure en heures de travail économisées, réduction d'erreurs, et capacité à scaler sans recruter."
  },
  {
    id: 5,
    question: "Proposez-vous un support après la mise en production ?",
    answer: "Oui. Chaque projet inclut une période de support post-livraison (2 semaines à 3 mois selon l'offre). Nous proposons également des accompagnements continus via nos formules de retainer."
  },
  {
    id: 6,
    question: "Peut-on commencer petit avant de transformer toute l'entreprise ?",
    answer: "Absolument. Nous recommandons de démarrer par l'Audit Express (350€) ou un Workflow Simple (2 500-5 000€) pour valider l'approche. Vous pouvez ensuite scaler progressivement selon vos besoins."
  },
  {
    id: 7,
    question: "Travaillez-vous avec des entreprises de toutes tailles ?",
    answer: "Nous accompagnons principalement des PME et ETI (10-250 personnes). Notre expertise est particulièrement adaptée aux structures qui souhaitent gagner en efficacité sans déployer des solutions enterprise complexes."
  },
  {
    id: 8,
    question: "Quelle est la différence entre n8n et Make.com ?",
    answer: "N8n est auto-hébergeable (souveraineté totale) et open-source, idéal pour les entreprises sensibles à la data. Make.com (ex-Integromat) est un SaaS européen plus accessible pour débuter. Nous vous guidons vers l'outil le mieux adapté à votre contexte."
  }
];

export default function FaqSection() {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleQuestion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="py-24 bg-v2-navy">
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur nos services d'automatisation
          </p>
        </ScrollReveal>

        {/* FAQ Grid - 2 columns desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-v2-charcoal/30 backdrop-blur-md rounded-xl overflow-hidden"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleQuestion(faq.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-v2-charcoal/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-v2-white pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: activeId === faq.id ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeId === faq.id ? (
                    <Minus size={24} className="text-v2-cyan flex-shrink-0" />
                  ) : (
                    <Plus size={24} className="text-v2-cyan flex-shrink-0" />
                  )}
                </motion.div>
              </button>

              {/* Answer (Animated) */}
              <AnimatePresence>
                {activeId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-v2-off-white/80 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Reference Existing Component**: Check `client/src/components/v2/FaqSection.tsx` for existing patterns (but create new v3 version).

**Alternative Icon Rotation**:
```typescript
// Use ChevronDown with rotation instead of Plus/Minus swap
<motion.div
  animate={{ rotate: activeId === faq.id ? 180 : 0 }}
>
  <ChevronDown size={24} className="text-v2-cyan" />
</motion.div>
```

## DOCUMENTATION

**FAQ Questions** (B2B Automation for French SMBs):

1. **Quels sont les outils d'automatisation que vous utilisez ?**
   - Answer: n8n (auto-hébergeable) et Make.com, outils européens, souveraineté données

2. **Combien de temps faut-il pour automatiser un processus ?**
   - Answer: 3-7 jours pour workflow simple, 2-4 semaines pour système complet

3. **Mes équipes doivent-elles avoir des compétences techniques ?**
   - Answer: Non, Formation-First adapté à tous niveaux

4. **Quel est le ROI typique d'un projet d'automatisation ?**
   - Answer: 50-150k€/an en moyenne, économies temps + réduction erreurs

5. **Proposez-vous un support après la mise en production ?**
   - Answer: Oui, 2 semaines à 3 mois selon offre + retainers disponibles

6. **Peut-on commencer petit avant de transformer toute l'entreprise ?**
   - Answer: Oui, Audit Express 350€ ou Workflow Simple pour valider

7. **Travaillez-vous avec des entreprises de toutes tailles ?**
   - Answer: PME et ETI (10-250 personnes) principalement

8. **Quelle est la différence entre n8n et Make.com ?**
   - Answer: n8n = auto-hébergeable/open-source, Make.com = SaaS européen

**Additional Question Ideas** (for 9-10 questions):
- "Combien coûte une formation sur n8n ou Make.com ?"
- "Puis-je héberger mes automatisations sur mes propres serveurs ?"
- "Comment assurez-vous la sécurité de nos données ?"

**Framer Motion AnimatePresence**:
- https://www.framer.com/motion/animate-presence/
- Used for enter/exit animations
- `initial`, `animate`, `exit` for smooth transitions

**Accordion Pattern**:
- Exclusive accordion: Only 1 item open at a time
- Click same item to close
- State: `activeId` tracks currently open question

**Icons**:
- Plus: Question closed
- Minus: Question open
- Alternative: ChevronDown with 180° rotation

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

**Responsive Design**:
- Desktop: 2 columns (grid-cols-2)
- Mobile: 1 column stack (grid-cols-1)
- Gap: 24px (gap-6)
- Max width: 6xl (1280px) to prevent overly wide questions

**Accordion Animation**:
- Question button: Always visible, clickable
- Answer: Slides down/up with height animation
- Duration: 300ms (smooth but not slow)
- Easing: easeInOut

**Icon Animation**:
- Plus rotates 45° to become X when opening
- Or swap Plus ↔ Minus
- Or ChevronDown rotates 180°
- Duration: 300ms synchronized with content

**State Management**:
- `activeId`: Number (ID of open question) or null (all closed)
- Toggle logic: If clicking active item, close it; else open new one
- Only 1 question open at a time (exclusive accordion)

**Typography**:
- Section title: 48px, bold, white
- Section subtitle: 20px, off-white/80
- Question: 18px, semibold, white
- Answer: 16px, off-white/80, leading-relaxed

**Accessibility**:
- Button elements for questions (keyboard accessible)
- ARIA attributes: aria-expanded, aria-controls (optional)
- Focus states visible
- Sufficient color contrast

**Performance**:
- Framer Motion GPU-accelerated
- AnimatePresence manages mounting/unmounting
- No heavy computations
- Simple state management

**Gotchas**:
- AnimatePresence requires unique `key` on animated elements
- Height: "auto" works but can cause layout shift (acceptable here)
- Ensure overflow: hidden on AnimatePresence parent
- Test that clicking same question closes it

**Known Issues to Avoid**:
- If animation is jerky, check transition easing
- If multiple questions open, check toggle logic (should be exclusive)
- If icon doesn't rotate, verify motion.div wraps icon
- If answer doesn't hide on close, check AnimatePresence setup

**Validation Commands**:
```bash
npm run check   # TypeScript compilation
npm run dev     # Start dev server
```

**Visual Validation** (after implementation):
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Scroll to FAQ section
mcp__playwright__browser_evaluate({
  function: "() => { window.scrollTo(0, document.body.scrollHeight - 1000); }"
})
mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot (all closed)
mcp__playwright__browser_take_screenshot({ filename: "prp-4.2-faq-closed.png" })

// Click first question to open
// (Manual testing recommended for interaction)

// Test mobile layout
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_take_screenshot({ filename: "prp-4.2-faq-mobile.png" })
```

**Manual Testing Checklist**:
- [ ] 8-10 FAQ items visible
- [ ] Desktop: 2-column layout
- [ ] Mobile: 1-column stack
- [ ] Questions are clickable (cursor pointer)
- [ ] Clicking question toggles it open/closed
- [ ] Only 1 question open at a time (exclusive)
- [ ] Answer slides down smoothly (300ms)
- [ ] Answer slides up smoothly when closed
- [ ] Icon changes: Plus → Minus (or rotates)
- [ ] Icon rotation is smooth (300ms)
- [ ] Question text wraps properly on mobile
- [ ] Answer text has good line height
- [ ] Hover effect on question button (background change)
- [ ] Glassmorphism card styling
- [ ] Staggered fade-in on scroll for cards
- [ ] No console errors
- [ ] Performance: animations smooth at 60fps

**Success Criteria**:
- ✅ 8-10 FAQ questions with answers
- ✅ Accordion with smooth animations (Framer Motion)
- ✅ Only 1 question open at a time (exclusive)
- ✅ Icons +/- with rotation animation on toggle
- ✅ Height animation for answer (slide down/up)
- ✅ 2-column layout desktop, 1-column mobile
- ✅ Glassmorphism card styling
- ✅ Hover effect on question buttons
- ✅ Questions realistic for B2B automation SMBs
- ✅ Positioned after ContactFormSection
- ✅ Staggered reveal on scroll entry
- ✅ No console errors
- ✅ TypeScript check passes

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 4.2 - FaqSection (Accordéon)
- **Prochaine étape**: PRP 5.1 - Responsive Mobile Complet
