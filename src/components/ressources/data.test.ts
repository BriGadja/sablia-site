import { describe, expect, it, vi } from 'vitest'
import { isStrict, loadList, loadSlugParams, NONE_SLUG } from './data'

const rows = [{ slug: 'a' }, { slug: 'b' }]

describe('loadSlugParams: the generateStaticParams list', () => {
  it('lists every published slug', async () => {
    const list = vi.fn(async () => rows)
    expect(await loadSlugParams({ env: {}, list })).toEqual([{ slug: 'a' }, { slug: 'b' }])
  })

  it('returns the one placeholder when the list is legitimately empty (an empty list fails the export)', async () => {
    expect(await loadSlugParams({ env: {}, list: async () => [] })).toEqual([{ slug: NONE_SLUG }])
  })

  it('fixture mode wins over the network and needs no key', async () => {
    const list = vi.fn(async () => rows)
    const params = await loadSlugParams({ env: { SABLIA_FIXTURE_SLUGS: 'x, y' }, list })
    expect(params).toEqual([{ slug: 'x' }, { slug: 'y' }])
    expect(list).not.toHaveBeenCalled()
  })

  it('outside strict mode a Supabase failure warns and falls back to the placeholder', async () => {
    const warn = vi.fn()
    const list = async () => {
      throw new Error('HTTP 500')
    }
    expect(await loadSlugParams({ env: {}, list, warn })).toEqual([{ slug: NONE_SLUG }])
    expect(warn).toHaveBeenCalledOnce()
  })

  it('in strict mode a Supabase failure THROWS: the deploy keeps the previous release', async () => {
    const list = async () => {
      throw new Error('HTTP 500')
    }
    await expect(loadSlugParams({ env: { PRERENDER_STRICT: '1' }, list })).rejects.toThrow(
      'HTTP 500',
    )
  })

  it('in strict mode an EMPTY answer is not a failure', async () => {
    const params = await loadSlugParams({ env: { PRERENDER_STRICT: '1' }, list: async () => [] })
    expect(params).toEqual([{ slug: NONE_SLUG }])
  })
})

describe('loadList: the /ressources rows', () => {
  it('null (unreadable) stays null outside strict mode, so the page shows « indisponible »', async () => {
    expect(await loadList({ env: {}, fetchList: async () => null })).toBeNull()
  })

  it('null THROWS in strict mode', async () => {
    await expect(
      loadList({ env: { PRERENDER_STRICT: '1' }, fetchList: async () => null }),
    ).rejects.toThrow(/ressources/i)
  })

  it('an empty list is returned as is in both modes', async () => {
    expect(await loadList({ env: { PRERENDER_STRICT: '1' }, fetchList: async () => [] })).toEqual(
      [],
    )
  })
})

describe('isStrict', () => {
  it('is set by PRERENDER_STRICT or VERCEL only', () => {
    expect(isStrict({})).toBe(false)
    expect(isStrict({ PRERENDER_STRICT: '1' })).toBe(true)
    expect(isStrict({ VERCEL: '1' })).toBe(true)
  })
})
