import React, { useState } from 'react';
import { studioStore, Project, Invoice } from '../../store/studioStore';
import { useBodyLock } from '../../hooks';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ClientPortalModal: React.FC<Props> = ({ open, onClose }) => {
  useBodyLock(open);

  const [searchEmail, setSearchEmail] = useState('');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  if (!open) return null;

  const state = studioStore.getState();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = state.projects.find(
      (p) => p.clientEmail.toLowerCase().includes(searchEmail.toLowerCase().trim()) || p.id.toLowerCase() === searchEmail.toLowerCase().trim()
    );
    if (found) {
      setActiveProject(found);
    } else {
      alert('No active project found for that email/ID. Try: jordan@slate.inc or PRJ-2026-01');
    }
  };

  const projectInvoices: Invoice[] = activeProject
    ? state.invoices.filter((inv) => inv.projectName.toLowerCase() === activeProject.name.toLowerCase() || inv.clientName.includes(activeProject.clientName))
    : [];

  return (
    <div className="fixed inset-0 z-[250] video-modal-backdrop flex items-center justify-center p-4 sm:p-6 animate-fade-in" role="dialog">
      <div className="relative w-full max-w-3xl surface-strong rounded-3xl p-6 sm:p-8 gold-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-modal-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b hairline mb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold">
              📂
            </div>
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-[#e3c893]">Client Portal & Trackers</div>
              <h2 className="text-xl font-bold text-white tracking-tight">Live Project Dashboard</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl surface flex items-center justify-center text-stone-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Search Bar if no project selected */}
        {!activeProject && (
          <div className="py-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#c9a86c]/10 border border-[#c9a86c]/30 flex items-center justify-center text-2xl mx-auto text-gold">
              🔒
            </div>
            <h3 className="text-lg font-semibold text-white">Track Your Active Studio Build</h3>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Enter your registered client email or Project ID to access live milestones, weekly staging previews, and team contact details.
            </p>
            <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 pt-2">
              <input
                type="text"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="e.g. jordan@slate.inc or PRJ-2026-01"
                className="flex-1 bg-[#12141a] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c9a86c]"
              />
              <button type="submit" className="btn-gold rounded-xl px-5 py-2.5 text-xs font-semibold">
                Access Build
              </button>
            </form>
            <div className="text-[11px] text-stone-500 pt-3">
              Demo sample emails: <button type="button" onClick={() => setSearchEmail('jordan@slate.inc')} className="text-gold underline">jordan@slate.inc</button> | <button type="button" onClick={() => setSearchEmail('priya@canvashealth.com')} className="text-gold underline">priya@canvashealth.com</button>
            </div>
          </div>
        )}

        {/* Active Project Dashboard View */}
        {activeProject && (
          <div className="overflow-y-auto space-y-6 pr-1">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.03] p-4 rounded-2xl border hairline">
              <div>
                <div className="flex items-center gap-2">
                  <span className="mono text-[10px] text-stone-400">{activeProject.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    activeProject.status === 'Shipped' ? 'bg-lime-400/20 text-lime-300 border border-lime-400/30' : 'bg-gold/20 text-gold border border-gold/30'
                  }`}>
                    ● {activeProject.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{activeProject.name}</h3>
                <div className="text-xs text-stone-400 mt-0.5">Client: {activeProject.clientName} ({activeProject.clientEmail})</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveProject(null)}
                  className="btn-ghost rounded-xl px-3 py-1.5 text-xs"
                >
                  Switch Project
                </button>
                <a
                  href={activeProject.stagingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary rounded-xl px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                >
                  🌐 Open Staging ↗
                </a>
              </div>
            </div>

            {/* Progress Bar & Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="surface rounded-xl p-3 border hairline">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">Overall Progress</div>
                <div className="text-xl font-bold text-gold mt-0.5">{activeProject.progress}%</div>
                <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#a5854e] to-[#e3c893]" style={{ width: `${activeProject.progress}%` }} />
                </div>
              </div>

              <div className="surface rounded-xl p-3 border hairline">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">Target Launch</div>
                <div className="text-sm font-semibold text-white mt-1">{activeProject.dueDate}</div>
                <div className="text-[9px] text-lime-300 mt-1">On Schedule</div>
              </div>

              <div className="surface rounded-xl p-3 border hairline">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">Budget</div>
                <div className="text-sm font-semibold text-white mt-1">{activeProject.budget}</div>
                <div className="text-[9px] text-stone-400 mt-1">Fixed Scope</div>
              </div>

              <div className="surface rounded-xl p-3 border hairline">
                <div className="text-[10px] text-stone-500 uppercase tracking-wider">Assigned Engineers</div>
                <div className="flex items-center -space-x-2 mt-1">
                  {activeProject.team.map((t, idx) => (
                    <div key={idx} className={`w-6 h-6 rounded-full ${t.avatarBg} text-[9px] font-bold text-black flex items-center justify-center border border-black`} title={`${t.name} - ${t.role}`}>
                      {t.name[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Milestones Checklist */}
            <div className="surface rounded-2xl p-5 border hairline space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-wider text-stone-300 font-semibold">Sprint Milestones & Deliverables</h4>
                <span className="mono text-[10px] text-gold">{activeProject.milestones.filter(m => m.completed).length} / {activeProject.milestones.length} Completed</span>
              </div>
              <div className="space-y-2">
                {activeProject.milestones.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border hairline">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${m.completed ? 'bg-lime-400/20 text-lime-300 border border-lime-400/40' : 'bg-stone-800 text-stone-500'}`}>
                        {m.completed ? '✓' : '○'}
                      </div>
                      <span className={`text-xs ${m.completed ? 'text-stone-300 line-through' : 'text-white font-medium'}`}>{m.title}</span>
                    </div>
                    <span className="mono text-[10px] text-stone-500">{m.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Invoices */}
            {projectInvoices.length > 0 && (
              <div className="surface rounded-2xl p-5 border hairline space-y-3">
                <h4 className="text-xs uppercase tracking-wider text-stone-300 font-semibold">Associated Invoices</h4>
                <div className="space-y-2">
                  {projectInvoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border hairline">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="mono text-[10px] text-gold">{inv.id}</span>
                          <span className="text-xs text-white font-medium">{inv.description}</span>
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">Issued: {inv.issuedDate} · Due: {inv.dueDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">${inv.amount.toLocaleString()}</div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                          inv.status === 'Paid' ? 'bg-lime-400/10 text-lime-300 border border-lime-400/20' : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
