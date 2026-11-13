import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { Conferences } from './index'

/**
 * `#conferences`, the talks on the home (US-104, plan sablia-site-structure-offre E6, copy deck B2
 * `home.conf.*`): a heading, one line and the door to `/conferences`. Talks are sold on request, the
 * price in the quote: no amount here, nor the words that would announce one.
 */
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const html = renderToString(<Conferences />).replace(/&#x27;/g, "'")
const text = html.replace(/<[^>]+>/g, ' ')
const css = readFileSync(join(__dirname, 'conferences.css'), 'utf8')

describe('#conferences static HTML', () => {
  it('is the #conferences section, its scope class and its measure zone', () => {
    expect(html).toMatch(/<section[^>]*id="conferences"/)
    expect(html).toContain('v2-home-conferences')
    expect(html).toContain('data-zone="conferences"')
  })

  it('eyebrow, the h2 (never an h1) and the line of the deck', () => {
    expect(html).toContain('>Conférences<')
    expect(html).toMatch(/<h2[^>]*>Conférences et séminaires, sur demande\.<\/h2>/)
    expect(html).not.toMatch(/<h1/)
    expect(text).toContain('Une conférence ou une matinée de séminaire, devant toute votre équipe.')
  })

  it('has one link, to the conferences page, plain and internal', () => {
    const links = html.match(/<a [^>]*href="[^"]*"/g) ?? []
    expect(links).toHaveLength(1)
    expect(html).toMatch(/<a [^>]*href="\/conferences"[^>]*>Voir les sujets/)
    expect(html).not.toMatch(/utm_|https?:\/\//)
  })

  // Deck correction after READY: each topic of `/conferences` shows its own duration, so the band
  // states none (VP2 question T5).
  it('no amount, no duration, no price word, none of the retired words, no em dash', () => {
    expect(text).not.toMatch(/\d[\d\s\u00a0.,]*\s?(€|euros?)/i)
    expect(text).not.toMatch(/\d\s?h\b|\bheures?\b|minutes/i)
    expect(text).not.toMatch(/\bprix\b|tarif|audit|référent|temps partagé/i)
    expect(text).not.toContain('—')
  })
})

describe('#conferences motion and CSS contract', () => {
  it('shows its final state under reduced motion', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    const { container } = render(<Conferences />)
    expect(container.querySelector('#conferences')?.getAttribute('data-reveal')).toBe('final')
  })

  it('opens with the layer order, and sits above the sticky hero on an opaque ground', () => {
    expect(css.split('\n')[0]).toBe('@layer theme, base, components, utilities;')
    const root = css.match(/\.v2-home-conferences \{([^}]*)/)?.[1] ?? ''
    expect(root).toMatch(/position:\s*relative/)
    expect(root).toMatch(/z-index:\s*1\b/)
    expect(root).toMatch(/background:\s*#[0-9a-f]{6}\b/i)
  })

  it('stages its content only in the armed state, with a reduced-motion block, hex colours only', () => {
    expect(css).toMatch(/\[data-reveal='armed'\]/)
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
    expect(css).not.toMatch(/var\(--color-/)
  })
})
