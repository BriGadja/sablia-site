import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

type PathCard = {
  title: string
  intro: string
  bullets: string[]
  priceFloor?: string
}

const paths: PathCard[] = [
  {
    title: "Formation d'équipes internes",
    intro:
      'Vos équipes doivent maîtriser un outil ou un workflow spécifique. On construit le curriculum sur mesure et on forme en présentiel ou à distance.',
    bullets: [
      'Utiliser n8n ou Make pour automatiser leurs process internes sans support technique',
      'Prompter correctement un LLM pour la relecture de contrats, la synthèse de réunion, le reporting',
      'Auditer un nouveau process automatisable sans dépendre d\u2019un prestataire externe',
    ],
    priceFloor: 'À partir de 1 500€ HT',
  },
  {
    title: 'Accompagnement',
    intro:
      'Un sponsor interne porte le projet IA dans votre entreprise. On le coache chaque semaine pour qu\u2019il délivre sans dérailler, sans over-engineering.',
    bullets: [
      'Structurer la roadmap d\u2019implémentation IA et la défendre en interne',
      'Piloter les prestataires techniques avec les bons critères et les bons livrables',
      'Décider quelles automatisations lancer, arbitrer les priorités, arrêter celles qui ne livrent pas',
    ],
  },
  {
    title: 'Développement',
    intro:
      'Vous voulez que les automatisations soient construites directement par Sablia. On livre clé en main avec documentation de handoff.',
    bullets: [
      'Exploiter des workflows n8n sur mesure (finance, ops, commercial, support)',
      'Déployer des agents vocaux Dipler pour standards, relances clients, prises de rendez-vous',
      'Utiliser des applications web internes (dashboards, formulaires, espaces clients)',
    ],
  },
]

export default function WhatRevealsSection() {
  return (
    <section className="py-24 bg-sablia-surface">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-semibold text-sablia-text mb-4">
            Ce que révèle votre diagnostic
          </h2>
          <p className="text-lg text-sablia-text-secondary">
            Le livrable se conclut par une recommandation parmi trois paths. Vous êtes libre de la
            suivre, de la combiner ou de décliner.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {paths.map((path, index) => (
            <motion.article
              key={path.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-sablia-border rounded-lg p-6 lg:p-7 flex flex-col"
            >
              <h3 className="text-xl font-semibold text-sablia-text mb-3">{path.title}</h3>
              <p className="text-sablia-text-secondary text-sm mb-5 leading-relaxed">
                {path.intro}
              </p>

              <p className="text-xs font-semibold uppercase tracking-wide text-sablia-text-tertiary mb-2">
                Ce que votre équipe peut faire après
              </p>
              <ul className="space-y-2 mb-5 flex-1">
                {path.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-sablia-text">
                    <Check
                      size={16}
                      className="text-sablia-accent mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {path.priceFloor && (
                <p className="text-sm font-medium text-sablia-accent pt-3 border-t border-sablia-border">
                  {path.priceFloor}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
