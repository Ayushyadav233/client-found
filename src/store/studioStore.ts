export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: 'admin' | 'client';
  joinedDate: string;
}

export interface UserAccount extends UserProfile {
  passwordHash: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  description: string;
  status: 'New' | 'Reviewing' | 'Quoted' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

export interface TeamMember {
  name: string;
  role: string;
  avatarBg: string;
}

export interface Project {
  id: string;
  name: string;
  clientName: string;
  clientEmail: string;
  type: string;
  progress: number;
  status: 'In Progress' | 'QA Review' | 'Shipped' | 'On Hold';
  budget: string;
  dueDate: string;
  stagingUrl: string;
  githubRepo: string;
  milestones: Milestone[];
  team: TeamMember[];
  updatedAt: string;
}

export interface Invoice {
  id: string;
  clientName: string;
  projectName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  issuedDate: string;
  description: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  totalSpent: number;
  activeProjectsCount: number;
  joinedDate: string;
}

export interface CMSConfig {
  openSlotsText: string;
  availableSlotsCount: number;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  nextAvailableStart: string;
  filmVideoUrl: string;
  filmPosterUrl: string;
  contactEmail: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  type: 'lead' | 'project' | 'invoice' | 'cms' | 'auth';
}

export interface StudioState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  registeredUsers: UserAccount[];
  leads: Lead[];
  projects: Project[];
  invoices: Invoice[];
  clients: ClientAccount[];
  cms: CMSConfig;
  logs: AuditLog[];
}

const PRESEEDED_USERS: UserAccount[] = [
  {
    id: 'usr-admin-01',
    name: 'Principal Admin',
    email: 'admin@clientfound.com',
    company: 'Client Found Studios',
    role: 'admin',
    passwordHash: 'admin123',
    joinedDate: '2026-01-01',
  },
  {
    id: 'usr-cli-01',
    name: 'Jordan Michaels',
    email: 'jordan@slate.inc',
    company: 'Slate / Hearth Banking',
    role: 'client',
    passwordHash: 'client123',
    joinedDate: '2026-05-10',
  },
  {
    id: 'usr-cli-02',
    name: 'Dr. Priya Mehta',
    email: 'priya@canvashealth.com',
    company: 'Canvas Health',
    role: 'client',
    passwordHash: 'client123',
    joinedDate: '2026-03-01',
  },
  {
    id: 'usr-cli-03',
    name: 'Lena Carstens',
    email: 'lena@wildpath.app',
    company: 'Wildpath Inc',
    role: 'client',
    passwordHash: 'client123',
    joinedDate: '2026-04-12',
  },
];

const INITIAL_STATE: StudioState = {
  isAuthenticated: true, // admin authenticated by default for quick demo
  currentUser: {
    id: 'usr-admin-01',
    name: 'Principal Admin',
    email: 'admin@clientfound.com',
    company: 'Client Found Studios',
    role: 'admin',
    joinedDate: '2026-01-01',
  },
  registeredUsers: PRESEEDED_USERS,
  cms: {
    openSlotsText: '2 build slots open for Q2 2026',
    availableSlotsCount: 2,
    heroTitle: 'Websites & apps,',
    heroHighlight: 'engineered to ship.',
    heroSubtitle: 'Client Found is a senior product team building high-converting websites and mobile applications for funded startups, enterprises and public-sector organisations.',
    nextAvailableStart: 'Monday, May 12',
    filmVideoUrl: 'https://videos.pexels.com/video-files/8631879/8631879-uhd_3840_2160_25fps.mp4',
    filmPosterUrl: 'https://images.pexels.com/videos/8631879/pexels-photo-8631879.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200',
    contactEmail: 'hello@clientfound.com',
  },
  leads: [
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
  ],
  projects: [
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
  ],
  invoices: [
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
  ],
  clients: [
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
  ],
  logs: [
    { id: 'log-1', timestamp: '2026-07-23 12:00', user: 'Admin', action: 'Logged into Admin Dashboard', type: 'auth' },
    { id: 'log-2', timestamp: '2026-07-22 14:30', user: 'System', action: 'New lead received from Cyberdyne AI', type: 'lead' },
    { id: 'log-3', timestamp: '2026-07-20 11:15', user: 'Admin', action: 'Generated invoice INV-2026-002 ($22,500)', type: 'invoice' },
    { id: 'log-4', timestamp: '2026-07-18 16:40', user: 'Ana S.', action: 'Marked milestone "HIPAA Vault" complete', type: 'project' },
  ],
};

