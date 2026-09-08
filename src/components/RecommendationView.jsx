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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Recommended Technicians
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                {matches.length} Matches
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by real-time availability, distance, rating, price competitiveness, and expertise.
            </p>
          </div>
        </div>

        {requestSummary && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-slate-950/50 border border-white/10 text-slate-300">
              <strong className="text-emerald-400">{requestSummary.serviceType}</strong>
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-950/50 border border-white/10 text-amber-300 font-semibold">
              {requestSummary.urgency} Urgency
            </span>
          </div>
        )}
      </div>

      {/* No matches fallback */}
      {matches.length === 0 && (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Matching Technicians Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            All technicians in this discipline have conflicting bookings during this requested time slot. Try selecting a different time window or disable strict collision filtering.
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl font-semibold bg-white/10 hover:bg-white/15 text-white text-sm"
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
              className={`glass-panel rounded-3xl p-6 sm:p-7 border relative overflow-hidden transition-all duration-300 ${
                isTopMatch
                  ? 'border-emerald-500/50 bg-gradient-to-br from-slate-900/80 via-emerald-950/20 to-slate-900/80 shadow-2xl shadow-emerald-500/15 ring-1 ring-emerald-500/30'
                  : 'border-white/10 bg-slate-900/50 hover:border-white/20'
              }`}
            >
              {/* Best Match Banner */}
              {isTopMatch && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  Top Match
                </div>
              )}

              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-3.5">
                  <img
                    src={provider.avatar}
                    alt={provider.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg"
                  />
                  <div>
                    <h3 className="font-extrabold text-white text-base sm:text-lg leading-snug">
                      {provider.name}
                    </h3>
                    <p className="text-xs text-emerald-400 font-medium">{provider.category}</p>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <div className="flex items-center text-amber-300 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 mr-1" />
                        {provider.rating.toFixed(1)}
                        <span className="text-slate-500 font-normal ml-1">
                          ({provider.reviewsCount})
                        </span>
                      </div>
                      <span>•</span>
                      <span className="font-semibold text-teal-300">${provider.basePrice}/hr</span>
                    </div>
                  </div>
                </div>

                {/* Circular Match Score Indicator */}
                <div className="shrink-0">
                  <CircularProgress score={matchScore} size={76} strokeWidth={6.5} />
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                {provider.bio}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {provider.expertiseLevel}
                </span>
                {provider.badges?.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-white/[0.04] text-slate-300 border border-white/5"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Score Metric Breakdown Grid */}
              <div className="bg-slate-950/60 rounded-2xl p-3 border border-white/5 mb-5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                  <span>Multi-Factor Algorithmic Breakdown</span>
                  <span className="text-emerald-400">{matchScore} / 100 pts</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="bg-white/[0.03] p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Available</span>
                    <span className="font-bold text-white">{breakdown.availability}</span>
                    <span className="text-[9px] text-slate-500">/25</span>
                  </div>
                  <div className="bg-white/[0.03] p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Proximity</span>
                    <span className="font-bold text-white">{breakdown.distance}</span>
                    <span className="text-[9px] text-emerald-400">{breakdown.distanceKm}km</span>
                  </div>
                  <div className="bg-white/[0.03] p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Rating</span>
                    <span className="font-bold text-white">{breakdown.rating}</span>
                    <span className="text-[9px] text-slate-500">/20</span>
                  </div>
                  <div className="bg-white/[0.03] p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Price</span>
                    <span className="font-bold text-white">{breakdown.price}</span>
                    <span className="text-[9px] text-slate-500">/15</span>
                  </div>
                  <div className="bg-white/[0.03] p-1.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Expertise</span>
                    <span className="font-bold text-white">{breakdown.expertise}</span>
                    <span className="text-[9px] text-slate-500">/15</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectProvider(provider, matchScore, breakdown)}
                disabled={isBooking}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  isTopMatch
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Book & Dispatch Technician</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
