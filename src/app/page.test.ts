import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { homeMetadata } from './home-metadata'

describe('home page', () => {
  it('canonical resolves to the bare origin and the page is indexable', () => {
    expect(homeMetadata.alternates?.canonical).toBe('/')
    expect(homeMetadata.robots).toEqual({ index: true, follow: true })
    expect(String(homeMetadata.metadataBase)).toBe('https://sablia.io/')
  })

  it('title is at most 7 words', () => {
    const title = (homeMetadata.title as { absolute: string }).absolute
    expect(title.split(/\s+/).length).toBeLessThanOrEqual(7)
  })

  it('mounts the nine bands in order inside main#contenu', () => {
    const src = readFileSync('src/components/home/HomePage.tsx', 'utf8')
    const body = src.slice(src.indexOf('<main'))
    const order = [
      '<Top',
      '<Scene',
      '<Automatisations',
      '<Construit',
      '<Formations',
      '<Derriere',
      '<Videos',
      '<Faq',
      '<FinBand',
    ]
    const idx = order.map((t) => body.indexOf(t))
    expect(idx.every((i) => i > 0)).toBe(true)
    expect([...idx].sort((a, b) => a - b)).toEqual(idx)
    expect(body).toContain('id="contenu" tabIndex={-1}')
  })
})
