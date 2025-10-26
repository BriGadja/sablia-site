import { motion } from "framer-motion";
import { useState } from "react";
import Container from "./Container";
import Section from "./Section";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./Card";
import { Button } from "./Button";

export default function CalculatorROI() {
  const [employees, setEmployees] = useState(10);
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(35);

  // Calculations
  const weeklyTimeCost = employees * hoursPerWeek * hourlyRate;
  const annualTimeCost = weeklyTimeCost * 52;
  const potentialSavings = annualTimeCost * 0.7; // 70% automation efficiency
  const automationCost = 5000; // Average project cost
  const netGain = potentialSavings - automationCost;
  const roiPercentage = ((netGain / automationCost) * 100).toFixed(0);
  const paybackMonths = ((automationCost / potentialSavings) * 12).toFixed(1);

  return (
    <Section background="white" spacing="default" id="calculator-roi">
      <Container maxWidth="narrow">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-v2-navy mb-6"
          >
            Calculez votre ROI automation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-v2-charcoal/80"
          >
            Combien pourriez-vous économiser en automatisant vos processus répétitifs ?
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Vos paramètres</CardTitle>
              <CardDescription>
                Ajustez les valeurs pour correspondre à votre situation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Employees Input */}
                <div>
                  <label className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-semibold text-v2-navy">
                      Nombre de collaborateurs
                    </span>
                    <span className="text-2xl font-bold text-v2-electric">{employees}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={employees}
                    onChange={(e) => setEmployees(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-v2-electric"
                  />
                  <div className="flex justify-between text-xs text-v2-charcoal/50 mt-1">
                    <span>1</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Hours Per Week Input */}
                <div>
                  <label className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-semibold text-v2-navy">
                      Heures/semaine sur tâches répétitives (par personne)
                    </span>
                    <span className="text-2xl font-bold text-v2-electric">{hoursPerWeek}h</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-v2-electric"
                  />
                  <div className="flex justify-between text-xs text-v2-charcoal/50 mt-1">
                    <span>1h</span>
                    <span>40h</span>
                  </div>
                </div>

                {/* Hourly Rate Input */}
                <div>
                  <label className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-semibold text-v2-navy">
                      Coût horaire moyen (chargé)
                    </span>
                    <span className="text-2xl font-bold text-v2-electric">{hourlyRate}€</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-v2-electric"
                  />
                  <div className="flex justify-between text-xs text-v2-charcoal/50 mt-1">
                    <span>20€</span>
                    <span>100€</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-v2-navy to-v2-electric text-v2-white">
              <CardContent className="pt-8">
                <div className="text-center">
                  <p className="text-sm font-semibold text-v2-white/80 mb-2">
                    Coût annuel actuel
                  </p>
                  <p className="text-5xl font-bold mb-1">
                    {annualTimeCost.toLocaleString('fr-FR')}€
                  </p>
                  <p className="text-xs text-v2-white/60">
                    {weeklyTimeCost.toLocaleString('fr-FR')}€/semaine sur tâches manuelles
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-v2-electric to-v2-cyan text-v2-white">
              <CardContent className="pt-8">
                <div className="text-center">
                  <p className="text-sm font-semibold text-v2-white/80 mb-2">
                    Économies potentielles (70% automatisable)
                  </p>
                  <p className="text-5xl font-bold mb-1">
                    {potentialSavings.toLocaleString('fr-FR')}€
                  </p>
                  <p className="text-xs text-v2-white/60">
                    par an après automation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-v2-charcoal/60 mb-1">ROI Première Année</p>
                <p className="text-3xl font-bold text-v2-cyan">{roiPercentage}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-v2-charcoal/60 mb-1">Retour sur Investissement</p>
                <p className="text-3xl font-bold text-v2-electric">{paybackMonths} mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-v2-charcoal/60 mb-1">Gain Net An 1</p>
                <p className="text-3xl font-bold text-v2-navy">
                  {netGain.toLocaleString('fr-FR')}€
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-v2-charcoal/60 mb-4">
              Ces estimations sont basées sur nos projets réels. Résultats variables selon votre contexte.
            </p>
            <Button
              size="lg"
              onClick={() => window.open('https://calendly.com/brice-gachadoat/30min', '_blank')}
            >
              Discutons de votre projet
            </Button>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
