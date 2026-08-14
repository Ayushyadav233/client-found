import bcrypt from 'bcryptjs';
import { countUsers, insertUser, type Queryable } from './db.js';
import {
  allClients, allInvoices, allLeads, allProjects, getCMS, insertClient, insertCMS, insertInvoice, insertLead, insertProject,
} from './repo.js';
import type { Lead, Project, Invoice, ClientAccount, CMSConfig } from './types.js';

function hash(pw: string): string {
  return bcrypt.hashSync(pw, 10);
}

const SEED_LEADS: Lead[] = [
  {
    id: 'LEAD-101',
    name: 'Sarah Connor',
    email: 'sarah@cyberdyne.io',
    company: 'Cyberdyne AI',
    service: 'Web Development',
    budget: '$25,000 - $50,000',
    timeline: '4-6 Weeks',
    description: 'Looking to build a next-gen web platform with interactive 3D visualizations and real-time LLM query streams.',
    status: 'New',
    createdAt: '2026-07-22 14:30',
  },
  {
    id: 'LEAD-102',
    name: 'Michael Vance',
    email: 'mvance@vancecap.com',
    company: 'Vance Capital',
    service: 'FinTech App',
    budget: '$50,000+',
    timeline: '8 Weeks',
    description: 'Need a mobile iOS/Android React Native wallet with automated portfolio rebalancing and biometric authentication.',
    status: 'Reviewing',
    createdAt: '2026-07-21 09:15',
  },
  {
    id: 'LEAD-103',
    name: 'Elena Rostova',
    email: 'elena@biomedx.org',
    company: 'BioMedX Health',
    service: 'HIPAA Portal',
    budget: '$25,000 - $50,000',
    timeline: '6 Weeks',
    description: 'HIPAA compliant patient intake system with automated lab test report parsing and PDF exports.',
    status: 'Quoted',
    createdAt: '2026-07-19 16:45',
  },
];

const SEED_PROJECTS: Project[] = [
  {
    id: 'PRJ-2026-01',
    name: 'Hearth Banking Portal',
    clientName: 'Jordan Michaels (Slate)',
    clientEmail: 'jordan@slate.inc',
    type: 'FinTech Web App',
    progress: 85,
    status: 'In Progress',
    budget: '$45,000',
    dueDate: '2026-08-15',
    stagingUrl: 'https://hearth-staging.clientfound.app',
    githubRepo: 'github.com/clientfound/hearth-banking',
    updatedAt: '2026-07-23 11:00',
    team: [
      { name: 'Ana S.', role: 'Lead Architect', avatarBg: 'bg-[#c9a86c]' },
      { name: 'Tom W.', role: 'Senior Frontend', avatarBg: 'bg-[#8fa3b8]' },
    ],
    milestones: [
      { id: 'm1', title: 'DB Schema & OAuth2 Auth', completed: true, dueDate: '2026-07-01' },
      { id: 'm2', title: 'Real-time Transaction Feed & Charts', completed: true, dueDate: '2026-07-14' },
      { id: 'm3', title: 'Stripe Treasury API Integration', completed: true, dueDate: '2026-07-25' },
      { id: 'm4', title: 'Security & Penetration Audit', completed: false, dueDate: '2026-08-05' },
    ],
  },
  {
    id: 'PRJ-2026-02',
    name: 'Wildpath Outdoor Companion',
    clientName: 'Lena Carstens',
    clientEmail: 'lena@wildpath.app',
    type: 'React Native Mobile App',
    progress: 100,
    status: 'Shipped',
    budget: '$38,000',
    dueDate: '2026-06-30',
    stagingUrl: 'https://wildpath.app',
    githubRepo: 'github.com/clientfound/wildpath-mobile',
    updatedAt: '2026-07-10 15:20',
    team: [
      { name: 'Ryan K.', role: 'Mobile Specialist', avatarBg: 'bg-[#9caf88]' },
      { name: 'Priya M.', role: 'UX Designer', avatarBg: 'bg-[#b8927a]' },
    ],
    milestones: [
      { id: 'wm1', title: 'Vector Map Tiles & Offline Sync', completed: true, dueDate: '2026-05-20' },
      { id: 'wm2', title: 'GPS Route Tracking Engine', completed: true, dueDate: '2026-06-05' },
      { id: 'wm3', title: 'App Store Submission & Review', completed: true, dueDate: '2026-06-28' },
    ],
  },
  {
    id: 'PRJ-2026-03',
    name: 'Canvas Telehealth Platform',
    clientName: 'Dr. Priya Mehta',
    clientEmail: 'priya@canvashealth.com',
    type: 'Healthcare SaaS',
    progress: 60,
    status: 'QA Review',
    budget: '$62,000',
    dueDate: '2026-09-01',
    stagingUrl: 'https://canvas-qa.clientfound.app',
    githubRepo: 'github.com/clientfound/canvas-telehealth',
    updatedAt: '2026-07-22 18:00',
    team: [
      { name: 'Ana S.', role: 'Fullstack Dev', avatarBg: 'bg-[#c9a86c]' },
      { name: 'Lucas C.', role: 'Backend Security', avatarBg: 'bg-[#a08fb4]' },
    ],
    milestones: [
      { id: 'cm1', title: 'WebRTC Video Consultation Room', completed: true, dueDate: '2026-07-05' },
      { id: 'cm2', title: 'HIPAA Compliant Encrypted Vault', completed: true, dueDate: '2026-07-18' },
      { id: 'cm3', title: 'AI Clinical Notes Transcription', completed: false, dueDate: '2026-08-10' },
    ],
  },
];

