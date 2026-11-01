import { describe, expect, it } from 'vitest'
import { NAV_LINKS, navLinksFor } from './nav-links'

/** US-92: the menu speaks of the training (plan site-formation-lot1, Data contract « Nav »). */
describe('NAV_LINKS', () => {
  it('lists Formation, Webinaires, Après la formation, Réalisations in that order', () => {
    expect(NAV_LINKS.map((l) => [l.label, l.href, l.match])).toEqual([
      ['Formation', '/formations', '/formations'],
      ['Webinaires', '/webinaire', '/webinaire'],
      ['Après la formation', '/accompagnement', '/accompagnement'],
      ['Réalisations', '/realisations', '/realisations'],
    ])
  })

  it('has no link left on a home hash anchor', () => {
    for (const l of NAV_LINKS) expect(l.href).not.toContain('#')
  })
})

/** R1 M1: `/webinaire` is the one session page (frozen); once the session started it sells a past date. */
describe('navLinksFor', () => {
  it('keeps the whole menu while the session is upcoming', () => {
    expect(navLinksFor(true)).toEqual(NAV_LINKS)
  })

  it('drops « Webinaires » from the session start, the other links in order', () => {
    expect(navLinksFor(false).map((l) => l.href)).toEqual([
      '/formations',
      '/accompagnement',
      '/realisations',
    ])
  })
})
