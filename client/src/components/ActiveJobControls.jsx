import React, { useState } from 'react';
import {
  Car,
  Wrench,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  User,
  Navigation,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

const STATUS_FLOW = [
  {
    id: 'Accepted',
    title: '1. Accepted',
    actionText: 'Dispatch: Mark On The Way',
    nextStatus: 'On the Way',
    icon: CheckCircle2,
    color: 'from-teal-500 to-emerald-500',
  },
  {
    id: 'On the Way',
    title: '2. On the Way',
    actionText: 'Arrived: Start Diagnostic & Repair',
    nextStatus: 'In Progress',
    icon: Car,
    color: 'from-emerald-500 to-cyan-500',
  },
  {
    id: 'In Progress',
    title: '3. In Progress',
    actionText: 'Finished: Complete & Test Systems',
    nextStatus: 'Completed',
    icon: Wrench,
    color: 'from-cyan-500 to-teal-400',
  },
  {
    id: 'Completed',
    title: '4. Completed',
    actionText: 'Job Successfully Closed',
    nextStatus: null,
    icon: Sparkles,
    color: 'from-emerald-400 to-teal-400',
  },
];

export default function ActiveJobControls({
  activeJob,
  onUpdateStatus,
  isUpdating,
  onViewQueue,
}) {
  const [transitionNote, setTransitionNote] = useState('');

  if (!activeJob) {
    return (
      <div className="spatial-panel rounded-3xl p-12 text-center border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/60 shadow-spatial-md">
        <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-4 text-teal-600 dark:text-teal-400">
          <FileCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">No Active Assignment</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 font-medium">
          You currently do not have an active accepted service call. Browse the Incoming Jobs Queue to accept a new customer dispatch.
        </p>
        <button
          onClick={onViewQueue}
          className="px-6 py-3 rounded-2xl font-extrabold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all cursor-pointer"
        >
          Check Incoming Jobs Queue
        </button>
      </div>
    );
  }

  const currentFlowStep = STATUS_FLOW.find((s) => s.id === activeJob.status) || STATUS_FLOW[0];
  const nextStage = currentFlowStep.nextStatus;

  const handleNextAction = () => {
    if (!nextStage) return;
    const defaultNotes = {
      'On the Way': 'Technician is in transit with diagnostic tools and replacement parts.',
      'In Progress': 'Technician arrived on site. Running hardware diagnostics and IoT pairing.',
      Completed: 'Service complete. All circuits, mesh hubs, and sensors calibrated and verified.',
    };
    onUpdateStatus(activeJob._id, nextStage, transitionNote || defaultNotes[nextStage]);
    setTransitionNote('');
  };

  const handleDirectStatusChange = (status) => {
    onUpdateStatus(activeJob._id, status, `Direct status transition to ${status}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="spatial-panel rounded-3xl p-6 sm:p-8 border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/60 backdrop-blur-2xl shadow-spatial-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 shadow-xs">
                Active Job In Progress
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Order ID #{activeJob._id?.slice(-6)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {activeJob.serviceType}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Customer: <strong className="text-slate-900 dark:text-white font-bold">{activeJob.customer?.name}</strong> •{' '}
              {activeJob.customer?.address}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-sm ${
                activeJob.status === 'Completed'
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/50'
                  : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 animate-pulse'
              }`}
            >
              Status: {activeJob.status}
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Prominent Status Controls Button Group */}
        {/* ---------------------------------------------------- */}
        <div className="pt-6">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
            Synchronize Pipeline State with Central Dispatch:
          </label>

          {/* Quick Step Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {STATUS_FLOW.map((step) => {
              const Icon = step.icon;
              const isCurrent = activeJob.status === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => handleDirectStatusChange(step.id)}
                  disabled={isUpdating}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-500/15 border-emerald-500 text-slate-900 dark:text-white shadow-spatial-sm ring-1 ring-emerald-500/30'
                      : 'bg-white/80 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-slate-300 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white shadow-xs'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold">{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Next Stage Primary Action Banner */}
          {nextStage && (
            <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-gradient-to-r dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-teal-950/40 border border-slate-200 dark:border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Recommended Next Transition:</span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5">
                  <span className="text-emerald-700 dark:text-emerald-400">{activeJob.status}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <span className="text-teal-700 dark:text-teal-300">{nextStage}</span>
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Optional status note..."
                  value={transitionNote}
                  onChange={(e) => setTransitionNote(e.target.value)}
                  className="spatial-input rounded-xl px-3 py-2 text-xs w-full sm:w-56 font-medium"
                />
                <button
                  onClick={handleNextAction}
                  disabled={isUpdating}
                  className="py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/30 transition-all shrink-0 active:scale-[0.98] cursor-pointer"
                >
                  {isUpdating ? 'Syncing...' : currentFlowStep.actionText}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer & Location Dossier */}
        <div className="lg:col-span-1 spatial-panel rounded-3xl p-6 border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/50 space-y-4 shadow-spatial-md">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Customer Dossier
          </span>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-lg shadow-sm">
              {activeJob.customer?.name?.[0] || 'C'}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{activeJob.customer?.name}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{activeJob.customer?.phone}</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200/80 dark:border-white/5 font-medium">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{activeJob.customer?.address || activeJob.location?.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Urgency: <strong className="text-amber-600 dark:text-amber-300 font-bold">{activeJob.urgency}</strong></span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={`tel:${activeJob.customer?.phone}`}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/[0.05] hover:bg-slate-900/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Call Customer
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                activeJob.customer?.address || ''
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              Launch GPS Navigation
            </a>
          </div>
        </div>

        {/* Audit Log Timeline */}
        <div className="lg:col-span-2 spatial-panel rounded-3xl p-6 border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/50 shadow-spatial-md">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-4">
            Audit Trail & Telemetry Sync Log
          </span>

          <div className="space-y-3">
            {activeJob.statusHistory?.map((hist, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0 shadow-sm" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{hist.status}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(hist.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 font-medium">{hist.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

