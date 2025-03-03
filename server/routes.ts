import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Route de debug pour tester les webhooks
  app.get('/api/webhook-test', (req, res) => {
    console.log('Requête webhook-test reçue:');
    console.log('Query params:', req.query);
    console.log('Headers:', req.headers);
    
    // Renvoyer tous les paramètres reçus
    res.json({
      success: true,
      message: 'Webhook test réussi',
      receivedParams: req.query,
      headers: req.headers
    });
  });

  // Route de debug pour voir les variables d'environnement
  app.get('/api/env-check', (req, res) => {
    console.log('Vérification des variables d\'environnement');
    
    // Ne pas exposer les valeurs réelles en production, juste les noms des variables
    const envVars = Object.keys(process.env)
      .filter(key => key.startsWith('VITE_'))
      .reduce((obj, key) => {
        obj[key] = process.env[key] ? 'défini' : 'non défini';
        return obj;
      }, {});
    
    res.json({
      environment: process.env.NODE_ENV || 'development',
      envVars
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
