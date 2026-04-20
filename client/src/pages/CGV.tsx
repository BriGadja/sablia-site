import { motion } from 'framer-motion'
import { useEffect } from 'react'
import LegalShell, { LegalSection } from '@/components/landing/LegalShell'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'
import { site } from '@/lib/site'

export default function CGV() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SEO page="/cgv" />
      <motion.div
        className="min-h-screen bg-[color:var(--color-sable)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LegalShell
          folio="CGV · Prestations"
          title={
            <>
              Conditions générales <em>de vente</em>
            </>
          }
          intro="Conditions applicables à toute prestation Sablia — Diagnostic Sablia et paths post-audit (Formation d'équipes internes, Accompagnement, Développement)."
        >
          <LegalSection title="1. Parties">
            <p>
              Les présentes conditions régissent les prestations entre d'une part GACHADOAT Brice,
              entrepreneur individuel (SIREN 940 901 127), exerçant sous le nom commercial Sablia,
              et d'autre part le client signataire du bon de commande ou acceptant le paiement en
              ligne du Diagnostic Sablia.
            </p>
          </LegalSection>

          <LegalSection title="2. Objet">
            <p>Les prestations Sablia couvrent quatre types de missions :</p>
            <ul>
              <li>
                <strong>Diagnostic Sablia</strong> — audit de 5 jours ouvrés débouchant sur un
                livrable PDF de 10 à 15 pages et une restitution d'une heure. Prix : 490€ HT.
              </li>
              <li>
                <strong>Formation d'équipes internes</strong> — montée en compétence ciblée sur 1 à
                3 jours. Prix : à partir de 1 500€ HT, chiffré au cas par cas.
              </li>
              <li>
                <strong>Accompagnement</strong> — coaching d'un sponsor interne sur 4 à 12 semaines.
                Prix mensuel chiffré en restitution de diagnostic.
              </li>
              <li>
                <strong>Développement</strong> — construction clé en main d'automatisations,
                workflows, agents vocaux ou applications web. Chiffrage par périmètre après
                diagnostic.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Prix et TVA">
            <p>
              Tous les prix sont exprimés en euros hors taxes. En application de l'article 293 B du
              CGI, la TVA n'est pas applicable (régime de la franchise en base). Aucun coût caché
              n'est appliqué en cours de mission.
            </p>
          </LegalSection>

          <LegalSection title="4. Paiement">
            <p>
              Le Diagnostic Sablia est payable d'avance, par carte bancaire via Stripe ou par
              virement. Les autres prestations (Formation, Accompagnement, Développement) font
              l'objet d'un bon de commande spécifique fixant échéance et modalités de règlement.
            </p>
            <p>
              En cas de retard de paiement, les pénalités de retard sont calculées au taux d'intérêt
              appliqué par la Banque centrale européenne à son opération de refinancement la plus
              récente, majoré de 10 points, conformément au Code de commerce.
            </p>
          </LegalSection>

          <LegalSection title="5. Crédit post-audit">
            <p>
              Les 490€ HT du Diagnostic Sablia sont intégralement déduits de la première facture si
              le client signe un contrat <strong>Développement</strong> ou{' '}
              <strong>Accompagnement</strong> dans les 90 jours calendaires suivant la restitution.
              Ce crédit n'est pas applicable au path <strong>Formation d'équipes internes</strong>,
              qui est facturé au plein tarif de sa fourchette.
            </p>
          </LegalSection>

          <LegalSection title="6. Annulation et remboursement">
            <p>
              Le client peut annuler sa commande de Diagnostic Sablia jusqu'à 72 heures avant le
              début de l'intake. Dans ce délai, le remboursement est intégral, sans justification.
              Passé ce délai ou une fois l'intake entamé, le diagnostic est non-remboursable, le
              travail d'analyse ayant déjà commencé.
            </p>
          </LegalSection>

          <LegalSection title="7. Délais">
            <p>
              Sablia s'engage à livrer le PDF du Diagnostic dans un délai de 5 jours ouvrés à
              compter de la fin de l'intake synchrone. Tout dépassement est notifié au client dans
              les 24 heures avec cause et nouveau créneau de livraison.
            </p>
          </LegalSection>

          <LegalSection title="8. Propriété des livrables">
            <p>
              Les livrables produits dans le cadre d'une mission (PDF de diagnostic, code source,
              workflows n8n, agents vocaux, documentation) sont cédés au client dès règlement
              complet. Sablia conserve le droit de mentionner la mission en référence commerciale,
              sauf opposition écrite du client.
            </p>
          </LegalSection>

          <LegalSection title="9. Confidentialité">
            <p>
              Toute information transmise par le client dans le cadre d'une mission Sablia est
              traitée confidentiellement. Un NDA peut être signé sur demande avant l'intake.
            </p>
          </LegalSection>

          <LegalSection title="10. Responsabilité">
            <p>
              Sablia est tenu à une obligation de moyens. La responsabilité de Sablia est limitée au
              montant TTC de la prestation concernée. Sont exclus les dommages indirects, notamment
              la perte de chiffre d'affaires, de clientèle ou de données liée à un dysfonctionnement
              des outils tiers (n8n, Dipler, Supabase, etc.).
            </p>
          </LegalSection>

          <LegalSection title="11. Droit applicable et juridiction">
            <p>
              Les présentes CGV sont régies par le droit français. Tout différend relève, à défaut
              d'accord amiable, des tribunaux compétents du ressort du siège de l'éditeur.
            </p>
          </LegalSection>

          <LegalSection title="12. Contact">
            <p>
              Toute question relative aux présentes conditions peut être adressée à{' '}
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
