import { describe, expect, it } from 'vitest'
import { posterPath } from './poster'

describe('posterPath: self-hosted posters only', () => {
  it('prefers the build-time poster', () => {
    const present = new Set([
      'public/_posters/abc123DEF_-.webp',
      'public/video-thumbs/abc123DEF_-.webp',
    ])
    expect(posterPath('abc123DEF_-', (p) => present.has(p))).toBe('/_posters/abc123DEF_-.webp')
  })

  it('falls back to the home tile thumbnail when it is the only copy', () => {
    const present = new Set(['public/video-thumbs/Op67YSG7T84.webp'])
    expect(posterPath('Op67YSG7T84', (p) => present.has(p))).toBe('/video-thumbs/Op67YSG7T84.webp')
  })

  it('is null when nothing is on disk: the facade draws a generic poster', () => {
    expect(posterPath('Op67YSG7T84', () => false)).toBeNull()
  })

  it('never builds a path from an id that is not a YouTube id', () => {
    expect(posterPath('../../etc/passwd', () => true)).toBeNull()
    expect(posterPath(null, () => true)).toBeNull()
  })
})
