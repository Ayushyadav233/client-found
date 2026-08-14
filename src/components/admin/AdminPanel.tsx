import React, { useState, useEffect } from 'react';
import { studioStore } from '../../store/studioStore';
import { AdminLogin } from './AdminLogin';
import { DashboardOverview } from './DashboardOverview';
import { LeadsManager } from './LeadsManager';
import { ProjectsManager } from './ProjectsManager';
import { InvoicesManager } from './InvoicesManager';
import { CMSManager } from './CMSManager';
import { AuditLogs } from './AuditLogs';
import { ToastNotification } from '../common/ToastNotification';

interface Props {
  onReturnToSite: () => void;
}

export const AdminPanel: React.FC<Props> = ({ onReturnToSite }) => {
  const [storeState, setStoreState] = useState(studioStore.getState());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'projects' | 'invoices' | 'cms' | 'logs'>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const unsubscribe = studioStore.subscribe(() => {
      setStoreState({ ...studioStore.getState() });
    });
    return unsubscribe;
  }, []);

  if (!storeState.isAuthenticated) {
    return <AdminLogin onSuccess={() => setStoreState({ ...studioStore.getState() })} />;
  }

  const handleLogout = () => {
    studioStore.logout();
  };

  const navItems: { id: 'dashboard' | 'leads' | 'projects' | 'invoices' | 'cms' | 'logs'; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'leads', label: 'Inbound Leads', icon: '📥', badge: storeState.leads.filter(l => l.status === 'New').length },
    { id: 'projects', label: 'Active Builds', icon: '🚀', badge: storeState.projects.filter(p => p.status === 'In Progress').length },
    { id: 'invoices', label: 'Invoices & Billing', icon: '💳', badge: storeState.invoices.filter(i => i.status === 'Pending').length },
    { id: 'cms', label: 'Site CMS & Slots', icon: '⚙️' },
    { id: 'logs', label: 'Audit Logs', icon: '📜' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-stone-200 flex flex-col antialiased selection:bg-[#c9a86c]/30 selection:text-white">
      {/* Toast feedback */}
      {toastMessage && (
        <ToastNotification message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Top Navigation Bar */}
      <header className="border-b hairline bg-[#12141a]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center font-bold text-gold">
              CF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">Client<span className="text-gold">Found</span></span>
                <span className="mono text-[9px] bg-gold/20 text-[#e3c893] px-2 py-0.5 rounded-md font-semibold border border-gold/30">
                  ADMIN CONSOLE
                </span>
              </div>
              <div className="text-[10px] text-stone-400">Master Operations & Management Platform</div>
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center bg-[#0a0c10] border border-white/10 rounded-xl px-3 py-1.5 text-xs w-64">
              <span className="text-stone-500 mr-2">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads, projects, clients..."
                className="bg-transparent text-white focus:outline-none w-full"
              />
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl surface flex items-center justify-center text-stone-300 hover:text-white transition-colors relative"
              >
                🔔
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-[#0a0c10] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {storeState.leads.filter(l => l.status === 'New').length}
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 surface-strong rounded-2xl p-4 gold-border shadow-2xl space-y-3 z-50 animate-modal-in">
                  <div className="flex items-center justify-between pb-2 border-b hairline">
                    <span className="text-xs font-bold text-white">System Notifications</span>
                    <span className="mono text-[9px] text-gold">{storeState.logs.length} events</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {storeState.logs.slice(0, 4).map((log) => (
                      <div key={log.id} className="p-2 rounded-lg bg-white/[0.02] border hairline">
                        <div className="text-stone-200 font-medium">{log.action}</div>
                        <div className="text-[9px] text-stone-500 mt-0.5">{log.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onReturnToSite}
              className="btn-ghost rounded-xl px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            >
              🌐 Live Client Site ↗
            </button>

            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-xl surface flex items-center justify-center text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors"
              title="Logout Admin"
            >
              🚪
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 surface-strong rounded-2xl p-4 gold-border h-fit space-y-2 flex-shrink-0">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-stone-500 px-3 py-1">Console Navigation</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === item.id
                  ? 'bg-gold text-[#0a0c10] font-bold shadow-lg shadow-gold/10'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  activeTab === item.id ? 'bg-[#0a0c10] text-gold' : 'bg-gold text-[#0a0c10]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 border-t hairline mt-4 text-[11px] text-stone-500 space-y-1 px-3">
            <div>Engineered for Client Found</div>
            <div className="mono text-[9px]">v2.4.0 · Direct Deploy Ready</div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && <DashboardOverview onNavigate={(t) => setActiveTab(t as any)} />}
          {activeTab === 'leads' && <LeadsManager onNotification={(msg) => setToastMessage(msg)} />}
          {activeTab === 'projects' && <ProjectsManager onNotification={(msg) => setToastMessage(msg)} />}
          {activeTab === 'invoices' && <InvoicesManager onNotification={(msg) => setToastMessage(msg)} />}
          {activeTab === 'cms' && <CMSManager onNotification={(msg) => setToastMessage(msg)} />}
          {activeTab === 'logs' && <AuditLogs />}
        </main>
      </div>
    </div>
  );
};
