import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { fetchPosters } from './fetch-posters.mjs'

const bytes = (s) => Buffer.from(s)
const fakeSharp = () => ({
  resize: () => ({ webp: () => ({ toBuffer: async () => bytes('WEBP') }) }),
})
const ok = (body) => ({ ok: true, status: 200, arrayBuffer: async () => bytes(body) })
const miss = { ok: false, status: 404 }

test('downloads each video poster once, trying the best size first, into <id>.webp', async () => {
  const out = mkdtempSync(join(tmpdir(), 'posters-'))
  const calls = []
  const fetch = async (url) => {
    calls.push(url)
    return url.includes('maxresdefault') ? miss : ok('JPG')
  }
  const log = []
  await fetchPosters({
    rows: [{ youtube_id: 'abc123DEF_-' }, { youtube_id: null }],
    outDir: out,
    fetch,
    sharp: fakeSharp,
    log: (m) => log.push(m),
  })
  assert.deepEqual(calls, [
    'https://i.ytimg.com/vi/abc123DEF_-/maxresdefault.jpg',
    'https://i.ytimg.com/vi/abc123DEF_-/sddefault.jpg',
  ])
  assert.equal(readFileSync(join(out, 'abc123DEF_-.webp'), 'utf8'), 'WEBP')
})

test('a poster already on disk is not fetched again', async () => {
  const out = mkdtempSync(join(tmpdir(), 'posters-'))
  const fetch = async () => ok('JPG')
  const args = {
    rows: [{ youtube_id: 'abc123DEF_-' }],
    outDir: out,
    fetch,
    sharp: fakeSharp,
    log() {},
  }
  await fetchPosters(args)
  let again = 0
  await fetchPosters({
    ...args,
    fetch: async () => {
      again++
      return ok('JPG')
    },
  })
  assert.equal(again, 0)
})

test('a failed download logs and never throws: the page falls back to the generic poster', async () => {
  const out = mkdtempSync(join(tmpdir(), 'posters-'))
  const log = []
  await fetchPosters({
    rows: [{ youtube_id: 'abc123DEF_-' }],
    outDir: out,
    fetch: async () => miss,
    sharp: fakeSharp,
    log: (m) => log.push(m),
  })
  assert.equal(existsSync(join(out, 'abc123DEF_-.webp')), false)
  assert.match(log.join('\n'), /abc123DEF_-/)
})

test('ignores an id that is not a YouTube id', async () => {
  const out = mkdtempSync(join(tmpdir(), 'posters-'))
  let n = 0
  await fetchPosters({
    rows: [{ youtube_id: '../x' }],
    outDir: out,
    fetch: async () => {
      n++
      return ok('JPG')
    },
    sharp: fakeSharp,
    log() {},
  })
  assert.equal(n, 0)
})
