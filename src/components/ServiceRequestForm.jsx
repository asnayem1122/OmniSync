import React, { useState } from 'react';
import {
  Zap,
  Thermometer,
  Shield,
  Speaker,
  SunMedium,
  Cpu,
  MapPin,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  User,
  Phone,
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'Smart Lighting & Control',
    title: 'Smart Lighting',
    desc: 'Lutron, Caseta, smart switches & scene automation',
    icon: Zap,
    color: 'from-amber-400/20 to-emerald-400/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'HVAC & Climate Automation',
    title: 'HVAC & Climate',
    desc: 'Ecobee, Nest, heat pump & multi-zone dampers',
    icon: Thermometer,
    color: 'from-teal-400/20 to-cyan-400/20 text-teal-300 border-teal-500/30',
  },
  {
    id: 'Smart Security & Access',
    title: 'Security & Access',
    desc: '4K PoE cameras, UniFi, smart biometric locks',
    icon: Shield,
    color: 'from-emerald-400/20 to-teal-400/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'Home Audio & Theater',
    title: 'Audio & Cinema',
    desc: 'Dolby Atmos, Sonos matrix & in-wall acoustic setup',
    icon: Speaker,
    color: 'from-purple-400/20 to-pink-400/20 text-purple-300 border-purple-500/30',
  },
  {
    id: 'Automated Blinds & Shading',
    title: 'Motorized Shading',
    desc: 'Somfy, Serena shades & solar automated tracking',
    icon: SunMedium,
    color: 'from-blue-400/20 to-teal-400/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'Smart Appliance Integration',
    title: 'Appliance & Energy',
    desc: 'Emporia energy monitors, smart relays & EV grid',
    icon: Cpu,
    color: 'from-emerald-400/20 to-lime-400/20 text-lime-300 border-lime-500/30',
  },
];

const LOCATION_PRESETS = [
  { name: 'Downtown Austin', lat: 30.2672, lng: -97.7431, address: '600 Congress Ave, Austin, TX' },
  { name: 'South Congress', lat: 30.248, lng: -97.752, address: '1300 S Congress Ave, Austin, TX' },
  { name: 'The Domain', lat: 30.402, lng: -97.726, address: '11410 Century Oaks, Austin, TX' },
  { name: 'Mueller District', lat: 30.298, lng: -97.705, address: '1900 Simond Ave, Austin, TX' },
];

const URGENCIES = [
  { level: 'Low', label: 'Low Urgency', sub: 'Flexible 48-72 hrs', border: 'border-slate-700' },
  { level: 'Medium', label: 'Standard', sub: 'Within 24 hours', border: 'border-teal-500/40' },
  { level: 'High', label: 'Priority', sub: 'Same-day urgent', border: 'border-amber-500/50' },
  { level: 'Emergency', label: 'Emergency', sub: 'Immediate dispatch', border: 'border-rose-500/60' },
];

