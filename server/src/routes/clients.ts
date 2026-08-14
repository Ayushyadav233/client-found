import { Router } from 'express';
import { requireAdmin } from '../auth.js';
import { allClients } from '../repo.js';

export const clientsRouter = Router();

clientsRouter.get('/', requireAdmin, async (_req, res) => {
  res.json({ clients: await allClients() });
});
