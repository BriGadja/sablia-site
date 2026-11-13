import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { PANEL_ID } from '../top'
import { Mensuel } from './index'

/**
 * `#mensuel`, the monthly offer on the home (US-104, plan sablia-site-structure-offre E4, copy deck B2
 * `home.mensuel.*`): it names the offer, says it in three lines and opens its page. The price lives on
 * the offer page only: no amount here, not even the words that would announce one. It is the night
 * panel that slides over the sticky hero (E3), so it must cover it: relative, above, opaque.
 */
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const html = renderToString(<Mensuel />).replace(/&#x27;/g, "'")
const text = html.replace(/<[^>]+>/g, ' ')
const css = readFileSync(join(__dirname, 'mensuel.css'), 'utf8')

const LINES = [
  "Un outil de plus en service chaque mois, en commençant par l'étape qui coince.",
  "Votre équipe s'en sert : rien de technique à apprendre.",
  'Tout est installé dans vos comptes, et vos données restent chez vous.',
]

describe('#mensuel static HTML', () => {
  it('is the #mensuel section, its scope class, its measure zone and the dark-band focus class', () => {
    expect(html).toMatch(/<section[^>]*id="mensuel"/)
    expect(html).toContain('v2-home-mensuel')
    expect(html).toContain('data-zone="mensuel"')
    expect(html).toMatch(/class="[^"]*\bpanel\b/)
  })

  it('is the panel the hero recedes under', () => {
    expect(html).toContain(`id="${PANEL_ID}"`)
  })

  it('names the offer, its title as an h2 (never an h1), and the three lines in order', () => {
    expect(html).toContain('Responsable IA externalisé')
    expect(html).toMatch(/<h2[^>]*>Votre responsable IA, sans le recruter\.<\/h2>/)
    expect(html).not.toMatch(/<h1/)
    const at = LINES.map((l) => html.indexOf(l))
    expect(at.every((i) => i > 0)).toBe(true)
    expect([...at].sort((a, b) => a - b)).toEqual(at)
  })

  it('has one link, to the offer page, plain and internal', () => {
    const links = html.match(/<a [^>]*href="[^"]*"/g) ?? []
    expect(links).toHaveLength(1)
    expect(html).toMatch(/<a [^>]*href="\/responsable-ia-externalise"[^>]*>Voir l'offre mensuelle/)
    expect(html).not.toMatch(/utm_|https?:\/\//)
  })

  it('no amount, no price word, none of the retired words, no hours framing, no em dash', () => {
    expect(text).not.toMatch(/\d[\d\s\u00a0.,]*\s?(€|euros?)/i)
    expect(text).not.toMatch(/\bprix\b|tarif|audit|référent|temps partagé/i)
    expect(text).not.toMatch(/\bheures?\b|\d\s?h\b|jours? de travail/i)
    expect(text).not.toContain('—')
  })
})

describe('#mensuel motion and CSS contract', () => {
  it('shows its final state under reduced motion', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    const { container } = render(<Mensuel />)
    expect(container.querySelector('#mensuel')?.getAttribute('data-reveal')).toBe('final')
  })

  it('opens with the layer order, and covers the sticky hero: relative, above it, opaque night', () => {
    expect(css.split('\n')[0]).toBe('@layer theme, base, components, utilities;')
    const root = css.match(/\.v2-home-mensuel \{([^}]*)/)?.[1] ?? ''
    expect(root).toMatch(/position:\s*relative/)
    expect(root).toMatch(/z-index:\s*1\b/)
    expect(root).toMatch(/background:\s*#161b29/i)
  })

  it('stages its rows only in the armed state, with a reduced-motion block, hex colours only', () => {
    expect(css).toMatch(/\[data-reveal='armed'\]/)
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
    expect(css).not.toMatch(/var\(--color-/)
  })
})
