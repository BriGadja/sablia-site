import type { ReactNode } from 'react'

const TOKEN = /(\*\*[^*]+\*\*|\[À CONFIRMER : [^\]]*\]|brice@sablia\.io)/g
const MARKER = /^\[À CONFIRMER : ([^\]]*)\]$/

/**
 * Inline markup of the CGV data files: `**bold**`, the contact e-mail (linked), and
 * `[À CONFIRMER : what to settle]`, drawn as a highlighted mark. The visible text always carries the exact
 * string « [À CONFIRMER] », which is what scripts/qa/content-gates.sh looks for: the PROD build fails on it.
 */
export function LegalText({ text }: { text: string }) {
  const out: ReactNode[] = []
  text.split(TOKEN).forEach((part, i) => {
    if (!part) return
    const key = `${i}`
    const todo = MARKER.exec(part)
    if (todo) {
      out.push(
        <mark key={key} className="v2-legal-todo">
          <b>[À CONFIRMER]</b> {todo[1]}
        </mark>,
      )
    } else if (part.startsWith('**')) {
      out.push(
        <strong key={key}>
          <LegalText text={part.slice(2, -2)} />
        </strong>,
      )
    } else if (part === 'brice@sablia.io') {
      out.push(
        <a key={key} href="mailto:brice@sablia.io">
          {part}
        </a>,
      )
    } else {
      out.push(part)
    }
  })
  return <>{out}</>
}
