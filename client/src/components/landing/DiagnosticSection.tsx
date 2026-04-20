import { motion } from 'framer-motion'
import DiagnosticForm from './DiagnosticForm'

export default function DiagnosticSection() {
  return (
    <section id="diagnostic-form" className="py-24 bg-sablia-surface">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-semibold text-sablia-text mb-6">
            Cinq jours pour y voir clair.
          </h2>
          <p className="text-lg text-sablia-text-secondary leading-relaxed">
            Le Diagnostic Sablia structure votre état des lieux. Vous recevez un PDF de 10 à 15
            pages&nbsp;: cartographie de vos process, opportunités d'implémentation IA classées par
            ROI, feuille de route 90 jours, et estimation chiffrée de la phase suivante. Tout ça en
            5 jours ouvrés, pour 490€ HT. Si le diagnostic débouche sur un contrat Développement ou
            Accompagnement signé dans les 90 jours, ces 490€ sont intégralement déduits de votre
            première facture. Payable par Stripe ou virement. Annulation avec remboursement intégral
            jusqu'à 72h avant l'intake.
          </p>
        </motion.div>

        <DiagnosticForm />
      </div>
    </section>
  )
}
