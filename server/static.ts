import path from 'node:path'
import express, { type Express, type NextFunction, type Request, type Response } from 'express'

/**
 * Static half of the production server. It reproduces what Vercel did for sablia.io (measured on
 * 2026-10-18, see deploy/parity-baseline.json): vercel.json's rewrites, directory pages answered
 * at `/x` AND `/x/` with a 200, `.well-known` served, everything revalidated except the hashed
 * `/assets/*`.
 */

const REVALIDATE = 'public, max-age=0, must-revalidate'
const IMMUTABLE = 'public, max-age=31536000, immutable'

export function mountStatic(app: Express, distPath: string): void {
  const root = path.resolve(distPath)
  const setHeaders = (res: Response, filePath: string) => {
    const rel = path.relative(root, filePath)
    res.setHeader('Cache-Control', rel.startsWith(`assets${path.sep}`) ? IMMUTABLE : REVALIDATE)
  }
  const sendPage = (res: Response, next: NextFunction, file: string) => {
    res.setHeader('Cache-Control', REVALIDATE)
    res.sendFile(file, { root, dotfiles: 'deny' }, (err) => {
      if (err) next(err)
    })
  }
  const isRead = (req: Request) => req.method === 'GET' || req.method === 'HEAD'

  // vercel.json: { "source": "/escalier-modeles", "destination": "/escalier-modeles.html" }
  app.get('/escalier-modeles', (_req, res, next) => sendPage(res, next, 'escalier-modeles.html'))

  // Prerendered directory pages (`cgv/index.html`): 200 with or without the trailing slash.
  app.use((req, res, next) => {
    if (!isRead(req)) return next()
    let decoded: string
    try {
      decoded = decodeURIComponent(req.path)
    } catch {
      return next()
    }
    const rel = decoded.replace(/\/+$/, '')
    const segments = rel.split('/').filter(Boolean)
    if (segments.length === 0 || segments.some((s) => s.startsWith('.') || s.includes('\0')))
      return next()
    const file = path.join(...segments, 'index.html')
    const full = path.resolve(root, file)
    if (!full.startsWith(root + path.sep)) return next()
    res.setHeader('Cache-Control', REVALIDATE)
    res.sendFile(file, { root, dotfiles: 'deny' }, (err) => {
      if (err) {
        res.removeHeader('Cache-Control')
        next()
      }
    })
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
      index: ['index.html'],
      setHeaders,
    }),
  )

  // vercel.json: { "source": "/((?!api/).*)", "destination": "/index.html" }
  app.use((req, res, next) => {
    if (!isRead(req)) {
      res.status(405).set('Allow', 'GET, HEAD').end()
      return
    }
    sendPage(res, next, 'index.html')
  })
}