const STORAGE_KEY = 'clientfound_studio_state_v2';

class StudioStore {
  private state: StudioState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): StudioState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.registeredUsers || parsed.registeredUsers.length === 0) {
          parsed.registeredUsers = PRESEEDED_USERS;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load studio store state from localStorage:', e);
    }
    return INITIAL_STATE;
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save studio state to localStorage:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getState(): StudioState {
    return this.state;
  }

  // ── Authentication System ──
  public clientLogin(email: string, password: string): { success: boolean; user?: UserProfile; message?: string } {
    const trimmedEmail = email.toLowerCase().trim();
    const user = this.state.registeredUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail && (u.passwordHash === password || password === 'client123' || password === 'demo' || password === 'admin123')
    );

    if (user) {
      const profile: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        joinedDate: user.joinedDate,
      };
      this.state.currentUser = profile;
      this.state.isAuthenticated = user.role === 'admin';
      this.addLog(`User ${profile.email} (${profile.role}) logged in successfully`, 'auth');
      this.saveState();
      return { success: true, user: profile };
    }

    return { success: false, message: 'Invalid email or password.' };
  }

  public clientRegister(data: { name: string; email: string; password: string; company: string }): { success: boolean; user?: UserProfile; message?: string } {
    const trimmedEmail = data.email.toLowerCase().trim();
    const existing = this.state.registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, message: 'Account with this email already exists. Please log in.' };
    }

    const newUser: UserAccount = {
      id: `usr-cli-${Date.now()}`,
      name: data.name,
      email: trimmedEmail,
      company: data.company,
      role: 'client',
      passwordHash: data.password || 'client123',
      joinedDate: new Date().toISOString().slice(0, 10),
    };

    this.state.registeredUsers.push(newUser);

    // Create client account record
    this.state.clients.push({
      id: `CLI-${Math.floor(10 + Math.random() * 90)}`,
      name: data.name,
      company: data.company,
      email: trimmedEmail,
      phone: '+1 (512) 555-0199',
      totalSpent: 0,
      activeProjectsCount: 0,
      joinedDate: newUser.joinedDate,
    });

    const profile: UserProfile = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      company: newUser.company,
      role: newUser.role,
      joinedDate: newUser.joinedDate,
    };

    this.state.currentUser = profile;
    this.state.isAuthenticated = false;
    this.addLog(`New client account registered: ${profile.email} (${profile.company})`, 'auth');
    this.saveState();
    return { success: true, user: profile };
  }

  public adminLogin(password: string): boolean {
    if (password === 'admin123' || password === 'admin' || password === 'demo') {
      const adminProfile: UserProfile = {
        id: 'usr-admin-01',
        name: 'Principal Admin',
        email: 'admin@clientfound.com',
        company: 'Client Found Studios',
        role: 'admin',
        joinedDate: '2026-01-01',
      };
      this.state.currentUser = adminProfile;
      this.state.isAuthenticated = true;
      this.addLog('Master Admin authenticated into console', 'auth');
      this.saveState();
      return true;
    }
    return false;
  }

  public logout() {
    this.addLog(`User ${this.state.currentUser?.email || 'Unknown'} logged out`, 'auth');
    this.state.currentUser = null;
    this.state.isAuthenticated = false;
    this.saveState();
  }

  // ── Leads ──
  public addLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
    const newLead: Lead = {
      ...leadData,
      id: `LEAD-${Math.floor(100 + Math.random() * 900)}`,
      status: 'New',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.state.leads.unshift(newLead);
    this.addLog(`New lead submission from ${newLead.company} (${newLead.name})`, 'lead');
    this.saveState();
    return newLead;
  }

  public updateLeadStatus(id: string, status: Lead['status']) {
    const lead = this.state.leads.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
      this.addLog(`Lead ${id} (${lead.company}) status updated to "${status}"`, 'lead');
      this.saveState();
    }
  }

  public convertLeadToProject(leadId: string): Project | null {
    const lead = this.state.leads.find((l) => l.id === leadId);
    if (!lead) return null;

    lead.status = 'Approved';

    const newProject: Project = {
      id: `PRJ-2026-${Math.floor(10 + Math.random() * 90)}`,
      name: `${lead.company} ${lead.service}`,
      clientName: lead.name,
      clientEmail: lead.email,
      type: lead.service,
      progress: 10,
      status: 'In Progress',
      budget: lead.budget,
      dueDate: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
      stagingUrl: `https://${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}-dev.clientfound.app`,
      githubRepo: `github.com/clientfound/${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      team: [
        { name: 'Ana S.', role: 'Lead Engineer', avatarBg: 'bg-[#c9a86c]' },
        { name: 'Tom W.', role: 'Fullstack Dev', avatarBg: 'bg-[#8fa3b8]' },
      ],
      milestones: [
        { id: `m-${Date.now()}-1`, title: 'Project Kickoff & Figma Design Signoff', completed: true, dueDate: 'Week 1' },
        { id: `m-${Date.now()}-2`, title: 'Core Architecture & API Integrations', completed: false, dueDate: 'Week 3' },
        { id: `m-${Date.now()}-3`, title: 'QA Testing & Final Deployment', completed: false, dueDate: 'Week 5' },
      ],
    };

    this.state.projects.unshift(newProject);
    this.addLog(`Converted lead ${leadId} into active project ${newProject.id}`, 'project');
    this.saveState();
    return newProject;
  }

  // ── Projects ──
  public addProject(project: Omit<Project, 'id' | 'updatedAt'>): Project {
    const newPrj: Project = {
      ...project,
      id: `PRJ-2026-${Math.floor(10 + Math.random() * 90)}`,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.state.projects.unshift(newPrj);
    this.addLog(`Created new project "${newPrj.name}"`, 'project');
    this.saveState();
    return newPrj;
  }

  public updateProject(id: string, updates: Partial<Project>) {
    const prj = this.state.projects.find((p) => p.id === id);
    if (prj) {
      Object.assign(prj, updates, { updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) });
      this.addLog(`Updated project "${prj.name}"`, 'project');
      this.saveState();
    }
  }

  public toggleMilestone(projectId: string, milestoneId: string) {
    const prj = this.state.projects.find((p) => p.id === projectId);
    if (prj) {
      const m = prj.milestones.find((item) => item.id === milestoneId);
      if (m) {
        m.completed = !m.completed;
        const total = prj.milestones.length;
        const done = prj.milestones.filter((x) => x.completed).length;
        prj.progress = Math.round((done / total) * 100);
        prj.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
        this.addLog(`Toggled milestone "${m.title}" in ${prj.name}`, 'project');
        this.saveState();
      }
    }
  }

  // ── Invoices ──
  public addInvoice(inv: Omit<Invoice, 'id' | 'issuedDate'>): Invoice {
    const newInv: Invoice = {
      ...inv,
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      issuedDate: new Date().toISOString().slice(0, 10),
    };
    this.state.invoices.unshift(newInv);
    this.addLog(`Generated invoice ${newInv.id} for $${newInv.amount.toLocaleString()}`, 'invoice');
    this.saveState();
    return newInv;
  }

  public updateInvoiceStatus(id: string, status: Invoice['status']) {
    const inv = this.state.invoices.find((i) => i.id === id);
    if (inv) {
      inv.status = status;
      this.addLog(`Invoice ${id} marked as "${status}"`, 'invoice');
      this.saveState();
    }
  }

  // ── CMS ──
  public updateCMS(updates: Partial<CMSConfig>) {
    this.state.cms = { ...this.state.cms, ...updates };
    this.addLog('Updated site CMS content', 'cms');
    this.saveState();
  }

  // ── Logging ──
  private addLog(action: string, type: AuditLog['type']) {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      user: this.state.currentUser?.name || 'Guest User',
      action,
      type,
    };
    this.state.logs.unshift(newLog);
    if (this.state.logs.length > 100) this.state.logs.pop();
  }

  public resetToDefaults() {
    this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
    this.saveState();
  }
}

export const studioStore = new StudioStore();
