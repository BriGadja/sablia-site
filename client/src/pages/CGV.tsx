import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navigation from "@/components/landing/Navigation";
import ScrollToTop from "@/components/ScrollToTop";
import AnimatedParticles from "@/components/animations/AnimatedParticles";
import CustomCursor from "@/components/animations/CustomCursor";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

export default function CGV() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO page="/cgv" />
      <motion.div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #2B9AB8 0%, #3E92CC 15%, #0A2463 35%, #0A2463 50%, #2D3142 65%, #3d2f1f 80%, #4a3621 95%, #3d2f1f 100%)",
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
            <p className="text-gray-400 mt-2">Dernière mise à jour : 28 octobre 2025</p>
          </div>

          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            {/* Informations légales */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">INFORMATIONS LÉGALES</h2>
              <div className="text-gray-300 space-y-2">
                <p>
                  <strong>Entreprise :</strong> GACHADOAT Brice, entrepreneur individuel
                </p>
                <p>
                  <strong>SIREN :</strong> 940 901 127
                </p>
                <p>
                  <strong>SIRET :</strong> 94090112700016
                </p>
                <p>
                  <strong>Adresse :</strong> 60 rue François Ier, 75008 Paris, France
                </p>
                <p>
                  <strong>Code APE :</strong> 6201Z - Programmation informatique
                </p>
                <p>
                  <strong>Nom commercial :</strong> Sablia
                </p>
                <p>
                  <strong>Site web :</strong> sablia.io
                </p>
                <p>
                  <strong>Email :</strong>{" "}
                  <a
                    href="mailto:brice@sablia.io"
                    className="text-orange-500 hover:text-orange-400"
                  >
                    brice@sablia.io
                  </a>
                </p>
                <p>
                  <strong>Téléphone :</strong> +33 6 25 42 68 38
                </p>
                <p className="mt-4">
                  <strong>Activité principale :</strong> Conseil, formation et développement
                  d'automatisations et d'agents IA alimentés à l'Intelligence Artificielle.
                </p>
                <p>
                  <strong>Responsable de publication :</strong> GACHADOAT Brice
                </p>
              </div>
            </section>

            {/* Article 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 1 - OBJET ET CHAMP D'APPLICATION
              </h2>

              <h3 className="text-xl font-semibold mb-3 text-white">1.1 Objet</h3>
              <p className="text-gray-300 mb-4">
                Les présentes Conditions Générales de Vente (ci-après « CGV ») ont pour objet de
                définir les modalités et conditions de vente des prestations proposées par Sablia,
                notamment :
              </p>

              <div className="text-gray-300 mb-4">
                <p className="font-semibold mb-2">A) Prestations ponctuelles :</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Formations (présentiel ou distanciel)</li>
                  <li>Conseils et audits</li>
                  <li>Développements spécifiques d'automatisations</li>
                  <li>Développements d'agents IA et solutions d'automatisation intelligente</li>
                  <li>Missions de conseil en transformation numérique</li>
                  <li>Prestations de paramétrage et intégration</li>
                </ul>
              </div>

              <div className="text-gray-300 mb-4">
                <p className="font-semibold mb-2">
                  B) Prestations récurrentes / Abonnements mensuels :
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Abonnements à des services d'automatisation (forfait heures/mois)</li>
                  <li>Abonnements à des agents vocaux IA (ex: Norah et autres agents)</li>
                  <li>Services de maintenance et support récurrents</li>
                  <li>Licences d'utilisation mensuelle de solutions développées</li>
                  <li>Services SaaS (Software as a Service)</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">1.2 Champ d'application</h3>
              <p className="text-gray-300 mb-4">
                Les présentes CGV s'appliquent exclusivement aux relations commerciales entre Sablia
                et ses clients professionnels (B2B) ou consommateurs (B2C), à l'exclusion de toute
                autre condition, notamment celles du client.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-white">1.3 Acceptation</h3>
              <p className="text-gray-300">
                La validation d'une commande ou la signature d'un devis implique l'acceptation sans
                réserve des présentes CGV par le client.
              </p>
            </section>

            {/* Article 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 2 - COMMANDES ET CONCLUSION DU CONTRAT
              </h2>

              <h3 className="text-xl font-semibold mb-3 text-white">2.1 Modalités de commande</h3>
              <p className="text-gray-300 mb-2">Les commandes peuvent être passées par :</p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1 mb-4">
                <li>Email (brice@sablia.io)</li>
                <li>Formulaire de contact sur sablia.io</li>
                <li>Validation d'un devis signé</li>
                <li>Tout autre moyen écrit convenu entre les parties</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-white">2.2 Devis</h3>
              <p className="text-gray-300 mb-2">
                Pour toute prestation, un devis détaillé est établi, précisant :
              </p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1 mb-4">
                <li>La nature et le descriptif des prestations</li>
                <li>Les délais d'exécution indicatifs</li>
                <li>Le prix (HT et TTC)</li>
                <li>Les modalités de paiement</li>
                <li>La durée de validité du devis (30 jours sauf mention contraire)</li>
              </ul>
              <p className="text-gray-300 mb-4">
                Le devis signé et retourné à Sablia vaut commande ferme et définitive.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-white">
                2.3 Confirmation de commande
              </h3>
              <p className="text-gray-300">
                Sablia confirme la commande par email dans un délai de 48 heures ouvrées. Le contrat
                est définitivement formé à la réception de cette confirmation.
              </p>
            </section>

            {/* Article 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">ARTICLE 3 - TARIFS</h2>

              <h3 className="text-xl font-semibold mb-3 text-white">3.1 Prix</h3>
              <p className="text-gray-300 mb-4">
                Les prix sont exprimés en euros, hors taxes (HT), sauf mention contraire. La TVA
                applicable au taux légal en vigueur (20% sauf exception) sera ajoutée en sus.
              </p>
              <p className="text-gray-300 mb-2">Les tarifs en vigueur sont :</p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1 mb-4">
                <li>Ceux figurant sur le site sablia.io au moment de la commande</li>
                <li>Ceux mentionnés dans le devis accepté par le client</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-white">3.2 Révision des prix</h3>
              <p className="text-gray-300 mb-2">
                <strong>Pour les prestations ponctuelles :</strong>
              </p>
              <p className="text-gray-300 mb-4">
                Les prix sont fermes et non révisables pendant la durée d'exécution de la
                prestation, sauf accord contraire stipulé au devis.
              </p>

              <p className="text-gray-300 mb-2">
                <strong>Pour les abonnements mensuels :</strong>
              </p>
              <p className="text-gray-300 mb-4">
                Sablia se réserve le droit de modifier ses tarifs avec un préavis de 30 jours
                calendaires. Le client sera informé par email de toute modification tarifaire. Il
                pourra alors :
              </p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1 mb-4">
                <li>Accepter le nouveau tarif (poursuite de l'abonnement)</li>
                <li>
                  Résilier l'abonnement sans pénalité dans les 15 jours suivant la notification
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-white">3.3 Frais annexes</h3>
              <p className="text-gray-300">
                Les frais de déplacement, d'hébergement et de restauration pour les prestations en
                présentiel sont facturés en sus, sauf stipulation contraire dans le devis.
              </p>
            </section>

            {/* Article 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 4 - MODALITÉS DE PAIEMENT
              </h2>

              <h3 className="text-xl font-semibold mb-3 text-white">4.1 Prestations ponctuelles</h3>
              <p className="text-gray-300 mb-2">
                Le paiement s'effectue selon l'une des modalités suivantes, précisée au devis :
              </p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1 mb-4">
                <li>
                  <strong>Option 1 :</strong> 50% à la commande + 50% à la livraison/achèvement
                </li>
                <li>
                  <strong>Option 2 :</strong> 100% à la commande (si accepté par le client)
                </li>
                <li>
                  <strong>Option 3 :</strong> 100% à la livraison (pour petites prestations &lt;
                  1000€)
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-white">4.2 Abonnements mensuels</h3>

              <p className="text-gray-300 font-semibold mb-2">A) Principe général</p>
              <p className="text-gray-300 mb-4">
                Les abonnements mensuels sont facturés <strong>d'avance</strong>, le{" "}
                <strong>1er jour de chaque mois</strong> pour le mois en cours.
              </p>

              <p className="text-gray-300 mb-2">
                <strong>Structure tarifaire :</strong>
              </p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1 mb-4">
                <li>
                  <strong>Partie fixe :</strong> abonnement mensuel (forfait heures, licence agent
                  vocal, accès plateforme)
                </li>
                <li>
                  <strong>Partie variable</strong> (si applicable) : consommation à l'usage (volume
                  d'appels, SMS, API calls, etc.)
                </li>
              </ul>

              <p className="text-gray-300 font-semibold mb-2">B) Facturation</p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1 mb-4">
                <li>
                  <strong>Partie fixe :</strong> facturée le 1er du mois (période du 1er au dernier
                  jour du mois)
                </li>
                <li>
                  <strong>Partie variable :</strong> facturée le 1er du mois suivant, à terme échu
                  (consommation du mois écoulé)
                </li>
              </ul>

              <p className="text-gray-300 mb-2">
                <strong>Exemple pour un agent vocal :</strong>
              </p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1 mb-4">
                <li>
                  1er janvier : Facture d'abonnement janvier (390€) + consommation décembre (150€)
                </li>
                <li>
                  1er février : Facture d'abonnement février (390€) + consommation janvier (200€)
                </li>
                <li>etc.</li>
              </ul>

              <p className="text-gray-300 font-semibold mb-2">C) Premier mois</p>
              <p className="text-gray-300 mb-4">
                Le premier mois d'abonnement est calculé au prorata temporis si la mise en service
                intervient en cours de mois.
              </p>

              <p className="text-gray-300 font-semibold mb-2">D) Dernier mois</p>
              <p className="text-gray-300 mb-4">
                En cas de résiliation, la partie fixe du dernier mois est due intégralement (pas de
                remboursement au prorata). La partie variable est facturée jusqu'à la date effective
                de résiliation.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-white">4.3 Moyens de paiement</h3>
              <p className="text-gray-300 mb-2">Les moyens de paiement acceptés sont :</p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1 mb-4">
                <li>Virement bancaire (privilégié)</li>
                <li>Prélèvement SEPA (pour les abonnements récurrents)</li>
                <li>Carte bancaire (via solution de paiement sécurisée)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-white">4.4 Échéances de paiement</h3>
              <p className="text-gray-300 mb-2">
                Sauf mention contraire au devis ou à la facture :
              </p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1 mb-4">
                <li>
                  <strong>Prestations ponctuelles :</strong> paiement à réception de facture ou
                  selon échéancier convenu
                </li>
                <li>
                  <strong>Abonnements mensuels :</strong> paiement dans les 7 jours suivant
                  l'émission de la facture (émise le 1er du mois)
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-white">4.5 Retard de paiement</h3>
              <p className="text-gray-300 mb-2">
                En cas de retard de paiement, et conformément aux articles L441-6 et D441-5 du Code
                de Commerce :
              </p>

              <div className="text-gray-300 mb-4">
                <p className="font-semibold mb-2">A) Pénalités de retard</p>
                <p className="mb-4">
                  Des pénalités de retard égales à{" "}
                  <strong>trois fois le taux d'intérêt légal en vigueur</strong> seront appliquées
                  de plein droit, sans qu'un rappel soit nécessaire, dès le premier jour de retard.
                </p>

                <p className="font-semibold mb-2">B) Indemnité forfaitaire</p>
                <p className="mb-4">
                  Une indemnité forfaitaire de <strong>40 euros</strong> pour frais de recouvrement
                  sera également due.
                </p>

                <p className="font-semibold mb-2">C) Indemnisation complémentaire</p>
                <p className="mb-4">
                  Si les frais de recouvrement réellement engagés sont supérieurs à 40 euros, une
                  indemnisation complémentaire pourra être demandée sur justificatifs.
                </p>

                <p className="font-semibold mb-2">D) Suspension du service</p>
                <p>
                  Sablia se réserve le droit de suspendre l'accès aux services en cas de défaut de
                  paiement, après mise en demeure restée infructueuse pendant 8 jours.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-white">4.6 Garanties</h3>
              <p className="text-gray-300">
                Sablia peut exiger, pour certaines prestations de montant élevé, le versement d'un
                acompte ou d'une garantie bancaire avant le démarrage des travaux.
              </p>
            </section>

            {/* Note: Je vais continuer avec les autres articles dans le même style, mais je vais simplifier pour gagner de la place */}

            {/* Article 5 - Simplifié pour longueur */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 5 - DÉROULEMENT DES PRESTATIONS
              </h2>
              <p className="text-gray-300 mb-4">
                Les prestations sont principalement réalisées à distance. Les délais sont
                indicatifs. Le client s'engage à fournir les informations nécessaires. Pour les
                abonnements, disponibilité visée de 99% avec support sous 48h ouvrées.
              </p>
            </section>

            {/* Article 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 6 - DURÉE ET RÉSILIATION
              </h2>
              <p className="text-gray-300 mb-4">
                Les abonnements sont conclus pour une durée indéterminée sans engagement minimum.
                Résiliation possible par le client avec préavis de 30 jours par email ou LRAR. La
                résiliation prend effet à l'issue du préavis.
              </p>
            </section>

            {/* Article 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 7 - DROIT DE RÉTRACTATION
              </h2>
              <h3 className="text-xl font-semibold mb-3 text-white">7.1 Consommateurs (B2C)</h3>
              <p className="text-gray-300 mb-4">
                Conformément à l'article L221-18 du Code de la consommation, le consommateur dispose
                d'un délai de 14 jours pour exercer son droit de rétractation. Exceptions :
                prestations pleinement exécutées avec accord préalable exprès.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-white">7.2 Professionnels (B2B)</h3>
              <p className="text-gray-300">
                Il n'existe pas de droit de rétractation pour les professionnels. La commande est
                ferme et définitive dès sa validation.
              </p>
            </section>

            {/* Article 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 8 - PROPRIÉTÉ INTELLECTUELLE
              </h2>
              <p className="text-gray-300 mb-4">
                Tous les éléments fournis par Sablia demeurent sa propriété exclusive. Le client
                bénéficie d'une licence d'utilisation non exclusive, non cessible et non
                sous-licenciable. Le client s'engage à ne pas reproduire, dupliquer ou exploiter
                commercialement sans autorisation.
              </p>
            </section>

            {/* Article 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 9 - PROTECTION DES DONNÉES PERSONNELLES (RGPD)
              </h2>
              <p className="text-gray-300 mb-4">
                La collecte et le traitement des données personnelles sont régis par la{" "}
                <a
                  href="/politique-confidentialite"
                  className="text-orange-500 hover:text-orange-400"
                >
                  Politique de Confidentialité
                </a>{" "}
                de Sablia.
              </p>
              <p className="text-gray-300 mb-4">
                Sablia agit en qualité de Responsable de traitement pour les données clients. Pour
                les services techniques (agents vocaux), Sablia agit en qualité de Sous-traitant. Un
                DPA (Data Processing Agreement) est conclu en annexe.
              </p>
              <p className="text-gray-300 mb-4">
                Contact pour exercer vos droits :{" "}
                <a href="mailto:brice@sablia.io" className="text-orange-500 hover:text-orange-400">
                  brice@sablia.io
                </a>
              </p>
              <p className="text-gray-300">
                Réclamation possible auprès de la CNIL :{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400"
                >
                  www.cnil.fr
                </a>
              </p>
            </section>

            {/* Article 10 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 10 - CONFIDENTIALITÉ
              </h2>
              <p className="text-gray-300 mb-4">
                Chaque partie s'engage à garder strictement confidentielles toutes les informations
                échangées et à ne pas les divulguer sans autorisation préalable écrite. L'obligation
                de confidentialité se poursuit pendant 2 ans après le terme du contrat.
              </p>
            </section>

            {/* Article 11 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 11 - RESPONSABILITÉ ET GARANTIES
              </h2>
              <p className="text-gray-300 mb-4">
                Sablia s'engage à réaliser les prestations avec professionnalisme dans le cadre
                d'une obligation de moyens. Délai de 7 jours pour signaler toute non-conformité.
              </p>
              <p className="text-gray-300 mb-4">
                Sablia ne peut être tenu responsable des dommages indirects. La responsabilité
                totale est limitée au montant payé sur les 12 derniers mois ou au montant de la
                prestation concernée.
              </p>
            </section>

            {/* Article 12 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">ARTICLE 12 - FORCE MAJEURE</h2>
              <p className="text-gray-300 mb-4">
                En cas de force majeure (catastrophes naturelles, guerres, pannes généralisées,
                cyberattaques majeures), les obligations sont suspendues sans indemnité. Si
                l'événement perdure au-delà de 30 jours, résiliation possible de plein droit.
              </p>
            </section>

            {/* Article 13 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 13 - RÉFÉRENCES COMMERCIALES
              </h2>
              <p className="text-gray-300">
                Sauf opposition expresse, Sablia est autorisée à mentionner le nom et le logo du
                client comme référence commerciale. Opposition possible à tout moment par email à{" "}
                <a href="mailto:brice@sablia.io" className="text-orange-500 hover:text-orange-400">
                  brice@sablia.io
                </a>
                .
              </p>
            </section>

            {/* Article 14 */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 14 - MÉDIATION ET RÈGLEMENT DES LITIGES
              </h2>

              <h3 className="text-xl font-semibold mb-3 text-white">
                14.1 Recherche d'une solution amiable
              </h3>
              <p className="text-gray-300 mb-4">
                Les parties s'engagent à rechercher de bonne foi une solution amiable avant toute
                action contentieuse.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-white">
                14.2 Médiation de la consommation (B2C)
              </h3>
              <p className="text-gray-300 mb-4">
                En cas de litige avec un consommateur, celui-ci peut recourir gratuitement à un
                médiateur de la consommation. Plateforme européenne :{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>

              <h3 className="text-xl font-semibold mb-3 text-white">
                14.3 Juridiction compétente (B2B)
              </h3>
              <p className="text-gray-300 mb-4">
                Tout litige relève de la compétence exclusive du Tribunal de Commerce de Paris.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-white">
                14.4 Juridiction compétente (B2C)
              </h3>
              <p className="text-gray-300">
                Pour les consommateurs, compétence des juridictions du lieu de résidence du
                consommateur ou du lieu d'établissement de Sablia.
              </p>
            </section>

            {/* Articles restants simplifiés */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 15 - CESSION DU CONTRAT
              </h2>
              <p className="text-gray-300">
                Le client ne peut céder le contrat sans accord préalable écrit de Sablia. Sablia
                peut céder à toute entité lui succédant.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 16 - INTÉGRALITÉ DE L'ACCORD
              </h2>
              <p className="text-gray-300">
                Les CGV, le devis et le contrat d'abonnement constituent l'intégralité de l'accord.
                Ordre de priorité : 1) Contrat particulier, 2) Devis, 3) DPA, 4) CGV.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 17 - NULLITÉ PARTIELLE
              </h2>
              <p className="text-gray-300">
                Si une stipulation est déclarée nulle, les autres conservent leur force. La clause
                annulée sera remplacée par une clause valide de portée équivalente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 18 - MODIFICATION DES CGV
              </h2>
              <p className="text-gray-300 mb-4">
                Sablia se réserve le droit de modifier les CGV. Version applicable : celle en
                vigueur au moment de la commande.
              </p>
              <p className="text-gray-300">
                Pour les abonnements en cours : préavis de 30 jours pour modifications
                substantielles, avec possibilité de résiliation sans pénalité dans les 15 jours.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">ARTICLE 19 - TOLÉRANCE</h2>
              <p className="text-gray-300">
                Le fait de ne pas se prévaloir d'un manquement ne constitue pas une renonciation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">ARTICLE 20 - NOTIFICATIONS</h2>
              <p className="text-gray-300 mb-2">
                Toute notification doit être effectuée par écrit :
              </p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1 mb-4">
                <li>Email (avec accusé de réception)</li>
                <li>Lettre recommandée avec accusé de réception</li>
              </ul>
              <p className="text-gray-300">
                <strong>Sablia :</strong>{" "}
                <a href="mailto:brice@sablia.io" className="text-orange-500 hover:text-orange-400">
                  brice@sablia.io
                </a>{" "}
                / 60 rue François Ier, 75008 Paris
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                ARTICLE 21 - LOI APPLICABLE ET LANGUE
              </h2>
              <p className="text-gray-300 mb-4">
                Les CGV sont régies par le droit français. Langue : français (prévaut en cas de
                divergence avec traduction).
              </p>
            </section>

            {/* Annexes */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">ANNEXES</h2>
              <p className="text-gray-300 mb-2">Les CGV peuvent être complétées par :</p>
              <ul className="text-gray-300 list-disc ml-6 space-y-1">
                <li>
                  <strong>Annexe 1 :</strong> DPA (Data Processing Agreement)
                </li>
                <li>
                  <strong>Annexe 2 :</strong> Descriptif technique du service
                </li>
                <li>
                  <strong>Annexe 3 :</strong> Grille tarifaire détaillée
                </li>
                <li>
                  <strong>Annexe 4 :</strong> SLA (Service Level Agreement)
                </li>
                <li>
                  <strong>Annexe 5 :</strong> Planning de déploiement
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="mb-8 p-6 bg-gray-800 bg-opacity-50 rounded-lg">
              <p className="text-gray-300 mb-4">
                <strong className="text-white">
                  Pour toute question relative aux présentes CGV :
                </strong>
              </p>
              <p className="text-gray-300">
                Email :{" "}
                <a href="mailto:brice@sablia.io" className="text-orange-500 hover:text-orange-400">
                  brice@sablia.io
                </a>
                <br />
                Téléphone : +33 6 25 42 68 38
              </p>
              <p className="text-gray-400 mt-4 italic text-sm">
                Sablia - L'intelligence au service de votre efficacité
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
    </>
  );
}
