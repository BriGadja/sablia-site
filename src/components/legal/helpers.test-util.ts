import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

/** Server-render a page and return its markup, and the visible text with tags dropped. */
export const html = (ui: ReactElement) => renderToStaticMarkup(ui)
export const text = (ui: ReactElement) =>
  html(ui)
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
