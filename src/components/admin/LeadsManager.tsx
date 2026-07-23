import React, { useState } from 'react';
import { studioStore, Lead } from '../../store/studioStore';

interface Props {
  onNotification: (msg: string) => void;
}

export const LeadsManager: React.FC<Props> = ({ onNotification }) => {
  const [filter, setFilter] = useState<'All' | 'New' | 'Reviewing' | 'Quoted' | 'Approved'>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const state = studioStore.getState();

  const leadsList = state.leads.filter((l) => (filter === 'All' ? true : l.status === filter));

  const handleStatusChange = (id: string, status: Lead['status']) => {
    studioStore.updateLeadStatus(id, status);
    onNotification(`Lead status updated to ${status}`);
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, status });
    }
  };

  const handleConvert = (leadId: string) => {
    const prj = studioStore.convertLeadToProject(leadId);
    if (prj) {
      onNotification(`Converted lead to active project "${prj.name}" (${prj.id})!`);
      setSelectedLead(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b hairline">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-[#e3c893]">Inbound Pipeline</div>
          <h2 className="text-xl font-bold text-white tracking-tight">Client Leads & Project Inquiries</h2>
          <p className="text-xs text-stone-400">Review project briefs submitted from the landing page</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-white/[0.03] p-1.5 rounded-xl border hairline">
          {(['All', 'New', 'Reviewing', 'Quoted', 'Approved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === st
                  ? 'bg-gold text-[#0a0c10] font-bold shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="surface rounded-2xl border hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b hairline bg-white/[0.02] text-[10px] uppercase tracking-wider text-stone-400">
                <th className="p-4">Lead ID</th>
                <th className="p-4">Client / Company</th>
                <th className="p-4">Requested Service</th>
                <th className="p-4">Budget Range</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y hairline text-xs text-stone-300">
              {leadsList.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 mono font-semibold text-gold">{lead.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{lead.company}</div>
                    <div className="text-[11px] text-stone-400">{lead.name} · {lead.email}</div>
                  </td>
                  <td className="p-4">{lead.service}</td>
                  <td className="p-4 font-medium text-stone-200">{lead.budget}</td>
                  <td className="p-4 mono text-[10px] text-stone-500">{lead.createdAt}</td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                      className="bg-[#12141a] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-stone-200 focus:outline-none focus:border-gold"
                    >
                      <option value="New">New</option>
                      <option value="Reviewing">Reviewing</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="btn-ghost rounded-lg px-3 py-1 text-xs"
                    >
                      View Brief
                    </button>
                    {lead.status !== 'Approved' && (
                      <button
                        onClick={() => handleConvert(lead.id)}
                        className="btn-gold rounded-lg px-3 py-1 text-xs font-semibold"
                      >
                        ⚡ Convert to Build
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {leadsList.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500">
                    No leads found matching filter "{filter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-[300] video-modal-backdrop flex items-center justify-center p-4">
          <div className="surface-strong rounded-3xl p-6 sm:p-8 gold-border w-full max-w-xl space-y-5 animate-modal-in">
            <div className="flex items-center justify-between pb-3 border-b hairline">
              <div>
                <span className="mono text-[10px] text-gold">{selectedLead.id}</span>
                <h3 className="text-xl font-bold text-white">{selectedLead.company}</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-stone-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 surface rounded-xl">
                <span className="text-stone-500 block text-[10px]">Contact Person</span>
                <span className="font-semibold text-white">{selectedLead.name}</span>
              </div>
              <div className="p-3 surface rounded-xl">
                <span className="text-stone-500 block text-[10px]">Email Address</span>
                <span className="font-semibold text-white">{selectedLead.email}</span>
              </div>
              <div className="p-3 surface rounded-xl">
                <span className="text-stone-500 block text-[10px]">Requested Service</span>
                <span className="font-semibold text-white">{selectedLead.service}</span>
              </div>
              <div className="p-3 surface rounded-xl">
                <span className="text-stone-500 block text-[10px]">Budget & Timeline</span>
                <span className="font-semibold text-[#e3c893]">{selectedLead.budget} ({selectedLead.timeline})</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-400">Client Brief & Scope Notes:</label>
              <div className="p-4 surface rounded-xl text-xs text-stone-300 leading-relaxed bg-black/30">
                "{selectedLead.description}"
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="btn-ghost rounded-xl px-4 py-2 text-xs"
              >
                Close
              </button>
              {selectedLead.status !== 'Approved' && (
                <button
                  onClick={() => handleConvert(selectedLead.id)}
                  className="btn-gold rounded-xl px-5 py-2 text-xs font-bold"
                >
                  ⚡ Convert Lead into Active Studio Project
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
