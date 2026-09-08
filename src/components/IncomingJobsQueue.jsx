import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  AlertTriangle,
  Check,
  X,
  User,
  Phone,
  FileText,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function IncomingJobsQueue({
  requests = [],
  currentProvider,
  onAcceptJob,
  onRejectJob,
  isProcessing,
}) {
  const [rejectedIds, setRejectedIds] = useState([]);

  // Filter for jobs that are in 'Requested' status and not locally rejected
  const queueJobs = requests.filter(
    (r) =>
      r.status === 'Requested' &&
      !rejectedIds.includes(r._id) &&
      (!currentProvider ||
        r.serviceType.toLowerCase().includes(currentProvider.category.toLowerCase()) ||
        currentProvider.category.toLowerCase().includes(r.serviceType.toLowerCase()))
  );

  const handleReject = (jobId) => {
    setRejectedIds((prev) => [...prev, jobId]);
    if (onRejectJob) onRejectJob(jobId);
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'Emergency':
        return 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/40 animate-pulse font-extrabold';
      case 'High':
        return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40 font-bold';
      case 'Medium':
        return 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/40 font-bold';
      default:
        return 'bg-slate-100 dark:bg-slate-700/40 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600/40 font-medium';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 spatial-panel rounded-2xl p-5 border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/60 shadow-spatial-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Incoming Jobs Queue</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-extrabold border border-emerald-500/30 shadow-xs">
              {queueJobs.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Real-time customer requests matching your discipline ({currentProvider?.category}).
          </p>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-950/50 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 shadow-xs">
          Specialist: <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{currentProvider?.name}</strong>
        </div>
      </div>

      {queueJobs.length === 0 ? (
        <div className="spatial-panel rounded-3xl p-12 text-center border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/60 shadow-spatial-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">Queue is Clear!</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium">
            No pending dispatch requests for this discipline. New customer bookings will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {queueJobs.map((job) => {
            const timeRange = job.preferredTimeRange;
            const startTimeStr = timeRange?.start
              ? new Date(timeRange.start).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Flexible';
            const endTimeStr = timeRange?.end
              ? new Date(timeRange.end).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <div
                key={job._id}
                className="spatial-card spatial-card-hover rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/50 hover:border-emerald-500/50 transition-all flex flex-col justify-between relative overflow-hidden shadow-spatial-sm"
              >
                {/* Top Bar */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        #{job._id?.slice(-6)} • {job.serviceType}
                      </span>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mt-0.5">
                        {job.customer?.name}
                      </h3>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-xl font-bold border shadow-xs ${getUrgencyBadge(
                        job.urgency
                      )}`}
                    >
                      {job.urgency}
                    </span>
                  </div>

                  {/* Address & Location */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mb-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate">{job.location?.address || job.customer?.address}</span>
                  </div>

                  {/* Scheduled Window */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 mb-4 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span>
                      Window: {startTimeStr} {endTimeStr ? `- ${endTimeStr}` : ''}
                    </span>
                  </div>

                  {/* Details Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300 mb-5 leading-relaxed font-medium">
                    <span className="text-slate-500 font-bold block text-[10px] uppercase mb-1">
                      Problem Scope:
                    </span>
                    {job.details || 'No specific notes provided.'}
                  </div>
                </div>

                {/* Accept / Reject Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 dark:border-white/10">
                  <button
                    onClick={() => handleReject(job._id)}
                    disabled={isProcessing}
                    className="py-3 px-4 rounded-xl font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 hover:border-rose-500/50 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline Job</span>
                  </button>

                  <button
                    onClick={() => onAcceptJob(job)}
                    disabled={isProcessing}
                    className="py-3 px-4 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-[0.98] cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Accept Job</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

