import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { Apres } from './index'

/**
 * `#apres`, the after-the-training teaser of the home (plan site-formation-lot1 U8, copy 01b
 * « After the training »): référent IA and sur-mesure, plain internal links, never a price.
 */
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const html = renderToString(<Apres />).replace(/&#x27;/g, "'")
const text = html.replace(/<[^>]+>/g, '')

describe('#apres static HTML', () => {
  it('is the #apres section with the scoped class', () => {
    expect(html).toContain('id="apres"')
    expect(html).toContain('v2-home-apres')
  })

  it('eyebrow, h2 and the two offers of 01b', () => {
    expect(html).toContain('Après la formation')
    expect(html).toMatch(/<h2[^>]*>Et après les trois jours \?<\/h2>/)
    expect(html).toMatch(/<h3[^>]*>Un référent IA<\/h3>/)
    expect(text).toContain('Une séance de 2 h par mois, et vos questions sous 48 h.')
    expect(html).toMatch(/<h3[^>]*>Des outils sur mesure<\/h3>/)
    expect(text).toContain(
      'Claude intégré dans votre CRM, et des automatisations pour les tâches qui reviennent.',
    )
  })

  it('links to « Après la formation » and to the CRM offer, plain internal links', () => {
    expect(html).toMatch(/<a [^>]*href="\/accompagnement"[^>]*>Voir ce qui vient après/)
    expect(html).toMatch(
      /<a [^>]*href="\/offres\/compte-rendu-appel"[^>]*>Claude intégré dans votre CRM<\/a>/,
    )
    expect(html).not.toMatch(/utm_|https?:\/\//)
  })

  it('no price, no pilot seats, no scarcity, no em dash', () => {
    expect(html).not.toMatch(/\d[\d\s.,]*\s?(€|euros?)|\bprix\b|tarif/i)
    expect(html).not.toMatch(/places?|dernières?|plus que/i)
    expect(html).not.toContain('—')
  })
})

describe('#apres motion', () => {
  it('keeps the cards visible under reduced motion', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    const { container } = render(<Apres />)
    expect(container.querySelector('#apres')?.getAttribute('data-reveal')).toBe('final')
  })

  it('stages the cards in CSS only for the armed state, with a reduced-motion block', () => {
    const css = readFileSync(join(__dirname, 'apres.css'), 'utf8')
    expect(css).toMatch(/\[data-reveal='armed'\]/)
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
  })
})
