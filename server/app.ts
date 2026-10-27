import express, { type Express, type NextFunction, type Request, type Response } from 'express'
import contact from '../api/contact'
import newsletter from '../api/newsletter'
import ressourcesRequest from '../api/ressources-request'
import { type FetchHandler, mountApi } from './api-adapter'
import { mountHealthz } from './healthz'
import { log } from './log'
import { mountStatic } from './static'

export interface AppOptions {
  distPath: string
  releaseFile: string
  env?: NodeJS.ProcessEnv
  /** Defaults to the three Fetch handlers in api/. */
  apiRoutes?: Record<string, FetchHandler>
  /** Mounted after /healthz and before /api; tests use it to throw on purpose. */
  extraRoutes?: (app: Express) => void
  /** false in development: nothing is served from dist/public (the Next dev server owns pages). */
  serveBuild?: boolean
}

const DEFAULT_API: Record<string, FetchHandler> = {
  '/api/contact': contact,
  '/api/newsletter': newsletter,
  '/api/ressources-request': ressourcesRequest,
}

export function createApp(options: AppOptions): Express {
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', 'loopback')

  app.use((_req, res, next) => {
    res.set('Strict-Transport-Security', 'max-age=63072000')
    res.set('X-Content-Type-Options', 'nosniff')
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    next()
  })

  // One line per API call: method, path, status, duration. Never a body (it holds visitors' data).
  app.use('/api', (req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      log(`${req.method} ${req.baseUrl}${req.path} ${res.statusCode} in ${Date.now() - start}ms`)
    })
    next()
  })

  mountHealthz(app, { releaseFile: options.releaseFile, env: options.env })
  options.extraRoutes?.(app)
  mountApi(app, options.apiRoutes ?? DEFAULT_API)
  if (options.serveBuild !== false) mountStatic(app, options.distPath)

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err)
    const status =
      (err as { status?: number; statusCode?: number })?.status ??
      (err as { statusCode?: number })?.statusCode
    console.error('[server] unhandled error', err instanceof Error ? err.name : 'unknown')
    const code = typeof status === 'number' && status >= 400 && status < 500 ? status : 500
    res.status(code).json({ error: 'Service indisponible', code: 'internal' })
  })

  return app
}
