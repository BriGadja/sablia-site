import { afterEach, describe, expect, it, vi } from 'vitest'
import { anonKey, fetchRessource, fetchRessources, fileUrl, SUPABASE_URL } from './contenu'

/**
 * The three states these pages can be in are NOT two: "unavailable" (null) and "nothing published
 * yet" ([] or undefined) render differently on screen, so the tests keep them apart. Everything
 * external is stubbed; nothing here touches Supabase.
 */

function stubFetch(impl: (url: string, init?: RequestInit) => Promise<Response> | Response) {
  const spy = vi.fn(impl)
  vi.stubGlobal('fetch', spy)
  return spy
}

const ok = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })

const ROW = {
  slug: 'demo-of1',
  titre: 'Le template n8n du compte rendu',
  resume: 'Le workflow montré dans la vidéo.',
  youtube_id: 'dQw4w9WgXcQ',
  published_at: '2026-09-28T09:00:00Z',
  corps_md: '## Installer',
  fichiers: [
    {
      nom: 't.json',
      path: 'ressources/demo-of1/uuid/t.json',
      taille_octets: 12,
      type: 'application/json',
    },
  ],
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('anonKey', () => {
  it('returns the key when the build had the variable', () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    expect(anonKey()).toBe('anon-key')
  })

  it('returns null rather than an empty string when the variable is missing', () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    expect(anonKey()).toBeNull()
  })
})

describe('fileUrl', () => {
  it('builds the public bucket URL from the stored path', () => {
    expect(fileUrl('ressources/demo-of1/uuid/t.json')).toBe(
      `${SUPABASE_URL}/storage/v1/object/public/contenu-ressources/ressources/demo-of1/uuid/t.json`,
    )
  })
})

describe('fetchRessources', () => {
  it('returns the published rows and asks only for published ones', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    const spy = stubFetch(() => ok([ROW]))

    const rows = await fetchRessources()

    expect(rows).toHaveLength(1)
    expect(rows?.[0].slug).toBe('demo-of1')
    const url = spy.mock.calls[0][0] as string
    expect(url).toContain('published=eq.true')
    expect(url).toContain('order=published_at.desc')
  })

  it('sends the anon key in both headers', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    const spy = stubFetch(() => ok([]))

    await fetchRessources()

    const init = spy.mock.calls[0][1] as RequestInit
    const headers = init.headers as Record<string, string>
    expect(headers.apikey).toBe('anon-key')
    expect(headers.Authorization).toBe('Bearer anon-key')
  })

  it('distinguishes "nothing published" from "could not read"', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    stubFetch(() => ok([]))
    expect(await fetchRessources()).toEqual([])
  })

  it('returns null on a non-2xx answer', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    stubFetch(() => new Response('nope', { status: 500 }))
    expect(await fetchRessources()).toBeNull()
  })

  it('returns null when the request throws (timeout, offline)', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    stubFetch(() => Promise.reject(new DOMException('aborted', 'TimeoutError')))
    expect(await fetchRessources()).toBeNull()
  })

  it('returns null and never calls fetch when the key is absent', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    const spy = stubFetch(() => ok([ROW]))
    expect(await fetchRessources()).toBeNull()
    expect(spy).not.toHaveBeenCalled()
  })

  it('returns null when the body is not an array', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    stubFetch(() => ok({ message: 'unexpected' }))
    expect(await fetchRessources()).toBeNull()
  })
})

describe('fetchRessource', () => {
  it('returns the row, with its files, for a published slug', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    const spy = stubFetch(() => ok([ROW]))

    const row = await fetchRessource('demo-of1')

    expect(row?.titre).toBe('Le template n8n du compte rendu')
    expect(row?.fichiers).toHaveLength(1)
    const url = spy.mock.calls[0][0] as string
    expect(url).toContain('slug=eq.demo-of1')
    expect(url).toContain('published=eq.true')
  })

  it('escapes the slug it puts in the query', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    const spy = stubFetch(() => ok([]))
    await fetchRessource('a b&c')
    expect(spy.mock.calls[0][0] as string).toContain('slug=eq.a%20b%26c')
  })

  it('returns undefined — not null — when no published row matches (a 404)', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    stubFetch(() => ok([]))
    expect(await fetchRessource('inconnue')).toBeUndefined()
  })

  it('returns null when the read itself failed', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    stubFetch(() => new Response('nope', { status: 503 }))
    expect(await fetchRessource('demo-of1')).toBeNull()
  })

  it('defaults fichiers to an empty array when the column is not a list', async () => {
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    stubFetch(() => ok([{ ...ROW, fichiers: null }]))
    const row = await fetchRessource('demo-of1')
    expect(row?.fichiers).toEqual([])
  })
})
