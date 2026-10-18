import { fireEvent, render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchRessource, type Ressource as RessourceRow } from '@/lib/contenu'
import Ressource from './Ressource'

/**
 * US-67 (CNIL): the video of a resource must not load YouTube before a click. Until 2026-10-18 the
 * page mounted a raw youtube-nocookie iframe on load; it now sits behind the same facade as the
 * list and the home.
 */
vi.mock('@/lib/contenu', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/contenu')>()),
  fetchRessource: vi.fn(),
}))

const ROW: RessourceRow = {
  slug: 'pipedrive-nouveau-lead',
  titre: "Brancher Pipedrive à n'importe quelle appli",
  resume: 'Le workflow n8n de la vidéo.',
  corps_md: null,
  youtube_id: 'd5fo00AFqVM',
  published_at: '2026-10-01T12:17:28Z',
  fichiers: [],
} as unknown as RessourceRow

async function renderPage(row: RessourceRow) {
  vi.mocked(fetchRessource).mockResolvedValue(row)
  const view = render(
    <HelmetProvider>
      <Ressource slug={row.slug} />
    </HelmetProvider>,
  )
  await screen.findByRole('heading', { level: 1, name: row.titre })
  return view
}

afterEach(() => {
  vi.mocked(fetchRessource).mockReset()
})

describe('Ressource: the video loads YouTube only after a click', () => {
  it('mounts no iframe and shows the play button before the click', async () => {
    const { container } = await renderPage(ROW)
    expect(container.querySelectorAll('iframe')).toHaveLength(0)
    expect(screen.getByRole('button', { name: `Lire la vidéo : ${ROW.titre}` })).toBeTruthy()
  })

  it('mounts the privacy-enhanced player for that video after the click', async () => {
    const { container } = await renderPage(ROW)
    fireEvent.click(screen.getByRole('button', { name: /Lire la vidéo/ }))
    const frames = container.querySelectorAll('iframe')
    expect(frames).toHaveLength(1)
    expect(
      frames[0]
        .getAttribute('src')
        ?.startsWith('https://www.youtube-nocookie.com/embed/d5fo00AFqVM'),
    ).toBe(true)
  })

  it('shows no player and no play button for a resource without a video', async () => {
    const { container } = await renderPage({ ...ROW, youtube_id: null })
    expect(container.querySelectorAll('iframe')).toHaveLength(0)
    expect(screen.queryByRole('button', { name: /Lire la vidéo/ })).toBeNull()
  })
})
