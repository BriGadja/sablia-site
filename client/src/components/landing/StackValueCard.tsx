import { motion } from "framer-motion";
import { Check, Sparkles, Clock } from "lucide-react";
import { MagneticButton } from "@/components/animations/MagneticElements";

/**
 * StackValueCard - Displays transparent value stack adapted for French B2B market
 *
 * Features:
 * - Itemized value breakdown with individual prices
 * - Total value calculation
 * - Professional tone (no aggressive marketing emojis)
 * - Optional included services section
 * - ROI projection
 * - Magnetic CTA button
 *
 * Adapted for French market: sober, professional, credible
 */

interface ValueItem {
  label: string;
  value: number; // in euros
}

interface StackValueCardProps {
  packName: string;
  items: ValueItem[];
  priceToday: number;
  bonuses?: ValueItem[];
  roiMin: number;
  roiMax: number;
  deadline?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function StackValueCard({
  packName,
  items,
  priceToday,
  bonuses = [],
  roiMin,
  roiMax,
  deadline,
  ctaText = "Réserver ma place",
  ctaLink = "#contact",
}: StackValueCardProps) {
  // Calculate totals and savings
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const totalBonus = bonuses.reduce((sum, bonus) => sum + bonus.value, 0);
  const savings = totalValue - priceToday;
  const savingsPercent = Math.round((savings / totalValue) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-v2-charcoal/30 backdrop-blur-md rounded-2xl p-8 border border-v2-cyan/30 hover:border-v2-cyan/60 transition-colors duration-300"
    >
      {/* Pack Name Header */}
      <h3 className="text-3xl font-bold text-v2-white mb-6">{packName}</h3>

      {/* Items List */}
      <div className="space-y-2 mb-6">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-v2-off-white flex-1">
              {item.label}
              <span className="text-v2-cyan/30 mx-2">................</span>
            </span>
            <span className="text-v2-white font-semibold whitespace-nowrap">
              {item.value.toLocaleString("fr-FR")} €
            </span>
          </div>
        ))}
      </div>

      {/* Total Value */}
      <div className="border-t border-v2-cyan/30 pt-4 mb-6">
        <div className="flex justify-between items-center text-lg">
          <span className="text-v2-off-white font-bold">VALEUR TOTALE</span>
          <span className="text-v2-white font-bold">{totalValue.toLocaleString("fr-FR")} €</span>
        </div>
      </div>

      {/* Price Today */}
      <div className="bg-v2-navy/50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-v2-cyan text-lg font-semibold">Investissement</span>
          <span className="text-v2-cyan text-3xl font-bold">
            {priceToday.toLocaleString("fr-FR")} €
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-v2-off-white/70 text-sm">Valeur totale livrée</span>
          <span className="text-v2-off-white text-lg font-semibold">
            {totalValue.toLocaleString("fr-FR")} €
          </span>
        </div>
      </div>

      {/* Bonuses (if any) */}
      {bonuses.length > 0 && (
        <div className="bg-v2-charcoal/20 rounded-lg p-6 mb-6 border border-v2-cyan/20">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-v2-cyan" />
            <h4 className="text-lg font-semibold text-v2-white">Inclus dans l'offre actuelle</h4>
          </div>
          <div className="space-y-2">
            {bonuses.map((bonus, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check size={18} className="text-v2-cyan mt-1" />
                <span className="text-v2-off-white flex-1 text-sm">
                  {bonus.label}{" "}
                  <span className="text-v2-cyan/70">({bonus.value.toLocaleString("fr-FR")} €)</span>
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-v2-cyan/20 mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-v2-off-white/70 text-sm">Valeur additionnelle</span>
              <span className="text-v2-cyan text-lg font-semibold">
                {totalBonus.toLocaleString("fr-FR")} €
              </span>
            </div>
          </div>
          {deadline && (
            <div className="flex items-center gap-2 mt-4 text-v2-off-white/60 text-sm">
              <Clock size={16} />
              <span>Offre valable jusqu'à {deadline}</span>
            </div>
          )}
        </div>
      )}

      {/* ROI Projection */}
      <div className="mb-6">
        <div className="text-v2-off-white/70 text-sm mb-2">
          Retour sur investissement projeté (an 1)
        </div>
        <div className="text-v2-cyan text-xl font-semibold">
          {roiMin.toLocaleString("fr-FR")} € - {roiMax.toLocaleString("fr-FR")} €
        </div>
        <div className="text-v2-off-white/50 text-xs mt-1">Basé sur nos études de cas clients</div>
      </div>

      {/* CTA */}
      <MagneticButton
        strength={0.3}
        className="w-full bg-v2-cyan text-v2-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-v2-cyan/90 transition-colors"
        onClick={() => {
          const target = document.querySelector(ctaLink);
          target?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {ctaText}
      </MagneticButton>
    </motion.div>
  );
}
