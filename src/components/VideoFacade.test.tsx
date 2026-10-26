import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { track } from '@/lib/analytics'
import { clearConsent, writeConsent } from '@/lib/consent'
import VideoFacade from './VideoFacade'

vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

const THUMB = { src: '/photos/x.webp', width: 640, height: 480 }
const mount = () => render(<VideoFacade youtubeId="abc123" title="La démo" thumbnail={THUMB} />)

beforeEach(() => {
  vi.mocked(track).mockReset()
  clearConsent()
  document.head.replaceChildren()
})

describe('VideoFacade reports plays (US-65, consent only)', () => {
  it('mounts nothing of YouTube before the click, and reports nothing', () => {
    const { container } = mount()
    expect(container.querySelectorAll('iframe')).toHaveLength(0)
    expect(track).not.toHaveBeenCalled()
  })

  it('without consent: the click plays the video, reports nothing, requests no YouTube API script', () => {
    const { container } = mount()
    fireEvent.click(screen.getByRole('button', { name: /Lire la vidéo/ }))
    expect(container.querySelectorAll('iframe')).toHaveLength(1)
    expect(track).not.toHaveBeenCalled()
    expect(document.querySelector('script[src*="iframe_api"]')).toBeNull()
  })

  it('with consent: video_play is reported with the id and the page, the API is enabled on the player', () => {
    writeConsent(true)
    const { container } = mount()
    fireEvent.click(screen.getByRole('button', { name: /Lire la vidéo/ }))
    expect(track).toHaveBeenCalledWith('video_play', { id: 'abc123', page: '/' })
    const src = container.querySelector('iframe')?.getAttribute('src') ?? ''
    expect(src.startsWith('https://www.youtube-nocookie.com/embed/abc123?autoplay=1')).toBe(true)
    expect(src).toContain('enablejsapi=1')
    expect(
      document.querySelector('script[src="https://www.youtube.com/iframe_api"]'),
    ).not.toBeNull()
  })
})

describe('VideoFacade without a poster', () => {
  it('draws the generic poster, still a labelled play button, and no image', () => {
    const { container } = render(
      <VideoFacade youtubeId="abc123" title="La démo" thumbnail={null} />,
    )
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('.is-generic')).not.toBeNull()
    expect(screen.getByRole('button', { name: 'Lire la vidéo : La démo' })).toBeTruthy()
  })
})
