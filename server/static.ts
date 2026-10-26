import path from 'node:path'
import express, { type Express, type NextFunction, type Request, type Response } from 'express'

/**
 * Static half of the production server, serving the Next `output: 'export'` tree (trailingSlash
 * false). Contract, measured against sablia.io on 2026-10-18 (deploy/parity-baseline.json) and
 * changed on purpose by the v2 build:
 * - a page is `<route>.html` (or `<route>/index.html`) and answers 200 at `/x` AND `/x/`; a file
 *   and a directory of the same name coexist (`ressources.html` beside `ressources/`);
 * - an unknown path is a real 404 carrying 404.html (the Vercel-era index.html fallback is gone);
 *   `/404*`, `/_not-found*` and `/ressources/__none*` (payload files included) are 404 too;
 * - Next's RSC payloads (`*.txt`, `index.txt`, `__next.*.txt`) are plain files: 200 text/plain;
 *   a 404 there would degrade every Link click to a full reload;
 * - `_next/static/*` is immutable, everything else revalidates; `.well-known` is served.
 */

const REVALIDATE = 'public, max-age=0, must-revalidate'
const IMMUTABLE = 'public, max-age=31536000, immutable'
const NEVER_SERVED = /^\/(?:404|_not-found|ressources\/__none)(?:[/.].*)?$/
const REDIRECTS: Record<string, string> = {
  '/roi': '/offres/compte-rendu-appel',
  '/about': '/#derriere',
}

export function mountStatic(app: Express, distPath: string): void {
  const root = path.resolve(distPath)
  const setHeaders = (res: Response, filePath: string) => {
    const rel = path.relative(root, filePath)
    const hashed = rel.startsWith(`_next${path.sep}static${path.sep}`)
    res.setHeader('Cache-Control', hashed ? IMMUTABLE : REVALIDATE)
  }
  const sendFile = (res: Response, file: string, onMiss: () => void, status = 200) => {
    res.status(status).setHeader('Cache-Control', REVALIDATE)
    res.sendFile(file, { root, dotfiles: 'deny' }, (err) => {
      if (!err) return
      res.status(200).removeHeader('Cache-Control')
      onMiss()
    })
  }
  const notFound = (res: Response) =>
    sendFile(res, '404.html', () => res.status(404).type('text/plain').send('Not Found'), 404)

  // Only GET and HEAD read the static tree.
  app.use((req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD') return next()
    res.status(405).set('Allow', 'GET, HEAD').end()
  })

  app.use((req, res, next) => {
    const clean = req.path.replace(/\/+$/, '') || '/'
    const target = REDIRECTS[clean]
    if (target) return res.redirect(301, target)
    if (NEVER_SERVED.test(clean)) return notFound(res)
    next()
  })

  // `<path>.html` first, then `<path>/index.html`; `/` is index.html.
  app.use((req: Request, res: Response, next: NextFunction) => {
    let decoded: string
    try {
      decoded = decodeURIComponent(req.path)
    } catch {
      return next()
    }
    const segments = decoded.split('/').filter(Boolean)
    if (segments.some((s) => s.startsWith('.') || s.includes('\0'))) return next()
    if (segments.length === 0) return sendFile(res, 'index.html', next)
    const base = path.join(...segments)
    if (!path.resolve(root, base).startsWith(root + path.sep)) return next()
    sendFile(res, `${base}.html`, () => sendFile(res, path.join(base, 'index.html'), next))
  })

  // `.well-known/ai.txt` is a dotfile path: only that folder is opened to dotfiles.
  app.use(
    '/.well-known',
    express.static(path.join(root, '.well-known'), {
      dotfiles: 'allow',
      redirect: false,
      setHeaders,
    }),
  )
  app.use(
    express.static(root, {
      dotfiles: 'ignore',
      redirect: false,
      index: false,
      setHeaders,
    }),
  )

  app.use((_req, res) => notFound(res))
}
