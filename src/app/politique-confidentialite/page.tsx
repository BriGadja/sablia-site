import { LegalPage, LegalSection } from '@/components/legal/LegalPage'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = pageMetadata({
  path: '/politique-confidentialite',
  title: 'Politique de confidentialité — Sablia',
  description:
    'Politique de confidentialité et gestion des données personnelles de Sablia.io. Conformité RGPD.',
})

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      folio="Confidentialité · RGPD"
      title="Politique de confidentialité"
      intro="Comment Sablia collecte, utilise et protège vos données personnelles. Conforme au Règlement général sur la protection des données (RGPD) et à la Loi Informatique et Libertés."
      updated="Dernière mise à jour : 27/10/2026."
    >
      <LegalSection title="Données collectées via le formulaire Diagnostic">
        <p>
          Lorsque vous soumettez le formulaire « Démarrer mon diagnostic » sur {site.domain}, nous
          collectons strictement les champs que vous renseignez :
        </p>
        <ul>
          <li>votre nom</li>
          <li>votre adresse email professionnelle</li>
          <li>le nom de votre entreprise</li>
          <li>la description facultative du process qui vous coûte du temps</li>
        </ul>
        <p>
          Aucune donnée n'est collectée silencieusement. Aucun cookie de pistage n'est déposé sans
          votre consentement.
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
          formulaire) et sur l'exécution des mesures précontractuelles que vous demandez (article
          6-1-b du RGPD).
        </p>
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <p>
          Les données liées à une demande de diagnostic sont conservées 3 ans à compter du dernier
          contact utile, sauf obligation légale supérieure (comptabilité : 10 ans pour les
          factures). Les demandes non converties sont anonymisées au-delà de 18 mois.
        </p>
      </LegalSection>

      <LegalSection title="Newsletter">
        <p>
          Finalité : vous envoyer « L&apos;IA au travail », la lettre du mardi de Brice Gachadoat
          (la vidéo de la semaine poussée plus loin).
        </p>
        <p>
          Base légale : votre consentement, donné en cochant la case prévue sur un formulaire du
          site, en cliquant le lien de confirmation reçu après une inscription sur la page
          Newsletter, ou en cliquant le bouton d&apos;un mail d&apos;invitation.
        </p>
        <p>
          Données : votre prénom, votre adresse email et les dates de votre inscription et de votre
          désinscription. Aucun suivi d&apos;ouverture ni de clic n&apos;est fait sur la lettre.
          Pour limiter les abus, une empreinte de l&apos;adresse IP accompagne une demande
          d&apos;inscription tant qu&apos;elle n&apos;est pas confirmée.
        </p>
        <p>
          Durée : jusqu&apos;à votre désinscription. Une demande d&apos;inscription non confirmée
          est effacée sous 7 jours.
        </p>
        <p>
          Désinscription : un lien dans chaque lettre. Vos autres droits s&apos;exercent en écrivant
          à <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Hébergement et sous-traitants">
        <p>Les données transitent et sont stockées via les prestataires suivants :</p>
        <ul>
          <li>
            <strong>Hostinger</strong> — hébergement du site et de la mesure d'audience, sur un
            serveur dédié à Sablia en France ; les sauvegardes chiffrées sont déposées sur Google
            Drive
          </li>
          <li>
            <strong>Resend</strong> — envoi des emails de confirmation, des notifications internes
            et de la lettre du mardi (newsletter) ; Resend héberge ses données aux États-Unis, sous
            clauses contractuelles types
          </li>
          <li>
            <strong>YouTube</strong> — lecture des vidéos, chargée uniquement après un clic sur la
            vidéo
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

      <LegalSection title="Mesure d'audience et enregistrement des écrans">
        <p>
          {site.domain} mesure sa fréquentation avec un outil hébergé sur notre propre serveur
          (Umami), sans cookie, sans identifiant persistant et sans vous suivre d'un site à l'autre.
          Sont comptés : les pages vues, les clics sur les liens et les boutons, la profondeur de
          défilement, les liens sortants. Ces statistiques sont conservées 25 mois au plus.
        </p>
        <p>
          Si vous cliquez sur « Tout accepter » dans le bandeau, nous enregistrons en plus, sans
          vous identifier directement, vos déplacements et vos clics sur nos pages (replay et cartes
          de chaleur) pour repérer ce qui est difficile à utiliser. Les champs de saisie sont
          masqués et les formulaires ne sont jamais enregistrés. Ces enregistrements sont conservés
          180 jours puis supprimés. Sans votre accord, ou si vous cliquez sur « Tout refuser » ou ne
          répondez pas, rien n'est enregistré.
        </p>
        <p>
          Votre choix est mémorisé dans votre navigateur (clé <code>sablia_consent</code>) pour 6
          mois, puis le bandeau vous le redemande. Vous pouvez le modifier à tout moment avec le
          lien « Gérer mes choix » en bas de chaque page ; retirer votre accord recharge la page.
        </p>
        <p>
          Les vidéos YouTube ne chargent rien chez YouTube tant que vous n'avez pas cliqué dessus.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          {site.domain} ne dépose aucun cookie à des fins de mesure d'audience ou de publicité.
          Seuls les cookies strictement nécessaires au fonctionnement du site (session Calendly,
          lorsque vous ouvrez la réservation) peuvent être déposés.
        </p>
      </LegalSection>
    </LegalPage>
  )
}
