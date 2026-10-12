import { Link } from 'wouter'
import { publishedCrmPages } from '@/content/crm'
import type { CrmPageContent } from '@/content/crm/schema'

interface CrmLinksProps {
  /** Defaults to the real pages; tests pass their own. Only published ones are ever listed. */
  pages?: readonly CrmPageContent[]
}

/**
 * « Votre CRM » : one compact link per PUBLISHED CRM page. A draft page is not routable, so it is
 * never linked; when nothing is published the strip renders nothing at all.
 */
export default function CrmLinks({ pages }: CrmLinksProps = {}) {
  const published = pages
    ? pages.filter((page) => page.status === 'published')
    : publishedCrmPages()
  if (published.length === 0) return null

  return (
    <section
      aria-labelledby="votre-crm"
      className="border-t border-hairline-light bg-surface-light px-8 py-14"
    >
      <div className="mx-auto max-w-editorial">
        <h2 id="votre-crm" className="eyebrow mb-5 text-muted-text">
          Votre CRM
        </h2>
        <ul className="flex flex-wrap gap-2.5">
          {published.map((page) => (
            <li key={page.slug}>
              <Link
                href={page.path}
                className="t-button inline-flex h-11 items-center rounded-md border border-hairline-light bg-white px-5 text-ink transition-colors hover:border-muted-text"
              >
                {page.crm}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
