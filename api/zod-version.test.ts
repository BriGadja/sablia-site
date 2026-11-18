import { createRequire } from 'node:module'
import { describe, expect, it } from 'vitest'

// GHSA-mrhx-c7xc-m3w5: zod < 4.6.6 accumulates one issue per failing array element with no cap
// (memory exhaustion). Our request schemas hold no array today, but the version floor keeps the
// form handlers off the vulnerable range if one is ever added.
const PATCHED = [4, 6, 6]

describe('zod dependency', () => {
  it('resolves to a version patched against GHSA-mrhx-c7xc-m3w5', () => {
    const { version } = createRequire(import.meta.url)('zod/package.json') as { version: string }
    const parts = version.split('.').map((n) => Number.parseInt(n, 10))
    const cmp = parts.findIndex((n, i) => n !== PATCHED[i])
    const atLeast = cmp === -1 || parts[cmp] > PATCHED[cmp]
    expect(atLeast, `zod ${version} is below ${PATCHED.join('.')}`).toBe(true)
  })
})
