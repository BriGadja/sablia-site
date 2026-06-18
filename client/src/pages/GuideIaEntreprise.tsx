import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowRight } from '@/components/icons/lucide-crm'
import { openBooking } from '@/components/landing/BookingModal'
import LegalShell, { LegalSection } from '@/components/landing/LegalShell'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'

const FAQ = [
  {
    q: "Par où commencer pour intégrer l'IA dans une PME ?",
    a: "Par un audit, pas par un outil. On cartographie d'abord les tâches répétitives qui pèsent sur vos équipes, puis on automatise les deux ou trois qui ont le meilleur retour. Acheter un logiciel avant d'avoir identifié le problème est la première cause d'échec.",
  },
  {
    q: "Faut-il changer de CRM ou de logiciels pour utiliser l'IA ?",
    a: "Non. L'IA se branche sur votre outil existant — Salesforce, HubSpot, Pipedrive, Zoho. Vous conservez votre stack et vos habitudes ; c'est la couche d'automatisation qui s'ajoute par-dessus.",
  },
  {
    q: 'Combien de temps avant un premier résultat ?',
    a: "Un premier workflow utile est livrable en production sous 30 jours. L'erreur est de viser une transformation globale d'un coup : on déploie un cas d'usage, on le mesure, puis on étend.",
  },
  {
    q: 'Quel budget prévoir pour un premier projet IA ?',
    a: "Une automatisation simple démarre entre 1 000 et 2 000 €. Le coût dépend du nombre d'intégrations et de la complexité des règles métier, pas d'un abonnement par siège. Le chiffrage se fait après un audit, jamais avant.",
  },
  {
    q: "Mes données sont-elles en sécurité avec l'IA ?",
    a: "Oui, à condition d'utiliser l'API commerciale du fournisseur. Chez Sablia, Claude est déployé via l'API d'Anthropic : par engagement contractuel, aucune de vos données n'entraîne le modèle. Conforme RGPD, un DPA peut être signé.",
  },
]

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: "Comment intégrer l'IA dans votre entreprise : le guide PME 2026",
  description:
    "Méthode concrète pour intégrer l'intelligence artificielle dans une PME : par où commencer, les cas d'usage les plus rentables, budget, délais, sécurité RGPD et erreurs à éviter.",
  inLanguage: 'fr-FR',
  datePublished: '2026-06-18',
  dateModified: '2026-06-18',
  author: { '@type': 'Organization', name: 'Sablia', url: 'https://sablia.io' },
  publisher: { '@type': 'Organization', name: 'Sablia', '@id': 'https://sablia.io/#organization' },
  mainEntityOfPage: 'https://sablia.io/guides/integrer-l-ia-dans-votre-entreprise',
  about: ["Intégration de l'IA en entreprise", 'Automatisation des PME', 'Claude AI', 'CRM'],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

function CtaAudit() {
  return (
    <button
      type="button"
      onClick={openBooking}
      className="t-button inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-on-primary transition-shadow duration-base hover:shadow-glow-coral"
    >
      Réserver un call audit — 30&nbsp;min <ArrowRight size={16} />
    </button>
  )
}

