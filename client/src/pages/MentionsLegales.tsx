import { motion } from 'framer-motion'
import { useEffect } from 'react'
import LegalShell, { LegalSection } from '@/components/landing/LegalShell'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'
import { site } from '@/lib/site'

export default function MentionsLegales() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SEO page="/mentions-legales" />
      <motion.div
        className="min-h-screen bg-[color:var(--color-sable)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LegalShell
          folio="Mentions · légales"
          title={
            <>
              Mentions <em>légales</em>
            </>
          }
          intro="Informations exigées par l'article 6-III de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN)."
        >
          <LegalSection title="Éditeur du site">
            <p>Le site {site.domain} est édité par :</p>
            <ul>
              <li>GACHADOAT Brice</li>
              <li>
                Entrepreneur individuel, régime de la franchise en base de TVA (art. 293 B du CGI)
              </li>
              <li>SIREN : 940 901 127</li>
              <li>SIRET : 94090112700016</li>
              <li>Adresse du siège : 60 rue François Ier, 75008 Paris, France</li>
              <li>Date d'immatriculation : 24/02/2025</li>
              <li>Code APE : 6201Z — Programmation informatique</li>
              <li>
                Activité : conseil, diagnostic, formation, accompagnement et développement
                d'automatisations et d'agents IA
              </li>
              <li>Nom commercial : Sablia</li>
            </ul>
          </LegalSection>

          <LegalSection title="Responsable de la publication">
            <p>
              Brice Gachadoat, joignable par email à l'adresse{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </LegalSection>

          <LegalSection title="Hébergeur du site">
            <ul>
              <li>Vercel Inc.</li>
              <li>340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
              <li>privacy@vercel.com</li>
              <li>+1 (559) 288-7060</li>
            </ul>
          </LegalSection>

          <LegalSection title="Propriété intellectuelle">
            <p>
              L'ensemble du contenu présent sur {site.domain} — textes, illustrations SVG, logo,
              composition typographique — est la propriété exclusive de GACHADOAT Brice ou de ses
              partenaires. Toute reproduction, représentation ou exploitation sans autorisation
              écrite préalable est strictement interdite.
            </p>
          </LegalSection>

          <LegalSection title="Liens et marques tierces">
            <p>
              Le site renvoie ponctuellement vers des partenaires (notamment IAPreneurs, via lien
              affilié) ou des outils tiers (Stripe, Calendly, Google Workspace, Supabase, Dipler,
              n8n). Les marques citées restent la propriété de leurs titulaires respectifs.
            </p>
          </LegalSection>

          <LegalSection title="Contact">
            <p>
              Pour toute demande relative au contenu, à la propriété intellectuelle ou à une
              rectification des présentes mentions, écrivez à{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          </LegalSection>

          <p className="legal-updated">Dernière mise à jour : 20/04/2026.</p>
        </LegalShell>
        <ScrollToTop />
      </motion.div>
    </>
  )
}
