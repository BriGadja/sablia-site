import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navigation from "@/components/landing/Navigation";
import ScrollToTop from "@/components/ScrollToTop";
import AnimatedParticles from "@/components/animations/AnimatedParticles";
import CustomCursor from "@/components/animations/CustomCursor";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";

export default function PolitiqueConfidentialite() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO page="/politique-confidentialite" />
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
            <h1 className="text-4xl font-bold text-center">Politique de confidentialité</h1>
            <p className="text-gray-400 mt-2">Dernière mise à jour : 28 octobre 2025</p>
          </div>

          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <p className="text-gray-300 mb-8">
              La présente politique explique comment{" "}
              <strong>Sablia – Entreprise Individuelle (micro‑entrepreneur)</strong> (« nous »)
              collecte, utilise et partage les données personnelles des visiteurs et utilisateurs du
              site <strong>sablia.io</strong> (le « Site »), ainsi que les droits dont disposent les
              personnes concernées.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                1) Responsable de traitement
              </h2>
              <ul className="text-gray-300 space-y-2">
                <li>
                  <strong>Responsable</strong> : GACHADOAT Brice – Entrepreneur individuel (SIREN :
                  940 901 127)
                </li>
                <li>
                  <strong>Nom commercial</strong> : Sablia
                </li>
                <li>
                  <strong>Adresse</strong> : 60 rue François Ier, 75008 Paris, France
                </li>
                <li>
                  <strong>E‑mail de contact</strong> :{" "}
                  <a
                    href="mailto:brice@sablia.io"
                    className="text-orange-500 hover:text-orange-400"
                  >
                    brice@sablia.io
                  </a>
                </li>
                <li>
                  <strong>Téléphone</strong> : +33 6 25 42 68 38
                </li>
                <li>
                  <strong>Délégué à la protection des données (si applicable)</strong> : non désigné
                  à ce jour
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                2) Données que nous collectons
              </h2>
              <p className="text-gray-300 mb-4">
                Nous collectons uniquement les données pertinentes pour nos finalités :
              </p>

              <h3 className="text-xl font-semibold mb-3 text-white">
                2.1. Données fournies via les formulaires
              </h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>
                  <strong>Formulaire de contact / demande de devis</strong> : identité (nom,
                  prénom), coordonnées (e‑mail, téléphone), société, message, pièces jointes.
                </li>
                <li>
                  <strong>Prise de rendez‑vous / call</strong> : identité, coordonnées, créneaux,
                  notes.
                </li>
                <li>
                  <strong>Newsletter (opt‑in)</strong> : e‑mail.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-white">
                2.2. Données collectées automatiquement
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  <strong>Données techniques et de navigation</strong> : URL visitée, date/heure,
                  pages consultées, temps passé, identifiants de cookies/traceurs strictement
                  nécessaires, adresse IP tronquée/anonymisée selon paramétrage, informations sur le
                  navigateur et l'appareil.
                </li>
                <li>
                  <strong>Mesure d'audience</strong> : <em>non déployée à ce jour</em>. Si un outil
                  d'analytics est mis en place ultérieurement (par ex. GA4 / Plausible / Matomo),
                  nous mettrons à jour la présente politique et, si nécessaire, recueillerons votre
                  consentement préalable.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                3) Finalités et bases légales
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-300 border border-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left border-b border-gray-700">Finalité</th>
                      <th className="px-4 py-3 text-left border-b border-gray-700">Base légale</th>
                      <th className="px-4 py-3 text-left border-b border-gray-700">Détails</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-3">Répondre aux demandes (contact, devis, RDV)</td>
                      <td className="px-4 py-3">
                        Exécution de mesures précontractuelles / contrat
                      </td>
                      <td className="px-4 py-3">Traitement et suivi des demandes entrantes.</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-3">
                        Gestion de la relation commerciale et facturation
                      </td>
                      <td className="px-4 py-3">Contrat / Obligation légale</td>
                      <td className="px-4 py-3">
                        Création de comptes clients, exécution des prestations, facturation,
                        comptabilité.
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-3">Prospection B2B (professionnels)</td>
                      <td className="px-4 py-3">Intérêt légitime</td>
                      <td className="px-4 py-3">
                        Envoi d'informations sur nos offres à des contacts professionnels
                        pertinents, avec possibilité d'opposition à tout moment.
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-3">Newsletter</td>
                      <td className="px-4 py-3">
                        <strong>Consentement</strong>
                      </td>
                      <td className="px-4 py-3">
                        Envoi d'e‑mails marketing aux personnes inscrites.
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-3">Mesure d'audience du Site</td>
                      <td className="px-4 py-3">
                        Intérêt légitime <strong>ou</strong> Consentement
                      </td>
                      <td className="px-4 py-3">
                        Selon l'outil et sa configuration (exemption possible si strictement
                        nécessaire et respect des lignes CNIL).
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-3">Sécurité du Site et prévention de la fraude</td>
                      <td className="px-4 py-3">Intérêt légitime</td>
                      <td className="px-4 py-3">Logs, détection d'anomalies et d'abus.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Démonstrations / agents IA</td>
                      <td className="px-4 py-3">Contrat / Consentement</td>
                      <td className="px-4 py-3">
                        Fourniture de la démo demandée ; paramétrages convenus et information
                        préalable.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">4) Durées de conservation</h2>
              <ul className="text-gray-300 space-y-2">
                <li>
                  <strong>Prospects</strong> : 3 ans à compter du dernier contact.
                </li>
                <li>
                  <strong>Clients et contrats</strong> : durée de la relation contractuelle, puis
                  archivage légal (jusqu'à 10 ans pour les documents comptables).
                </li>
                <li>
                  <strong>Mesure d'audience / cookies</strong> : selon la durée de vie du
                  cookie/traceur (voir annexe Cookies).
                </li>
                <li>
                  <strong>Enregistrements / transcriptions de démos (agents voix)</strong> :{" "}
                  <strong>90 jours</strong> par défaut, puis suppression ou anonymisation.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                5) Destinataires et sous‑traitants
              </h2>
              <p className="text-gray-300 mb-4">
                Accès interne limité aux personnes habilitées (commercial, opérations, support,
                facturation). Nous recourons à des <strong>sous‑traitants</strong> pour
                l'hébergement, la messagerie, le stockage, la téléphonie/voix et certaines
                automatisations.
              </p>
              <p className="text-gray-300 mb-3">
                <strong>Sous‑traitants actuellement utilisés :</strong>
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>
                  <strong>Hébergement & diffusion</strong> : <strong>Vercel</strong> (hébergement de
                  l'application/site et CDN).
                </li>
                <li>
                  <strong>Base de données/Backend</strong> : <strong>Supabase</strong> (UE –{" "}
                  <strong>Irlande</strong>, AWS eu‑west‑1).
                </li>
                <li>
                  <strong>Automatisations</strong> : <strong>n8n</strong> (exécuté sur notre
                  infrastructure ; connecte nos services).
                </li>
                <li>
                  <strong>Voix/SMS</strong> : <strong>Twilio</strong>.
                </li>
                <li>
                  <strong>Stockage documentaire</strong> : <strong>Google Drive</strong>.
                </li>
              </ul>
              <p className="text-gray-300 mt-4">
                Un <strong>contrat de sous‑traitance (DPA)</strong> et des{" "}
                <strong>mesures de sécurité</strong> appropriées encadrent ces traitements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                6) Transferts hors Union européenne
              </h2>
              <p className="text-gray-300 mb-4">
                Certains prestataires sont établis en dehors de l'UE/EEE ou opèrent depuis des zones
                tierces (par ex. <strong>Twilio</strong> et <strong>Vercel</strong> – société
                américaine – ainsi que certains services de <strong>Google</strong>). Des{" "}
                <strong>transferts</strong> peuvent donc avoir lieu.
              </p>
              <p className="text-gray-300 mb-4">
                Lorsque cela se produit, nous nous assurons d'un <strong>mécanisme légal</strong>{" "}
                valide (par ex. <strong>décision d'adéquation</strong> ou{" "}
                <strong>Clauses Contractuelles Types</strong> de la Commission européenne), complété
                le cas échéant par des mesures additionnelles. Les détails (destinataires, pays,
                mécanisme) sont disponibles sur demande.
              </p>
              <p className="text-gray-300 mb-3">
                <strong>Notes spécifiques :</strong>
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>
                  <strong>Twilio (voix/SMS)</strong> : traitements susceptibles d'impliquer des
                  transferts vers les États‑Unis ; mécanisme de transfert : CCT/équivalent.
                </li>
                <li>
                  <strong>Vercel (hébergement/CDN)</strong> : société US ; utilisation potentielle
                  d'infrastructures globales ; mécanisme de transfert : CCT/équivalent.
                </li>
                <li>
                  <strong>Google Drive (stockage)</strong> : infrastructures globales ; mécanisme de
                  transfert : décision d'adéquation et/ou CCT selon service/configuration.
                </li>
                <li>
                  <strong>Supabase</strong> : projet hébergé en{" "}
                  <strong>UE – Irlande (AWS eu‑west‑1)</strong> ; pas de transfert hors UE pour le
                  stockage principal. En cas d'usage de services complémentaires impliquant un
                  transfert, nous appliquerons les <strong>CCT</strong> si nécessaire.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">7) Cookies et traceurs</h2>
              <p className="text-gray-300 mb-4">
                À ce jour, nous n'utilisons <strong>aucun outil d'analytics</strong> ni traceur non
                essentiel. Seuls des <strong>cookies/traceurs strictement nécessaires</strong> au
                fonctionnement, à la sécurité et à la répartition de charge (hébergement/CDN)
                peuvent être déposés.
              </p>
              <p className="text-gray-300">
                Si, à l'avenir, des traqueurs non essentiels (mesure d'audience, marketing) sont
                déployés, nous <strong>recueillerons votre consentement</strong> via un bandeau
                conforme et offrirons un module « <strong>Préférences cookies</strong> » permettant
                l'acceptation, le refus et le retrait du consentement à tout moment.
              </p>
              <p className="text-gray-300 mt-4">
                Voir <strong>Annexe A – Registre des cookies</strong> pour l'état actuel.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">8) Sécurité</h2>
              <p className="text-gray-300">
                Nous mettons en œuvre des mesures techniques et organisationnelles adaptées
                (chiffrement en transit, contrôle des accès, journalisation, sauvegardes, principe
                du moindre privilège). En cas d'<strong>incident de sécurité</strong> susceptible
                d'engendrer un risque pour les droits et libertés, nous suivons la procédure de{" "}
                <strong>notification</strong> aux autorités et aux personnes concernées lorsque
                requis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">9) Vos droits</h2>
              <p className="text-gray-300 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>
                  <strong>Accès</strong> à vos données et obtention d'une copie ;
                </li>
                <li>
                  <strong>Rectification</strong> des données inexactes ;
                </li>
                <li>
                  <strong>Effacement</strong> (droit à l'oubli) dans les conditions applicables ;
                </li>
                <li>
                  <strong>Limitation</strong> du traitement ;
                </li>
                <li>
                  <strong>Opposition</strong> au traitement fondé sur l'intérêt légitime et à la
                  prospection ;
                </li>
                <li>
                  <strong>Portabilité</strong> des données fournies lorsque le traitement est fondé
                  sur le consentement ou le contrat et effectué à l'aide de procédés automatisés ;
                </li>
                <li>
                  <strong>Retrait du consentement</strong> à tout moment pour les traitements fondés
                  sur celui‑ci.
                </li>
              </ul>
              <p className="text-gray-300 mt-4">
                Vous pouvez exercer ces droits en nous écrivant à{" "}
                <a href="mailto:brice@sablia.io" className="text-orange-500 hover:text-orange-400">
                  brice@sablia.io
                </a>{" "}
                (ou via le formulaire dédié). En cas de doute sérieux, une preuve d'identité pourra
                être demandée.
              </p>
              <p className="text-gray-300 mt-4">
                Vous disposez également du droit d'introduire une <strong>réclamation</strong>{" "}
                auprès de l'<strong>autorité de contrôle</strong> compétente, notamment la{" "}
                <strong>CNIL</strong> (
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400"
                >
                  cnil.fr
                </a>
                ).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                10) Prise de décision automatisée
              </h2>
              <p className="text-gray-300">
                Nous ne réalisons pas de profilage ni de décisions produisant des effets juridiques
                fondées uniquement sur un traitement automatisé, sauf information contraire
                explicite et consentement lorsque requis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">11) Liens externes</h2>
              <p className="text-gray-300">
                Le Site peut contenir des liens vers des sites tiers. Nous n'exerçons aucun contrôle
                sur leurs pratiques de confidentialité ; veuillez consulter leurs politiques.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">12) Mises à jour</h2>
              <p className="text-gray-300">
                Nous pouvons modifier la présente politique pour tenir compte des évolutions
                légales, techniques ou opérationnelles. La version en vigueur est disponible sur
                cette page, avec sa date de mise à jour.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Annexe A – Registre des cookies (état actuel)
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-300 border border-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left border-b border-gray-700">Catégorie</th>
                      <th className="px-4 py-3 text-left border-b border-gray-700">
                        Nom du cookie
                      </th>
                      <th className="px-4 py-3 text-left border-b border-gray-700">Fournisseur</th>
                      <th className="px-4 py-3 text-left border-b border-gray-700">Finalité</th>
                      <th className="px-4 py-3 text-left border-b border-gray-700">Durée</th>
                      <th className="px-4 py-3 text-left border-b border-gray-700">Base légale</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-3">Nécessaire</td>
                      <td className="px-4 py-3">[ex. cookie de routage/CDN]</td>
                      <td className="px-4 py-3">Vercel</td>
                      <td className="px-4 py-3">Distribution, équilibrage de charge, sécurité</td>
                      <td className="px-4 py-3">session</td>
                      <td className="px-4 py-3">Intérêt légitime</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Nécessaire</td>
                      <td className="px-4 py-3">[ex. session applicative]</td>
                      <td className="px-4 py-3">sablia.io</td>
                      <td className="px-4 py-3">Maintien de la session/CSRF</td>
                      <td className="px-4 py-3">session</td>
                      <td className="px-4 py-3">Intérêt légitime</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-300 mt-4">
                <strong>Gestion des préférences</strong> : pas de bandeau à ce jour (aucun traqueur
                non essentiel). Il sera activé si/when des cookies non essentiels sont déployés.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Annexe B – Sous‑traitants (actuels)
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-300 border border-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left border-b border-gray-700">Fournisseur</th>
                      <th className="px-4 py-3 text-left border-b border-gray-700">Service</th>
                      <th className="px-4 py-3 text-left border-b border-gray-700">
                        Localisation des données
                      </th>
                      <th className="px-4 py-3 text-left border-b border-gray-700">
                        Garanties de transfert
                      </th>
                      <th className="px-4 py-3 text-left border-b border-gray-700">DPA signé</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-3">
                        <strong>Vercel</strong>
                      </td>
                      <td className="px-4 py-3">Hébergement/CDN</td>
                      <td className="px-4 py-3">Global (incl. hors UE)</td>
                      <td className="px-4 py-3">CCT/équivalents</td>
                      <td className="px-4 py-3">Oui</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-3">
                        <strong>Supabase</strong>
                      </td>
                      <td className="px-4 py-3">Base de données/Backend</td>
                      <td className="px-4 py-3">
                        <strong>UE – Irlande (AWS eu‑west‑1)</strong>
                      </td>
                      <td className="px-4 py-3">
                        <strong>N/A (données hébergées dans l'UE)</strong>
                      </td>
                      <td className="px-4 py-3">À confirmer</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-3">
                        <strong>Twilio</strong>
                      </td>
                      <td className="px-4 py-3">Voix/SMS</td>
                      <td className="px-4 py-3">Global (incl. US)</td>
                      <td className="px-4 py-3">CCT/équivalents</td>
                      <td className="px-4 py-3">Oui</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="px-4 py-3">
                        <strong>Google Drive</strong>
                      </td>
                      <td className="px-4 py-3">Stockage documentaire</td>
                      <td className="px-4 py-3">Global (centres de données Google)</td>
                      <td className="px-4 py-3">Décision d'adéquation et/ou CCT</td>
                      <td className="px-4 py-3">Oui</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">
                        <strong>n8n (self‑host)</strong>
                      </td>
                      <td className="px-4 py-3">Orchestration d'automatisations</td>
                      <td className="px-4 py-3">Selon l'hébergeur utilisé</td>
                      <td className="px-4 py-3">S/O (outil opéré par nos soins)</td>
                      <td className="px-4 py-3">S/O</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-white">Annexe C – Coordonnées</h2>
              <ul className="text-gray-300 space-y-2">
                <li>
                  <strong>Contact confidentialité</strong> :{" "}
                  <a
                    href="mailto:brice@sablia.io"
                    className="text-orange-500 hover:text-orange-400"
                  >
                    brice@sablia.io
                  </a>
                </li>
                <li>
                  <strong>Contact DPO (si nommé)</strong> : non désigné
                </li>
                <li>
                  <strong>Autorité de contrôle</strong> : CNIL –{" "}
                  <a
                    href="https://www.cnil.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-400"
                  >
                    www.cnil.fr
                  </a>
                </li>
              </ul>
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
