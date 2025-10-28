# PRP 3.2: Interactive ROI Calculator

## Philosophy: Context is King

This PRP follows a validation-loop approach:
1. **Syntax & Style**: TypeScript type-checking
2. **Build Verification**: Production build success
3. **Visual Validation**: Playwright MCP screenshots

**Confidence Score: 9/10** - This PRP contains comprehensive context including exact code patterns, validation steps, and visual testing procedures.

---

## 1. Goal and Why

**What are we building?**
An interactive ROI calculator that allows prospects to estimate their potential savings from automation in real-time. Users input 4 key metrics (employees, hours/week, hourly cost, processes to automate) and instantly see their annual savings, hours saved, ROI percentage, and estimated investment.

**Why are we building it?**
- **Business Value**: Converts prospects by showing concrete, personalized ROI figures
- **User Experience**: Removes friction by eliminating the need for sales calls to get ballpark estimates
- **Lead Quality**: Qualified leads who see positive ROI are more likely to convert
- **Transparency**: Builds trust by showing realistic investment and return figures upfront

---

## 2. What (Requirements)

### User-Visible Behavior
1. User sees a calculator section after the Pricing Section on LandingV3
2. Left side: 4 number input fields with labels and validation
3. Right side: Real-time results display with large, formatted numbers
4. Results update instantly as user types (no submit button needed)
5. CTA button "Discuter de mon projet" scrolls smoothly to #contact
6. Mobile: Form stacks above results vertically
7. Desktop: Form left, results right (2-column grid)

### Functional Requirements
- ✅ 4 input fields: employees (1-10,000), hoursPerWeek (0.5-100), hourlyCost (10-500€), processesToAutomate (1-50)
- ✅ Real-time ROI calculation using watch() from React Hook Form
- ✅ Zod schema validation with error messages below inputs
- ✅ French locale number formatting (87 500€ with space separators)
- ✅ ROI formula: annualSavings = employees × hours/week × 50 weeks × 70% efficiency × hourly cost
- ✅ Estimated investment: processes × 3,500€ average per process
- ✅ ROI percentage: ((savings - investment) / investment) × 100
- ✅ Results display: annual savings (large), hours saved, ROI%, investment
- ✅ MagneticButton with smooth scroll to #contact
- ✅ Sensible defaults pre-filled (10 employees, 5 hours, 50€, 3 processes)

### Non-Functional Requirements
- **Performance**: Calculation is instant (simple arithmetic, no API calls)
- **Responsiveness**: Works on mobile (375px) to desktop (1920px+)
- **Accessibility**: Labels, error messages, keyboard navigation, focus states
- **Visual Consistency**: Follows v3 glassmorphism patterns, respects gradient background
- **Code Quality**: TypeScript strict mode, follows existing patterns

---

## 3. Success Criteria

