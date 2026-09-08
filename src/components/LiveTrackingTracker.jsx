import React, { useState } from 'react';
import LiveServiceMap from './LiveServiceMap';
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
  Star,
  Award,
  ThumbsUp,
  Camera,
  Maximize2,
  X,
  FileText,
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
  onOpenReviewModal,
}) {
  if (!request) {
    return (
      <div className="max-w-4xl mx-auto spatial-panel rounded-3xl p-12 text-center border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/60 shadow-spatial-md">
        <AlertCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">No Active Dispatch Tracking</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium">
          You currently do not have an active service job in transit. Create a new service request to initiate live tracking.
        </p>
        <button
          onClick={onNewRequest}
          className="forest-pill-btn px-6 py-3 text-sm font-extrabold shadow-lg cursor-pointer"
        >
          Book a Smart Home Specialist
        </button>
      </div>
    );
  }

  const [selectedImageModal, setSelectedImageModal] = useState(null);

  const currentStepIndex = PIPELINE_STEPS.findIndex((s) => s.id === request.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const progressPercent = (activeIndex / (PIPELINE_STEPS.length - 1)) * 100;

  const nextStep = activeIndex < PIPELINE_STEPS.length - 1 ? PIPELINE_STEPS[activeIndex + 1].id : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="spatial-panel rounded-3xl p-6 sm:p-8 border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/60 backdrop-blur-2xl shadow-spatial-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 shadow-xs">
                Live Telemetry Pipeline
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Request #{request._id?.slice(-6)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {request.serviceType}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
              Customer: <strong className="text-slate-900 dark:text-white font-bold">{request.customer?.name}</strong> •{' '}
              {request.customer?.address}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm ${
                request.status === 'Completed'
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40'
                  : 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border border-teal-500/40 animate-pulse'
              }`}
            >
              Current Status: {request.status}
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* Horizontal Pipeline Stepper */}
        {/* ---------------------------------------------------- */}
        <div className="pt-6 sm:pt-8 pb-3 sm:pb-4">
          <div className="relative">
            {/* Background Line */}
            <div className="absolute top-4 sm:top-5 left-5 sm:left-8 right-5 sm:right-8 h-1 bg-slate-200 dark:bg-white/10 rounded-full -z-0" />

            {/* Glowing Active Fill Line */}
            <div
              className="absolute top-4 sm:top-5 left-5 sm:left-8 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700 -z-0 shadow-[0_0_12px_rgba(16,185,129,0.7)]"
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
                  <div key={step.id} className="flex flex-col items-center text-center max-w-[64px] sm:max-w-[120px]">
                    {/* Node Dot / Circle */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                          : isCurrent
                          ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-white ring-2 sm:ring-4 ring-emerald-400/30 shadow-xl shadow-emerald-500/40 scale-105 sm:scale-110'
                          : 'bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/20 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                      ) : (
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </div>

                    {/* Step Label */}
                    <span
                      className={`text-[10px] sm:text-xs font-bold mt-2 sm:mt-3 leading-tight ${
                        isCurrent
                          ? 'text-emerald-700 dark:text-emerald-300 font-extrabold'
                          : isCompleted
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {step.label}
                    </span>

                    <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5 leading-tight font-medium">
                      {step.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Post-Completion Rating & Review Banner */}
        {request.status === 'Completed' && (
          <div className="mt-4 pt-6 border-t border-slate-200/80 dark:border-white/10">
            {request.review && request.review.rating ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#EBF5F0] dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#1E3A2B] dark:text-emerald-300">
                      ★ Service Verified & Rated
                    </span>
                    <div className="flex text-amber-500">
                      {[...Array(request.review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    "{request.review.comment}"
                  </p>
                </div>
                <div className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-white/80 dark:bg-slate-900/60 px-3 py-1 rounded-xl shadow-xs shrink-0">
                  Overall Score Recalculated
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-400/40 dark:border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      Task Completed Successfully!
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    How was your experience with <strong>{request.assignedProvider?.name || 'the specialist'}</strong>? Your rating directly updates their overall technician score.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenReviewModal?.(request)}
                  className="forest-pill-btn px-5 py-2.5 text-xs font-bold gap-2 cursor-pointer shadow-md shrink-0"
                >
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Rate Specialist (1-5 ★)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* Real-time Interactive GIS Service Map */}
      {/* ---------------------------------------------------- */}
      <LiveServiceMap
        provider={request.assignedProvider}
        customerLocation={request.location}
        customerAddress={request.customer?.address || request.location?.address}
        customerName={request.customer?.name}
        status={request.status}
        urgency={request.urgency}
      />

      {/* Grid: Assigned Provider Info & Status Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Assigned Provider Card */}
          <div className="spatial-panel rounded-3xl p-6 border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/50 shadow-spatial-md">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-3">
            Assigned Service Specialist
          </span>

          {request.assignedProvider ? (
            <div>
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={request.assignedProvider.avatar}
                  alt={request.assignedProvider.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {request.assignedProvider.name}
                  </h3>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                    {request.assignedProvider.expertiseLevel} Specialist
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-amber-500 dark:text-amber-300 font-bold">
                    <span>★ {request.assignedProvider.rating}</span>
                    <span className="text-slate-400 font-normal">
                      ({request.assignedProvider.reviewsCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-white/[0.02] p-3 rounded-2xl border border-slate-200/80 dark:border-white/5 mb-4 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Phone:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{request.assignedProvider.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Rate:</span>
                  <span className="font-bold text-teal-700 dark:text-teal-300">
                    ৳{request.assignedProvider.basePrice}/hr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Dispatch ETA:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
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
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900/[0.05] hover:bg-slate-900/[0.08] dark:bg-white/[0.06] dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Contact Specialist
              </a>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs font-medium">
              Awaiting specialist confirmation...
            </div>
          )}
        </div>

        {/* Customer Problem & Attached Photo Card */}
        <div className="spatial-panel rounded-3xl p-6 border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/50 shadow-spatial-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Dispatched Problem Report
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20">
              Urgency: {request.urgency}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            <span className="text-slate-500 font-bold block text-[10px] uppercase mb-1">
              Customer Issue Notes:
            </span>
            {request.details || 'Standard maintenance & installation.'}
          </div>

          {/* Problem Photo Thumbnail */}
          {request.image ? (
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Camera className="w-3 h-3 text-emerald-600" /> Attached Problem Photo:
              </span>
              <div
                onClick={() => setSelectedImageModal(request.image)}
                className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 cursor-pointer max-h-40 aspect-video flex items-center justify-center shadow-xs"
              >
                <img
                  src={request.image}
                  alt="Customer Issue"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold backdrop-blur-xs">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge Photo</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 dark:text-slate-500 italic p-3 bg-slate-50 dark:bg-white/[0.01] rounded-2xl border border-dashed border-slate-200 dark:border-white/5 text-center">
              No problem photo attached to this dispatch.
            </div>
          )}
        </div>
      </div>

        {/* Status Timeline History & Simulator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Operational Simulator */}
          <div className="spatial-panel rounded-3xl p-6 border border-emerald-500/30 bg-emerald-500/[0.08] dark:bg-emerald-950/20 backdrop-blur-xl shadow-spatial-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Live Dispatch Simulator
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Simulate real-time specialist state transitions
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
                    className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30'
                        : 'bg-white/80 hover:bg-white text-slate-700 dark:bg-white/[0.05] dark:hover:bg-white/10 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-xs'
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
                  className="ml-auto text-xs px-4 py-2 rounded-xl font-extrabold bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Next: {nextStep}
                </button>
              )}
            </div>
          </div>

          {/* Audit Log / History */}
          <div className="spatial-panel rounded-3xl p-6 border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/50 shadow-spatial-md">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-4">
              Dispatch Audit Log & Timeline
            </span>

            <div className="space-y-3">
              {request.statusHistory?.map((hist, hIdx) => (
                <div
                  key={hIdx}
                  className="flex items-start gap-3 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 shadow-sm" />
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

      {/* Dispatched Problem Photo Enlarge Modal */}
      {selectedImageModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImageModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl p-4 border border-white/20 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-white/10">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" /> Dispatched Hardware Problem Attachment
              </span>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={selectedImageModal}
              alt="Problem Full View"
              className="w-full max-h-[70vh] object-contain rounded-2xl bg-black/40"
            />
          </div>
        </div>
      )}
    </div>
  );
}

