import { describe, expect, it } from 'vitest'

// Deliberate failure: proves that a red `test` keeps `release` (what sablia.io serves) where it is.
// Removed by the next pull request.
describe('deploy hold demonstration', () => {
  it('fails on purpose', () => {
    expect(1).toBe(2)
  })
})
