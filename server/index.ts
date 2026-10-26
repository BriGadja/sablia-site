import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from './app'
import { log } from './log'
import { registerRoutes } from './routes'

// Bound to loopback by default: in production Caddy is the only way in (plan Decision 1).
const HOST = process.env.HOST ?? '127.0.0.1'
const PORT = Number(process.env.PORT ?? 5000)
const here = dirname(fileURLToPath(import.meta.url))

;(async () => {
  const app = createApp({
    distPath: join(here, 'public'),
    releaseFile: process.env.RELEASE_FILE ?? join(here, '..', 'RELEASE'),
    serveBuild: process.env.NODE_ENV !== 'development',
  })
  const server = registerRoutes(app)

  server.listen(PORT, HOST, () => {
    log(`serving on ${HOST}:${PORT}`)
  })

  const stop = () => {
    server.close(() => process.exit(0))
    server.closeIdleConnections()
    setTimeout(() => process.exit(0), 10_000).unref()
  }
  process.on('SIGTERM', stop)
  process.on('SIGINT', stop)
})()