const SEED_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-001',
    clientName: 'Jordan Michaels (Slate)',
    projectName: 'Hearth Banking Portal',
    amount: 22500,
    status: 'Paid',
    dueDate: '2026-07-01',
    issuedDate: '2026-06-15',
    description: 'Milestone 1 & 2 Delivery (50% upfront)',
  },
  {
    id: 'INV-2026-002',
    clientName: 'Jordan Michaels (Slate)',
    projectName: 'Hearth Banking Portal',
    amount: 22500,
    status: 'Pending',
    dueDate: '2026-08-15',
    issuedDate: '2026-07-20',
    description: 'Final Milestone Delivery & Launch',
  },
  {
    id: 'INV-2026-003',
    clientName: 'Lena Carstens',
    projectName: 'Wildpath Outdoor Companion',
    amount: 38000,
    status: 'Paid',
    dueDate: '2026-06-30',
    issuedDate: '2026-06-01',
    description: 'Complete App Release Payment',
  },
  {
    id: 'INV-2026-004',
    clientName: 'Dr. Priya Mehta',
    projectName: 'Canvas Telehealth Platform',
    amount: 31000,
    status: 'Paid',
    dueDate: '2026-07-10',
    issuedDate: '2026-06-20',
    description: 'Sprint Phase 1 Delivery',
  },
];

const SEED_CLIENTS: ClientAccount[] = [
  {
    id: 'CLI-01',
    name: 'Jordan Michaels',
    company: 'Slate / Hearth Banking',
    email: 'jordan@slate.inc',
    phone: '+1 (512) 890-3411',
    totalSpent: 45000,
    activeProjectsCount: 1,
    joinedDate: '2026-05-10',
  },
  {
    id: 'CLI-02',
    name: 'Lena Carstens',
    company: 'Wildpath Inc',
    email: 'lena@wildpath.app',
    phone: '+1 (415) 762-9012',
    totalSpent: 38000,
    activeProjectsCount: 0,
    joinedDate: '2026-04-12',
  },
  {
    id: 'CLI-03',
    name: 'Dr. Priya Mehta',
    company: 'Canvas Health Solutions',
    email: 'priya@canvashealth.com',
    phone: '+1 (650) 431-8890',
    totalSpent: 62000,
    activeProjectsCount: 1,
    joinedDate: '2026-03-01',
  },
];

const SEED_CMS: CMSConfig = {
  openSlotsText: '2 build slots open for Q2 2026',
  availableSlotsCount: 2,
  heroTitle: 'Websites & apps,',
  heroHighlight: 'engineered to ship.',
  heroSubtitle: 'Client Found is a senior product team building high-converting websites and mobile applications for funded startups, enterprises and public-sector organisations.',
  nextAvailableStart: 'Monday, May 12',
  filmVideoUrl: 'https://videos.pexels.com/video-files/8631879/8631879-uhd_3840_2160_25fps.mp4',
  filmPosterUrl: 'https://images.pexels.com/videos/8631879/pexels-photo-8631879.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200',
  contactEmail: 'hello@clientfound.com',
};

export async function seedIfEmpty(q: Queryable) {
  if ((await countUsers(q)) > 0) return;

  await insertUser({
    id: 'usr-admin-01',
    name: 'Principal Admin',
    email: 'admin@clientfound.com',
    company: 'Client Found Studios',
    role: 'admin',
    passwordHash: hash('admin123'),
    joinedDate: '2026-01-01',
  }, q);
  await insertUser({
    id: 'usr-cli-01',
    name: 'Jordan Michaels',
    email: 'jordan@slate.inc',
    company: 'Slate / Hearth Banking',
    role: 'client',
    passwordHash: hash('client123'),
    joinedDate: '2026-05-10',
  }, q);
  await insertUser({
    id: 'usr-cli-02',
    name: 'Dr. Priya Mehta',
    email: 'priya@canvashealth.com',
    company: 'Canvas Health',
    role: 'client',
    passwordHash: hash('client123'),
    joinedDate: '2026-03-01',
  }, q);
  await insertUser({
    id: 'usr-cli-03',
    name: 'Lena Carstens',
    email: 'lena@wildpath.app',
    company: 'Wildpath Inc',
    role: 'client',
    passwordHash: hash('client123'),
    joinedDate: '2026-04-12',
  }, q);

  for (const c of SEED_CLIENTS) await insertClient(c, q);
  for (const l of SEED_LEADS) await insertLead(l, q);
  for (const p of SEED_PROJECTS) await insertProject(p, q);
  for (const i of SEED_INVOICES) await insertInvoice(i, q);
  await insertCMS(SEED_CMS, q);

  const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
  await q.query(
    `INSERT INTO logs (id, timestamp, "user", action, type) VALUES
     ($1, $2, $3, $4, $5),
     ($6, $2, $7, $8, $9),
     ($10, $2, $11, $12, $13),
     ($14, $2, $15, $16, $17)`,
    [
      'log-1', now, 'Admin', 'Logged into Admin Dashboard', 'auth',
      'log-2', 'System', 'New lead received from Cyberdyne AI', 'lead',
      'log-3', 'Admin', 'Generated invoice INV-2026-002 ($22,500)', 'invoice',
      'log-4', 'Ana S.', 'Marked milestone "HIPAA Vault" complete', 'project',
    ]
  );

  console.log('Seeded database with demo data.');
}

export async function hasAdmin(q: Queryable): Promise<boolean> {
  const { rows } = await q.query(`SELECT COUNT(*) as c FROM users WHERE role = 'admin'`);
  return Number(rows[0].c) > 0;
}
