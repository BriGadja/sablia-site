import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Lettre } from '@/components/lettre/data'

const loadLettre = vi.fn()
const loadLettreParams = vi.fn()
vi.mock('@/components/lettre/data', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/components/lettre/data')>()),
  loadLettre: (...a: unknown[]) => loadLettre(...a),
  loadLettreParams: (...a: unknown[]) => loadLettreParams(...a),
}))
vi.mock('@/components/ressources/poster', () => ({
  posterPath: (id: string | null) => (id ? `/_posters/${id}.webp` : null),
}))
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))

import { LETTRE as COPY } from '@/components/lettre/content'
import LettrePage, { dynamicParams, generateMetadata, generateStaticParams } from './[slug]/page'

/**
 * `/lettre/<slug>` (US-101): one issue of the Tuesday letter as a page. Pattern of
 * `ressources.test.tsx`: the data module, the poster lookup and `notFound` are mocked.
 */
const ROW: Lettre = {
  slug: '2026-11-17-relancer-un-devis',
  titre: 'Relancer un devis sans y penser',
  resume: 'Une relance automatique aide, à condition de savoir quoi lui confier.',
  corps_md:
    'Bonjour,\n\n## Pourquoi cette vidéo\n\nLa même question revient.\nEt elle revient encore.\n\n- un\n- deux\n\nVoir [la page](https://sablia.io/ressources).\n\nBrice',
  youtube_id: null,
  // 23:30 UTC on the 16th is already the 17th in Paris: the visible date must say the 17th.
  published_at: '2026-11-16T23:30:00+00:00',
  updated_at: '2026-11-16T23:30:00+00:00',
}
const WITH_VIDEO: Lettre = { ...ROW, youtube_id: 'abc123def45' }

beforeEach(() => {
  delete process.env.VITE_SUPABASE_ANON_KEY
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  loadLettre.mockReset()
  loadLettreParams.mockReset()
})

const props = (slug: string) => ({ params: Promise.resolve({ slug }) })
const ld = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map((s) =>
    JSON.parse(s.textContent ?? '{}'),
  )
const precedes = (a: Element, b: Element) =>
  Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)

describe('/lettre/[slug]: the static params', () => {
  it('is closed to unlisted slugs: a real 404 until the next build', () => {
    expect(dynamicParams).toBe(false)
  })

  it('takes its params from the one data module (placeholder included)', async () => {
    loadLettreParams.mockResolvedValue([{ slug: '__none' }])
    expect(await generateStaticParams()).toEqual([{ slug: '__none' }])
  })
})

