import { compiler } from 'markdown-to-jsx/react'
import { Fragment, type ReactNode } from 'react'

/**
 * The body of an issue (US-101), rendered on the server from the hub's Markdown as React nodes:
 * raw HTML is shown as text (`disableParsingRawHTML`), never parsed, and no HTML string is injected.
 * `compiler` is the pure function of `markdown-to-jsx/react` (no React context, fine in a Server
 * Component). Paragraphs keep their single line breaks through `white-space: pre-line` (lettre.css).
 *
 * The block carries `data-body="lettre"`: the export guard (`assertLettreHtml`) reads it up to its first
 * `</div>`, which works because nothing below emits a <div>.
 */

type Children = { children?: ReactNode }

// Headings without the generated `id`; a `#` heading becomes an h2 (the page has one h1, the title).
const H2 = ({ children }: Children) => <h2>{children}</h2>
const H3 = ({ children }: Children) => <h3>{children}</h3>
const H4 = ({ children }: Children) => <h4>{children}</h4>
const H5 = ({ children }: Children) => <h5>{children}</h5>
const H6 = ({ children }: Children) => <h6>{children}</h6>

/** An issue is published without images (the hub refuses them): a Markdown image renders nothing. */
const NoImage = () => null

/** Absolute (scheme or protocol-relative) and on a host that is not sablia.io or one of its subdomains. */
export function isExternalHref(href: string | undefined): boolean {
  if (!href || !/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(href)) return false
  try {
    const { hostname } = new URL(href, 'https://sablia.io')
    return hostname !== 'sablia.io' && !hostname.endsWith('.sablia.io')
  } catch {
    return false
  }
}

/** Keeps the href (absent when the sanitizer dropped it, e.g. `javascript:`). */
function BodyLink({ href, children }: Children & { href?: string }) {
  return (
    <a href={href} rel={isExternalHref(href) ? 'noopener' : undefined}>
      {children}
    </a>
  )
}

const OPTIONS = {
  disableParsingRawHTML: true,
  forceBlock: true,
  forceWrapper: true,
  wrapper: Fragment,
  overrides: {
    h1: { component: H2 },
    h2: { component: H2 },
    h3: { component: H3 },
    h4: { component: H4 },
    h5: { component: H5 },
    h6: { component: H6 },
    img: { component: NoImage },
    a: { component: BodyLink },
  },
}

export function LettreBody({ markdown }: { markdown: string }) {
  return (
    <div className="lt-body" data-body="lettre">
      {compiler(markdown, OPTIONS)}
    </div>
  )
}
