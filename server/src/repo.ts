import { pool, type Queryable } from './db.js';
import type { AuditLog, ClientAccount, CMSConfig, Invoice, Lead, Project, TeamMember, Milestone, UserAccount, UserProfile } from './types.js';

type Row = Record<string, unknown>;

// ── Users ──
export async function allUsers(): Promise<UserAccount[]> {
  const { rows } = await pool.query('SELECT * FROM users ORDER BY joined_date ASC');
  return rows.map((r) => ({
    id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    company: r.company ? String(r.company) : undefined,
    role: r.role as 'admin' | 'client',
    joinedDate: String(r.joined_date),
    passwordHash: String(r.password_hash),
  }));
}

export function toProfile(u: { id: string; name: string; email: string; company?: string; role: 'admin' | 'client'; joinedDate: string }): UserProfile {
  return { id: u.id, name: u.name, email: u.email, company: u.company, role: u.role, joinedDate: u.joinedDate };
}

// ── Clients ──
export async function allClients(): Promise<ClientAccount[]> {
  const { rows } = await pool.query('SELECT * FROM clients ORDER BY joined_date ASC');
  return rows.map((r) => ({
    id: String(r.id),
    name: String(r.name),
    company: String(r.company),
    email: String(r.email),
    phone: String(r.phone),
    totalSpent: Number(r.total_spent),
    activeProjectsCount: Number(r.active_projects_count),
    joinedDate: String(r.joined_date),
  }));
}

