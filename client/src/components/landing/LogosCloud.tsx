import { motion } from 'framer-motion'
import { Bot, ClipboardCheck, GraduationCap, Workflow } from 'lucide-react'

interface Expertise {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  accent: string
}

const expertises: Expertise[] = [
  {
    icon: <ClipboardCheck size={24} />,
    title: 'Diagnostic Express',
    description:
      'Identifiez vos gains rapides en 1h30. Audit de vos processus et feuille de route personnalisée.',
    href: '#contact',
    accent: 'border-l-sablia-sienna text-sablia-sienna',
  },
  {
    icon: <GraduationCap size={24} />,
    title: 'Vos équipes autonomes',
    description:
      'De débutant à expert en 1 à 3 jours. Formations n8n, IA et automatisation sur mesure.',
    href: '#pricing',
    accent: 'border-l-sablia-accent text-sablia-accent',
  },
  {
    icon: <Workflow size={24} />,
    title: 'Workflows sur mesure',
    description:
      'Vos processus, automatisés et fiables. Développement, déploiement et maintenance inclus.',
    href: '#pricing',
    accent: 'border-l-sablia-alba text-sablia-alba',
  },
  {
    icon: <Bot size={24} />,
    title: 'Agents IA',
    description:
      "L'IA qui travaille pour vous. Agents vocaux, traitement de documents, veille automatisée.",
    href: '#pricing',
    accent: 'border-l-sablia-sienna text-sablia-sienna',
  },
]

export default function LogosCloud() {
  const handleClick = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="expertise" className="py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-medium uppercase tracking-[0.15em] text-sablia-sienna mb-3"
          >
            Ce que nous faisons
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="text-3xl lg:text-4xl font-display font-semibold text-sablia-text"
          >
            Nos expertises
          </motion.h2>
        </div>

        {/* Desktop: 4-column grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {expertises.map((item, index) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => handleClick(item.href)}
              className={`text-left bg-sablia-surface border border-sablia-border border-l-[3px] ${item.accent.split(' ')[0]} rounded p-6 hover:shadow-warm-sm transition-all duration-200 group`}
            >
              <div className={`mb-4 ${item.accent.split(' ')[1]}`}>{item.icon}</div>
              <h3 className="text-lg font-semibold text-sablia-text mb-2">{item.title}</h3>
              <p className="text-sm text-sablia-text-secondary leading-relaxed mb-4">
                {item.description}
              </p>
              <span className="text-sm font-medium text-sablia-accent group-hover:underline underline-offset-2">
                En savoir plus &rarr;
              </span>
            </motion.button>
          ))}
        </div>

        {/* Mobile: horizontal scroll with snap */}
        <div className="md:hidden -mx-6 px-6">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {expertises.map((item, index) => (
              <motion.button
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => handleClick(item.href)}
                className={`text-left flex-shrink-0 w-[280px] snap-start bg-sablia-surface border border-sablia-border border-l-[3px] ${item.accent.split(' ')[0]} rounded p-6`}
              >
                <div className={`mb-4 ${item.accent.split(' ')[1]}`}>{item.icon}</div>
                <h3 className="text-lg font-semibold text-sablia-text mb-2">{item.title}</h3>
                <p className="text-sm text-sablia-text-secondary leading-relaxed mb-4">
                  {item.description}
                </p>
                <span className="text-sm font-medium text-sablia-accent">
                  En savoir plus &rarr;
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
