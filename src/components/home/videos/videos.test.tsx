import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { RessourceSummary } from '@/lib/contenu'
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

const row = (youtube_id: string, slug: string): RessourceSummary => ({
  slug,
  titre: slug,
  resume: null,
  youtube_id,
  published_at: null,
})

describe('content', () => {
  it('lists the four mockup videos in order, the OF-1 demo first', () => {
    expect(TILES.map((t) => t.youtubeId)).toEqual([
      'd5fo00AFqVM',
      'Op67YSG7T84',
      'V2VLG4alRxI',
      'wbQ6yCKLy3I',
    ])
  })

  it('links a tile to our page when it has a resource row, else to YouTube', () => {
    const tiles = resolveTiles([row('Op67YSG7T84', 'pipedrive-n8n')])
    expect(tiles[1]).toMatchObject({ href: '/ressources/pipedrive-n8n', external: false })
    expect(tiles[0]).toMatchObject({ href: 'https://youtu.be/d5fo00AFqVM', external: true })
  })

  it('treats an empty or null list as "no row" for every tile', () => {
    expect(resolveTiles([]).every((t) => t.external)).toBe(true)
    expect(resolveTiles(null).every((t) => t.external)).toBe(true)
  })
})

describe('VideosView', () => {
  const tiles = resolveTiles([row('V2VLG4alRxI', 'skill-devis')])

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
    expect(tiles.every((t) => t.external)).toBe(true)
  })
})