export default function ServiceRequestForm({ onFindMatches, isLoading }) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [customerName, setCustomerName] = useState('Alex Rivera');
  const [customerPhone, setCustomerPhone] = useState('+1 (512) 555-4829');
  const [customerEmail, setCustomerEmail] = useState('alex.rivera@homemail.com');

  const [selectedPreset, setSelectedPreset] = useState(LOCATION_PRESETS[0]);
  const [customAddress, setCustomAddress] = useState(LOCATION_PRESETS[0].address);

  const [urgency, setUrgency] = useState('High');
  const [filterCollisions, setFilterCollisions] = useState(true);
  const [details, setDetails] = useState(
    'Smart scene keypad intermittently failing to trigger secondary relay zone.'
  );

  // Time Slot Selection
  const [timePreset, setTimePreset] = useState('immediate');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const getTimeRange = () => {
    const now = new Date();
    if (timePreset === 'immediate') {
      const start = new Date(now.getTime() + 15 * 60000); // 15 mins from now
      const end = new Date(start.getTime() + 2 * 3600000); // 2 hr window
      return { start: start.toISOString(), end: end.toISOString() };
    }
    if (timePreset === 'afternoon') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 30);
      return { start: start.toISOString(), end: end.toISOString() };
    }
    if (timePreset === 'tomorrow') {
      const tomorrow = new Date(now.getTime() + 24 * 3600000);
      const start = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 30);
      const end = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0);
      return { start: start.toISOString(), end: end.toISOString() };
    }
    return {
      start: customStart || new Date().toISOString(),
      end: customEnd || new Date(Date.now() + 7200000).toISOString(),
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timeRange = getTimeRange();

    const requestPayload = {
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customAddress,
      },
      serviceType: selectedCategory,
      location: {
        lat: selectedPreset.lat,
        lng: selectedPreset.lng,
        address: customAddress,
      },
      preferredTimeRange: timeRange,
      urgency,
      details,
      filterCollisions,
    };

    onFindMatches(requestPayload);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 bg-slate-900/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Dispatch
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Schedule Smart Home Technician
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Multi-factor algorithmic matching with guaranteed zero double-booking collision.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-2xl border border-white/10 text-xs text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white">13 Verified Technicians Online</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Service Category Selection */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">
              1. Select Service Discipline
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2.5 rounded-xl bg-white/[0.06] border border-white/10 ${cat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                          Selected
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{cat.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Location & Coordinate Anchor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                2. Customer Location & Coordinates
              </label>
              <span className="text-xs text-slate-400">Calculates exact Haversine proximity</span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 mb-3">
              {LOCATION_PRESETS.map((loc) => {
                const isMatch = selectedPreset.name === loc.name;
                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(loc);
                      setCustomAddress(loc.address);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                      isMatch
                        ? 'bg-teal-500/25 text-teal-300 border border-teal-500/50'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {loc.name}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="Enter customer service address"
                required
                className="w-full glass-input rounded-xl px-4 py-3 text-sm placeholder:text-slate-500"
              />
              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">
                <span>Lat: {selectedPreset.lat}</span>
                <span>•</span>
                <span>Lng: {selectedPreset.lng}</span>
              </div>
            </div>
          </div>

          {/* 3. Preferred Time & Window */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                <Clock className="w-4 h-4 text-teal-400" />
                3. Preferred Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setTimePreset('immediate')}
                  className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all ${
                    timePreset === 'immediate'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                      : 'bg-white/[0.04] text-slate-400 border border-white/5'
                  }`}
                >
                  Immediate (1-2h)
                </button>
                <button
                  type="button"
                  onClick={() => setTimePreset('afternoon')}
                  className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all ${
                    timePreset === 'afternoon'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                      : 'bg-white/[0.04] text-slate-400 border border-white/5'
                  }`}
                >
                  This Afternoon
                </button>
                <button
                  type="button"
                  onClick={() => setTimePreset('tomorrow')}
                  className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all ${
                    timePreset === 'tomorrow'
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/50 shadow-md'
                      : 'bg-white/[0.04] text-slate-400 border border-white/5'
                  }`}
                >
                  Tomorrow AM
                </button>
              </div>

              {/* Collision Filter Toggle */}
              <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-white/5">
                <div className="text-xs">
                  <span className="font-semibold text-white">Strict Collision Prevention</span>
                  <p className="text-slate-400 text-[11px]">Filter out technicians with overlapping slots</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterCollisions(!filterCollisions)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    filterCollisions ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      filterCollisions ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 4. Urgency Level */}
            <div>
              <label className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                4. Urgency Tier
              </label>
              <div className="grid grid-cols-2 gap-2">
                {URGENCIES.map((u) => {
                  const isSel = urgency === u.level;
                  return (
                    <div
                      key={u.level}
                      onClick={() => setUrgency(u.level)}
                      className={`cursor-pointer p-3 rounded-xl border transition-all ${
                        isSel
                          ? 'bg-emerald-500/15 border-emerald-400 shadow-md'
                          : `bg-white/[0.03] ${u.border} hover:bg-white/[0.06]`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{u.label}</span>
                        {isSel && <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{u.sub}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Customer Details & Service Scope */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Contact
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">
              Service Notes & Problem Description
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl font-extrabold text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:from-emerald-300 hover:to-teal-300 transition-all duration-300 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.99]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Running Matching Algorithm...</span>
              </div>
            ) : (
              <>
                <span>Calculate Best Matches & Rankings</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
