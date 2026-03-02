const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export function getUTMParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const val = params.get(key)
    if (val) utm[key] = val
  }
  return utm
}
