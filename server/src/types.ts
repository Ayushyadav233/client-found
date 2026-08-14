export type UserRole = 'admin' | 'client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: UserRole;
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
