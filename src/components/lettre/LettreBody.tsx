import { compiler } from 'markdown-to-jsx/react'
import { Fragment, type ReactNode } from 'react'

/**
 * The body of an issue (US-101), rendered on the server from the hub's Markdown as React nodes:
 * raw HTML is shown as text (`disableParsingRawHTML`), never parsed, and no HTML string is injected.
 * `compiler` is the pure function of `markdown-to-jsx/react` (no React context, fine in a Server
 * Component). Paragraphs keep their single line breaks through `white-space: pre-line` (lettre.css).
 *
 * The block carries `data-body="lettre"`: the export guard (`assertLettreHtml`) reads it up to its first
 * `</div>`, which works because nothing below emits a <div> (footnotes included, see `Notes`).
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

/**
 * Footnotes (`[^1]`): markdown-to-jsx appends a `<footer>` of `<div id="…">` notes. In the body that
 * would be a second footer inside <main>, generated ids (`[^contenu]` would duplicate <main id="contenu">)
 * and a <div> that ends the export guard's capture. They render as an <aside> of paragraphs without ids.
 */
const Notes = ({ children }: Children) => <aside className="lt-notes">{children}</aside>
const Note = ({ children }: Children) => <p>{children}</p>

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

/**
 * The text of an autolinked bare URL (its text is its href) reads without the scheme, the hub's `utm_*`
 * parameters and the fragment; any other parameter stays (a YouTube link keeps its `?v=` id). A labelled
 * link keeps its label.
 */
function linkText(href: string | undefined, children: ReactNode): ReactNode {
  const text = Array.isArray(children) && children.length === 1 ? children[0] : children
  if (!href || text !== href || !/^https?:\/\//i.test(href)) return children
  const bare = href.replace(/^https?:\/\//i, '').replace(/#.*$/, '')
  const at = bare.indexOf('?')
  if (at === -1) return bare || children
  const kept = bare
    .slice(at + 1)
    .split('&')
    .filter((param) => param !== '' && !/^utm_/i.test(param))
  const path = bare.slice(0, at)
  return (kept.length > 0 ? `${path}?${kept.join('&')}` : path) || children
}

/**
 * markdown-to-jsx ends a bare URL at an ASCII space, `<` or `>` only, so a no-break or thin space, « » » or
 * « … » typed right after it (French typography) joins its href. Such a URL goes in angle brackets before
 * `compiler`, ending where the library ends one at a space: the same trailing marks stay outside, a `)` the
 * URL opened stays in. Code spans, Markdown links (label, destination, definition) and `<…>` are skipped.
 */
const WIDE_SPACE_URL =
  /(`+)[\s\S]*?\1|\[[^\]]*\](?:\([^)]*\)|:[ \t]*\S+)?|<[^<>]*>|(?<!<)https?:\/\/[^\s<>»…]+(?=[^\S \t\n\r]|[»…])/g
const TRAILING_MARKS = '.,:!?*_~;)'

function bracketBareUrls(markdown: string): string {
  return markdown.replace(WIDE_SPACE_URL, (match) => {
    if (!match.startsWith('http')) return match
    const host = match.indexOf('//') + 2
    let end = match.length
    while (end > host && TRAILING_MARKS.includes(match[end - 1])) {
      const url = match.slice(0, end)
      if (match[end - 1] === ')' && url.split('(').length >= url.split(')').length) break
      end--
    }
    return end > host ? `<${match.slice(0, end)}>${match.slice(end)}` : match
  })
}

/** Keeps the href (absent when the sanitizer dropped it, e.g. `javascript:`). */
function BodyLink({ href, children }: Children & { href?: string }) {
  // An in-page anchor has no target here (headings and notes carry no id): the text stays, unlinked.
  if (href?.startsWith('#')) return <>{children}</>
  return (
    <a href={href} rel={isExternalHref(href) ? 'noopener' : undefined}>
      {linkText(href, children)}
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
    footer: { component: Notes },
    div: { component: Note },
  },
}

export function LettreBody({ markdown }: { markdown: string }) {
  return (
    <div className="lt-body" data-body="lettre">
      {compiler(bracketBareUrls(markdown), OPTIONS)}
    </div>
  )
}
