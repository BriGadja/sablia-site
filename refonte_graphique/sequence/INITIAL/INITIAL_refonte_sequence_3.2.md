# INITIAL - PRP 3.2 - CalculatorROI (Interactif)

## FEATURE

Create an interactive ROI calculator that allows prospects to estimate their potential savings from automation.

**Requirements**:
- Form with 4-5 input fields (number of employees, manual hours/week, hourly cost, etc.)
- Real-time dynamic ROI calculation
- Results display: annual savings + time saved
- Frontend validation (positive numbers, reasonable limits)
- Clear, professional design with glassmorphism
- CTA "Discuter de mon projet" below results
- Optional: Visual representation of savings (progress bar or chart)

**Visual Deliverable**: Functional ROI calculator with immediate results display, professional styling, positioned after PricingSection.

**Technical Requirements**:
- Component path: `client/src/components/v3/CalculatorROI.tsx`
- Use React Hook Form for form management
- Use Zod for validation schema
- Real-time calculation on input change (debounced)
- Integrate into LandingV3.tsx as eighth section

## EXAMPLES

**CalculatorROI Structure Pattern**:
```typescript
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calculator, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import MagneticElements from "@/components/animations/MagneticElements";

// Validation schema
const calculatorSchema = z.object({
  employees: z.number().min(1).max(10000),
  hoursPerWeek: z.number().min(0.5).max(100),
  hourlyCost: z.number().min(10).max(500),
  processesToAutomate: z.number().min(1).max(50)
});

type CalculatorInputs = z.infer<typeof calculatorSchema>;

export default function CalculatorROI() {
  const { register, watch, formState: { errors } } = useForm<CalculatorInputs>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      employees: 10,
      hoursPerWeek: 5,
      hourlyCost: 50,
      processesToAutomate: 3
    }
  });

  // Watch all inputs for real-time calculation
  const inputs = watch();

  // Calculate ROI
  const calculateROI = () => {
    const { employees, hoursPerWeek, hourlyCost, processesToAutomate } = inputs;

    // Hours saved per year = employees × hours/week × 50 weeks × automation efficiency
    const hoursSavedPerYear = employees * hoursPerWeek * 50 * 0.7; // 70% efficiency

    // Annual savings = hours saved × hourly cost
    const annualSavings = hoursSavedPerYear * hourlyCost;

    // Typical automation cost (rough estimate for context)
    const estimatedInvestment = processesToAutomate * 3500; // ~3.5k per process

    // ROI percentage
    const roiPercentage = ((annualSavings - estimatedInvestment) / estimatedInvestment) * 100;

    return {
      hoursSavedPerYear: Math.round(hoursSavedPerYear),
      annualSavings: Math.round(annualSavings),
      estimatedInvestment: Math.round(estimatedInvestment),
      roiPercentage: Math.round(roiPercentage)
    };
  };

  const results = calculateROI();

  return (
    <section id="calculator" className="py-24 bg-v2-navy">
      <div className="container mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center text-v2-white mb-4">
            Calculez votre ROI
          </h2>
          <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Estimez le temps et l'argent que vous pourriez économiser grâce à l'automatisation
          </p>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-v2-charcoal/30 backdrop-blur-md rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator size={32} className="text-v2-cyan" />
              <h3 className="text-2xl font-bold text-v2-white">Vos données</h3>
            </div>

            <form className="space-y-6">
              {/* Number of employees */}
              <div>
                <label className="block text-v2-white mb-2 font-medium">
                  Nombre d'employés
                </label>
                <input
                  type="number"
                  {...register("employees", { valueAsNumber: true })}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
                />
                {errors.employees && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.employees.message}
                  </p>
                )}
              </div>

              {/* Hours per week */}
              <div>
                <label className="block text-v2-white mb-2 font-medium">
                  Heures manuelles par semaine (par employé)
                </label>
                <input
                  type="number"
                  step="0.5"
                  {...register("hoursPerWeek", { valueAsNumber: true })}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
                />
                {errors.hoursPerWeek && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.hoursPerWeek.message}
                  </p>
                )}
              </div>

              {/* Hourly cost */}
              <div>
                <label className="block text-v2-white mb-2 font-medium">
                  Coût horaire moyen (€)
                </label>
                <input
                  type="number"
                  {...register("hourlyCost", { valueAsNumber: true })}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
                />
                {errors.hourlyCost && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.hourlyCost.message}
                  </p>
                )}
              </div>

              {/* Processes to automate */}
              <div>
                <label className="block text-v2-white mb-2 font-medium">
                  Processus à automatiser
                </label>
                <input
                  type="number"
                  {...register("processesToAutomate", { valueAsNumber: true })}
                  className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
                />
                {errors.processesToAutomate && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.processesToAutomate.message}
                  </p>
                )}
              </div>
            </form>
          </motion.div>

          {/* Results Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-v2-cyan/20 to-v2-electric/20 backdrop-blur-md rounded-2xl p-8 border-2 border-v2-cyan"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={32} className="text-v2-cyan" />
              <h3 className="text-2xl font-bold text-v2-white">Vos économies potentielles</h3>
            </div>

            <div className="space-y-6">
              {/* Annual Savings */}
              <div>
                <p className="text-v2-off-white/80 mb-2">Économies annuelles</p>
                <p className="text-5xl font-bold text-v2-cyan">
                  {results.annualSavings.toLocaleString('fr-FR')}€
                </p>
              </div>

              {/* Hours Saved */}
              <div>
                <p className="text-v2-off-white/80 mb-2">Heures économisées par an</p>
                <p className="text-3xl font-bold text-v2-white">
                  {results.hoursSavedPerYear.toLocaleString('fr-FR')} heures
                </p>
              </div>

              {/* ROI Percentage */}
              <div>
                <p className="text-v2-off-white/80 mb-2">Retour sur investissement</p>
                <p className="text-3xl font-bold text-v2-electric">
                  +{results.roiPercentage}%
                </p>
              </div>

              {/* Estimated Investment */}
              <div className="border-t border-v2-cyan/30 pt-6">
                <p className="text-v2-off-white/60 text-sm mb-1">Investissement estimé</p>
                <p className="text-xl text-v2-off-white">
                  ~{results.estimatedInvestment.toLocaleString('fr-FR')}€
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <MagneticElements intensity="high">
                <a
                  href="#contact"
                  className="block text-center bg-v2-cyan text-v2-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-v2-electric transition-colors"
                >
                  Discuter de mon projet
                </a>
              </MagneticElements>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

**Reference Existing Component**: Check `client/src/components/v2/CalculatorROI.tsx` for existing patterns (but create new v3 version).

## DOCUMENTATION

**React Hook Form**:
- https://react-hook-form.com/
- Already installed and used in project
- `register()` for field registration
- `watch()` for real-time value observation
- `formState.errors` for validation errors

**Zod Schema Validation**:
- https://zod.dev/
- Already installed
- Define validation rules for each field
- Integrate with React Hook Form via `zodResolver`

**Validation Rules**:
```typescript
employees: z.number().min(1).max(10000)
hoursPerWeek: z.number().min(0.5).max(100)
hourlyCost: z.number().min(10).max(500)
processesToAutomate: z.number().min(1).max(50)
```

**ROI Calculation Formula**:
```typescript
// Hours saved per year
hoursSaved = employees × hoursPerWeek × 50 weeks × 0.7 (70% efficiency)

