import StackValueCard from "@/components/landing/StackValueCard";
import ScrollReveal from "@/components/animations/ScrollReveal";

/**
 * Test page for StackValueCard component
 * Displays all 3 packs (Starter, Growth, Enterprise)
 */

// Pack Starter data
const starterItems = [
  { label: "Audit Expert 3 jours", value: 2900 },
  { label: "Build 2 automatisations", value: 1920 },
  { label: "Formation équipe 2h", value: 1200 },
  { label: "Documentation technique complète", value: 800 },
  { label: "Support prioritaire 30 jours", value: 800 },
  { label: "Maintenance corrective 60 jours", value: 1200 },
];

const starterBonuses = [
  { label: "Bibliothèque de 12 playbooks prêts à l'emploi", value: 1500 },
  { label: "2 sessions stratégiques mensuelles (2 mois)", value: 900 },
  { label: "Audit d'optimisation J+90", value: 1500 },
];

// Pack Growth data
const growthItems = [
  { label: "Audit Expert 5 jours", value: 4500 },
  { label: "Build 5 automatisations", value: 4800 },
  { label: "Formation équipe 4h", value: 2400 },
  { label: "Documentation technique complète", value: 1200 },
  { label: "Support prioritaire 45 jours", value: 1200 },
  { label: "Maintenance corrective 90 jours", value: 1800 },
];

const growthBonuses = [
  { label: "Bibliothèque de 25 playbooks prêts à l'emploi", value: 2500 },
  { label: "6 sessions stratégiques mensuelles (6 mois)", value: 3600 },
  { label: "Audit d'optimisation J+90", value: 1500 },
];

// Pack Enterprise data
const enterpriseItems = [
  { label: "Audit Expert 7 jours", value: 7000 },
  { label: "Build 10+ automatisations", value: 9600 },
  { label: "Formation équipe 8h", value: 4800 },
  { label: "Architecture personnalisée", value: 3000 },
  { label: "Documentation complète + runbooks", value: 2000 },
  { label: "Support prioritaire 90 jours", value: 2400 },
  { label: "Maintenance corrective 120 jours", value: 3600 },
];

const enterpriseBonuses = [
  { label: "Bibliothèque complète de 50+ playbooks", value: 4000 },
  { label: "12 sessions stratégiques mensuelles (1 an)", value: 7200 },
  { label: "2 audits d'optimisation (J+90 et J+180)", value: 6000 },
];

export default function TestStackValue() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-v2-navy via-v2-charcoal to-v2-navy">
      <div className="container mx-auto px-6 py-24">
        {/* Section Header */}
        <ScrollReveal>
          <h1 className="text-6xl font-bold text-center text-v2-white mb-4">
            Stack Value Card - Test
          </h1>
          <p className="text-xl text-v2-off-white/80 text-center mb-16 max-w-3xl mx-auto">
            Validation visuelle des 3 packs avec Stack Value Math (Hormozi)
          </p>
        </ScrollReveal>

        {/* 3 Pack Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Pack Starter */}
          <StackValueCard
            packName="PACK STARTER"
            items={starterItems}
            priceToday={5900}
            bonuses={starterBonuses}
            roiMin={17700}
            roiMax={23600}
            deadline="fin du mois"
          />

          {/* Pack Growth */}
          <StackValueCard
            packName="PACK GROWTH"
            items={growthItems}
            priceToday={11500}
            bonuses={growthBonuses}
            roiMin={34500}
            roiMax={46000}
            deadline="fin du mois"
          />

          {/* Pack Enterprise */}
          <StackValueCard
            packName="PACK ENTERPRISE"
            items={enterpriseItems}
            priceToday={24900}
            bonuses={enterpriseBonuses}
            roiMin={74700}
            roiMax={99600}
            deadline="fin du mois"
          />
        </div>

        {/* Test Card Without Bonuses */}
        <div className="mt-16 max-w-md mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-v2-white mb-8 text-center">Test: Sans Bonus</h2>
          </ScrollReveal>
          <StackValueCard
            packName="PACK TEST (NO BONUS)"
            items={[
              { label: "Service A", value: 1000 },
              { label: "Service B", value: 2000 },
              { label: "Service C", value: 3000 },
            ]}
            priceToday={5000}
            bonuses={[]}
            roiMin={15000}
            roiMax={20000}
            ctaText="Tester maintenant"
          />
        </div>
      </div>
    </div>
  );
}
