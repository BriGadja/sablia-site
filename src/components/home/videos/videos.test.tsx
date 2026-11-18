import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { RessourceSummary } from '@/lib/contenu'
import * as content from './content'
import { resolveTiles, TILES } from './content'
import { Videos, VideosView } from './index'

// Tag next/link so jsdom can tell a client-navigation anchor from a plain one.
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-next-link="" {...rest}>
      {children}
    </a>
  ),
}))

const row = (
  youtube_id: string | null,
  slug: string,
  titre = slug,
  published_at: string | null = null,
): RessourceSummary => ({ slug, titre, resume: null, youtube_id, published_at })

describe('content', () => {
  it('lists the four mockup videos in order, the OF-1 demo first', () => {
    expect(TILES.map((t) => t.youtubeId)).toEqual([
      'd5fo00AFqVM',
      'Op67YSG7T84',
      'V2VLG4alRxI',
      'wbQ6yCKLy3I',
    ])
  })

  // US-112: the band follows the resource list, so each new video reaches the home without a code
  // change (« Claude dans Excel » was missing on 18/11 because the four tiles were written by hand).
  it('shows the four newest resources with a video, newest first, each opening our own page', () => {
    const tiles = resolveTiles([
      row(
        'Op67YSG7T84',
        'pipedrive',
        "Brancher Pipedrive à n'importe quelle appli : le workflow",
        '2026-10-01T09:00:00Z',
      ),
      row(null, 'guide-sans-video', 'Un guide sans vidéo', '2026-11-20T09:00:00Z'),
      row(
        'NEWEST00001',
        'claude-dans-excel',
        'Claude dans Excel : les fichiers de la vidéo',
        '2026-11-16T15:06:57Z',
      ),
      row(
        'V2VLG4alRxI',
        'skill-devis',
        'Le skill de devis pour Claude : vos prix',
        '2026-10-10T09:00:00Z',
      ),
      row(
        'wbQ6yCKLy3I',
        'veille',
        'Créer ses routines dans Claude : le guide',
        '2026-10-20T09:00:00Z',
      ),
      row('OLDEST00001', 'oldest', 'La plus ancienne', '2026-09-01T09:00:00Z'),
    ])
    expect(tiles.map((t) => t.href)).toEqual([
      '/ressources/claude-dans-excel',
      '/ressources/veille',
      '/ressources/skill-devis',
      '/ressources/pipedrive',
    ])
    expect(tiles.every((t) => !t.external)).toBe(true)
    // The tile keeps the short name, the part of the title before « : ».
    expect(tiles[0]).toMatchObject({
      youtubeId: 'NEWEST00001',
      title: 'Claude dans Excel',
      alt: 'Miniature : Claude dans Excel',
    })
  })

  it('falls back to the four hand-picked YouTube videos when the list is empty or null', () => {
    for (const rows of [null, [], [row(null, 'guide-sans-video')]]) {
      const tiles = resolveTiles(rows)
      expect(tiles.map((t) => t.youtubeId)).toEqual(TILES.map((t) => t.youtubeId))
      expect(tiles.every((t) => t.external)).toBe(true)
    }
  })
})

