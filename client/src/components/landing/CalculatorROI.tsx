import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

const calculatorSchema = z.object({
  employees: z.number({ invalid_type_error: "Nombre d'employés requis" }).min(1, "Minimum 1 employé").max(10000, "Maximum 10 000 employés"),
  hoursPerWeek: z.number({ invalid_type_error: "Heures par semaine requises" }).min(0.5, "Minimum 0.5 heure").max(40, "Maximum 40 heures"),
  hourlyCost: z.number({ invalid_type_error: "Coût horaire requis" }).min(10, "Minimum 10€").max(500, "Maximum 500€"),
  processesToAutomate: z.number({ invalid_type_error: "Nombre de processus requis" }).min(1, "Minimum 1 processus").max(50, "Maximum 50 processus"),
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

interface ROIResults {
  hoursSavedPerYear: number;
  annualSavings: number;
  estimatedInvestment: number;
  roiPercentage: number;
}

function calculateROI(data: CalculatorFormData): ROIResults {
  const hoursSavedPerYear = data.employees * data.hoursPerWeek * 50 * 0.7;
  const annualSavings = hoursSavedPerYear * data.hourlyCost;
  const estimatedInvestment = data.processesToAutomate * 3500;
  const roiPercentage = ((annualSavings - estimatedInvestment) / estimatedInvestment) * 100;
  return { hoursSavedPerYear, annualSavings, estimatedInvestment, roiPercentage };
}

export default function CalculatorROI() {
  const { register, watch, formState: { errors } } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: { employees: 10, hoursPerWeek: 5, hourlyCost: 40, processesToAutomate: 3 },
    mode: "onChange",
  });

  const formValues = watch();
  const isValidData =
    typeof formValues.employees === "number" && typeof formValues.hoursPerWeek === "number" &&
    typeof formValues.hourlyCost === "number" && typeof formValues.processesToAutomate === "number" &&
    !isNaN(formValues.employees) && !isNaN(formValues.hoursPerWeek) &&
    !isNaN(formValues.hourlyCost) && !isNaN(formValues.processesToAutomate);

  const results: ROIResults = isValidData
    ? calculateROI(formValues)
    : { hoursSavedPerYear: 0, annualSavings: 0, estimatedInvestment: 0, roiPercentage: 0 };

  const inputClasses = "w-full px-4 py-3 rounded bg-sablia-bg border border-sablia-border text-sablia-text text-base focus:outline-none focus:border-sablia-accent focus:ring-1 focus:ring-sablia-accent transition-colors";

  return (
    <section id="calculator" className="py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Calculator size={28} className="text-sablia-accent" />
              <h2 className="text-3xl lg:text-4xl font-display font-semibold text-sablia-text">
                Calculateur ROI
              </h2>
            </div>
            <p className="text-lg text-sablia-text-secondary max-w-2xl mx-auto">
              Estimez le retour sur investissement de votre transformation digitale
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-sablia-bg border border-sablia-border rounded p-8"
          >
            <h3 className="text-xl font-semibold text-sablia-text mb-6">
              Votre situation actuelle
            </h3>

            <div className="space-y-5">
              <div>
                <label htmlFor="employees" className="block text-sablia-text-secondary mb-2 text-sm font-medium">
                  Nombre d'employés concernés
                </label>
                <input id="employees" type="number" {...register("employees", { valueAsNumber: true })} className={inputClasses} placeholder="Ex: 10" />
                {errors.employees && <p className="text-red-500 text-sm mt-1">{errors.employees.message}</p>}
              </div>

              <div>
                <label htmlFor="hoursPerWeek" className="block text-sablia-text-secondary mb-2 text-sm font-medium">
                  Heures par semaine passées sur tâches répétitives
                </label>
                <input id="hoursPerWeek" type="number" step="0.5" {...register("hoursPerWeek", { valueAsNumber: true })} className={inputClasses} placeholder="Ex: 5" />
                {errors.hoursPerWeek && <p className="text-red-500 text-sm mt-1">{errors.hoursPerWeek.message}</p>}
              </div>

              <div>
                <label htmlFor="hourlyCost" className="block text-sablia-text-secondary mb-2 text-sm font-medium">
                  Coût horaire moyen (€)
                </label>
                <input id="hourlyCost" type="number" {...register("hourlyCost", { valueAsNumber: true })} className={inputClasses} placeholder="Ex: 40" />
                {errors.hourlyCost && <p className="text-red-500 text-sm mt-1">{errors.hourlyCost.message}</p>}
              </div>

              <div>
                <label htmlFor="processesToAutomate" className="block text-sablia-text-secondary mb-2 text-sm font-medium">
                  Nombre de processus à automatiser
                </label>
                <input id="processesToAutomate" type="number" {...register("processesToAutomate", { valueAsNumber: true })} className={inputClasses} placeholder="Ex: 3" />
                {errors.processesToAutomate && <p className="text-red-500 text-sm mt-1">{errors.processesToAutomate.message}</p>}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-sablia-bg border border-sablia-border rounded p-8"
          >
            <h3 className="text-xl font-semibold text-sablia-text mb-6">
              Votre retour sur investissement
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded bg-sablia-surface border border-sablia-border">
                <p className="text-sablia-text-secondary text-sm mb-1">Heures économisées par an</p>
                <p className="text-2xl font-bold text-sablia-text">
                  {results.hoursSavedPerYear.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} h
                </p>
              </div>

              <div className="p-4 rounded bg-sablia-surface border border-sablia-border">
                <p className="text-sablia-text-secondary text-sm mb-1">Économies annuelles</p>
                <p className="text-2xl font-bold text-sablia-accent">
                  {results.annualSavings.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </p>
              </div>

              <div className="p-4 rounded bg-sablia-surface border border-sablia-border">
                <p className="text-sablia-text-secondary text-sm mb-1">Investissement estimé</p>
                <p className="text-2xl font-bold text-sablia-text">
                  {results.estimatedInvestment.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €
                </p>
              </div>

              <div className="p-4 rounded bg-sablia-accent/[0.04] border border-sablia-accent/15">
                <p className="text-sablia-text-secondary text-sm mb-1">ROI Première Année</p>
                <p className="text-3xl font-bold text-sablia-accent">
                  {results.roiPercentage > 0 ? "+" : ""}{results.roiPercentage.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} %
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="w-full py-3.5 rounded font-medium text-base bg-sablia-accent text-sablia-bg hover:bg-sablia-accent-hover transition-colors duration-200"
                onClick={() => {
                  const target = document.querySelector("#contact");
                  target?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Discuter de mon projet
              </button>
            </div>
          </motion.div>
        </div>

        <p className="text-center text-sablia-text-tertiary text-sm mt-8 max-w-2xl mx-auto">
          *Estimation basée sur un taux d'efficacité de 70% et un coût moyen de 3 500€ par processus automatisé. Les résultats réels peuvent varier.
        </p>
      </div>
    </section>
  );
}
