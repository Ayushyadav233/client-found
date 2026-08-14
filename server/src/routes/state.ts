import { Router } from 'express';
import { requireAdmin, requireAuth, AuthedRequest } from '../auth.js';
import { getUserById, runInTransaction } from '../db.js';
import { seedIfEmpty } from '../seed.js';
import {
  allClients, allInvoices, allLeads, allLogs, allProjects, allUsers, getCMS, toProfile, wipeAll,
} from '../repo.js';

export const stateRouter = Router();

stateRouter.get('/', requireAuth, async (req: AuthedRequest, res) => {
  const user = await getUserById(req.userId!);
  if (!user) {
    res.status(401).json({ success: false, message: 'Session no longer valid.' });
    return;
  }

  const [cms, users, leads, projects, invoices, clients, logs] = await Promise.all([
    getCMS(),
    allUsers(),
    allLeads(),
    allProjects(),
    allInvoices(),
    allClients(),
    allLogs(),
  ]);
  res.json({
    success: true,
    state: {
      isAuthenticated: user.role === 'admin',
      currentUser: toProfile(user),
      registeredUsers: users.map((u) => ({ ...u, passwordHash: undefined })),
      leads,
      projects,
      invoices,
      clients,
      cms,
      logs,
    },
  });
});

stateRouter.post('/reset', requireAdmin, async (_req, res) => {
  await runInTransaction(async (q) => {
    await wipeAll(q);
    await seedIfEmpty(q);
  });
  res.json({ success: true });
});
