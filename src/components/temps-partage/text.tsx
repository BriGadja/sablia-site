import { Fragment, type ReactNode } from 'react'

/**
 * `text` with each of `terms` (first occurrence, in order) wrapped in a `<strong>`. The words and
 * spaces are the copy's own: nothing is added or dropped, so the static HTML reads the gated string.
 */
export function Emphasis({
  text,
  terms,
  className,
}: {
  text: string
  terms: readonly string[]
  className?: string
}) {
  const out: ReactNode[] = []
  let rest = text
  for (const term of terms) {
    const at = rest.indexOf(term)
    if (at < 0) continue
    out.push(
      <Fragment key={`t-${term}`}>{rest.slice(0, at)}</Fragment>,
      <strong key={term} className={className}>
        {term}
      </strong>,
    )
    rest = rest.slice(at + term.length)
  }
  out.push(<Fragment key="rest">{rest}</Fragment>)
  return <>{out}</>
}

/**
 * Splits a sentence after its lead: the first « . » or « : » followed by a space. The lead keeps its
 * punctuation and the rest keeps its leading space, so `lead + rest === text`.
 */
export function splitLead(text: string): [string, string] {
  const at = text.search(/[.:] /)
  return at < 0 ? [text, ''] : [text.slice(0, at + 1), text.slice(at + 1)]
}

/**
 * French typography at render time (the copy stays as gated): a figure never ends a line apart from
 * the word after it (« 48 heures », « 10 à 50 personnes »), nor does « à » apart from the next word.
 */
export function typo(text: string): string {
  return text.replace(/(\d) (?=\S)/g, '$1\u00a0').replace(/(^|\s)à (?=\S)/g, '$1à\u00a0')
}

/** The responsive set of a photo of 09/10 (`public/photos/formation-NN-{540,900,1200}.webp`). */
export function photoSrcSet(n: string): string {
  return [540, 900, 1200].map((w) => `/photos/formation-${n}-${w}.webp ${w}w`).join(', ')
}
