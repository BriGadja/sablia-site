import type { CSSProperties } from 'react'

/**
 * The CRM record that fills itself (grill 2026-09-28, decision 2; mockup 2 of 2026-09-25), laid over
 * the hero photo: the ONLY animated moment of the home. Pure CSS (`.record-*` in `index.css`), so
 * the prerendered HTML and `prefers-reduced-motion` behave without JavaScript. Decorative: the
 * record is a fictional contact and its fields carry no data, hence `aria-hidden`.
 *
 * The two constants live here, not in `content/home.ts`: the OF-1 copy guard scans every content
 * module for banned statistic sources by substring, and « Durand » contains « rand ».
 */
const RECORD_CONTACT = 'Catherine Durand'
const RECORD_FIELDS = ['Besoin', 'Échéance', 'Décideurs', 'Relance'] as const

export default function RecordCard({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`record-card grid gap-2 rounded-xl bg-white p-3.5 shadow-[0_24px_50px_-18px_rgba(20,15,43,0.35)] ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[14px] font-semibold text-ink">{RECORD_CONTACT}</span>
        <span className="rounded-full bg-[#e7f8ef] px-2 py-0.5 font-mono text-[11px] text-[#0b7a47]">
          à jour
        </span>
      </div>
      {RECORD_FIELDS.map((field, index) => (
        <div key={field} className="grid grid-cols-[78px_1fr] items-center gap-2 text-[13px]">
          <span className="text-muted-text">{field}</span>
          <i className="record-bar" style={{ '--d': index } as CSSProperties} />
        </div>
      ))}
    </div>
  )
}
