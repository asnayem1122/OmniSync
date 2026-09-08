import React, { useState } from 'react';
import {
  Star,
  X,
  Sparkles,
  Award,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';

const RATING_DESCRIPTIONS = {
  1: 'Needs Improvement',
  2: 'Fair Service',
  3: 'Good Service',
  4: 'Very Good & Professional',
  5: 'Exceptional Master Craftsmanship',
};

const FEEDBACK_TAGS = [
  '⚡ Arrived Right On Time',
  '🔧 Clean Cable Management',
  '💡 Explained Features Clearly',
  '🛡️ Verified All Sensors & Scenes',
  '👏 Polite & Courteous Specialist',
  '🏆 Exceeded Expectations',
];

export default function RatingReviewModal({
  isOpen,
  onClose,
  request,
  onSubmitReview,
  isSubmitting,
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['⚡ Arrived Right On Time']);

  if (!isOpen || !request) return null;

  const activeScore = hoverRating || rating;
  const assigned = request.assignedProvider;

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullComment = selectedTags.length > 0
      ? `${comment ? comment + ' • ' : ''}Tags: ${selectedTags.join(', ')}`
      : comment || 'Service completed flawlessly with excellent punctuality.';

    onSubmitReview(request._id, rating, fullComment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-white/10 relative z-10">
          <div>
            <div className="contractor-tag mb-1 text-[10px]">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Service Sign-Off Telemetry</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Rate Your Service Specialist
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assigned Provider Summary Card */}
        {assigned && (
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/5 mb-6">
            <img
              src={assigned.avatar}
              alt={assigned.name}
              className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
            />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{assigned.name}</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                {request.serviceType}
              </p>
              <div className="text-[11px] text-slate-500">
                Current Rating: <strong>{assigned.rating?.toFixed(1)} ★</strong> ({assigned.reviewsCount} reviews)
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 5-Star Interactive Selector */}
          <div className="text-center bg-[#EBF5F0]/50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Overall Performance Rating
            </label>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = starVal <= activeScore;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starVal)}
                    className="p-1 text-3xl focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-sm font-bold text-[#1E3A2B] dark:text-emerald-400">
              {RATING_DESCRIPTIONS[activeScore]} ({rating} / 5)
            </div>
          </div>

          {/* Quick Feedback Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              What went especially well? (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FEEDBACK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] px-3 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E3A2B] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Review Notes & Feedback for the Technician
            </label>
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Arrived on time, tested the whole-home Lutron lighting scene, and left the room spotless!"
              className="w-full rounded-xl px-3.5 py-2.5 text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1E3A2B]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full forest-pill-btn py-3.5 px-4 text-xs sm:text-sm font-bold gap-2 cursor-pointer shadow-lg"
          >
            {isSubmitting ? (
              <span>Recalculating Overall Rating...</span>
            ) : (
              <>
                <Award className="w-4 h-4 text-emerald-300" />
                <span>Submit Rating & Update Overall Score</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