describe('/lettre/[slug]: the page', () => {
  it('is main#contenu[data-ready=true].v2-lettre with exactly one h1, the title', async () => {
    loadLettre.mockResolvedValue(ROW)
    const { container } = render(await LettrePage(props(ROW.slug)))
    const main = container.querySelector('main#contenu[data-ready="true"]')
    expect(main?.classList.contains('v2-lettre')).toBe(true)
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(container.querySelector('h1')?.textContent).toBe(ROW.titre)
  })

  it('shows the eyebrow, the résumé as a visible lede and a byline linking to the trainer section', async () => {
    loadLettre.mockResolvedValue(ROW)
    const { container } = render(await LettrePage(props(ROW.slug)))
    expect(container.textContent).toContain(COPY.eyebrow)
    expect(container.querySelector('.lt-lede')?.textContent).toBe(ROW.resume)
    const byline = container.querySelector('a[href="/#derriere"]')
    expect(byline?.textContent).toBe('Brice Gachadoat')
  })

  it('shows the Paris day of the send, the same instant as datePublished', async () => {
    loadLettre.mockResolvedValue(ROW)
    const { container } = render(await LettrePage(props(ROW.slug)))
    const time = container.querySelector('time') as HTMLTimeElement
    expect(time.textContent).toBe('17 novembre 2026')
    expect(time.getAttribute('datetime')).toBe(ROW.published_at)
    const article = ld(container).find((d) => d['@type'] === 'Article')
    expect(article.datePublished).toBe(time.getAttribute('datetime'))
  })

  it('renders the body from Markdown: sections, list, link, the line break kept', async () => {
    loadLettre.mockResolvedValue(ROW)
    const { container } = render(await LettrePage(props(ROW.slug)))
    const body = container.querySelector('[data-body="lettre"]') as Element
    expect(body.querySelector('h2')?.textContent).toBe('Pourquoi cette vidéo')
    expect(body.querySelectorAll('li')).toHaveLength(2)
    expect(body.querySelector('a[href="https://sablia.io/ressources"]')).not.toBeNull()
    expect(body.innerHTML).toContain('La même question revient.\nEt elle revient encore.')
  })

  it('emits Article and BreadcrumbList (Newsletter, then the issue), never a VideoObject', async () => {
    loadLettre.mockResolvedValue(WITH_VIDEO)
    const { container } = render(await LettrePage(props(ROW.slug)))
    const data = ld(container)
    expect(data.map((d) => d['@type']).sort()).toEqual(['Article', 'BreadcrumbList'])
    const crumbs = data.find((d) => d['@type'] === 'BreadcrumbList').itemListElement
    expect(crumbs.map((c: { name: string }) => c.name)).toEqual([
      'Accueil',
      'Newsletter',
      ROW.titre,
    ])
    expect(crumbs[1].item).toBe('https://sablia.io/newsletter')
    expect(crumbs[2].item).toBe(`https://sablia.io/lettre/${ROW.slug}`)
    expect(container.innerHTML).not.toContain('VideoObject')
    const article = data.find((d) => d['@type'] === 'Article')
    expect(article.image).toBe('https://sablia.io/_posters/abc123def45.webp')
  })

  it('puts the video behind its click-to-play facade BEFORE the body; no iframe, no YouTube host', async () => {
    loadLettre.mockResolvedValue(WITH_VIDEO)
    const { container } = render(await LettrePage(props(ROW.slug)))
    const video = container.querySelector('button[aria-label^="Lire la vidéo"]') as Element
    const body = container.querySelector('[data-body="lettre"]') as Element
    expect(video && body).toBeTruthy()
    expect(precedes(video, body)).toBe(true)
    expect(container.querySelectorAll('iframe')).toHaveLength(0)
    expect(container.innerHTML).not.toContain('ytimg')
  })

  it('renders no video block without a video', async () => {
    loadLettre.mockResolvedValue(ROW)
    const { container } = render(await LettrePage(props(ROW.slug)))
    expect(container.querySelector('button[aria-label^="Lire la vidéo"]')).toBeNull()
    expect(ld(container).find((d) => d['@type'] === 'Article')).not.toHaveProperty('image')
  })

  it('closes on the subscription block (one sentence, a link to /newsletter), and has no final band', async () => {
    loadLettre.mockResolvedValue(ROW)
    const { container } = render(await LettrePage(props(ROW.slug)))
    const block = container.querySelector('section#abonnement') as Element
    expect(block.textContent).toContain(COPY.abonnement.text)
    const cta = block.querySelector('a[href="/newsletter"]')
    expect(cta?.textContent).toContain(COPY.abonnement.label)
    expect(precedes(container.querySelector('[data-body="lettre"]') as Element, block)).toBe(true)
    expect(container.querySelector('#fin')).toBeNull()
  })

  it('never lets « : » start a line: a no-break space before it in the title and the lede', async () => {
    loadLettre.mockResolvedValue({
      ...ROW,
      titre: 'Relancer : la méthode',
      resume: 'Deux mots : voilà.',
    })
    const { container } = render(await LettrePage(props(ROW.slug)))
    expect(container.querySelector('h1')?.textContent).toBe('Relancer\u00a0: la méthode')
    expect(container.querySelector('.lt-lede')?.textContent).toBe('Deux mots\u00a0: voilà.')
  })

  it('carries its whole text in the server HTML, nothing hidden', async () => {
    loadLettre.mockResolvedValue(ROW)
    const html = renderToString(await LettrePage(props(ROW.slug)))
    expect(html).toContain(ROW.titre)
    expect(html).toContain('Pourquoi cette vidéo')
    expect(html).not.toMatch(/opacity:\s*0/)
  })

  it('answers 404 for an unknown slug and for the placeholder', async () => {
    loadLettre.mockResolvedValue(undefined)
    await expect(LettrePage(props('2026-11-10-inconnu'))).rejects.toThrow('NEXT_NOT_FOUND')
    await expect(LettrePage(props('__none'))).rejects.toThrow('NEXT_NOT_FOUND')
  })
})

describe('/lettre/[slug]: metadata', () => {
  it('titles the page « {titre} — Sablia » with its own canonical and the résumé as description', async () => {
    loadLettre.mockResolvedValue(ROW)
    const meta = await generateMetadata(props(ROW.slug))
    expect(meta.title).toEqual({ absolute: `${ROW.titre} — Sablia` })
    expect(meta.alternates?.canonical).toBe(`/lettre/${ROW.slug}`)
    expect(meta.description).toBe(ROW.resume)
  })
})
