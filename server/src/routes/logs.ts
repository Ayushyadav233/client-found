import { Router } from 'express';
import { requireAdmin } from '../auth.js';
import { allLogs } from '../repo.js';

export const logsRouter = Router();

logsRouter.get('/', requireAdmin, async (_req, res) => {
  res.json({ logs: await allLogs() });
});
