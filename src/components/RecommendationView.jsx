import React from 'react';
import CircularProgress from './CircularProgress';
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Award,
  CheckCircle,
  Phone,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  Zap,
} from 'lucide-react';

export default function RecommendationView({
  matches = [],
  requestSummary,
  onSelectProvider,
  onBack,
  isBooking,
}) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Controls & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 spatial-panel rounded-2xl p-5 border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/60 shadow-spatial-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-900/[0.04] dark:bg-white/[0.05] hover:bg-slate-900/[0.08] dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Recommended Specialists
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-extrabold border border-emerald-500/30 shadow-sm">
                {matches.length} Matches Found
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Ranked in real-time by availability, Haversine distance, rating, price competitiveness, and expertise.
            </p>
          </div>
        </div>

        {requestSummary && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-medium shadow-sm">
              Service: <strong className="text-emerald-700 dark:text-emerald-400 font-bold ml-1">{requestSummary.serviceType}</strong>
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-amber-700 dark:text-amber-300 font-bold shadow-sm">
              {requestSummary.urgency} Urgency
            </span>
          </div>
        )}
      </div>

      {/* No matches fallback */}
      {matches.length === 0 && (
        <div className="spatial-panel rounded-3xl p-12 text-center border border-white/90 dark:border-white/10 bg-white/75 dark:bg-slate-900/60 shadow-spatial-md">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500 dark:text-slate-400">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">No Matching Specialists Found</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6 font-medium">
            All technicians in this discipline have conflicting bookings during this requested time slot. Try selecting a different time window or disable strict collision filtering.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all text-sm shadow-md"
          >
            Adjust Time Slot
          </button>
        </div>
      )}

      {/* Grid of Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map((item, index) => {
          const { provider, matchScore, breakdown } = item;
          const isTopMatch = index === 0;

          return (
            <div
              key={provider._id || index}
              className={`spatial-card spatial-card-hover rounded-3xl p-6 sm:p-7 border relative overflow-hidden transition-all duration-300 ${
                isTopMatch
                  ? 'border-emerald-500/50 bg-white/90 dark:bg-gradient-to-br dark:from-slate-900/80 dark:via-emerald-950/20 dark:to-slate-900/80 shadow-spatial-glow ring-1 ring-emerald-500/40'
                  : 'border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/50 shadow-spatial-sm'
              }`}
            >
              {/* Best Match Banner */}
              {isTopMatch && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-white" />
                  Top Match
                </div>
              )}

              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-3.5">
                  <img
                    src={provider.avatar}
                    alt={provider.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg leading-snug">
                      {provider.name}
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">{provider.category}</p>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <div className="flex items-center text-amber-500 dark:text-amber-300 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 mr-1" />
                        {provider.rating.toFixed(1)}
                        <span className="text-slate-400 font-normal ml-1">
                          ({provider.reviewsCount})
                        </span>
                      </div>
                      <span>•</span>
                      <span className="font-bold text-teal-700 dark:text-teal-300">${provider.basePrice}/hr</span>
                    </div>
                  </div>
                </div>

                {/* Circular Match Score Indicator */}
                <div className="shrink-0">
                  <CircularProgress score={matchScore} size={76} strokeWidth={6.5} />
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 leading-relaxed bg-slate-900/[0.02] dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5 font-medium">
                {provider.bio}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-xs">
                  <Award className="w-3 h-3 text-emerald-600" />
                  {provider.expertiseLevel}
                </span>
                {provider.badges?.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-white/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 shadow-xs"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Score Metric Breakdown Grid */}
              <div className="bg-slate-100/80 dark:bg-slate-950/60 rounded-2xl p-3 border border-slate-200/80 dark:border-white/5 mb-5 shadow-inner">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                  <span>Algorithmic Factor Breakdown</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{matchScore} / 100 pts</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="bg-white dark:bg-white/[0.03] p-1.5 rounded-lg border border-slate-200/60 dark:border-transparent shadow-xs">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Available</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{breakdown.availability}</span>
                    <span className="text-[9px] text-slate-400">/25</span>
                  </div>
                  <div className="bg-white dark:bg-white/[0.03] p-1.5 rounded-lg border border-slate-200/60 dark:border-transparent shadow-xs">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Proximity</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{breakdown.distance}</span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold block">{breakdown.distanceKm}km</span>
                  </div>
                  <div className="bg-white dark:bg-white/[0.03] p-1.5 rounded-lg border border-slate-200/60 dark:border-transparent shadow-xs">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Rating</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{breakdown.rating}</span>
                    <span className="text-[9px] text-slate-400">/20</span>
                  </div>
                  <div className="bg-white dark:bg-white/[0.03] p-1.5 rounded-lg border border-slate-200/60 dark:border-transparent shadow-xs">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Price</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">$25</span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold block">Diagnostic Fee</span>
                  </div>
                  <div className="bg-white dark:bg-white/[0.03] p-1.5 rounded-lg border border-slate-200/60 dark:border-transparent shadow-xs">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Expertise</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{breakdown.expertise}</span>
                    <span className="text-[9px] text-slate-400">/15</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectProvider(provider, matchScore, breakdown)}
                disabled={isBooking}
                className={`w-full py-3.5 px-4 rounded-full font-extrabold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  isTopMatch
                    ? 'forest-pill-btn shadow-lg'
                    : 'bg-[#1E3A2B]/10 hover:bg-[#1E3A2B]/20 text-[#1E3A2B] dark:text-emerald-300 dark:bg-white/10 dark:hover:bg-white/15 border border-[#1E3A2B]/30'
                }`}
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Book & Dispatch Specialist</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

