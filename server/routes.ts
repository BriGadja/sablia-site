import { createServer, type Server } from 'node:http'
import type { Express } from 'express'

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app)

  return httpServer
}
