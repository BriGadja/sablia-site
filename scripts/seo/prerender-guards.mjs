// Checks on the HTML the prerender is about to write. Pure, no browser, so they can be tested.

// What must never be baked into a static page: the page is served before any consent exists.
const FORBIDDEN = [
  { what: 'consent banner', needle: 'data-consent-banner' },
  { what: 'analytics tracker script', needle: '/m/a.js' },
  { what: 'session recorder script', needle: '/m/r.js' },
]

/** Throws when a prerendered page carries the banner, the tracker or the recorder. */
export function assertCleanStaticHtml(html, route) {
  for (const { what, needle } of FORBIDDEN) {
    if (html.includes(needle)) {
      throw new Error(`${route}: prerendered html contains the ${what} (${JSON.stringify(needle)})`)
    }
  }
}
