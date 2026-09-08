import React, { useState, useEffect } from 'react';
import { Star, MapPin, Calendar, Clock, Award, Shield, Search } from 'lucide-react';

export default function ProviderDirectory({ providers = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Smart Lighting & Control',
    'HVAC & Climate Automation',
    'Smart Security & Access',
    'Home Audio & Theater',
    'Automated Blinds & Shading',
    'Smart Appliance Integration',
  ];

  const filtered = providers.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Certified Technician Network
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Browse pre-vetted smart home engineers and inspect live calendar availability.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search specialists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input rounded-xl pl-9 pr-4 py-2 text-xs w-64"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
          {categories.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                  isSel
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-bold shadow-md'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((provider) => (
          <div
            key={provider._id}
            className="glass-panel rounded-3xl p-5 border border-white/10 bg-slate-900/40 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-400/40"
                />
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight">{provider.name}</h3>
                  <span className="text-[11px] text-emerald-400 font-medium block">
                    {provider.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                    <span>{provider.rating.toFixed(1)}</span>
                    <span className="text-slate-500 font-normal">({provider.reviewsCount})</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-3 line-clamp-2 leading-relaxed">
                {provider.bio}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {provider.expertiseLevel}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  ${provider.basePrice}/hr
                </span>
              </div>
            </div>

            {/* Booked Slots summary */}
            <div className="pt-3 border-t border-white/5 text-[11px]">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-teal-400" />
                  Calendar Schedule:
                </span>
                <span
                  className={`font-semibold ${
                    provider.bookedSlots?.length > 0 ? 'text-amber-300' : 'text-emerald-400'
                  }`}
                >
                  {provider.bookedSlots?.length || 0} Booked Slot
                  {provider.bookedSlots?.length === 1 ? '' : 's'}
                </span>
              </div>
              {provider.bookedSlots?.length > 0 && (
                <div className="space-y-1 mt-1.5">
                  {provider.bookedSlots.map((slot, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-white/[0.02] p-1.5 rounded-lg border border-white/5 text-[10px] text-slate-300"
                    >
                      <span className="font-semibold text-white block truncate">{slot.title}</span>
                      <span className="text-slate-400">
                        {new Date(slot.start).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(slot.end).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
