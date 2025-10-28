import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navigation from "@/components/landing/Navigation";
import ScrollToTop from "@/components/ScrollToTop";
import AnimatedParticles from "@/components/animations/AnimatedParticles";
import CustomCursor from "@/components/animations/CustomCursor";
import { motion } from "framer-motion";

export default function CGV() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #2B9AB8 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated particles background */}
      <AnimatedParticles />

      {/* Content layer */}
      <div className="relative z-10">
        <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center mb-10 mt-12">
          <h1 className="text-4xl font-bold text-center">Conditions Générales de Vente (CGV)</h1>
        </div>

        <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
          <div className="mb-8 text-gray-300">
            <p><strong>Entreprise :</strong> GACHADOAT Brice, entrepreneur individuel</p>
            <p><strong>SIREN :</strong> 940 901 127</p>
            <p><strong>Adresse :</strong> 60 RUE François Ier, 75008 Paris, France</p>
            <p><strong>Code APE :</strong> 6201Z - Programmation informatique</p>
            <p><strong>Nom commercial :</strong> Sablia</p>
            <p><strong>Domaine :</strong> sablia.io</p>
            <p><strong>Activité principale :</strong> Conseil, formation, développement d'automatisations, Chatbots et agents vocaux alimentés à l'Intelligence Artificielle</p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Objet</h2>
            <p className="text-gray-300">
              Les présentes Conditions Générales de Vente ont pour objet de définir les modalités de vente des prestations proposées par Sablia, notamment les formations, conseils, audits, et développements spécifiques, ainsi que leurs conditions d'exécution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Commandes</h2>
            <p className="text-gray-300">
              Les commandes peuvent être passées par tout moyen écrit (email, formulaire, etc.). La validation de la commande implique l'acceptation sans réserve des présentes CGV.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Tarifs et modalités de paiement</h2>
            <ul className="text-gray-300 space-y-2">
              <li>Les tarifs des formations sont fixés selon la grille en vigueur au moment de la commande.</li>
              <li>Les tarifs pour les prestations d'automatisation, conseils ou autres développements sont communiqués lors de l'établissement du devis.</li>
              <li>Le paiement s'effectue par virement bancaire.</li>
              <li>Les modalités de paiement sont :
                <ul className="ml-6 mt-2 space-y-1">
                  <li>50% du montant total à la commande,</li>
                  <li>50% à la livraison ou à l'achèvement de la prestation, ou</li>
                  <li>100% à la commande si le client l'a accepté.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Déroulement des prestations</h2>
            <ul className="text-gray-300 space-y-2">
              <li>Les prestations sont dématérialisées (par visioconférence, échanges électroniques).</li>
              <li>Sur demande, des formations en présentiel peuvent être organisées.</li>
              <li>Les délais d'exécution sont indiqués lors de la confirmation de la commande.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Droit de rétractation</h2>
            <p className="text-gray-300">
              Conformément à la législation applicable, il n'est pas prévu de droit de rétractation pour les prestations de services. La commande est ferme et définitive dès sa validation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Responsabilité et garanties</h2>
            <p className="text-gray-300 mb-4">
              Sablia s'engage à réaliser les prestations avec professionnalisme et conformément aux spécifications du devis accepté. La qualité des résultats peut dépendre de la coopération et des informations fournies par le client.
            </p>
            <p className="text-gray-300">
              En toute hypothèse, la responsabilité de Sablia est limitée au montant de la prestation concernée. Sablia ne pourra être tenue responsable des dommages indirects (perte de chiffre d'affaires, perte de chance, préjudice commercial, etc.).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Propriété intellectuelle</h2>
            <p className="text-gray-300">
              Tous les contenus, documents, outils ou logiciels fournis ou réalisés dans le cadre des prestations restent la propriété exclusive de Sablia, sauf accord contraire. Le client s'engage à ne pas reproduire, distribuer ou exploiter ces éléments sans autorisation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Confidentialité</h2>
            <p className="text-gray-300">
              Les parties s'engagent à respecter la confidentialité des informations échangées dans le cadre des prestations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Loi applicable et juridiction compétente</h2>
            <p className="text-gray-300">
              Les présentes CGV sont régies par la loi française. En cas de litige, attribution de compétence exclusive aux tribunaux de Paris.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Retard de paiement</h2>
            <p className="text-gray-300 mb-4">
              En cas de retard de paiement, des pénalités de retard égales à trois fois le taux d'intérêt légal en vigueur seront appliquées de plein droit, sans qu'un rappel soit nécessaire.
            </p>
            <p className="text-gray-300">
              Une indemnité forfaitaire de 40 euros pour frais de recouvrement sera également due. Si les frais de recouvrement réellement engagés sont supérieurs à ce montant, une indemnisation complémentaire pourra être demandée sur justificatifs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">11. Force majeure</h2>
            <p className="text-gray-300 mb-4">
              Sablia ne pourra être tenue responsable de l'inexécution de ses obligations contractuelles en cas de force majeure telle que définie par la jurisprudence des tribunaux français, notamment en cas de catastrophe naturelle, grève, guerre, pandémie, défaillance des réseaux de télécommunication ou d'électricité, ou tout autre événement échappant à son contrôle raisonnable.
            </p>
            <p className="text-gray-300">
              En cas de force majeure, l'exécution de la prestation sera suspendue. Si la situation perdure au-delà de 30 jours, le contrat pourra être résilié de plein droit par l'une ou l'autre des parties, sans indemnité.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">12. Médiation</h2>
            <p className="text-gray-300 mb-4">
              Conformément aux dispositions du Code de la consommation concernant le règlement amiable des litiges, en cas de litige entre Sablia et un client consommateur, une solution amiable sera recherchée avant toute action judiciaire.
            </p>
            <p className="text-gray-300 mb-4">
              Le client peut recourir gratuitement au service de médiation proposé par Sablia en contactant : <a href="mailto:brice@sablia.io" className="text-orange-500 hover:text-orange-400">brice@sablia.io</a>
            </p>
            <p className="text-gray-300">
              À défaut d'accord amiable, le client consommateur peut saisir gratuitement le médiateur de la consommation dont relève Sablia. Les coordonnées du médiateur sont disponibles sur demande.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">13. Modifications des CGV</h2>
            <p className="text-gray-300">
              Sablia se réserve le droit de modifier à tout moment les présentes CGV. La version en vigueur est celle qui est accessible en ligne au moment de la commande.
            </p>
          </section>
        </div>
      </main>
        <Footer />
        <ScrollToTop />
      </div>

      {/* Custom cursor layer */}
      <CustomCursor />
    </motion.div>
  );
}
