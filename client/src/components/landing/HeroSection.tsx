import { motion } from 'framer-motion'
import { ArrowRight, Check } from '@/components/icons/lucide-crm'
import { openBooking } from './BookingModal'

function Sparkline() {
  const points = [4, 12, 8, 18, 14, 26, 22, 30, 28, 24, 36, 32, 44, 40, 52, 46, 60, 50]
  const W = 320
  const H = 56
  const xs = points.map((_, i) => (i / (points.length - 1)) * W)
  const ys = points.map((p) => H - (p / 60) * (H - 8) - 4)
  const d = xs.map((x, i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ')
  const fill = `${d} L${W} ${H} L0 ${H} Z`
  return (
    <svg className="mb-4 block h-14 w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <title>Sparkline de pipeline</title>
      <path d={fill} fill="rgba(204,120,92,0.14)" />
      <path d={d} fill="none" stroke="#cc785c" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function DashboardMockup() {
  const kpis = [
    { label: 'Volume', value: '€428k', delta: '+18.4%' },
    { label: 'Deals actifs', value: '62', delta: '+9' },
    { label: 'Cycle moyen', value: '21j', delta: '−3j', muted: true },
  ]
  const rows = [
    { name: 'Client industriel', amt: '€48,200', stage: 'Negotiation', color: 'text-success' },
    { name: 'PME services', amt: '€36,500', stage: 'Qualified', color: 'text-primary' },
    { name: 'Cabinet conseil', amt: '€24,000', stage: 'Discovery', color: 'text-accent-teal' },
  ]
  return (
    <div className="rounded-xl border border-hairline-light bg-surface-light p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink">Pipeline commercial · Mars</span>
        <span className="t-caption-uppercase rounded-full bg-surface-light-card px-2.5 py-1 text-muted-text">
          Salesforce
        </span>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2.5">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-lg bg-surface-light-card px-3.5 py-3">
            <div className="text-[10px] font-medium uppercase tracking-[1.2px] text-muted-text">
              {k.label}
            </div>
            <div className="font-mono text-[22px] tracking-tight text-ink">{k.value}</div>
            <div
              className={`font-mono text-[11px] ${k.muted ? 'text-muted-text' : 'text-success'}`}
            >
              {k.delta}
            </div>
          </div>
        ))}
      </div>
      <Sparkline />
      <div className="mb-2 text-[11px] font-medium uppercase tracking-[1.2px] text-muted-text">
        Top opportunités
      </div>
      {rows.map((r) => (
        <div
          key={r.name}
          className="mb-1.5 grid grid-cols-[1fr_auto_auto] items-center gap-2.5 rounded-lg bg-surface-light-card px-3 py-2.5"
        >
          <span className="text-[13px] text-ink">{r.name}</span>
          <span className="font-mono text-xs text-body">{r.amt}</span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[1.2px] ${r.color} border-current`}
          >
            {r.stage}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="bg-canvas px-8 pb-20 pt-section">
      <div className="mx-auto grid max-w-editorial items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
        >
          <div className="eyebrow mb-6 inline-flex items-center gap-2 text-primary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Agence d'intégration Claude AI
          </div>
          <h1 className="t-display-xl text-on-dark-strong">
            Exploitez <em className="font-display italic text-primary">100&nbsp;%</em> du potentiel
            de votre CRM.
          </h1>
          <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-on-dark-body">
            Nous vous accompagnons dans l'intégration de Claude AI au cœur de vos processus
            commerciaux. Vos équipes gagnent du temps, votre outil révèle tout son potentiel.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openBooking}
              className="t-button inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-on-primary transition-shadow duration-base hover:shadow-glow-coral"
            >
              Réserver un call audit — 30&nbsp;min <ArrowRight size={16} />
            </button>
            <a
              href="#use-cases"
              className="t-button inline-flex h-11 items-center rounded-md border border-hairline px-5 text-on-dark transition-colors hover:border-on-dark-muted"
            >
              Voir les cas d'usage
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-on-dark-muted">
            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-success" /> Gratuit
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-success" /> Sans engagement
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-success" /> Équipe en France
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0, 0, 1] }}
          className="hidden lg:block"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  )
}
