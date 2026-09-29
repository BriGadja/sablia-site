import type { CSSProperties } from 'react'

/**
 * The CRM contact record laid over the hero photo: Brice's pick of 2026-09-29, option A « La fiche
 * contact » of `fiche-crm-options.html` (run 2026-09-28-refonte-accueil-sablia), replacing the
 * four filling bars of grill decision 2. An avatar, the company, the pipeline stage, then the four
 * fields Claude writes after the call, typed in one after another, signed. The ONLY animated moment
 * of the home, in pure CSS (`.record-*` in `index.css`), so the prerendered HTML and
 * `prefers-reduced-motion` behave without JavaScript. Decorative: the contact is fictional and the
 * h1 and the offer carry the message, hence `aria-hidden`.
 *
 * The constants live here, not in `content/home.ts`: the OF-1 copy guard scans every content
 * module for banned statistic sources by substring, and « Durand » contains « rand ».
 */
export const RECORD_CONTACT = {
  initials: 'CD',
  name: 'Catherine Durand',
  // No-break spaces: when the line is short, it breaks after the dot, never inside « 12 salariés ».
  company: 'Atelier Durand\u00a0· 12\u00a0salariés',
  stage: 'Proposition',
} as const

export const RECORD_FIELDS = [
  { label: 'Besoin', value: 'Remplacer les devis sur Excel' },
  { label: 'Échéance', value: 'Avant le 15 novembre' },
  { label: 'Décideurs', value: 'La gérante et son comptable' },
  { label: 'Prochaine étape', value: 'Relance mardi à 10 h' },
] as const

export const RECORD_SIGNATURE = "Écrit par Claude après l'appel · il y a 12 s"

export default function RecordCard({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`record-card rounded-xl bg-white p-3.5 text-[12px] leading-snug text-ink shadow-[0_24px_50px_-18px_rgba(20,15,43,0.35)] ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-active text-[12px] font-semibold text-white">
          {RECORD_CONTACT.initials}
        </span>
        <div>
          <p className="record-name whitespace-nowrap text-[14px] font-semibold">
            {RECORD_CONTACT.name}
          </p>
          <p className="text-[12px] text-muted-text">{RECORD_CONTACT.company}</p>
        </div>
        <span className="record-stage ml-auto whitespace-nowrap rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary-hover">
          {RECORD_CONTACT.stage}
        </span>
      </div>
      <dl className="mt-2.5 grid gap-1.5">
        {RECORD_FIELDS.map((field, index) => (
          <div
            key={field.label}
            className="record-row grid grid-cols-[96px_1fr] gap-2 border-t border-hairline-light/60 pt-1.5"
          >
            <dt className="text-muted-text">{field.label}</dt>
            <dd
              className="record-value justify-self-start font-medium [text-wrap:balance]"
              style={{ '--d': index } as CSSProperties}
            >
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="record-signature mt-2.5 text-[11px] text-[#2f7a4f]">{RECORD_SIGNATURE}</p>
    </div>
  )
}