// Annual savings
annualSavings = hoursSaved × hourlyCost

// Estimated investment
estimatedInvestment = processesToAutomate × 3500€ (avg per process)

// ROI percentage
roiPercentage = ((savings - investment) / investment) × 100
```

**Input Fields**:
1. **Nombre d'employés** (1-10,000): Company size
2. **Heures manuelles/semaine** (0.5-100): Manual hours per employee per week
3. **Coût horaire** (10-500€): Average hourly cost
4. **Processus à automatiser** (1-50): Number of processes to automate

**Default Values** (for good UX):
- employees: 10
- hoursPerWeek: 5
- hourlyCost: 50
- processesToAutomate: 3

These defaults should produce realistic results (e.g., 10 employees × 5 hours × 50 weeks × 70% efficiency × 50€/hour = 87,500€/year).

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
- Desktop: 2-column layout (form left, results right)
- Mobile: Stack vertically (form first, then results)
- Use `grid-cols-1 lg:grid-cols-2`

**Input Styling**:
- Background: Navy with 50% opacity
- Border: Cyan with 30% opacity
- Focus: Solid cyan border
- Text: White color
- Padding: `px-4 py-3`

**Results Card Styling**:
- Gradient background: Cyan to Electric with 20% opacity
- Border: 2px solid cyan (highlighted)
- Backdrop blur for glassmorphism
- Large numbers for visual impact

**Real-Time Calculation**:
- Use `watch()` to observe all inputs
- Recalculate on any input change (React re-renders automatically)
- No need for submit button (instant feedback)
- Optional: Debounce calculation if performance is an issue

**Number Formatting**:
```typescript
// French locale formatting with thousand separators
value.toLocaleString('fr-FR')
// Example: 87500 → "87 500"
```

**Error Handling**:
- Show validation errors below each input
- Red color for errors
- Prevent negative numbers
- Set realistic max values to avoid absurd results

**Accessibility**:
- Label each input field
- Error messages associated with inputs
- Focus states visible
- Keyboard navigation works
- Results update live (aria-live region optional)

**Performance**:
- Calculation is simple arithmetic (no performance impact)
- Real-time updates via React's efficient re-rendering
- No API calls needed (pure frontend calculation)

**Gotchas**:
- Use `valueAsNumber: true` in register() to get numbers, not strings
- Watch() returns all form values as object
- Calculation should handle edge cases (e.g., 0 employees)
- Format large numbers with locale for readability

**Optional Enhancements**:
- Visual chart/graph of savings (optional, skip for MVP)
- Comparison table (before/after automation)
- Downloadable PDF report (advanced feature)
- Save results to email (requires backend)

Keep it simple for MVP: inputs → calculation → results → CTA.

**Known Issues to Avoid**:
- If inputs default to 0, calculation shows 0€ (use sensible defaults)
- If validation is too strict, users get frustrated (balance UX)
- If results update too fast, users can't read (acceptable trade-off)
- If numbers don't format, check locale string is correct

**Validation Commands**:
```bash
npm run check   # TypeScript compilation
npm run dev     # Start dev server
```

**Visual Validation** (after implementation):
```javascript
// Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// Scroll to calculator section
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })"
})
mcp__playwright__browser_wait_for({ time: 2 })

