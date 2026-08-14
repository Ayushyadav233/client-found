import { Router } from 'express';
import { requireAdmin } from '../auth.js';
import { addLog } from '../db.js';
import { getCMS, updateCMS } from '../repo.js';

export const cmsRouter = Router();

cmsRouter.get('/', async (_req, res) => {
  const cms = await getCMS();
  if (!cms) {
    res.status(404).json({ success: false, message: 'CMS not configured yet.' });
    return;
  }
  res.json({ cms });
});

cmsRouter.put('/', requireAdmin, async (req, res) => {
  const cms = req.body as Parameters<typeof updateCMS>[0];
  await updateCMS(cms);
  await addLog('Updated site CMS content', 'cms');
  res.json({ success: true, cms: await getCMS() });
});
