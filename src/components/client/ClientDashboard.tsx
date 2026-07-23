import React, { useState } from 'react';
import { studioStore, UserProfile, Project, Invoice } from '../../store/studioStore';
import { useBodyLock } from '../../hooks';

interface Props {
  user: UserProfile;
  open: boolean;
  onClose: () => void;
  onOpenInquiry: () => void;
  onNotification: (msg: string) => void;
}

export const ClientDashboard: React.FC<Props> = ({ user, open, onClose, onOpenInquiry, onNotification }) => {
  useBodyLock(open);

  const [activeTab, setActiveTab] = useState<'builds' | 'invoices' | 'account'>('builds');

  if (!open) return null;

  const state = studioStore.getState();

  // Filter projects & invoices for this logged-in client
  const clientProjects = state.projects.filter(
    (p) => p.clientEmail.toLowerCase() === user.email.toLowerCase() || p.clientName.toLowerCase().includes(user.name.toLowerCase())
  );

  const clientInvoices = state.invoices.filter(
    (inv) => inv.clientName.toLowerCase().includes(user.name.toLowerCase()) || (user.company && inv.clientName.toLowerCase().includes(user.company.toLowerCase()))
  );

  const totalPaid = clientInvoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingInvoices = clientInvoices.filter((i) => i.status === 'Pending');

  const handlePayInvoice = (invId: string) => {
    studioStore.updateInvoiceStatus(invId, 'Paid');
    onNotification(`Invoice ${invId} successfully paid! Thank you.`);
  };

  return (
    <div className="fixed inset-0 z-[250] video-modal-backdrop flex items-center justify-center p-4 sm:p-6 animate-fade-in" role="dialog">
      <div className="relative w-full max-w-4xl surface-strong rounded-3xl p-6 sm:p-8 gold-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-modal-in">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#c9a86c]/10 rounded-full blur-[110px] pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b hairline flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold font-bold text-xl">
              {user.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{user.name}</h2>
                <span className="mono text-[9px] bg-gold/20 text-[#e3c893] px-2 py-0.5 rounded-full font-semibold border border-gold/30">
                  {user.company || 'Client Workspace'}
                </span>
              </div>
              <div className="text-xs text-stone-400 mt-0.5">{user.email} · Account ID: {user.id}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenInquiry}
              className="btn-gold rounded-xl px-4 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              + Request New Build
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl surface flex items-center justify-center text-stone-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-3 gap-3 my-4 flex-shrink-0">
          <div className="surface rounded-2xl p-4 border hairline">
            <div className="text-[10px] text-stone-500 uppercase tracking-wider">Active Studio Builds</div>
            <div className="text-xl font-bold text-white mt-1 tabular-nums">{clientProjects.length}</div>
            <div className="text-[10px] text-gold mt-0.5">Live engineering phase</div>
          </div>

          <div className="surface rounded-2xl p-4 border hairline">
            <div className="text-[10px] text-stone-500 uppercase tracking-wider">Total Spent</div>
            <div className="text-xl font-bold text-white mt-1 tabular-nums">${totalPaid.toLocaleString()}</div>
            <div className="text-[10px] text-lime-300 mt-0.5">Paid invoices</div>
          </div>

          <div className="surface rounded-2xl p-4 border hairline">
            <div className="text-[10px] text-stone-500 uppercase tracking-wider">Pending Receivables</div>
            <div className="text-xl font-bold text-amber-300 mt-1 tabular-nums">${pendingInvoices.reduce((a, b) => a + b.amount, 0).toLocaleString()}</div>
            <div className="text-[10px] text-stone-400 mt-0.5">{pendingInvoices.length} invoices</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b hairline pb-2 mb-4 flex-shrink-0">
          <button
            onClick={() => setActiveTab('builds')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'builds' ? 'bg-gold text-[#0a0c10]' : 'text-stone-400 hover:text-white'
            }`}
          >
            🚀 My Active Builds ({clientProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'invoices' ? 'bg-gold text-[#0a0c10]' : 'text-stone-400 hover:text-white'
            }`}
          >
            💳 Invoices & Payments ({clientInvoices.length})
          </button>
        </div>

        {/* TAB 1: BUILDS */}
        {activeTab === 'builds' && (
          <div className="overflow-y-auto space-y-4 pr-1">
            {clientProjects.map((p) => (
              <div key={p.id} className="surface rounded-2xl p-5 border hairline space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="mono text-[10px] text-gold">{p.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gold/20 text-gold border border-gold/30">
                        {p.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{p.name}</h3>
                  </div>

                  <a
                    href={p.stagingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary rounded-xl px-4 py-2 text-xs font-semibold"
                  >
                    🌐 Open Staging ↗
                  </a>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 bg-black/30 p-3 rounded-xl border hairline">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-400">Completion Progress</span>
                    <span className="font-bold text-gold">{p.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#a5854e] to-[#e3c893]" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>

                {/* Milestones checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Milestones & Sprint Deliverables</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {p.milestones.map((m) => (
                      <div key={m.id} className="p-3 rounded-xl bg-white/[0.02] border hairline flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${m.completed ? 'bg-lime-400 text-black' : 'bg-stone-800 text-stone-500'}`}>
                            {m.completed ? '✓' : '○'}
                          </span>
                          <span className={m.completed ? 'text-stone-400 line-through' : 'text-white font-medium'}>{m.title}</span>
                        </div>
                        <span className="mono text-[9px] text-stone-500">{m.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {clientProjects.length === 0 && (
              <div className="py-12 text-center surface rounded-2xl border hairline space-y-3">
                <div className="text-3xl">📁</div>
                <h3 className="text-base font-bold text-white">No Active Builds Found</h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Submit a new project request to kick off your custom software development with Client Found Studios.
                </p>
                <button onClick={onOpenInquiry} className="btn-gold rounded-xl px-5 py-2.5 text-xs font-bold">
                  Submit Project Brief →
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INVOICES */}
        {activeTab === 'invoices' && (
          <div className="overflow-y-auto space-y-3 pr-1">
            {clientInvoices.map((inv) => (
              <div key={inv.id} className="p-4 rounded-2xl surface border hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="mono text-[10px] text-gold">{inv.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      inv.status === 'Paid' ? 'bg-lime-400/20 text-lime-300' : 'bg-amber-400/20 text-amber-300'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{inv.description}</h4>
                  <div className="text-xs text-stone-400">Issued: {inv.issuedDate} · Due: {inv.dueDate}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-base font-bold text-white tabular-nums">${inv.amount.toLocaleString()}</div>
                  </div>
                  {inv.status === 'Pending' && (
                    <button
                      onClick={() => handlePayInvoice(inv.id)}
                      className="btn-gold rounded-xl px-4 py-2 text-xs font-bold shadow-lg shadow-gold/20"
                    >
                      ⚡ Pay Now ($)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
