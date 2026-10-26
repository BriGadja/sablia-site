import { act, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, mockReducedMotion } from '@/lib/hooks/test-utils'
import { Avis } from '../avis'
import { ANSWERS, CASES } from '../avis/content'
import { Deroule } from '../deroule'
import { STEPS } from '../deroule/content'
import { Formats } from '../formats'
import { FORMATS } from '../formats/content'
import { Outils } from '../outils'
import { GROUPS } from '../outils/content'
import { Questions } from '../questions'
import { QUESTIONS } from '../questions/content'
import { RUNGS } from './content'
import { Niveaux } from './index'

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const text = (node: React.ReactElement) =>
  renderToString(node)
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')

describe('static HTML carries every section text (SSR content rule)', () => {
  it('niveaux: four rungs, final state', () => {
    const html = text(<Niveaux />)
    expect(html).toContain('id="niveaux"')
    for (const r of RUNGS) expect(html).toContain(r.what)
    expect(html.match(/nv-rung on/g)).toHaveLength(4)
  })
  it('outils: six groups, voice agents only « sur demande »', () => {
    const html = text(<Outils />)
    for (const g of GROUPS) {
      expect(html).toContain(g.title)
      for (const i of g.items) expect(html).toContain(i.name)
    }
    expect(GROUPS).toHaveLength(6)
    expect(html).toMatch(/Agents vocaux<span class="ou-note">sur demande/)
  })
  it('deroule: four steps', () => {
    const html = text(<Deroule />)
    for (const s of STEPS) expect(html).toContain(s.what)
  })
  it('avis: three cases, four quotes with the signature under each, temoignage class', () => {
    const html = text(<Avis />)
    for (const c of CASES) expect(html).toContain(c.what)
    for (const a of ANSWERS) expect(html).toContain(a.text)
    expect(html.match(/class="temoignage"/g)).toHaveLength(4)
    expect(html).toMatch(/<\/blockquote><figcaption>/)
  })
  it('formats: three cards, one link to /accompagnement', () => {
    const html = text(<Formats />)
    for (const f of FORMATS) expect(html).toContain(f.what)
    expect(html.match(/href="\/accompagnement"/g)).toHaveLength(1)
  })
  it('questions: five', () => {
    const html = text(<Questions />)
    for (const q of QUESTIONS) expect(html).toContain(q.a)
    expect(QUESTIONS).toHaveLength(5)
  })
  it('no price, no em dash, no old school name', () => {
    const all = [Niveaux, Outils, Deroule, Avis, Formats, Questions]
      .map((C) => text(<C />))
      .join(' ')
    expect(all).not.toMatch(/€|—|IAPreneurs/i)
  })
})

describe('staged reveal', () => {
  it('drops to 0 once mounted, then lights a rung at 120 + 380k ms after entering view', () => {
    vi.useFakeTimers()
    mockReducedMotion(false)
    const io = mockIntersectionObserver()
    const { container } = render(<Niveaux />)
    const on = () => container.querySelectorAll('.nv-rung.on').length
    expect(on()).toBe(0)
    act(() => io.trigger(container.querySelector('#niveaux') as Element, true))
    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(on()).toBe(0)
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(on()).toBe(1)
    act(() => {
      vi.advanceTimersByTime(380 * 3)
    })
    expect(on()).toBe(4)
  })
  it('reduced motion keeps the final state', () => {
    mockReducedMotion(true)
    mockIntersectionObserver()
    const { container } = render(<Niveaux />)
    expect(container.querySelectorAll('.nv-rung.on')).toHaveLength(4)
  })
})

describe('reduced motion flipping after hydration', () => {
  it('returns to the final state when the preference becomes true after a stage-0 reset', () => {
    const rm = mockReducedMotion(false)
    mockIntersectionObserver()
    const { container } = render(<Niveaux />)
    expect(container.querySelectorAll('.nv-rung.on')).toHaveLength(0)
    act(() => rm.set(true))
    expect(container.querySelectorAll('.nv-rung.on')).toHaveLength(4)
  })
})
