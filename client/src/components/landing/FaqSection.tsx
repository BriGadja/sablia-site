import { Helmet } from 'react-helmet-async'
import {
  AccordionEditorial,
  type AccordionEditorialItem,
} from '@/components/ui/accordion-editorial'
import { Reveal } from '@/components/ui/reveal'

/**
 * N° 08 · Objections légitimes — 9 Q&A.
 * 7 items diagnostic-focused (spec docs/copy-v1.md §C5-C6) + 2 items
 * techniques (outils + sécurité) conservés pour répondre aux objections
 * Google Ads (plan Phase 3 FAQ décision).
 */

type FaqEntry = { id: string; question: string; answerText: string; answer: React.ReactNode }

const items: FaqEntry[] = [
  {
    id: 'prix',
    question: 'Combien coûte le Diagnostic Sablia ?',
    answerText:
      "490€ HT. TVA non applicable (art. 293 B du CGI). Paiement upfront par Stripe ou virement. Ce prix couvre l'intake, la session de deep-dive de 3 heures, la rédaction du livrable PDF de 10 à 15 pages, et la restitution d'une heure. Pas de coût caché, pas de dépassement. Si, dans les 90 jours suivant la restitution, vous signez un contrat Développement ou Accompagnement avec Sablia, les 490€ sont intégralement déduits de votre première facture. Non applicable au path Formation d'équipes internes (qui reste facturé au plein tarif de sa fourchette).",
    answer: (
      <>
        <p>
          <strong>490€ HT.</strong> TVA non applicable (art. 293 B du CGI). Paiement upfront par
          Stripe ou virement. Ce prix couvre l'intake, la session de deep-dive de 3 heures, la
          rédaction du livrable PDF de 10 à 15 pages, et la restitution d'une heure. Pas de coût
          caché, pas de dépassement.
        </p>
        <p className="mt-3">
          Si, dans les 90 jours suivant la restitution, vous signez un contrat Développement ou
          Accompagnement avec Sablia, les 490€ sont intégralement déduits de votre première facture.
          Non applicable au path Formation d'équipes internes (qui reste facturé au plein tarif de
          sa fourchette).
        </p>
      </>
    ),
  },
  {
    id: 'delai',
    question: 'Combien de temps ça prend ?',
    answerText:
      "Cinq jours ouvrés entre la fin de l'intake et la restitution du PDF. L'intake lui-même dure 45 minutes (un formulaire asynchrone + un appel de 15 minutes pour clarifier). Le deep-dive synchrone dure 3 heures. La restitution dure 1 heure.",
    answer: (
      <p>
        Cinq jours ouvrés entre la fin de l'intake et la restitution du PDF. L'intake lui-même dure
        45 minutes (un formulaire asynchrone + un appel de 15 minutes pour clarifier). Le deep-dive
        synchrone dure 3 heures. La restitution dure 1 heure.
      </p>
    ),
  },
  {
    id: 'pour-qui',
    question: "Pour quel type d'entreprise ?",
    answerText:
      "PME de 10 à 250 salariés avec au moins un process manuel qui coûte 5 heures ou plus par semaine à l'équipe. Le diagnostic est taillé pour les structures qui ont déjà des opérations en place, pas pour valider une idée de startup. Si votre process ne saigne pas encore 5 h+/semaine, attendez.",
    answer: (
      <p>
        PME de 10 à 250 salariés avec au moins un process manuel qui coûte 5 heures ou plus par
        semaine à l'équipe. Le diagnostic est taillé pour les structures qui ont déjà des opérations
        en place, pas pour valider une idée de startup. Si votre process ne saigne pas encore 5
        h+/semaine, attendez.
      </p>
    ),
  },
  {
    id: 'apres',
    question: 'Que se passe-t-il après le diagnostic ?',
    answerText:
      "Le livrable PDF contient une recommandation claire parmi trois paths : formation d'équipes internes, accompagnement d'un sponsor interne, ou développement des automatisations par Sablia. Vous êtes libre de choisir n'importe lequel, de les combiner, ou de décliner, le diagnostic se tient seul, sans obligation de continuer.",
    answer: (
      <p>
        Le livrable PDF contient une recommandation claire parmi trois paths : formation d'équipes
        internes, accompagnement d'un sponsor interne, ou développement des automatisations par
        Sablia. Vous êtes libre de choisir n'importe lequel, de les combiner, ou de décliner, le
        diagnostic se tient seul, sans obligation de continuer.
      </p>
    ),
  },
  {
    id: 'remboursement',
    question: 'Quelle est la politique de remboursement ?',
    answerText:
      "Jusqu'à 72 heures avant l'intake, annulation avec remboursement intégral sans justification. Une fois l'intake démarré, le diagnostic est non-remboursable, parce que le travail d'analyse commence immédiatement après.",
    answer: (
      <p>
        Jusqu'à 72 heures avant l'intake, annulation avec remboursement intégral sans justification.
        Une fois l'intake démarré, le diagnostic est non-remboursable, parce que le travail
        d'analyse commence immédiatement après.
      </p>
    ),
  },
  {
    id: 'pourquoi-payant',
    question: 'Pourquoi un diagnostic payant et pas un audit gratuit ?',
    answerText:
      "Un audit gratuit dure 30 minutes et finit toujours par recommander ce que le prestataire vend. Un diagnostic payant de 5 jours cartographie réellement vos process et peut conclure qu'aucune implémentation IA n'est pertinente chez vous. On préfère qu'on vous dise ça plutôt qu'on vous vende une solution qui ne marchera pas. Le coût du diagnostic protège la qualité de la recommandation.",
    answer: (
      <p>
        Un audit gratuit dure 30 minutes et finit toujours par recommander ce que le prestataire
        vend. Un diagnostic payant de 5 jours cartographie réellement vos process et peut conclure
        qu'aucune implémentation IA n'est pertinente chez vous. On préfère qu'on vous dise ça plutôt
        qu'on vous vende une solution qui ne marchera pas. Le coût du diagnostic protège la qualité
        de la recommandation.
      </p>
    ),
  },
  {
    id: 'outils',
    question: 'Quels outils utilisez-vous pour implémenter les automatisations ?',
    answerText:
      'Principalement n8n (auto-hébergé, souveraineté totale) pour les workflows, Dipler pour les agents vocaux, et les modèles LLM (OpenAI, Claude, Mistral) pour les capacités IA. Le choix exact est arbitré pendant le diagnostic selon votre stack existante et vos contraintes de confidentialité.',
    answer: (
      <p>
        Principalement n8n (auto-hébergé, souveraineté totale) pour les workflows, Dipler pour les
        agents vocaux, et les modèles LLM (OpenAI, Claude, Mistral) pour les capacités IA. Le choix
        exact est arbitré pendant le diagnostic selon votre stack existante et vos contraintes de
        confidentialité.
      </p>
    ),
  },
  {
    id: 'securite',
    question: 'Comment garantissez-vous la sécurité des données ?',
    answerText:
      "Hébergement Europe (RGPD-compliant), chiffrement TLS 1.3 en transit et AES-256 au repos, 2FA obligatoire côté Sablia. NDA systématique. Pour les PME qui souhaitent un contrôle total, n8n peut être déployé sur vos propres serveurs — c'est l'un des paths Développement possibles.",
    answer: (
      <p>
        Hébergement Europe (RGPD-compliant), chiffrement TLS 1.3 en transit et AES-256 au repos, 2FA
        obligatoire côté Sablia. NDA systématique. Pour les PME qui souhaitent un contrôle total,
        n8n peut être déployé sur vos propres serveurs — c'est l'un des paths Développement
        possibles.
      </p>
    ),
  },
  {
    id: 'iapreneurs',
    question: "En quoi Sablia est-il différent d'IAPreneurs ?",
    answerText:
      "IAPreneurs forme les entrepreneurs qui veulent construire une activité en vendant l'intelligence artificielle. Sablia, c'est l'inverse : on intègre l'IA directement dans votre PME existante. Les deux n'ont pas les mêmes clients, Brice exerce simplement les deux rôles. IAPreneurs s'adresse à des freelances et consultants IA en construction. Sablia s'adresse à des dirigeants de PME de 10 à 250 salariés avec des process opérationnels déjà en place.",
    answer: (
      <p>
        IAPreneurs forme les entrepreneurs qui veulent construire une activité en vendant
        l'intelligence artificielle. Sablia, c'est l'inverse : on intègre l'IA directement dans
        votre PME existante. Les deux n'ont pas les mêmes clients, Brice exerce simplement les deux
        rôles. IAPreneurs s'adresse à des freelances et consultants IA en construction. Sablia
        s'adresse à des dirigeants de PME de 10 à 250 salariés avec des process opérationnels déjà
        en place.
      </p>
    ),
  },
]

const accordionItems: AccordionEditorialItem[] = items.map((it) => ({
  id: it.id,
  question: it.question,
  answer: it.answer,
}))

export default function FaqSection() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answerText },
    })),
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <section id="faq" className="relative py-24 md:py-32" aria-labelledby="faq-title">
        <div className="container-editorial">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <div className="col-span-12 lg:col-span-4">
              <Reveal>
                <p className="folio mb-6">N° 08 · Objections légitimes</p>
                <h2 id="faq-title" className="display-lg">
                  Les questions que
                  <br />
                  <em>vous n'osez pas poser</em>
                  <br />à une agence.
                </h2>
                <p className="mt-6 max-w-[32ch] text-[color:var(--color-encre-70)]">
                  Réponses directes, sans langue de bois. Si une question manque, écrivez-nous ou
                  réservez 15 minutes avec Brice avant de lancer le diagnostic.
                </p>
              </Reveal>
            </div>

            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <Reveal delay={150}>
                <AccordionEditorial items={accordionItems} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
