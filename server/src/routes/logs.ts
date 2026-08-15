import { Router } from 'express';
import { requireAdmin } from '../auth.js';
import { allLogs, deleteLog } from '../repo.js';

export const logsRouter = Router();

logsRouter.get('/', requireAdmin, async (_req, res) => {
  res.json({ logs: await allLogs() });
});

logsRouter.delete('/:id', requireAdmin, async (req, res) => {
  const deleted = await deleteLog(String(req.params.id));
  res.json({ success: true, deleted });
});
