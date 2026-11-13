import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { homeMetadata } from './home-metadata'

describe('home page', () => {
  it('canonical resolves to the bare origin and the page is indexable', () => {
    expect(homeMetadata.alternates?.canonical).toBe('/')
    expect(homeMetadata.robots).toEqual({ index: true, follow: true })
    expect(String(homeMetadata.metadataBase)).toBe('https://sablia.io/')
  })

  // The 7-word rule is for section titles; the meta title is the copy deck's `home.meta.title` (US-104),
  // pinned with its description in home-metadata.test.ts.
  it('title is the deck title (what Sablia does, for whom, where), without an em dash', () => {
    const title = (homeMetadata.title as { absolute: string }).absolute
    expect(title).toBe("Outils d'IA et formation pour les PME, à Rouen · Sablia")
    expect(title).not.toContain('—')
  })

  // Home order of plan sablia-site-structure-offre (E1, US-104); the rendered ids are pinned in
  // src/components/home/HomePage.test.tsx.
  it('mounts the eleven bands in order inside main#contenu, the monthly offer right after the hero', () => {
    const src = readFileSync('src/components/home/HomePage.tsx', 'utf8')
    const body = src.slice(src.indexOf('<main'))
    const order = [
      '<Top',
      '<Mensuel',
      '<Automatisations',
      '<Offre',
      '<Formations',
      '<Conferences',
      '<Videos',
      '<Derriere',
      '<WebinaireBand',
      '<Faq',
      '<FinBand',
    ]
    const idx = order.map((t) => body.indexOf(t))
    expect(idx.every((i) => i > 0)).toBe(true)
    expect([...idx].sort((a, b) => a - b)).toEqual(idx)
    expect(body).toContain('id="contenu" tabIndex={-1}')
  })

  it('no longer imports the bands that left the home (scene: CRM offer page; construit: /realisations; apres: replaced by mensuel)', () => {
    const src = readFileSync('src/components/home/HomePage.tsx', 'utf8')
    expect(src).not.toMatch(/scene|construit|apres/i)
  })
})
