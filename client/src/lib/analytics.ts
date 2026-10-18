/**
 * Thin facade over the self-hosted Umami tracker (plan sablia-io-lot0-vps, Decision 6). The tracker
 * script is injected by the consent-aware loader (Phase E); until it is there, or when a blocker
 * removed it, every call is a no-op: a measurement problem must never break a click.
 */
type UmamiWindow = Window & { umami?: { track: (name: string, data?: object) => void } }

export function track(name: string, data?: Record<string, string | number | boolean>): void {
  try {
    ;(window as UmamiWindow).umami?.track(name, data)
  } catch {
    // swallowed on purpose
  }
}