export async function insertClient(c: Omit<ClientAccount, 'id'> & { id?: string }, q: Queryable = pool) {
  const id = c.id ?? `CLI-${Date.now()}`;
  await q.query(
    `INSERT INTO clients (id, name, company, email, phone, total_spent, active_projects_count, joined_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, c.name, c.company, c.email.toLowerCase().trim(), c.phone, c.totalSpent, c.activeProjectsCount, c.joinedDate]
  );
}

// ── Leads ──
function rowToLead(r: Row): Lead {
  return {
    id: String(r.id),
    name: String(r.name),
    email: String(r.email),
    company: String(r.company),
    service: String(r.service),
    budget: String(r.budget),
    timeline: String(r.timeline),
    description: String(r.description),
    status: r.status as Lead['status'],
    createdAt: String(r.created_at),
  };
}

export async function allLeads(): Promise<Lead[]> {
  const { rows } = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
  return rows.map(rowToLead);
}

export async function getLead(id: string): Promise<Lead | null> {
  const { rows } = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
  return rows[0] ? rowToLead(rows[0]) : null;
}

export async function insertLead(l: Lead, q: Queryable = pool) {
  await q.query(
    `INSERT INTO leads (id, name, email, company, service, budget, timeline, description, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [l.id, l.name, l.email, l.company, l.service, l.budget, l.timeline, l.description, l.status, l.createdAt]
  );
}

export async function updateLeadStatus(id: string, status: Lead['status']) {
  await pool.query('UPDATE leads SET status = $1 WHERE id = $2', [status, id]);
}

// ── Projects ──
function rowToProject(r: Row): Project {
  return {
    id: String(r.id),
    name: String(r.name),
    clientName: String(r.client_name),
    clientEmail: String(r.client_email),
    type: String(r.type),
    progress: Number(r.progress),
    status: r.status as Project['status'],
    budget: String(r.budget),
    dueDate: String(r.due_date),
    stagingUrl: String(r.staging_url),
    githubRepo: String(r.github_repo),
    updatedAt: String(r.updated_at),
    milestones: JSON.parse(String(r.milestones || '[]')) as Milestone[],
    team: JSON.parse(String(r.team || '[]')) as TeamMember[],
  };
}

export async function allProjects(): Promise<Project[]> {
  const { rows } = await pool.query('SELECT * FROM projects ORDER BY updated_at DESC');
  return rows.map(rowToProject);
}

export async function getProject(id: string): Promise<Project | null> {
  const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
  return rows[0] ? rowToProject(rows[0]) : null;
}

export async function insertProject(p: Project, q: Queryable = pool) {
  await q.query(
    `INSERT INTO projects (id, name, client_name, client_email, type, progress, status, budget, due_date, staging_url, github_repo, updated_at, milestones, team)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      p.id, p.name, p.clientName, p.clientEmail, p.type, p.progress, p.status, p.budget, p.dueDate,
      p.stagingUrl, p.githubRepo, p.updatedAt,
      JSON.stringify(p.milestones), JSON.stringify(p.team),
    ]
  );
}

export async function updateProject(id: string, patch: Record<string, unknown>) {
  const allowed = [
    'name', 'clientName', 'clientEmail', 'type', 'progress', 'status', 'budget', 'dueDate',
    'stagingUrl', 'githubRepo', 'milestones', 'team',
  ];
  const mapped: Record<string, unknown> = {};
  for (const key of allowed) {
    if (patch[key] === undefined) continue;
    const col = key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
    mapped[col] = key === 'milestones' || key === 'team' ? JSON.stringify(patch[key]) : patch[key];
  }
  if (Object.keys(mapped).length === 0) return;
  mapped.updated_at = new Date().toISOString().replace('T', ' ').slice(0, 16);
  const cols = Object.keys(mapped);
  const set = cols.map((c, i) => `${c} = $${i + 1}`).join(', ');
  await pool.query(`UPDATE projects SET ${set} WHERE id = $${cols.length + 1}`, [...Object.values(mapped), id]);
}

// ── Invoices ──
export async function allInvoices(): Promise<Invoice[]> {
  const { rows } = await pool.query('SELECT * FROM invoices ORDER BY issued_date DESC');
  return rows.map((r) => ({
    id: String(r.id),
    clientName: String(r.client_name),
    projectName: String(r.project_name),
    amount: Number(r.amount),
    status: r.status as Invoice['status'],
    dueDate: String(r.due_date),
    issuedDate: String(r.issued_date),
    description: String(r.description),
  }));
}

export async function insertInvoice(i: Invoice, q: Queryable = pool) {
  await q.query(
    `INSERT INTO invoices (id, client_name, project_name, amount, status, due_date, issued_date, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [i.id, i.clientName, i.projectName, i.amount, i.status, i.dueDate, i.issuedDate, i.description]
  );
}

export async function updateInvoiceStatus(id: string, status: Invoice['status']) {
  await pool.query('UPDATE invoices SET status = $1 WHERE id = $2', [status, id]);
}

// ── CMS ──
export async function getCMS(): Promise<CMSConfig | null> {
  const { rows } = await pool.query('SELECT * FROM cms WHERE id = 1');
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    openSlotsText: String(r.open_slots_text),
    availableSlotsCount: Number(r.available_slots_count),
    heroTitle: String(r.hero_title),
    heroHighlight: String(r.hero_highlight),
    heroSubtitle: String(r.hero_subtitle),
    nextAvailableStart: String(r.next_available_start),
    filmVideoUrl: String(r.film_video_url),
    filmPosterUrl: String(r.film_poster_url),
    contactEmail: String(r.contact_email),
  };
}

export async function insertCMS(c: CMSConfig, q: Queryable = pool) {
  await q.query(
    `INSERT INTO cms (id, open_slots_text, available_slots_count, hero_title, hero_highlight, hero_subtitle, next_available_start, film_video_url, film_poster_url, contact_email)
     VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      c.openSlotsText, c.availableSlotsCount, c.heroTitle, c.heroHighlight, c.heroSubtitle,
      c.nextAvailableStart, c.filmVideoUrl, c.filmPosterUrl, c.contactEmail,
    ]
  );
}

export async function updateCMS(c: CMSConfig) {
  await pool.query(
    `UPDATE cms SET open_slots_text = $1, available_slots_count = $2, hero_title = $3, hero_highlight = $4, hero_subtitle = $5, next_available_start = $6, film_video_url = $7, film_poster_url = $8, contact_email = $9 WHERE id = 1`,
    [
      c.openSlotsText, c.availableSlotsCount, c.heroTitle, c.heroHighlight, c.heroSubtitle,
      c.nextAvailableStart, c.filmVideoUrl, c.filmPosterUrl, c.contactEmail,
    ]
  );
}

// ── Logs ──
export async function allLogs(): Promise<AuditLog[]> {
  const { rows } = await pool.query('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100');
  return rows.map((r) => ({
    id: String(r.id),
    timestamp: String(r.timestamp),
    user: String(r.user),
    action: String(r.action),
    type: r.type as AuditLog['type'],
  }));
}

export async function deleteLog(id: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM logs WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}

// ── Reset ──
export async function wipeAll(q: Queryable = pool) {
  for (const table of ['users', 'clients', 'leads', 'projects', 'invoices', 'cms', 'logs']) {
    await q.query(`DELETE FROM ${table}`);
  }
}