describe('VideosView', () => {
  const fallback = resolveTiles(null)
  const tiles = [
    fallback[0],
    fallback[1],
    resolveTiles([row('V2VLG4alRxI', 'skill-devis')])[0],
    fallback[3],
  ]

  it('opens the whole library from its head: « Toutes les ressources » to /ressources, same tab (US-112)', () => {
    const { container } = render(<VideosView tiles={tiles} />)
    const all = container.querySelector('#videos .vd-head a[href="/ressources"]')
    expect(all?.textContent).toContain('Toutes les ressources')
    expect(all?.getAttribute('target')).toBeNull()
    expect(all?.hasAttribute('data-next-link')).toBe(true)
  })

  it('server-renders the title, the channel link and four tiles', () => {
    const { container } = render(<VideosView tiles={tiles} />)
    const section = container.querySelector('section#videos.v2-videos')
    expect(section).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Nos vidéos sur YouTube.')
    const channel = screen.getByRole('link', { name: /Voir la chaîne/ })
    expect(channel.getAttribute('href')).toBe(
      'https://www.youtube.com/channel/UCXzIrGckmJcwKSLCPXV7r1w',
    )
    expect(channel.getAttribute('rel')).toContain('noopener')
    expect(section?.querySelectorAll('a.vid').length).toBe(4)
  })

  it('opens YouTube tiles with rel and a new tab, own pages in the same tab', () => {
    const { container } = render(<VideosView tiles={tiles} />)
    const links = [...container.querySelectorAll('a.vid')]
    const yt = links[0]
    expect(yt.getAttribute('href')).toBe('https://youtu.be/d5fo00AFqVM')
    expect(yt.getAttribute('target')).toBe('_blank')
    expect(yt.getAttribute('rel')).toContain('noopener')
    const own = links[2]
    expect(own.getAttribute('href')).toBe('/ressources/skill-devis')
    expect(own.getAttribute('target')).toBeNull()
  })

  it('navigates to own pages through next/link, and leaves YouTube as a plain anchor', () => {
    const { container } = render(<VideosView tiles={tiles} />)
    const links = [...container.querySelectorAll('a.vid')]
    expect(links[2].hasAttribute('data-next-link')).toBe(true)
    expect(links[0].hasAttribute('data-next-link')).toBe(false)
  })

  it('loads no third-party image and no player before a click', () => {
    const { container } = render(<VideosView tiles={tiles} />)
    expect(container.innerHTML).not.toMatch(/ytimg|<iframe|youtube-nocookie/)
    for (const img of container.querySelectorAll('img')) {
      expect(img.getAttribute('src')).toMatch(/^\/(video-thumbs|_posters)\//)
    }
  })

  it('carries no em dash', () => {
    const { container } = render(<VideosView tiles={tiles} />)
    expect(container.textContent).not.toMatch(/—/)
  })

  // US-104 (plan sablia-site-structure-offre E7, copy deck B2 `home.videos.*`): the band also opens
  // the Réalisations door and says custom builds exist; the YouTube channel link stays on the home
  // (the analytics end-to-end clicks it).
  it('opens /realisations from its head, in the same tab, with the line « Un besoin précis ? »', () => {
    const { container } = render(<VideosView tiles={tiles} />)
    const head = container.querySelector('#videos .vd-head') as HTMLElement
    expect(head.textContent).toContain('Un besoin précis ? Je construis aussi à la demande.')
    const real = head.querySelector('a[href="/realisations"]')
    expect(real?.textContent).toContain('Voir les réalisations')
    expect(real?.getAttribute('target')).toBeNull()
    expect(real?.hasAttribute('data-next-link')).toBe(true)
    expect(head.querySelector('a[href^="https://www.youtube.com/channel/"]')).not.toBeNull()
  })

  it('its strings carry no amount (the band is outside the price guard list)', () => {
    const strings = (Object.values(content) as unknown[]).filter(
      (v): v is string => typeof v === 'string',
    )
    expect(strings).toContain('Un besoin précis ? Je construis aussi à la demande.')
    for (const s of strings) expect(s).not.toMatch(/\d[\d\s\u00a0.,]*\s?(€|euros?)/i)
  })
})

describe('Videos (server)', () => {
  it('renders an element from the live list', async () => {
    const el = await Videos({ load: async () => resolveTiles([row('wbQ6yCKLy3I', 'veille')]) })
    const { container } = render(el)
    expect(container.querySelector('a[href="/ressources/veille"]')).not.toBeNull()
  })

  it('lets a strict build fail loudly when the list is unreadable', async () => {
    const { loadTiles } = await import('./index')
    await expect(
      loadTiles({ env: { PRERENDER_STRICT: '1' }, fetchList: async () => null }),
    ).rejects.toThrow()
  })

  it('falls back to YouTube links when unreadable outside strict mode', async () => {
    const { loadTiles } = await import('./index')
    const tiles = await loadTiles({ env: {}, fetchList: async () => null })
    expect(tiles).toHaveLength(4)
    expect(tiles.every((t) => t.external)).toBe(true)
  })
})
