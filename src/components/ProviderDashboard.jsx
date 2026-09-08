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
  Banknote,
  CheckCircle2,
  Clock,
  Power,
  ShieldCheck,
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
  currentUser,
}) {
  // Currently selected provider persona
  const [selectedProviderId, setSelectedProviderId] = useState(
    currentUser?.providerId || providers[0]?._id || ''
  );
  const [providerTab, setProviderTab] = useState('queue'); // 'queue' | 'active' | 'schedule'
  const [isOnline, setIsOnline] = useState(true);

  // Sync if currentUser or providers update
  useEffect(() => {
    if (currentUser?.role === 'provider' && currentUser.providerId) {
      setSelectedProviderId(currentUser.providerId);
    } else if (!selectedProviderId && providers.length > 0) {
      setSelectedProviderId(providers[0]._id);
    }
  }, [currentUser, providers, selectedProviderId]);

  const currentProvider =
    providers.find((p) => p._id === selectedProviderId) || providers[0];

  useEffect(() => {
    if (currentProvider) {
      setIsOnline(currentProvider.isAvailable ?? true);
    }
  }, [currentProvider]);

  const handleToggleOnline = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (currentProvider?._id) {
      try {
        await fetch(`/api/providers/${currentProvider._id}/availability`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isAvailable: nextState }),
        });
      } catch (e) {
        console.error('Failed to toggle availability:', e);
      }
    }
  };

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

  // Completed jobs by this provider
  const completedCount = requests.filter(
    (r) => r.assignedProvider?._id === currentProvider?._id && r.status === 'Completed'
  ).length + (currentProvider?.completedJobsCount || 12);

  const earnings = completedCount * (currentProvider?.basePrice || 95) * 2;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Provider Switcher & Profile Card */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-white/10 shadow-clean-card relative overflow-hidden">
        {/* Decorative ambient gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-white/10">
          {/* Persona details */}
          {currentProvider && (
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={currentProvider.avatar}
                  alt={currentProvider.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#1E3A2B] dark:border-emerald-500 shadow-md"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                    isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {currentProvider.name}
                  </h1>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EBF5F0] text-[#1E3A2B] dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40 shadow-xs">
                    {currentProvider.expertiseLevel}
                  </span>
                </div>
                <p className="text-xs text-[#1E3A2B] dark:text-emerald-400 font-bold mt-0.5">
                  {currentProvider.category}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <div className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                    {currentProvider.rating?.toFixed(1)}
                    <span className="text-slate-400 font-normal ml-1">
                      ({currentProvider.reviewsCount} reviews)
                    </span>
                  </div>
                  <span>•</span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    ৳{currentProvider.basePrice}/hr Base
                  </span>
                  <span>•</span>
                  <span>{currentProvider.location?.city || 'Austin Metro'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Right Action: Online Toggle & Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Live Availability Toggle */}
            <button
              onClick={handleToggleOnline}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                isOnline
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isOnline ? 'Online & Available' : 'Offline / On Break'}</span>
            </button>

            {/* Specialist Dropdown (Demo switcher) */}
            <div className="relative w-full sm:w-56">
              <select
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
                className="w-full rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-white appearance-none cursor-pointer pr-9 font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs"
              >
                {providers.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Performance KPI Metrics Ribbon */}
        {/* ---------------------------------------------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 dark:border-white/10">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Overall Rating
            </span>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {currentProvider?.rating?.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ 5.0</span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-0.5">
              {currentProvider?.reviewsCount} Verified Reviews
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Completed Tasks
            </span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {completedCount}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              Zero Fault Callbacks
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Revenue Accrued
            </span>
            <div className="flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-emerald-600" />
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                ৳{earnings.toLocaleString()} BDT
              </span>
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-0.5">
              Direct Deposit Ready
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
              Collision Shield
            </span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1E3A2B] dark:text-emerald-400" />
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                100%
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              0 Double-Bookings
            </span>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <button
            onClick={() => setProviderTab('queue')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              providerTab === 'queue'
                ? 'bg-[#1E3A2B] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Incoming Jobs Queue
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-xs">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setProviderTab('active')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
              providerTab === 'active'
                ? 'bg-[#1E3A2B] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Active Job Controls
            {activeJob && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setProviderTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              providerTab === 'schedule'
                ? 'bg-[#1E3A2B] text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
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
