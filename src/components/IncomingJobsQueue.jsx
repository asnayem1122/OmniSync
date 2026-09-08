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
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Medium':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel rounded-2xl p-5 border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">Incoming Jobs Queue</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              {queueJobs.length} Pending
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time customer requests matching your discipline ({currentProvider?.category}).
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-950/50 px-3 py-1.5 rounded-xl border border-white/5">
          Provider: <strong className="text-emerald-400">{currentProvider?.name}</strong>
        </div>
      </div>

      {queueJobs.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Queue is Clear!</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
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
                className="glass-panel rounded-3xl p-6 border border-white/10 bg-slate-900/50 hover:border-emerald-500/40 transition-all flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Bar */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        #{job._id?.slice(-6)} • {job.serviceType}
                      </span>
                      <h3 className="font-extrabold text-white text-lg mt-0.5">
                        {job.customer?.name}
                      </h3>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-xl font-bold border ${getUrgencyBadge(
                        job.urgency
                      )}`}
                    >
                      {job.urgency}
                    </span>
                  </div>

                  {/* Address & Location */}
                  <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{job.location?.address || job.customer?.address}</span>
                  </div>

                  {/* Scheduled Window */}
                  <div className="flex items-center gap-2 text-xs text-slate-300 mb-4">
                    <Calendar className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>
                      Window: {startTimeStr} {endTimeStr ? `- ${endTimeStr}` : ''}
                    </span>
                  </div>

                  {/* Details Box */}
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-300 mb-5 leading-relaxed">
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase mb-1">
                      Problem Scope:
                    </span>
                    {job.details || 'No specific notes provided.'}
                  </div>
                </div>

                {/* Accept / Reject Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleReject(job._id)}
                    disabled={isProcessing}
                    className="py-3 px-4 rounded-xl font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline Job</span>
                  </button>

                  <button
                    onClick={() => onAcceptJob(job)}
                    disabled={isProcessing}
                    className="py-3 px-4 rounded-xl font-extrabold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-[0.98]"
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
