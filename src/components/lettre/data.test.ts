import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NONE_SLUG } from '@/components/ressources/data'
import { listPublishedLettres } from '../../../scripts/seo/ressources.mjs'
import { type Lettre, lettreStore, loadLettre, loadLettreParams, loadLettres } from './data'

// A shell with the build env sourced must never reach Supabase from a test.
const SCRUBBED = [
  'VITE_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SABLIA_FIXTURE_LETTRES',
  'PRERENDER_STRICT',
  'VERCEL',
  'SABLIA_SLOT',
] as const
const saved: Partial<Record<(typeof SCRUBBED)[number], string>> = {}
beforeEach(() => {
  for (const name of SCRUBBED) {
    saved[name] = process.env[name]
    delete process.env[name]
  }
})
afterEach(() => {
  for (const name of SCRUBBED) {
    if (saved[name] === undefined) delete process.env[name]
    else process.env[name] = saved[name]
  }
})

const row = (slug: string, published_at: string): Lettre => ({
  slug,
  titre: `Numéro ${slug}`,
  resume: 'Résumé.',
  corps_md: '## Titre\n\nTexte.',
  youtube_id: null,
  published_at,
  updated_at: published_at,
})
const A = row('2026-11-10-a', '2026-11-10T07:30:00+00:00')
const B = row('2026-11-03-b', '2026-11-03T07:30:00+00:00')
const noSleep = async () => {}

describe('lettreStore: the generateStaticParams list', () => {
  it('lists every published slug', async () => {
    const store = lettreStore(async () => [A, B])
    expect(await store.loadLettreParams()).toEqual([{ slug: A.slug }, { slug: B.slug }])
  })

  it('returns the one placeholder when nothing is published (an empty list fails the export)', async () => {
    expect(await lettreStore(async () => []).loadLettreParams()).toEqual([{ slug: NONE_SLUG }])
  })

  it('in strict mode an unreadable table THROWS through the params and the page data', async () => {
    const failing = vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) }))
    const store = lettreStore(
      () =>
        listPublishedLettres({
          env: { PRERENDER_STRICT: '1', VITE_SUPABASE_ANON_KEY: 'k' },
          fetch: failing,
          sleep: noSleep,
        }) as Promise<Lettre[]>,
    )
    await expect(store.loadLettreParams()).rejects.toThrow(/HTTP 500/)
    await expect(store.loadLettre(A.slug)).rejects.toThrow(/HTTP 500/)
  })
})

describe('lettreStore: one read per process', () => {
  it('reads Supabase ONCE for the params, every page and the /newsletter list', async () => {
    const fetch = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => [B, A],
    }))
    const store = lettreStore(
      () =>
        listPublishedLettres({
          env: { VITE_SUPABASE_ANON_KEY: 'k' },
          fetch,
          sleep: noSleep,
        }) as Promise<Lettre[]>,
    )
    await store.loadLettreParams()
    await Promise.all([store.loadLettre(A.slug), store.loadLettre(B.slug)])
    const list = await store.loadLettres()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(list.map((l) => l.slug)).toEqual([A.slug, B.slug])
  })

  it('does not keep a failed read: the next call tries again', async () => {
    let n = 0
    const store = lettreStore(async () => {
      n++
      if (n === 1) throw new Error('blip')
      return [A]
    })
    await expect(store.loadLettres()).rejects.toThrow('blip')
    expect(await store.loadLettres()).toEqual([A])
  })
})

describe('lettreStore: one issue', () => {
  it('finds a published issue, and answers undefined (a 404) for an unknown slug and the placeholder', async () => {
    const store = lettreStore(async () => [A, B])
    expect(await store.loadLettre(B.slug)).toEqual(B)
    expect(await store.loadLettre('2026-11-10-inconnu')).toBeUndefined()
    expect(await store.loadLettre(NONE_SLUG)).toBeUndefined()
  })
})

describe('the module store, wired to the one reader', () => {
  it('serves the fixture issue without a key (dev server, local build)', async () => {
    process.env.SABLIA_FIXTURE_LETTRES = '2026-11-10-exemple-de-numero'
    expect(await loadLettreParams()).toEqual([{ slug: '2026-11-10-exemple-de-numero' }])
    const issue = await loadLettre('2026-11-10-exemple-de-numero')
    expect(issue?.corps_md).toContain('## ')
    expect(await loadLettres()).toHaveLength(1)
  })
})