export default function GuideIaEntreprise() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SEO page="/guides/integrer-l-ia-dans-votre-entreprise" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LegalShell
          folio="Guide · Intégration IA"
          title={
            <>
              Comment intégrer l'IA <em>dans votre entreprise</em>
            </>
          }
          intro="Intégrer l'intelligence artificielle dans une PME, ce n'est pas empiler un outil de plus. C'est repérer les tâches qui freinent vos équipes, puis automatiser les bonnes — sans casser ce qui fonctionne déjà. Voici la méthode que nous appliquons chez Sablia."
        >
          <LegalSection title="En bref">
            <ul>
              <li>Commencez par un audit des tâches, pas par l'achat d'un outil.</li>
              <li>
                Ciblez d'abord les cas d'usage à fort retour : reporting commercial, relances
                automatisées, analyse des appels.
              </li>
              <li>Gardez votre CRM et vos logiciels : l'IA se branche par-dessus.</li>
              <li>Visez un premier workflow en production sous 30 jours, puis étendez.</li>
              <li>Utilisez l'API commerciale du fournisseur pour rester conforme au RGPD.</li>
            </ul>
          </LegalSection>

          <LegalSection title="1. Commencez par un audit, pas par un outil">
            <p>
              La majorité des projets IA échouent parce qu'ils démarrent par la question « quel
              outil acheter ? » au lieu de « quel problème résoudre ? ». L'intelligence artificielle
              n'a de valeur que branchée sur une tâche précise, mesurable et répétée.
            </p>
            <p>
              La première étape est donc une cartographie : lister les tâches chronophages de vos
              équipes, estimer le temps qu'elles consomment, et repérer celles qui suivent des
              règles claires. Ce sont les meilleures candidates à l'automatisation. Un audit d'une
              demi-journée suffit souvent à dégager deux ou trois chantiers à fort retour.
            </p>
          </LegalSection>

          <LegalSection title="2. Les trois cas d'usage les plus rentables en PME">
            <p>
              Dans les PME que nous accompagnons, trois automatisations reviennent comme les plus
              rentables à mettre en place, parce qu'elles touchent directement le chiffre d'affaires
              :
            </p>
            <ul>
              <li>
                <strong>Reporting commercial intelligent</strong> — l'IA lit votre pipeline et
                produit chaque semaine un brief : opportunités à risque, leads chauds, actions
                prioritaires. Vos commerciaux arrivent le lundi avec une liste, pas avec un tableur.
              </li>
              <li>
                <strong>Relances et nurturing automatisés</strong> — des séquences d'emails
                personnalisées, déclenchées par les signaux du pipeline et calibrées sur le ton de
                votre marque, plutôt que des relances oubliées ou génériques.
              </li>
              <li>
                <strong>Analyse des appels commerciaux</strong> — chaque call est transcrit, résumé
                et enrichi dans le CRM : objections clés, prochaines étapes, scoring. Plus aucune
                information ne se perd entre l'appel et le suivi.
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="3. Faut-il changer de CRM ou de logiciels ?">
            <p>
              Non, et c'est même à éviter. Changer de CRM pour « faire de l'IA » revient à refaire
              toute votre organisation pour une couche qui peut s'ajouter par-dessus l'existant.
              L'IA se connecte à votre outil actuel — Salesforce, HubSpot, Pipedrive, Zoho — via ses
              API. Vous conservez votre stack, vos données et les habitudes de vos équipes.
            </p>
          </LegalSection>

          <LegalSection title="4. Combien de temps et quel budget prévoir ?">
            <p>
              Le bon réflexe est d'avancer par paliers. Plutôt que de viser une transformation
              globale, on déploie un premier cas d'usage, on le mesure, puis on étend ce qui
              fonctionne. Un premier workflow utile est livrable en production sous 30 jours.
            </p>
            <p>
              Côté budget, une automatisation simple démarre entre 1 000 et 2 000 €. Le coût dépend
              du nombre d'intégrations et de la complexité des règles métier, pas d'un abonnement
              par utilisateur. Le chiffrage se fait après l'audit, une fois le périmètre clair —
              jamais à l'aveugle.
            </p>
          </LegalSection>

          <LegalSection title="5. Sécurité des données et conformité RGPD">
            <p>
              C'est la question légitime de tout dirigeant. La règle est simple : utilisez l'API
              commerciale du fournisseur, pas la version grand public. Chez Sablia, Claude est
              déployé via l'API d'Anthropic, où aucune de vos données n'entraîne le modèle par
              engagement contractuel. Le traitement est conforme au RGPD et un accord de traitement
              des données (DPA) peut être signé avant tout démarrage.
            </p>
          </LegalSection>

          <LegalSection title="6. Les erreurs qui font échouer un projet IA">
            <ul>
              <li>Acheter un outil avant d'avoir identifié le problème à résoudre.</li>
              <li>Vouloir tout automatiser d'un coup au lieu d'avancer par cas d'usage.</li>
              <li>Négliger la formation des équipes, qui finissent par contourner l'outil.</li>
              <li>Utiliser une version grand public d'un modèle d'IA avec des données clients.</li>
              <li>Mesurer le succès en « features livrées » plutôt qu'en temps gagné réel.</li>
            </ul>
          </LegalSection>

          <LegalSection title="Par où commencer concrètement">
            <p>
              La façon la plus rapide de savoir si l'IA peut vous faire gagner du temps est d'en
              parler à quelqu'un qui en intègre au quotidien. Sablia propose un call audit gratuit
              de 30 minutes : on regarde vos processus, on identifie les deux ou trois
              automatisations les plus rentables pour vous, et vous repartez avec une vision claire
              — engagement ou pas.
            </p>
            <p>
              <CtaAudit />
            </p>
          </LegalSection>

          <LegalSection title="Questions fréquentes">
            <div className="not-prose">
              {FAQ.map((item) => (
                <div key={item.q} className="mb-6">
                  <h3 className="t-title-sm mb-1.5 text-on-dark">{item.q}</h3>
                  <p className="text-on-dark-body">{item.a}</p>
                </div>
              ))}
            </div>
          </LegalSection>

          <p className="legal-updated">Dernière mise à jour : 18/06/2026.</p>
        </LegalShell>
        <ScrollToTop />
      </motion.div>
    </>
  )
}
