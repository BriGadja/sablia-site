import { describe, expect, it } from 'vitest'
import { FOUNDER } from '@/components/seo/OrganizationJsonLd'
import { pageMetadata } from '@/lib/seo'
import { articleSchema } from './article-schema'
import type { Lettre } from './data'

const LETTRE: Lettre = {
  slug: '2026-11-17-relancer-un-devis',
  titre: 'Relancer un devis sans y penser',
  resume: "Ce que l'outil ne fait pas.",
  corps_md: '## Pourquoi\n\nTexte.',
  youtube_id: 'abc123def45',
  published_at: '2026-11-17T07:31:12+00:00',
  updated_at: '2026-11-17T07:31:12+00:00',
}

describe('articleSchema: the Article data of an issue page (US-101)', () => {
  it('describes the issue: headline, description, language, author Brice, publisher the organisation, its own page', () => {
    const data = articleSchema(LETTRE, null)
    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: LETTRE.titre,
      description: LETTRE.resume,
      inLanguage: 'fr-FR',
      datePublished: LETTRE.published_at,
      author: FOUNDER,
      publisher: { '@id': 'https://sablia.io/#organization' },
      mainEntityOfPage: 'https://sablia.io/lettre/2026-11-17-relancer-un-devis',
    })
  })

  it('dateModified = published_at while updated_at stays within the hour (no real edit)', () => {
    const data = articleSchema({ ...LETTRE, updated_at: '2026-11-17T08:20:00+00:00' }, null)
    expect(data.dateModified).toBe(LETTRE.published_at)
  })

  it('dateModified = updated_at when the text changed two hours later', () => {
    const data = articleSchema({ ...LETTRE, updated_at: '2026-11-17T09:31:12+00:00' }, null)
    expect(data.dateModified).toBe('2026-11-17T09:31:12+00:00')
  })

  it('falls back to published_at on an updated_at that cannot be read or comes before the send', () => {
    expect(articleSchema({ ...LETTRE, updated_at: 'pas une date' }, null).dateModified).toBe(
      LETTRE.published_at,
    )
    expect(
      articleSchema({ ...LETTRE, updated_at: '2026-11-16T07:00:00+00:00' }, null).dateModified,
    ).toBe(LETTRE.published_at)
  })

  it('carries an image as an absolute URL: the own-hosted poster, else the default social image of every page', () => {
    expect(articleSchema(LETTRE, '/_posters/abc123def45.webp').image).toBe(
      'https://sablia.io/_posters/abc123def45.webp',
    )
    expect(articleSchema({ ...LETTRE, youtube_id: null }, null).image).toBe(
      'https://sablia.io/og-image.png',
    )
    // The same image the page's Open Graph tags carry (pageMetadata's default).
    const og = pageMetadata({ path: '/lettre/x', title: 't', description: 'd' }).openGraph
    expect(JSON.stringify(og)).toContain('"url":"https://sablia.io/og-image.png"')
  })

  it('never describes the video: no VideoObject, no video property', () => {
    const json = JSON.stringify(articleSchema(LETTRE, '/_posters/abc123def45.webp'))
    expect(json).not.toContain('VideoObject')
    expect(json).not.toContain('"video"')
    expect(json).not.toContain('youtube')
  })
})