// Take screenshot with default values
mcp__playwright__browser_take_screenshot({ filename: "prp-3.2-calculator-default.png" })

// Type in different values
mcp__playwright__browser_click({ element: "employees input", ref: "input[name='employees']" })
mcp__playwright__browser_type({ element: "employees input", ref: "input[name='employees']", text: "20" })
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({ filename: "prp-3.2-calculator-updated.png" })

// Test mobile
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_take_screenshot({ filename: "prp-3.2-calculator-mobile.png" })
```

**Manual Testing Checklist**:
- [ ] 4-5 input fields visible with labels
- [ ] Default values populated (10, 5, 50, 3)
- [ ] Inputs accept numbers only
- [ ] Validation errors appear for invalid inputs (e.g., negative, too large)
- [ ] Results calculate in real-time as inputs change
- [ ] Annual savings displayed in large font with euro symbol
- [ ] Hours saved displayed
- [ ] ROI percentage displayed
- [ ] Estimated investment shown
- [ ] Numbers formatted with French locale (space separators)
- [ ] CTA "Discuter de mon projet" below results
- [ ] Magnetic hover effect on CTA
- [ ] Desktop: 2-column layout (form left, results right)
- [ ] Mobile: Stacked layout (form then results)
- [ ] Glassmorphism styling on both cards
- [ ] No console errors
- [ ] Calculation is accurate (verify math)

**Success Criteria**:
- ✅ Form with 4-5 input fields (employees, hours/week, hourly cost, processes)
- ✅ React Hook Form + Zod validation
- ✅ Real-time ROI calculation on input change
- ✅ Results display: annual savings, hours saved, ROI %, investment
- ✅ Frontend validation (positive numbers, reasonable limits)
- ✅ Error messages for invalid inputs
- ✅ French locale number formatting (87 500€)
- ✅ CTA "Discuter de mon projet" with magnetic effect
- ✅ Glassmorphism card styling
- ✅ 2-column desktop, stacked mobile
- ✅ Positioned after PricingSection
- ✅ No console errors
- ✅ TypeScript check passes

## LOG D'EXÉCUTION

**IMPORTANT**: À la fin de l'exécution du PRP généré depuis cet INITIAL, vous DEVEZ écrire un log d'exécution dans le fichier:

`C:\Users\pc\Documents\Projets\sablia-site\refonte_graphique\sequence\avancement_refonte.md`

**Format du log**: (Voir exemple dans INITIAL_refonte_sequence_0.1.md)

Remplacer dans le template:
- **Numéro**: PRP 3.2 - CalculatorROI (Interactif)
- **Prochaine étape**: PRP 4.1 - ContactFormSection
