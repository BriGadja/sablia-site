import { motion } from 'framer-motion'
import { useEffect } from 'react'
import LegalShell, { LegalSection } from '@/components/landing/LegalShell'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'
import { site } from '@/lib/site'

export default function PolitiqueConfidentialite() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SEO page="/politique-confidentialite" />
      <motion.div
        className="min-h-screen bg-[color:var(--color-sable)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LegalShell
          folio="Confidentialité · RGPD"
          title={
            <>
              Politique de <em>confidentialité</em>
            </>
          }
          intro="Comment Sablia collecte, utilise et protège vos données personnelles. Conforme au Règlement général sur la protection des données (RGPD) et à la Loi Informatique et Libertés."
        >
          <LegalSection title="Données collectées via le formulaire Diagnostic">
            <p>
              Lorsque vous soumettez le formulaire « Démarrer mon diagnostic » sur {site.domain},
              nous collectons strictement les champs que vous renseignez :
            </p>
            <ul>
              <li>votre nom</li>
              <li>votre adresse email professionnelle</li>
              <li>le nom de votre entreprise</li>
              <li>la description facultative du process qui vous coûte du temps</li>
            </ul>
            <p>
              Aucune donnée n'est collectée silencieusement. Aucun cookie de pistage n'est déposé
              sans votre consentement.
            </p>
          </LegalSection>

          <LegalSection title="Finalités">
            <p>Ces données sont utilisées uniquement pour :</p>
            <ul>
              <li>vous recontacter afin d'organiser l'intake du diagnostic</li>
              <li>préparer le livrable PDF du diagnostic</li>
              <li>émettre la facture correspondante</li>
            </ul>
            <p>Elles ne sont jamais revendues, louées, ni transmises à un tiers marketing.</p>
          </LegalSection>

          <LegalSection title="Base légale">
            <p>
              Le traitement repose sur votre consentement explicite (case à cocher RGPD au bas du
              formulaire) et sur l'exécution des mesures précontractuelles que vous demandez
              (article 6-1-b du RGPD).
            </p>
          </LegalSection>

          <LegalSection title="Durée de conservation">
            <p>
              Les données liées à une demande de diagnostic sont conservées 3 ans à compter du
              dernier contact utile, sauf obligation légale supérieure (comptabilité : 10 ans pour
              les factures). Les demandes non converties sont anonymisées au-delà de 18 mois.
            </p>
          </LegalSection>

          <LegalSection title="Hébergement et sous-traitants">
            <p>Les données transitent et sont stockées via les prestataires suivants :</p>
            <ul>
              <li>
                <strong>Vercel Inc.</strong> — hébergement du site (États-Unis, DPA signé, cadre
                Data Privacy Framework)
              </li>
              <li>
                <strong>n8n (self-hosted)</strong> — orchestration des formulaires (serveur France,
                propriété Sablia)
              </li>
              <li>
                <strong>Supabase</strong> — base de données (région Europe, DPA signé)
              </li>
              <li>
                <strong>Stripe</strong> — traitement des paiements (Irlande / États-Unis, conforme
                PCI-DSS)
              </li>
              <li>
                <strong>Google (Analytics 4, Ads)</strong> — mesure d'audience anonymisée (activé
                uniquement après consentement bandeau)
              </li>
              <li>
                <strong>Calendly</strong> — prise de rendez-vous (États-Unis, DPA signé)
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="Vos droits">
            <p>Conformément au RGPD, vous disposez à tout moment des droits suivants :</p>
            <ul>
              <li>droit d'accès, de rectification, d'effacement de vos données</li>
              <li>droit à la limitation et à la portabilité</li>
              <li>droit d'opposition au traitement</li>
              <li>droit de retirer votre consentement à tout moment</li>
            </ul>
            <p>
              Pour exercer l'un de ces droits, il suffit d'écrire à{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a>. Réponse sous 30 jours maximum.
            </p>
            <p>
              Vous avez également le droit d'introduire une réclamation auprès de la CNIL (
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
                cnil.fr
              </a>
              ).
            </p>
          </LegalSection>

          <LegalSection title="Cookies">
            <p>
              {site.domain} n'utilise aucun cookie avant consentement. Les mesures d'audience
              (Google Analytics 4, Google Ads) ne sont chargées qu'après acceptation explicite via
              le bandeau. Aucun cookie publicitaire de tiers n'est déposé.
            </p>
          </LegalSection>

          <p className="legal-updated">Dernière mise à jour : 20/04/2026.</p>
        </LegalShell>
        <ScrollToTop />
      </motion.div>
    </>
  )
}
