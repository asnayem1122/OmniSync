import React, { useState, useEffect } from 'react';
import IncomingJobsQueue from './IncomingJobsQueue';
import ProviderScheduleView from './ProviderScheduleView';
import ActiveJobControls from './ActiveJobControls';
import {
  Inbox,
  Calendar,
  Activity,
  UserCheck,
  Star,
  Award,
  Zap,
  ChevronDown,
} from 'lucide-react';

export default function ProviderDashboard({
  providers = [],
  requests = [],
  onAcceptJob,
  onRejectJob,
  onUpdateJobStatus,
  onAddManualSlot,
  isProcessing,
  activeRequestId,
}) {
  // Currently selected provider persona
  const [selectedProviderId, setSelectedProviderId] = useState(
    providers[0]?._id || ''
  );
  const [providerTab, setProviderTab] = useState('queue'); // 'queue' | 'active' | 'schedule'

  // Sync if providers update
  useEffect(() => {
    if (!selectedProviderId && providers.length > 0) {
      setSelectedProviderId(providers[0]._id);
    }
  }, [providers, selectedProviderId]);

  const currentProvider =
    providers.find((p) => p._id === selectedProviderId) || providers[0];

  // Find if this provider has an active (Accepted / On the Way / In Progress) job
  const activeJob =
    requests.find(
      (r) =>
        r.assignedProvider?._id === currentProvider?._id &&
        ['Accepted', 'On the Way', 'In Progress'].includes(r.status)
    ) ||
    requests.find((r) => r._id === activeRequestId && r.assignedProvider?._id === currentProvider?._id) ||
    null;

  // Count pending queue jobs for this provider's category
  const pendingCount = requests.filter(
    (r) =>
      r.status === 'Requested' &&
      currentProvider &&
      (r.serviceType.toLowerCase().includes(currentProvider.category.toLowerCase()) ||
        currentProvider.category.toLowerCase().includes(r.serviceType.toLowerCase()))
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Provider Switcher & Profile Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 bg-slate-900/60 backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Persona selector & details */}
          {currentProvider && (
            <div className="flex items-center gap-4">
              <img
                src={currentProvider.avatar}
                alt={currentProvider.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/60 shadow-xl shadow-emerald-500/20"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                    {currentProvider.name}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {currentProvider.expertiseLevel}
                  </span>
                </div>
                <p className="text-xs text-emerald-400 font-semibold">{currentProvider.category}</p>

                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <div className="flex items-center text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 mr-1" />
                    {currentProvider.rating.toFixed(1)}
                  </div>
                  <span>•</span>
                  <span className="text-teal-300 font-semibold">${currentProvider.basePrice}/hr</span>
                  <span>•</span>
                  <span>{currentProvider.location?.city || 'Metropolis'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Persona Dropdown for Hackathon Demo */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold">Simulate Specialist:</span>
            <div className="relative w-full sm:w-64">
              <select
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none cursor-pointer pr-9"
              >
                {providers.map((p) => (
                  <option key={p._id} value={p._id} className="bg-slate-900 text-white">
                    {p.name} ({p.category.split(' ')[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setProviderTab('queue')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
              providerTab === 'queue'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Incoming Jobs Queue
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setProviderTab('active')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative ${
              providerTab === 'active'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            <Activity className="w-4 h-4" />
            Active Job & Status Controls
            {activeJob && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setProviderTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              providerTab === 'schedule'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/[0.04] text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar & Blocked Slots
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {providerTab === 'queue' && (
        <IncomingJobsQueue
          requests={requests}
          currentProvider={currentProvider}
          onAcceptJob={onAcceptJob}
          onRejectJob={onRejectJob}
          isProcessing={isProcessing}
        />
      )}

      {providerTab === 'active' && (
        <ActiveJobControls
          activeJob={activeJob}
          onUpdateStatus={onUpdateJobStatus}
          isUpdating={isProcessing}
          onViewQueue={() => setProviderTab('queue')}
        />
      )}

      {providerTab === 'schedule' && (
        <ProviderScheduleView
          provider={currentProvider}
          onAddManualSlot={onAddManualSlot}
          isAddingSlot={isProcessing}
        />
      )}
    </div>
  );
}
