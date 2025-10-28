import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { MagneticButton } from "@/components/animations/MagneticElements";
import { Calculator } from "lucide-react";

/**
 * CalculatorROI - Interactive ROI Calculator with Real-Time Results
 *
 * Features:
 * - 4 input fields: employees, hoursPerWeek, hourlyCost, processesToAutomate
 * - React Hook Form + Zod validation
 * - Real-time calculation with 70% efficiency factor
 * - French locale number formatting
 * - 2-column desktop layout (form left, results right)
 * - Stacked mobile layout
 * - Glassmorphism design
 * - Magnetic CTA with smooth scroll
 */

// ============================================
// Zod Validation Schema
// ============================================

const calculatorSchema = z.object({
  employees: z
    .number({ invalid_type_error: "Nombre d'employés requis" })
    .min(1, "Minimum 1 employé")
    .max(10000, "Maximum 10 000 employés"),
  hoursPerWeek: z
    .number({ invalid_type_error: "Heures par semaine requises" })
    .min(0.5, "Minimum 0.5 heure")
    .max(40, "Maximum 40 heures"),
  hourlyCost: z
    .number({ invalid_type_error: "Coût horaire requis" })
    .min(10, "Minimum 10€")
    .max(500, "Maximum 500€"),
  processesToAutomate: z
    .number({ invalid_type_error: "Nombre de processus requis" })
    .min(1, "Minimum 1 processus")
    .max(50, "Maximum 50 processus")
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

// ============================================
// ROI Calculation Logic
// ============================================

interface ROIResults {
  hoursSavedPerYear: number;
  annualSavings: number;
  estimatedInvestment: number;
  roiPercentage: number;
}

function calculateROI(data: CalculatorFormData): ROIResults {
  // Hours saved per year with 70% efficiency factor (50 working weeks)
  const hoursSavedPerYear = data.employees * data.hoursPerWeek * 50 * 0.7;

  // Annual savings
  const annualSavings = hoursSavedPerYear * data.hourlyCost;

  // Estimated investment (3500€ per process)
  const estimatedInvestment = data.processesToAutomate * 3500;

  // ROI percentage
  const roiPercentage = ((annualSavings - estimatedInvestment) / estimatedInvestment) * 100;

  return {
    hoursSavedPerYear,
    annualSavings,
    estimatedInvestment,
    roiPercentage
  };
}

// ============================================
// Main Component
// ============================================

export default function CalculatorROI() {
  const {
    register,
    watch,
    formState: { errors }
  } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      employees: 10,
      hoursPerWeek: 5,
      hourlyCost: 40,
      processesToAutomate: 3
    },
    mode: "onChange"
  });

  // Watch all form values for real-time calculation
  const formValues = watch();

  // Calculate ROI (only if all fields are valid numbers)
  const isValidData =
    typeof formValues.employees === 'number' &&
    typeof formValues.hoursPerWeek === 'number' &&
    typeof formValues.hourlyCost === 'number' &&
    typeof formValues.processesToAutomate === 'number' &&
    !isNaN(formValues.employees) &&
    !isNaN(formValues.hoursPerWeek) &&
    !isNaN(formValues.hourlyCost) &&
    !isNaN(formValues.processesToAutomate);

  const results: ROIResults = isValidData
    ? calculateROI(formValues)
    : { hoursSavedPerYear: 0, annualSavings: 0, estimatedInvestment: 0, roiPercentage: 0 };

  return (
    <section id="calculator" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator size={40} className="text-v2-cyan" />
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-v2-white">
                Calculateur ROI
              </h2>
            </div>
            <p className="text-xl sm:text-2xl text-v2-off-white/80 max-w-3xl mx-auto">
              Estimez le retour sur investissement de votre transformation digitale en quelques secondes
            </p>
          </div>
        </ScrollReveal>

        {/* 2-Column Layout: Form (left) + Results (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* LEFT COLUMN: Form Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-v2-charcoal/30 backdrop-blur-md rounded-2xl p-8 border border-v2-cyan/30"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-v2-white mb-6">
              Votre situation actuelle
            </h3>

            <div className="space-y-6">
              {/* Input 1: Employees */}
              <div>
                <label htmlFor="employees" className="block text-v2-off-white/80 mb-2 font-medium">
                  Nombre d'employés concernés
                </label>
                <input
                  id="employees"
                  type="number"
                  {...register("employees", { valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-lg bg-v2-navy/50 border border-v2-cyan/20 text-v2-white text-base focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="Ex: 10"
                />
                {errors.employees && (
                  <p className="text-red-400 text-sm mt-1">{errors.employees.message}</p>
                )}
              </div>

              {/* Input 2: Hours per Week */}
              <div>
                <label htmlFor="hoursPerWeek" className="block text-v2-off-white/80 mb-2 font-medium">
                  Heures par semaine passées sur tâches répétitives
                </label>
                <input
                  id="hoursPerWeek"
                  type="number"
                  step="0.5"
                  {...register("hoursPerWeek", { valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-lg bg-v2-navy/50 border border-v2-cyan/20 text-v2-white text-base focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="Ex: 5"
                />
                {errors.hoursPerWeek && (
                  <p className="text-red-400 text-sm mt-1">{errors.hoursPerWeek.message}</p>
                )}
              </div>

              {/* Input 3: Hourly Cost */}
              <div>
                <label htmlFor="hourlyCost" className="block text-v2-off-white/80 mb-2 font-medium">
                  Coût horaire moyen (€)
                </label>
                <input
                  id="hourlyCost"
                  type="number"
                  {...register("hourlyCost", { valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-lg bg-v2-navy/50 border border-v2-cyan/20 text-v2-white text-base focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="Ex: 40"
                />
                {errors.hourlyCost && (
                  <p className="text-red-400 text-sm mt-1">{errors.hourlyCost.message}</p>
                )}
              </div>

              {/* Input 4: Processes to Automate */}
              <div>
                <label htmlFor="processesToAutomate" className="block text-v2-off-white/80 mb-2 font-medium">
                  Nombre de processus à automatiser
                </label>
                <input
                  id="processesToAutomate"
                  type="number"
                  {...register("processesToAutomate", { valueAsNumber: true })}
                  className="w-full px-4 py-3 rounded-lg bg-v2-navy/50 border border-v2-cyan/20 text-v2-white text-base focus:outline-none focus:border-v2-cyan transition-colors"
                  placeholder="Ex: 3"
                />
                {errors.processesToAutomate && (
                  <p className="text-red-400 text-sm mt-1">{errors.processesToAutomate.message}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Results Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-v2-cyan/10 to-v2-navy/30 backdrop-blur-md rounded-2xl p-8 border border-v2-cyan/50"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-v2-white mb-6">
              Votre retour sur investissement
            </h3>

            <div className="space-y-6">
              {/* Result 1: Hours Saved */}
              <div className="p-4 rounded-lg bg-v2-navy/30 border border-v2-cyan/20">
                <p className="text-v2-off-white/70 text-sm mb-1">Heures économisées par an</p>
                <p className="text-3xl font-bold text-v2-cyan">
                  {results.hoursSavedPerYear.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} h
                </p>
              </div>

              {/* Result 2: Annual Savings */}
              <div className="p-4 rounded-lg bg-v2-navy/30 border border-v2-cyan/20">
                <p className="text-v2-off-white/70 text-sm mb-1">Économies annuelles</p>
                <p className="text-3xl font-bold text-v2-cyan">
                  {results.annualSavings.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                </p>
              </div>

              {/* Result 3: Estimated Investment */}
              <div className="p-4 rounded-lg bg-v2-navy/30 border border-v2-cyan/20">
                <p className="text-v2-off-white/70 text-sm mb-1">Investissement estimé</p>
                <p className="text-3xl font-bold text-v2-white">
                  {results.estimatedInvestment.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                </p>
              </div>

              {/* Result 4: ROI Percentage */}
              <div className="p-4 rounded-lg bg-v2-cyan/20 border border-v2-cyan/50">
                <p className="text-v2-white/90 text-sm mb-1">ROI Première Année</p>
                <p className="text-4xl font-bold text-v2-cyan">
                  {results.roiPercentage > 0 ? '+' : ''}
                  {results.roiPercentage.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} %
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8">
              <MagneticButton
                strength={0.2}
                className="w-full py-4 rounded-lg font-semibold text-lg bg-v2-cyan text-v2-navy hover:bg-v2-cyan/90 transition-colors duration-300"
                onClick={() => {
                  const target = document.querySelector('#contact');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Discuter de mon projet
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-v2-off-white/50 text-base sm:text-lg mt-8 max-w-3xl mx-auto">
          *Estimation basée sur un taux d'efficacité de 70% et un coût moyen de 3 500€ par processus automatisé.
          Les résultats réels peuvent varier selon votre contexte spécifique.
        </p>
      </div>
    </section>
  );
}
