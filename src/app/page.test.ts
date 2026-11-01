import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { homeMetadata } from './home-metadata'

describe('home page', () => {
  it('canonical resolves to the bare origin and the page is indexable', () => {
    expect(homeMetadata.alternates?.canonical).toBe('/')
    expect(homeMetadata.robots).toEqual({ index: true, follow: true })
    expect(String(homeMetadata.metadataBase)).toBe('https://sablia.io/')
  })

  // The 7-word rule is for section titles; the meta title is the 01b string (U13a, 11 tokens by design),
  // pinned with its description in home-metadata.test.ts.
  it('title is the 01b training title, without an em dash', () => {
    const title = (homeMetadata.title as { absolute: string }).absolute
    expect(title).toBe("Formation à l'IA pour votre équipe, sur ses dossiers · Sablia")
    expect(title).not.toContain('—')
  })

  // Data contract « Home order » (plan site-formation-lot1); the rendered ids are pinned in
  // src/components/home/HomePage.test.tsx.
  it('mounts the ten training bands in order inside main#contenu', () => {
    const src = readFileSync('src/components/home/HomePage.tsx', 'utf8')
    const body = src.slice(src.indexOf('<main'))
    const order = [
      '<Top',
      '<Offre',
      '<Automatisations',
      '<Formations',
      '<Derriere',
      '<WebinaireBand',
      '<Apres',
      '<Videos',
      '<Faq',
      '<FinBand',
    ]
    const idx = order.map((t) => body.indexOf(t))
    expect(idx.every((i) => i > 0)).toBe(true)
    expect([...idx].sort((a, b) => a - b)).toEqual(idx)
    expect(body).toContain('id="contenu" tabIndex={-1}')
  })

  it('no longer imports the bands that left the home (scene: CRM offer page; construit: /realisations)', () => {
    const src = readFileSync('src/components/home/HomePage.tsx', 'utf8')
    expect(src).not.toMatch(/scene|construit/i)
  })
})
