import { describe, expect, it } from 'vitest'
import { pageMetadata, SITE_ORIGIN } from './seo'

describe('pageMetadata', () => {
  const base = { path: '/cgv', title: 'Conditions générales de vente', description: 'Les CGV.' }

  it('sets metadataBase to the production origin on every page', () => {
    expect(pageMetadata(base).metadataBase?.href).toBe(`${SITE_ORIGIN}/`)
  })

  it('uses the title as written, with no template suffix', () => {
    expect(pageMetadata(base).title).toEqual({ absolute: base.title })
  })

  it('canonical is the path without a trailing slash; the home is the bare origin', () => {
    expect(pageMetadata(base).alternates?.canonical).toBe('/cgv')
    expect(pageMetadata({ ...base, path: '/' }).alternates?.canonical).toBe('/')
    expect(() => pageMetadata({ ...base, path: '/cgv/' })).toThrow(/trailing slash/)
    expect(() => pageMetadata({ ...base, path: 'cgv' })).toThrow(/start with/)
  })

  it('indexable by default; noindex,nofollow on request', () => {
    expect(pageMetadata(base).robots).toEqual({ index: true, follow: true })
    expect(pageMetadata({ ...base, noindex: true }).robots).toEqual({ index: false, follow: false })
  })

  it('Open Graph and Twitter carry the same title, description and an absolute image', () => {
    const m = pageMetadata(base)
    expect(m.openGraph).toMatchObject({
      type: 'website',
      siteName: 'Sablia',
      locale: 'fr_FR',
      url: '/cgv',
      title: base.title,
      description: base.description,
    })
    expect(m.twitter).toMatchObject({
      card: 'summary_large_image',
      title: base.title,
      site: '@sablia_io',
    })
    const og = m.openGraph as { images: { url: string }[] }
    expect(og.images[0].url).toBe(`${SITE_ORIGIN}/og-image.png`)
    expect((m.twitter as { images: string[] }).images[0]).toBe(`${SITE_ORIGIN}/twitter-image.png`)
  })

  it('a page image replaces both defaults', () => {
    const m = pageMetadata({
      ...base,
      image: '/og-image-home.png',
      twitterImage: '/twitter-image-home.png',
    })
    expect((m.openGraph as { images: { url: string }[] }).images[0].url).toBe(
      `${SITE_ORIGIN}/og-image-home.png`,
    )
    expect((m.twitter as { images: string[] }).images[0]).toBe(
      `${SITE_ORIGIN}/twitter-image-home.png`,
    )
  })

  it('refuses an empty title or description (a page never ships without them)', () => {
    expect(() => pageMetadata({ ...base, title: ' ' })).toThrow(/title/)
    expect(() => pageMetadata({ ...base, description: '' })).toThrow(/description/)
  })
})
