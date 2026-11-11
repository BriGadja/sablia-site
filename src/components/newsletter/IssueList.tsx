import Link from 'next/link'
import { NUMEROS } from '@/components/lettre/content'
import type { Lettre } from '@/components/lettre/data'
import { parisDate } from '@/components/lettre/date'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { frenchSpacing } from '@/lib/format'

const newestFirst = (lettres: readonly Lettre[]) =>
  [...lettres].sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))

/**
 * `#numeros` on `/newsletter` (US-102): every published issue, newest first (Paris date, title, link
 * to `/lettre/<slug>`), or one sentence while none is published. The export guard checks that this
 * page links every published issue.
 */
export function IssueList({ lettres }: { lettres: readonly Lettre[] }) {
  const rows = newestFirst(lettres)
  return (
    <section id="numeros" className="nl-numeros">
      <Dune back="#C68A8E" front="#F4ECDD" />
      <div className="wrap">
        <Eyebrow>{NUMEROS.eyebrow}</Eyebrow>
        <h2>{NUMEROS.title}</h2>
        {rows.length === 0 ? (
          <p data-state="empty" className="nl-issues-empty">
            {NUMEROS.empty}
          </p>
        ) : (
          <ol className="nl-issues">
            {rows.map((lettre) => (
              <li key={lettre.slug}>
                <Link href={`/lettre/${lettre.slug}`} className="nl-issue">
                  <time dateTime={lettre.published_at} className="nl-issue-date">
                    {parisDate(lettre.published_at)}
                  </time>
                  <span className="nl-issue-title">{frenchSpacing(lettre.titre)}</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
