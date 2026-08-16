import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initSchema, runInTransaction } from './db.js';
import { seedIfEmpty } from './seed.js';
import { authRouter } from './routes/auth.js';
import { leadsRouter } from './routes/leads.js';
import { projectsRouter } from './routes/projects.js';
import { invoicesRouter } from './routes/invoices.js';
import { cmsRouter } from './routes/cms.js';
import { clientsRouter } from './routes/clients.js';
import { logsRouter } from './routes/logs.js';
import { stateRouter } from './routes/state.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let readyPromise: Promise<void> | null = null;

export function ensureDbReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = initSchema()
      .then(() => runInTransaction(async (q) => {
        await seedIfEmpty(q);
      }))
      .catch((err) => {
        readyPromise = null;
        throw err;
      });
  }
  return readyPromise;
}

export function createApp(): express.Express {
  const app = express();
  app.set('trust proxy', 1);

  app.use(cookieParser());
  app.use(express.json({ limit: '1mb' }));

  const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
  app.use(
    cors({
      origin: process.env.NODE_ENV === 'production' ? undefined : clientOrigin,
      credentials: true,
    })
  );

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/leads', leadsRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/invoices', invoicesRouter);
  app.use('/api/cms', cmsRouter);
  app.use('/api/clients', clientsRouter);
  app.use('/api/logs', logsRouter);
  app.use('/api/state', stateRouter);

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found.' });
  });

  const clientDist = path.resolve(__dirname, '../../dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(clientDist, 'index.html'));
    });
    console.log(`Serving frontend build from ${clientDist}`);
  }

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('[api] Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  });

  return app;
}