The implementation is complete when:
- [ ] Component file created at `client/src/components/v3/CalculatorROI.tsx`
- [ ] 4 input fields with React Hook Form registration and Zod validation
- [ ] Real-time calculation updates on any input change
- [ ] Results display with French formatting (space separators)
- [ ] Annual savings, hours saved, ROI%, and investment all calculated correctly
- [ ] Validation errors appear for invalid inputs (negative, out of range)
- [ ] MagneticButton CTA with smooth scroll to #contact
- [ ] 2-column desktop layout, stacked mobile layout
- [ ] Glassmorphism styling (semi-transparent cards with backdrop blur)
- [ ] Section integrated into `LandingV3.tsx` after `PricingSection`
- [ ] No console errors
- [ ] TypeScript check passes (`npm run check`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Visual validation screenshots captured and reviewed

---

## 4. Documentation & References

### Official Documentation
- **React Hook Form**: https://react-hook-form.com/
  - `register()` for field registration with `valueAsNumber: true`
  - `watch()` for observing all form values in real-time
  - `formState.errors` for validation error display
  - `zodResolver` for Zod schema integration

- **Zod Schema Validation**: https://zod.dev/
  - `.number()` for numeric fields
  - `.min()` and `.max()` for range validation
  - `.infer<typeof schema>` for TypeScript types

- **Framer Motion**: https://www.framer.com/motion/
  - `motion.div` with `initial`, `whileInView`, `viewport` props
  - Staggered animations with `delay` in transition

### Relevant Code Examples
- `client/src/components/v2/CalculatorROI.tsx` - v2 version with range sliders (different approach)
- `client/src/components/v3/PricingSection.tsx` - v3 glassmorphism card styling patterns
- `client/src/components/animations/MagneticElements.tsx` - MagneticButton component
- `client/src/pages/GapForm.tsx` - React Hook Form + Zod integration pattern
- `refonte_graphique/sequence/INITIAL/GRADIENT_REFERENCE.md` - Gradient system rules

### External Resources
- **Number Formatting**: `toLocaleString('fr-FR')` for French thousand separators
- **ROI Calculation Best Practices**: Conservative 70% automation efficiency factor

---

## 5. Codebase Context

### Current Structure
```
client/src/
├── components/
│   ├── v3/
│   │   ├── PricingSection.tsx  ← Section before calculator
│   │   └── (other v3 components)
│   └── animations/
│       └── MagneticElements.tsx  ← Import MagneticButton from here
├── pages/
│   └── LandingV3.tsx  ← Add CalculatorROI import and render
```

### Desired Structure (After Implementation)
```
client/src/
├── components/
│   ├── v3/
│   │   ├── PricingSection.tsx
│   │   ├── CalculatorROI.tsx  ← NEW FILE
│   │   └── (other v3 components)
├── pages/
│   └── LandingV3.tsx  ← MODIFIED (add import and render)
```

### Key Files to Modify
- **CREATE**: `client/src/components/v3/CalculatorROI.tsx` - Main calculator component
- **MODIFY**: `client/src/pages/LandingV3.tsx` - Add import and render after PricingSection

---

## 6. Known Gotchas & Pitfalls

### Library-Specific Quirks
- **React Hook Form**: Must use `valueAsNumber: true` in `register()` to get numbers instead of strings
- **React Hook Form**: `watch()` returns an object with all form values, triggers re-render on change
- **Zod**: `.number()` expects actual numbers, not strings. Combine with `valueAsNumber: true`
- **Framer Motion**: `whileInView` with `viewport={{ once: true }}` ensures animations only play once

### Common Mistakes
- ❌ **Anti-pattern**: Forgetting `valueAsNumber: true` → inputs return strings, calculation breaks
- ✅ **Correct**: `{...register("employees", { valueAsNumber: true })}`

- ❌ **Anti-pattern**: Using solid background on section (`bg-v2-navy`)
- ✅ **Correct**: Transparent section, glassmorphism on cards (`bg-v2-charcoal/30 backdrop-blur-md`)

- ❌ **Anti-pattern**: Not formatting numbers → "87500" looks unreadable
- ✅ **Correct**: `value.toLocaleString('fr-FR')` → "87 500"

- ❌ **Anti-pattern**: Setting default values to 0 → results show 0€ (bad UX)
- ✅ **Correct**: Sensible defaults (10 employees, 5 hours, 50€, 3 processes)

### Error Patterns
- **Error**: "Cannot read property 'toLocaleString' of undefined"
  - **Cause**: Calculation returns NaN when inputs are invalid
  - **Fix**: Guard with `Math.round()` and handle edge cases (0 employees)

- **Error**: "Type 'string' is not assignable to type 'number'"
  - **Cause**: Forgot `valueAsNumber: true` in register()
  - **Fix**: Add `valueAsNumber: true` to all number fields

- **Error**: Validation errors don't appear
  - **Cause**: Not checking `formState.errors` or wrong field name
  - **Fix**: Use `errors.fieldName?.message` with correct field name

---

## 7. Data Models & Schemas

### Zod Validation Schema
```typescript
import { z } from "zod";

const calculatorSchema = z.object({
  employees: z.number()
    .min(1, "Minimum 1 employé")
    .max(10000, "Maximum 10,000 employés"),
  hoursPerWeek: z.number()
    .min(0.5, "Minimum 0.5 heure")
    .max(100, "Maximum 100 heures"),
  hourlyCost: z.number()
    .min(10, "Minimum 10€")
    .max(500, "Maximum 500€"),
  processesToAutomate: z.number()
    .min(1, "Minimum 1 processus")
    .max(50, "Maximum 50 processus")
});

type CalculatorInputs = z.infer<typeof calculatorSchema>;
```

### ROI Calculation Return Type
```typescript
interface ROIResults {
  hoursSavedPerYear: number;  // Rounded integer
  annualSavings: number;      // Rounded integer (euros)
  estimatedInvestment: number; // Rounded integer (euros)
  roiPercentage: number;      // Rounded integer (percentage)
}
```

### ROI Calculation Formula
```typescript
const calculateROI = (inputs: CalculatorInputs): ROIResults => {
  const { employees, hoursPerWeek, hourlyCost, processesToAutomate } = inputs;

  // Hours saved per year = employees × hours/week × 50 weeks × 70% efficiency
  const hoursSavedPerYear = employees * hoursPerWeek * 50 * 0.7;

  // Annual savings = hours saved × hourly cost
  const annualSavings = hoursSavedPerYear * hourlyCost;

  // Estimated investment = processes × 3,500€ average per process
  const estimatedInvestment = processesToAutomate * 3500;

  // ROI percentage = ((savings - investment) / investment) × 100
  const roiPercentage = ((annualSavings - estimatedInvestment) / estimatedInvestment) * 100;

  return {
    hoursSavedPerYear: Math.round(hoursSavedPerYear),
    annualSavings: Math.round(annualSavings),
    estimatedInvestment: Math.round(estimatedInvestment),
    roiPercentage: Math.round(roiPercentage)
  };
};
```

---

## 8. Implementation Tasks

Execute these tasks in order:

### Task 1: Create CalculatorROI Component File
**Action**: CREATE
**Location**: `client/src/components/v3/CalculatorROI.tsx`
**Details**:
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Calculator, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { MagneticButton } from "@/components/animations/MagneticElements";

// 1. Define Zod schema (see section 7)
// 2. Define TypeScript types
// 3. Define ROI calculation function
// 4. Create component with useForm hook
// 5. Implement 2-column layout (form left, results right)
// 6. Implement input fields with validation
// 7. Implement results display
// 8. Add MagneticButton CTA
```
**Why**: Creates the main calculator component with all necessary imports and structure
**Gotchas**:
- Import MagneticButton with `{ MagneticButton }` (named export)
- Use `ScrollReveal` for section header animation
- Keep section background transparent (NO `bg-v2-navy`)

### Task 2: Implement Form Section (Left Column)
**Action**: INJECT
**Location**: Inside `<motion.div>` for form column
**Details**:
```typescript
<motion.div
  initial={{ opacity: 0, x: -30 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="bg-v2-charcoal/30 backdrop-blur-md rounded-2xl p-8 border border-v2-cyan/30"
>
  <div className="flex items-center gap-3 mb-6">
    <Calculator size={32} className="text-v2-cyan" />
    <h3 className="text-2xl font-bold text-v2-white">Vos données</h3>
  </div>

  <form className="space-y-6">
    {/* 4 input fields with labels, inputs, and error messages */}
    {/* Pattern for each field:
      <div>
        <label className="block text-v2-white mb-2 font-medium">Label</label>
        <input
          type="number"
          {...register("fieldName", { valueAsNumber: true })}
          className="w-full bg-v2-navy/50 border border-v2-cyan/30 rounded-lg px-4 py-3 text-v2-white focus:outline-none focus:border-v2-cyan transition-colors"
        />
        {errors.fieldName && (
          <p className="text-red-400 text-sm mt-1">{errors.fieldName.message}</p>
        )}
      </div>
    */}
  </form>
</motion.div>
```
**Why**: Creates input section with glassmorphism styling and validation
**Gotchas**:
- **CRITICAL**: Add `valueAsNumber: true` to every `register()` call
- Use `step="0.5"` for hoursPerWeek input to allow decimals
- Error messages must check `errors.fieldName` before rendering

### Task 3: Implement Results Section (Right Column)
**Action**: INJECT
**Location**: Inside `<motion.div>` for results column
**Details**:
```typescript
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
    {/* Annual Savings - Large, prominent */}
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

    {/* Estimated Investment (secondary) */}
    <div className="border-t border-v2-cyan/30 pt-6">
      <p className="text-v2-off-white/60 text-sm mb-1">Investissement estimé</p>
      <p className="text-xl text-v2-off-white">
        ~{results.estimatedInvestment.toLocaleString('fr-FR')}€
      </p>
    </div>
  </div>

  {/* CTA Button */}
  <div className="mt-8">
    <MagneticButton
      strength={0.2}
      className="w-full bg-v2-cyan text-v2-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-v2-electric transition-colors"
      onClick={() => {
        const target = document.querySelector('#contact');
        target?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      Discuter de mon projet
    </MagneticButton>
  </div>
</motion.div>
```
**Why**: Displays calculated results with visual hierarchy and CTA
**Gotchas**:
- Use `toLocaleString('fr-FR')` on ALL numbers for French formatting
- Annual savings should be largest/most prominent (5xl font)
- Gradient background on results card to make it stand out
- MagneticButton must use `onClick` (not `href`) for smooth scroll

### Task 4: Integrate into LandingV3
**Action**: MODIFY
**Location**: `client/src/pages/LandingV3.tsx`
**Details**:
```typescript
// 1. Add import at top
import CalculatorROI from "@/components/v3/CalculatorROI";

// 2. Add render after PricingSection, before hidden placeholders
<main>
  {/* ...existing sections... */}
  <PricingSection />

  {/* Calculator Section - NEW */}
  <CalculatorROI />

  {/* Hidden section placeholders */}
  <div className="hidden">
    {/* ...existing placeholders... */}
  </div>
</main>
```
**Why**: Makes the calculator visible on the landing page
**Gotchas**:
- Import must use default export: `import CalculatorROI from ...`
- Position is critical: AFTER PricingSection, BEFORE hidden placeholders
- No wrapper div needed (component includes its own `<section>`)

### Task 5: Add Section Anchor (Optional Enhancement)
**Action**: MODIFY
**Location**: `client/src/components/v3/CalculatorROI.tsx`
**Details**:
```typescript
// Update section opening tag to include id
<section id="calculator" className="py-24 relative overflow-hidden">
```
**Why**: Allows navigation to calculator section via #calculator hash
**Gotchas**: None

---

## 9. Testing Strategy

### Manual Testing Checklist
After implementation, verify:
- [ ] 4 input fields visible with correct labels
- [ ] Default values pre-filled (10, 5, 50, 3)
- [ ] Typing in any field immediately updates results
- [ ] Negative numbers trigger validation errors
- [ ] Numbers above max trigger validation errors
- [ ] Error messages appear below relevant inputs
- [ ] Error messages disappear when input becomes valid
- [ ] Annual savings displays in large font with € symbol
- [ ] Hours saved displays with "heures" label
- [ ] ROI percentage displays with % symbol
- [ ] Estimated investment displays with ~ prefix
- [ ] All numbers use French formatting (space separators): "87 500€"
- [ ] CTA button "Discuter de mon projet" present
- [ ] Clicking CTA smoothly scrolls to #contact section
- [ ] Desktop: Form left, results right (2 columns)
- [ ] Mobile (375px): Form stacked above results
- [ ] Glassmorphism visible on both cards
- [ ] Background gradient visible through section (not blocked by solid color)
- [ ] No console errors
- [ ] Calculation is mathematically correct

**Test Calculation Example**:
- Inputs: 10 employees, 5 hours/week, 50€/hour, 3 processes
- Expected Hours Saved: 10 × 5 × 50 × 0.7 = 1,750 hours
- Expected Annual Savings: 1,750 × 50 = 87,500€
- Expected Investment: 3 × 3,500 = 10,500€
- Expected ROI: ((87,500 - 10,500) / 10,500) × 100 = 733%

---

## 10. Validation Gates

### Level 1: Syntax & Style
```bash
npm run check
```
**Expected**: No TypeScript errors

### Level 2: Build
```bash
npm run build
```
**Expected**: Build succeeds, no errors

### Level 3: Visual Validation (Playwright MCP)
```javascript
// 1. Start dev server (if not running)
npm run dev

// 2. Navigate to page
mcp__playwright__browser_navigate({ url: "http://localhost:5000/landingv3" })

// 3. Scroll to calculator section
mcp__playwright__browser_evaluate({
  function: "() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })"
})

// 4. Wait for animations
mcp__playwright__browser_wait_for({ time: 2 })

// 5. Screenshot with default values
mcp__playwright__browser_take_screenshot({
  filename: "prp-3.2-calculator-default.png"
})

// 6. Type in different values to test real-time updates
// (Clear and type new value)
mcp__playwright__browser_click({
  element: "employees input",
  ref: "input[name='employees']"
})
mcp__playwright__browser_evaluate({
  function: "() => { const input = document.querySelector('input[name=\"employees\"]'); if (input) { input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); } }"
})
mcp__playwright__browser_type({
  element: "employees input",
  ref: "input[name='employees']",
  text: "20",
  slowly: false
})

// 7. Wait for calculation update
mcp__playwright__browser_wait_for({ time: 1 })

// 8. Screenshot with updated values
mcp__playwright__browser_take_screenshot({
  filename: "prp-3.2-calculator-updated.png"
})

// 9. Test mobile responsive
mcp__playwright__browser_resize({ width: 375, height: 812 })
mcp__playwright__browser_take_screenshot({
  filename: "prp-3.2-calculator-mobile.png"
})

// 10. Test validation error
// (Type invalid value like -5)
mcp__playwright__browser_resize({ width: 1280, height: 800 }) // Back to desktop
mcp__playwright__browser_click({
  element: "hours per week input",
  ref: "input[name='hoursPerWeek']"
})
mcp__playwright__browser_evaluate({
  function: "() => { const input = document.querySelector('input[name=\"hoursPerWeek\"]'); if (input) { input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); } }"
})
mcp__playwright__browser_type({
  element: "hours per week input",
  ref: "input[name='hoursPerWeek']",
  text: "-5"
})
mcp__playwright__browser_wait_for({ time: 1 })
mcp__playwright__browser_take_screenshot({
  filename: "prp-3.2-calculator-validation-error.png"
})
```

**Expected Visual Results**:
1. Default screenshot shows sensible results (87,500€ annual savings)
2. Updated screenshot shows recalculated results (175,000€ with 20 employees)
3. Mobile screenshot shows stacked layout (form above results)
4. Validation error screenshot shows red error message below input
5. Gradient background visible through sections (not blocked)
6. White text readable on all gradient zones

---

## 11. Integration Points

### Component Integration
- **Import**: `import CalculatorROI from "@/components/v3/CalculatorROI";`
- **Render**: Place in `LandingV3.tsx` after `<PricingSection />`
- **Dependencies**: Uses existing `MagneticButton`, `ScrollReveal` components

### No Backend Integration Needed
- Calculator is purely frontend (no API calls)
- No database storage required
- No form submission to backend

---

## 12. Critical Anti-Patterns

### DO NOT:
- ❌ Use solid background on section (`bg-v2-navy`) - breaks gradient system
- ❌ Forget `valueAsNumber: true` - breaks calculation (strings vs numbers)
- ❌ Skip number formatting - "87500" is unreadable, must be "87 500"
- ❌ Use default values of 0 - shows 0€ result (terrible UX)
- ❌ Hardcode CTA URL - must use smooth scroll to #contact
- ❌ Use form submit button - calculations should be real-time

### DO:
- ✅ Keep section transparent - let gradient show through
- ✅ Add `valueAsNumber: true` to all number inputs
- ✅ Use `toLocaleString('fr-FR')` on all displayed numbers
- ✅ Set sensible defaults (10, 5, 50, 3)
- ✅ Use MagneticButton with smooth scroll onClick
- ✅ Use `watch()` for real-time updates (no submit needed)

---

## 13. Progressive Success

### Phase 1: Basic Structure (MVP)
1. Create component file
2. Set up form with React Hook Form + Zod
3. Add 4 input fields
4. Implement basic ROI calculation
5. Display results
6. Integrate into LandingV3

**Validation**: TypeScript check passes, page renders

### Phase 2: Styling & UX
7. Add glassmorphism styling
8. Add icons (Calculator, TrendingUp)
9. Add animations (motion.div with stagger)
10. Format numbers with French locale
11. Add MagneticButton CTA

**Validation**: Visual review looks professional

### Phase 3: Polish & Validation
12. Add input validation with Zod
13. Display error messages
14. Test edge cases (negative, zero, max values)
15. Verify responsive layout (mobile/desktop)
16. Take Playwright screenshots

**Validation**: All gates pass, screenshots reviewed

---

## Final Validation Checklist

Before marking complete:
- [ ] Component created at correct path
- [ ] All 4 inputs present and functional
- [ ] Real-time calculation working
- [ ] French number formatting applied
- [ ] Validation errors display correctly
- [ ] MagneticButton CTA scrolls to #contact
- [ ] 2-column desktop, stacked mobile layout
- [ ] Glassmorphism styling applied
- [ ] Gradient background visible (not blocked)
- [ ] TypeScript check passes (`npm run check`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Visual validation screenshots captured
- [ ] No console errors
- [ ] All manual test cases pass
- [ ] Calculation mathematically correct

---

## Confidence Score: 9/10

**Why this score?**
- ✅ Complete code patterns provided
- ✅ Exact file paths specified
- ✅ Validation commands included
- ✅ Visual testing procedure detailed
- ✅ All gotchas documented
- ✅ ROI formula clearly explained
- ✅ Existing patterns referenced

**What could improve it to 10?**
- Unit tests would increase confidence (not required for this feature)

This PRP provides sufficient context for an AI agent to implement the feature successfully in one pass.
