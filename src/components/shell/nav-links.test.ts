import { describe, expect, it } from 'vitest'
import * as NAV from './nav-links'
import { NAV_CTA, NAV_LINKS } from './nav-links'

/**
 * US-103 (plan sablia-site-structure-offre, Phase D): the menu ranges the site by intent, the monthly
 * offer first. The same four links at any date: the webinar is reached from the header button.
 */
describe('NAV_LINKS', () => {
  it('lists Responsable IA externalisé, Formations, Conférences, Réalisations in that order', () => {
    expect(NAV_LINKS.map((l) => [l.label, l.href, l.match])).toEqual([
      ['Responsable IA externalisé', '/responsable-ia-externalise', '/responsable-ia-externalise'],
      ['Formations', '/formations', '/formations'],
      ['Conférences', '/conferences', '/conferences'],
      ['Réalisations', '/realisations', '/realisations'],
    ])
  })

  it('has no link left on a home hash anchor', () => {
    for (const l of NAV_LINKS) expect(l.href).not.toContain('#')
  })

  it('has no entry that depends on the session clock, and no filter for one', () => {
    for (const l of NAV_LINKS) expect('untilSession' in l, l.label).toBe(false)
    expect('navLinksFor' in NAV).toBe(false)
  })

  it('keeps the header button label of the webinar', () => {
    expect(NAV_CTA).toBe('Prochain webinaire')
  })
})
