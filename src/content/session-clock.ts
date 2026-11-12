/**
 * When the next webinar starts, and the build-time clock. Pure (no React): server components, the
 * client hook and the tests all read it. Re-exported by `session-bar.ts`, the contract's entry point.
 */

/** 03/12/2026 12:00 Paris (winter time, UTC+1). `session-bar.test.ts` pins it against `SESSION`. */
export const SESSION_START = '2026-12-03T12:00:00+01:00'

/** True while `now` is strictly before the start; false from the start second on. */
export function sessionUpcoming(now: Date): boolean {
  return now.getTime() < Date.parse(SESSION_START)
}

/**
 * The instant the static export was built (`NEXT_PUBLIC_BUILD_AT`, inlined by next.config.ts), or
 * null when absent (tests, a tool that renders without Next). Read directly, never destructured:
 * Next only inlines the literal `process.env.NEXT_PUBLIC_BUILD_AT`.
 */
export function buildTime(): Date | null {
  const at = process.env.NEXT_PUBLIC_BUILD_AT
  if (!at) return null
  const d = new Date(at)
  return Number.isNaN(d.getTime()) ? null : d
}
