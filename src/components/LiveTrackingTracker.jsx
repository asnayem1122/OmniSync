import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Car,
  Wrench,
  Sparkles,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Play,
  RotateCcw,
  Check,
} from 'lucide-react';

const PIPELINE_STEPS = [
  {
    id: 'Requested',
    label: 'Requested',
    description: 'Dispatch query registered & sent to technician',
    icon: Clock,
  },
  {
    id: 'Accepted',
    label: 'Accepted',
    description: 'Technician confirmed schedule slot',
    icon: CheckCircle2,
  },
  {
    id: 'On the Way',
    label: 'On the Way',
    description: 'Technician en route to service location',
    icon: Car,
  },
  {
    id: 'In Progress',
    label: 'In Progress',
    description: 'Diagnostic & smart installation underway',
    icon: Wrench,
  },
  {
    id: 'Completed',
    label: 'Completed',
    description: 'Ecosystem tested & calibrated successfully',
    icon: Sparkles,
  },
];

export default function LiveTrackingTracker({
  request,
  onUpdateStatus,
  isUpdating,
  onNewRequest,
}) {
  if (!request) {
    return (
      <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-12 text-center border border-white/10">
        <AlertCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Active Dispatch Tracking</h2>
        <p className="text-sm text-slate-400 mb-6">
          You currently do not have an active service job in transit. Create a new service request to initiate tracking.
        </p>
        <button
          onClick={onNewRequest}
          className="px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20"
        >
          Book a Smart Home Service
        </button>
      </div>
    );
  }

  const currentStepIndex = PIPELINE_STEPS.findIndex((s) => s.id === request.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const progressPercent = (activeIndex / (PIPELINE_STEPS.length - 1)) * 100;

  const nextStep = activeIndex < PIPELINE_STEPS.length - 1 ? PIPELINE_STEPS[activeIndex + 1].id : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-900/60 backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Dispatch Telemetry
              </span>
              <span className="text-xs text-slate-400">Request ID: #{request._id?.slice(-6)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {request.serviceType}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Customer: <strong className="text-white">{request.customer?.name}</strong> •{' '}
              {request.customer?.address}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                request.status === 'Completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/40 animate-pulse'
              }`}
            >
              Current Status: {request.status}
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Horizontal Pipeline Stepper */}
        {/* ---------------------------------------------------- */}
        <div className="pt-8 pb-4">
          <div className="relative">
            {/* Background Line */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-white/10 rounded-full -z-0" />

            {/* Glowing Active Fill Line */}
            <div
              className="absolute top-5 left-8 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700 -z-0 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `calc(${progressPercent}% * 0.88)` }}
            />

            {/* Stepper Nodes */}
            <div className="relative z-10 flex justify-between items-start">
              {PIPELINE_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < activeIndex;
                const isCurrent = idx === activeIndex;
                const isUpcoming = idx > activeIndex;

                return (
                  <div key={step.id} className="flex flex-col items-center text-center max-w-[90px] sm:max-w-[120px]">
                    {/* Node Dot / Circle */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                          : isCurrent
                          ? 'bg-gradient-to-tr from-emerald-400 to-teal-400 text-slate-950 ring-4 ring-emerald-400/30 shadow-xl shadow-emerald-400/50 scale-110'
                          : 'bg-slate-900 border border-white/20 text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 stroke-[3]" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`text-xs font-bold mt-3 ${
                        isCurrent
                          ? 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                          : isCompleted
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>

                    <span className="text-[10px] text-slate-400 hidden sm:block mt-0.5 leading-tight">
                      {step.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Assigned Provider Info & Status Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Provider Card */}
        <div className="lg:col-span-1 glass-panel rounded-3xl p-6 border border-white/10 bg-slate-900/50">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Assigned Service Specialist
          </span>

          {request.assignedProvider ? (
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={request.assignedProvider.avatar}
                  alt={request.assignedProvider.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400/50"
                />
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {request.assignedProvider.name}
                  </h3>
                  <span className="text-xs text-emerald-400 font-medium">
                    {request.assignedProvider.expertiseLevel} Specialist
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-amber-300">
                    <span>★ {request.assignedProvider.rating}</span>
                    <span className="text-slate-400">
                      ({request.assignedProvider.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-white/[0.02] p-3 rounded-2xl border border-white/5 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-semibold text-white">{request.assignedProvider.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rate:</span>
                  <span className="font-semibold text-teal-300">
                    ${request.assignedProvider.basePrice}/hr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dispatch ETA:</span>
                  <span className="font-semibold text-emerald-400">
                    {request.status === 'On the Way'
                      ? '12 - 18 mins'
                      : request.status === 'In Progress'
                      ? 'On Site'
                      : request.status === 'Completed'
                      ? 'Resolved'
                      : 'Scheduled'}
                  </span>
                </div>
              </div>

              <a
                href={`tel:${request.assignedProvider.phone}`}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                Contact Technician
              </a>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              Awaiting specialist confirmation...
            </div>
          )}
        </div>

        {/* Status Timeline History & Hackathon Simulator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hackathon Simulation Bar */}
          <div className="glass-panel rounded-3xl p-6 border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                  Hackathon Stage Simulator
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Simulate real-time provider state transitions
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {PIPELINE_STEPS.map((step) => {
                const isActive = request.status === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => onUpdateStatus(request._id, step.id)}
                    disabled={isUpdating}
                    className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/30'
                        : 'bg-white/[0.05] hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    {step.label}
                  </button>
                );
              })}

              {nextStep && (
                <button
                  onClick={() => onUpdateStatus(request._id, nextStep)}
                  disabled={isUpdating}
                  className="ml-auto text-xs px-4 py-2 rounded-xl font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/25"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  Next: {nextStep}
                </button>
              )}
            </div>
          </div>

          {/* Audit Log / History */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 bg-slate-900/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-4">
              Dispatch Audit Log & Timeline
            </span>

            <div className="space-y-3">
              {request.statusHistory?.map((hist, hIdx) => (
                <div
                  key={hIdx}
                  className="flex items-start gap-3 text-xs p-3 rounded-2xl bg-white/[0.02] border border-white/5"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-sm" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{hist.status}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(hist.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{hist.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
