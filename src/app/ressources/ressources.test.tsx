import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Ressource } from '@/lib/contenu'

const loadList = vi.fn()
const loadRessource = vi.fn()
vi.mock('@/components/ressources/data', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/components/ressources/data')>()),
  loadList: (...a: unknown[]) => loadList(...a),
  loadRessource: (...a: unknown[]) => loadRessource(...a),
}))
vi.mock('@/components/ressources/poster', () => ({
  posterPath: (id: string | null) => (id ? `/_posters/${id}.webp` : null),
}))
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))

import RessourcePage, { dynamicParams, generateMetadata } from './[slug]/page'
import RessourcesPage from './page'

const ROW: Ressource = {
  slug: 'pipedrive-nouveau-lead',
  titre: "Brancher Pipedrive à n'importe quelle appli",
  resume: 'Le workflow n8n de la vidéo.',
  youtube_id: 'd5fo00AFqVM',
  published_at: '2026-10-01T12:17:28Z',
  corps_md: "## Ce que vous recevez\n\nLe workflow, le schéma et le mode d'emploi.",
  fichiers: [
    { nom: 'workflow.json', path: 'secret/path/workflow.json', taille_octets: 10, type: 'json' },
  ],
}

beforeEach(() => {
  loadList.mockReset()
  loadRessource.mockReset()
})

describe('/ressources: three states', () => {
  it('lists the resources, each with its click-to-play video and a link', async () => {
    loadList.mockResolvedValue([ROW])
    const { container } = render(await RessourcesPage())
    expect(container.querySelector('h1')?.textContent).toBeTruthy()
    expect(container.querySelector('button[aria-label^="Lire la vidéo"]')).not.toBeNull()
    expect(container.querySelector('a[href="/ressources/pipedrive-nouveau-lead"]')).not.toBeNull()
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/_posters/d5fo00AFqVM.webp')
    expect(container.innerHTML).not.toContain('ytimg')
    expect(container.querySelectorAll('iframe')).toHaveLength(0)
  })

  it('says the first resources arrive with the first video when nothing is published', async () => {
    loadList.mockResolvedValue([])
    const { container } = render(await RessourcesPage())
    expect(container.querySelector('[data-state="empty"]')?.textContent).toContain(
      'Les premières ressources arrivent avec la première vidéo',
    )
  })

  it('says the library is unavailable when Supabase could not be read', async () => {
    loadList.mockResolvedValue(null)
    const { container } = render(await RessourcesPage())
    expect(container.querySelector('[data-state="unavailable"]')).not.toBeNull()
  })

  it('keeps a text-only card, still linked, without a video', async () => {
    loadList.mockResolvedValue([{ ...ROW, youtube_id: null }])
    const { container } = render(await RessourcesPage())
    expect(container.querySelector('button[aria-label^="Lire la vidéo"]')).toBeNull()
    expect(container.querySelector('a[href="/ressources/pipedrive-nouveau-lead"]')).not.toBeNull()
  })
})

describe('/ressources/[slug]', () => {
  const props = (slug: string) => ({ params: Promise.resolve({ slug }) })

  it('is closed to unlisted slugs: a real 404 until the next build', () => {
    expect(dynamicParams).toBe(false)
  })

  it('puts the video FIRST, then the body, then the form; one h1; main[data-ready=true]', async () => {
    loadRessource.mockResolvedValue(ROW)
    const { container } = render(await RessourcePage(props(ROW.slug)))
    const main = container.querySelector('main[data-ready="true"]')
    expect(main).not.toBeNull()
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(container.querySelector('h1')?.textContent).toBe(ROW.titre)
    const video = container.querySelector('button[aria-label^="Lire la vidéo"]') as Element
    const body = container.querySelector('.v2-ressources-body') as Element
    const form = container.querySelector('form[data-form="ressource"]') as Element
    expect(video && body && form).toBeTruthy()
    const precedes = (a: Element, b: Element) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
    expect(precedes(video, body)).toBe(true)
    expect(precedes(body, form)).toBe(true)
    expect(container.querySelector('input[name="prenom"]')).not.toBeNull()
    expect(container.querySelector('input[name="email"]')).not.toBeNull()
  })

  it('mounts no iframe and leaks no file URL in the static HTML', async () => {
    loadRessource.mockResolvedValue(ROW)
    const { container } = render(await RessourcePage(props(ROW.slug)))
    expect(container.querySelectorAll('iframe')).toHaveLength(0)
    expect(container.innerHTML).not.toContain('contenu-ressources')
    expect(container.innerHTML).not.toContain('secret/path')
    expect(container.innerHTML).not.toContain('ytimg')
  })

  it('emits a VideoObject (own-hosted thumbnail) and a breadcrumb', async () => {
    loadRessource.mockResolvedValue(ROW)
    const { container } = render(await RessourcePage(props(ROW.slug)))
    const ld = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map(
      (s) => JSON.parse(s.textContent ?? '{}'),
    )
    const video = ld.find((d) => d['@type'] === 'VideoObject')
    expect(video.thumbnailUrl).toBe('https://sablia.io/_posters/d5fo00AFqVM.webp')
    expect(video.uploadDate).toBe('2026-10-01')
    expect(ld.some((d) => d['@type'] === 'BreadcrumbList')).toBe(true)
  })

  it('renders no video block and no VideoObject for a resource without a video', async () => {
    loadRessource.mockResolvedValue({ ...ROW, youtube_id: null })
    const { container } = render(await RessourcePage(props(ROW.slug)))
    expect(container.querySelector('button[aria-label^="Lire la vidéo"]')).toBeNull()
    expect(container.innerHTML).not.toContain('VideoObject')
  })

  it('answers 404 for a slug that is not published', async () => {
    loadRessource.mockResolvedValue(undefined)
    await expect(RessourcePage(props('nope'))).rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('titles the page « {titre} — Sablia » with its own canonical and the résumé as description', async () => {
    loadRessource.mockResolvedValue(ROW)
    const meta = await generateMetadata(props(ROW.slug))
    expect(meta.title).toEqual({ absolute: `${ROW.titre} — Sablia` })
    expect(meta.alternates?.canonical).toBe(`/ressources/${ROW.slug}`)
    expect(meta.description).toBe(ROW.resume)
  })
})
