import Link from 'next/link'
import { publishedCrmPages } from '@/content/crm'
import { SPREADSHEET_PAGES } from '@/content/crm/spreadsheets'
import { crmPath } from '@/content/crm/view'

const slugOf = (name: string) => name.toLowerCase().replace(/\s+/g, '-')

/** Paths of the CRM pages that may be linked: the published JSON pages and the two spreadsheet pages. */
export function linkablePaths(): Set<string> {
  return new Set([
    ...publishedCrmPages().map((page) => page.path),
    ...Object.values(SPREADSHEET_PAGES).map((page) => page.path),
  ])
}

/**
 * One chip per tool: a link when the tool has a page, plain text otherwise. A draft page is not
 * routable, so it never appears among the paths and is never linked.
 */
export default function CrmLinks({
  names,
  paths,
}: {
  names: readonly string[]
  paths?: Set<string>
}) {
  const known = paths ?? linkablePaths()
  return (
    <ul className="chips">
      {names.map((name) => {
        const path = crmPath(slugOf(name))
        return (
          <li key={name}>
            {known.has(path) ? (
              <Link href={path} className="chip">
                {name}
              </Link>
            ) : (
              <span className="chip">{name}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
