import { fireEvent, render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchRessources, type RessourceSummary } from '@/lib/contenu'
import Ressources from './Ressources'

/**
 * Brice, 2026-10-02: a visitor who lands on `/ressources` may never have seen the videos, so each
 * card carries its video on the left (click-to-play, on the page) and, on the right, the title,
 * the summary and a button into the resource. A resource without a video keeps a text-only card.
 */
vi.mock('@/lib/contenu', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/contenu')>()),
  fetchRessources: vi.fn(),
}))

const WITH_VIDEO: RessourceSummary = {
  slug: 'pipedrive-nouveau-lead',
  titre: "Brancher Pipedrive à n'importe quelle appli",
  resume: 'Le workflow n8n de la vidéo.',
  youtube_id: 'Op67YSG7T84',
  published_at: '2026-10-01T12:17:28Z',
}

const WITHOUT_VIDEO: RessourceSummary = {
  slug: 'schema-sans-video',
  titre: 'Un schéma sans vidéo',
  resume: null,
  youtube_id: null,
  published_at: '2026-09-30T09:00:00Z',
}

async function renderList(rows: RessourceSummary[]) {
  vi.mocked(fetchRessources).mockResolvedValue(rows)
  const view = render(
    <HelmetProvider>
      <Ressources />
    </HelmetProvider>,
  )
  await screen.findByText(rows[0].titre)
  return view
}

afterEach(() => {
  vi.mocked(fetchRessources).mockReset()
})

describe('ressources: each card carries its video', () => {
  it('shows the YouTube thumbnail behind a play button, and no player before the click', async () => {
    const { container } = await renderList([WITH_VIDEO])
    const play = screen.getByRole('button', { name: `Lire la vidéo : ${WITH_VIDEO.titre}` })
    expect(play.querySelector('img')?.getAttribute('src')).toBe(
      'https://i.ytimg.com/vi/Op67YSG7T84/sddefault.jpg',
    )
    expect(container.querySelectorAll('iframe')).toHaveLength(0)
  })

  it('plays the video on the page, in the privacy-enhanced player, on click', async () => {
    const { container } = await renderList([WITH_VIDEO])
    fireEvent.click(screen.getByRole('button', { name: /Lire la vidéo/ }))
    const frames = container.querySelectorAll('iframe')
    expect(frames).toHaveLength(1)
    expect(
      frames[0]
        .getAttribute('src')
        ?.startsWith('https://www.youtube-nocookie.com/embed/Op67YSG7T84?autoplay=1'),
    ).toBe(true)
  })

  it('opens the resource from a « Voir la ressource » button', async () => {
    await renderList([WITH_VIDEO])
    const link = screen.getByRole('link', { name: /Voir la ressource/ })
    expect(link.getAttribute('href')).toBe('/ressources/pipedrive-nouveau-lead')
    expect(link.textContent).toContain(WITH_VIDEO.titre)
  })

  it('keeps a text-only card, still linked, when the resource has no video', async () => {
    await renderList([WITHOUT_VIDEO])
    expect(screen.queryByRole('button', { name: /Lire la vidéo/ })).toBeNull()
    expect(screen.getByRole('link', { name: /Voir la ressource/ }).getAttribute('href')).toBe(
      '/ressources/schema-sans-video',
    )
  })
})
