import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";

const INVESTMENT = 1500;
const EFFICIENCY = 0.7;
const WORK_WEEKS = 48;
const HOURS_PER_DAY = 7;

function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = value;
    const diff = target - start;
    if (Math.abs(diff) < 1) {
      setValue(target);
      return;
    }
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + diff * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

export default function CalculatorROI() {
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [hourlyCost, setHourlyCost] = useState(35);

  const hoursSaved = Math.round(hoursPerWeek * EFFICIENCY * WORK_WEEKS);
  const annualSavings = hoursSaved * hourlyCost;
  const roi = Math.round(((annualSavings - INVESTMENT) / INVESTMENT) * 100);
  const daysEquivalent = Math.round(hoursSaved / HOURS_PER_DAY);

  const animatedHours = useCountUp(hoursSaved);
  const animatedSavings = useCountUp(annualSavings);
  const animatedRoi = useCountUp(roi);

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
                Calculez vos économies en 30 secondes
              </h2>
            </div>
            <p className="text-lg text-sablia-text-secondary max-w-2xl mx-auto">
              Deux curseurs, un résultat concret
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-sablia-bg border border-sablia-border rounded p-8 space-y-8"
          >
            <div>
              <label htmlFor="hours" className="flex items-baseline justify-between mb-4">
                <span className="text-sm font-medium text-sablia-text-secondary">
                  Heures/semaine sur tâches répétitives
                </span>
                <span className="text-2xl font-bold text-sablia-text tabular-nums">
                  {hoursPerWeek}h
                </span>
              </label>
              <input
                id="hours"
                type="range"
                min={2}
                max={40}
                step={1}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-sablia-surface accent-sablia-sienna [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sablia-sienna [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sablia-sienna [&::-moz-range-thumb]:border-0"
              />
              <div className="flex justify-between text-xs text-sablia-text-tertiary mt-1">
                <span>2h</span>
                <span>40h</span>
              </div>
            </div>

            <div>
              <label htmlFor="cost" className="flex items-baseline justify-between mb-4">
                <span className="text-sm font-medium text-sablia-text-secondary">
                  Coût horaire moyen dans votre entreprise
                </span>
                <span className="text-2xl font-bold text-sablia-text tabular-nums">
                  {hourlyCost}€
                </span>
              </label>
              <input
                id="cost"
                type="range"
                min={20}
                max={80}
                step={5}
                value={hourlyCost}
                onChange={(e) => setHourlyCost(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-sablia-surface accent-sablia-sienna [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sablia-sienna [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-sablia-sienna [&::-moz-range-thumb]:border-0"
              />
              <div className="flex justify-between text-xs text-sablia-text-tertiary mt-1">
                <span>20€</span>
                <span>80€</span>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-sablia-bg border border-sablia-border rounded p-8 flex flex-col"
          >
            <div className="space-y-4 flex-1">
              <div className="p-4 rounded bg-sablia-surface border border-sablia-border">
                <p className="text-sablia-text-secondary text-sm mb-1">Heures récupérées par an</p>
                <p className="text-3xl font-bold text-sablia-sienna tabular-nums">
                  {animatedHours.toLocaleString("fr-FR")} h
                </p>
              </div>

              <div className="p-4 rounded bg-sablia-surface border border-sablia-border">
                <p className="text-sablia-text-secondary text-sm mb-1">Économies annuelles</p>
                <p className="text-3xl font-bold text-sablia-accent tabular-nums">
                  {animatedSavings.toLocaleString("fr-FR")} €
                </p>
              </div>

              <div className="p-4 rounded bg-sablia-accent/[0.04] border border-sablia-accent/15">
                <p className="text-sablia-text-secondary text-sm mb-1">
                  Pour un investissement de ~{INVESTMENT.toLocaleString("fr-FR")} €
                </p>
                <p className="text-3xl font-bold text-sablia-accent tabular-nums">
                  {animatedRoi > 0 ? "+" : ""}{animatedRoi.toLocaleString("fr-FR")} % ROI
                </p>
              </div>
            </div>

            <p className="text-sm text-sablia-text-secondary mt-4 leading-relaxed">
              C'est l'équivalent de <strong className="text-sablia-text">{daysEquivalent} jours de travail</strong> récupérés par an.
            </p>

            <div className="mt-4 pt-4 border-t border-sablia-border">
              <p className="text-xs text-sablia-text-tertiary italic">
                "Hélène a économisé 90% de son temps de conception de menus" — GirlsGang
              </p>
            </div>

            <button
              className="w-full py-3.5 rounded font-medium text-base bg-sablia-accent text-sablia-bg hover:bg-sablia-accent-hover transition-colors duration-200 mt-6"
              onClick={() => {
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Discuter de mon projet
            </button>
          </motion.div>
        </div>

        <p className="text-center text-sablia-text-tertiary text-sm mt-8 max-w-2xl mx-auto">
          *Estimation basée sur un taux d'efficacité de 70%, 48 semaines travaillées, et un investissement moyen de {INVESTMENT.toLocaleString("fr-FR")} €.
        </p>
      </div>
    </section>
  );
}
