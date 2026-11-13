import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Formations } from './index'

/**
 * `#formations` opens the trainer band (plan site-formation-lot1 U8): three photos of the 9 October
 * 2026 session, the copy of the trainer follows in `#derriere`. Alt texts are the photo unit's (U6).
 */
const html = renderToString(<Formations />).replace(/&#x27;/g, "'")

const PHOTOS = [
  ['03', 'Brice Gachadoat sourit au public, derrière un pupitre et un ordinateur portable.'],
  ['04', "Brice Gachadoat montre l'écran de projection d'un geste du bras."],
  ['05', 'Brice Gachadoat échange avec deux participants pendant la pause.'],
] as const

describe('#formations static HTML', () => {
  it('is the #formations section with the scoped class', () => {
    expect(html).toContain('id="formations"')
    expect(html).toContain('v2-formations')
  })

  it('shows exactly the three 3:2 photos of the session, in order, with their alt texts', () => {
    const imgs = html.match(/<img [^>]*>/g) ?? []
    expect(imgs).toHaveLength(3)
    PHOTOS.forEach(([n, alt], i) => {
      const img = imgs[i]
      expect(img).toContain(`src="/photos/formation-${n}-900.webp"`)
      expect(img).toContain(
        `/photos/formation-${n}-540.webp 540w, /photos/formation-${n}-900.webp 900w, /photos/formation-${n}-1200.webp 1200w`,
      )
      expect(img).toContain(`alt="${alt}"`)
      expect(img).toContain('width="1200"')
      expect(img).toContain('height="800"')
      expect(img).toContain('loading="lazy"')
    })
  })

  it('drops the photo the photo unit dropped (245) and the old meetup photo', () => {
    expect(html).not.toContain('formation-06')
    expect(html).not.toContain('accueil-meetup')
  })

  it('the old CRM-era band left: no testimonials, no formats, no Noésia line, no price', () => {
    expect(html).not.toMatch(/Nous l'enseignons aussi|Lire la suite|Denis|Vassili|Franky/)
    expect(html).not.toMatch(/Noésia|IAPreneurs/i)
    expect(html).not.toMatch(/\d[\d\s.,]*\s?(€|euros?)/i)
    expect(html).not.toContain('—')
  })
})

describe('#formations motion', () => {
  const css = readFileSync(join(__dirname, 'formations.css'), 'utf8')

  it('drifts only inside @supports (animation-timeline: view()) and stops under reduced motion', () => {
    expect(css).toMatch(/@supports \(animation-timeline: view\(\)\)/)
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*animation: none/)
  })

  it('moves photos by transform only (opacity and position, never size or layout)', () => {
    const frames = css.match(/@keyframes [\w-]+ \{[\s\S]*?\n {2}\}/g) ?? []
    expect(frames.length).toBeGreaterThan(0)
    for (const f of frames) expect(f).not.toMatch(/\b(width|height|top|left|margin|scale)\b/)
  })
})
