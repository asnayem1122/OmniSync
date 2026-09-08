import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'Smart Lighting & Control',
    title: 'Smart Lighting & Shading',
    desc: 'Lutron Caseta, architectural scene keypads & circadian rhythms',
    icon: Zap,
  },
  {
    id: 'HVAC & Climate Automation',
    title: 'HVAC & Climate Automation',
    desc: 'Ecobee, Nest, heat pump load balancing & damper diagnostics',
    icon: Thermometer,
  },
  {
    id: 'Smart Security & Access',
    title: 'Security & Access Control',
    desc: '4K PoE AI cameras, biometric locks & perimeter sensors',
    icon: Shield,
  },
  {
    id: 'Home Audio & Theater',
    title: 'Whole-Home Audio & Cinema',
    desc: 'Dolby Atmos, multi-zone Sonos matrix & architectural speakers',
    icon: Speaker,
  },
  {
    id: 'Automated Blinds & Shading',
    title: 'Proactive Health & Diagnostics',
    desc: 'Continuous sensor health, hub checks & seasonal preventive tune-ups',
    icon: Cpu,
  },
  {
    id: 'Smart Appliance Integration',
    title: 'Enterprise Mesh & IoT Networks',
    desc: 'Commercial Wi-Fi 7, Matter, Zigbee mesh & VLAN isolation',
    icon: SunMedium,
  },
];

const LOCATION_PRESETS = [
  { name: 'Downtown Austin', lat: 30.2672, lng: -97.7431, address: '600 Congress Ave, Austin, TX' },
  { name: 'South Congress', lat: 30.248, lng: -97.752, address: '1300 S Congress Ave, Austin, TX' },
  { name: 'The Domain', lat: 30.402, lng: -97.726, address: '11410 Century Oaks, Austin, TX' },
  { name: 'Mueller District', lat: 30.298, lng: -97.705, address: '1900 Simond Ave, Austin, TX' },
];

const URGENCIES = [
  { level: 'Low', label: 'Low Urgency', sub: 'Flexible 48-72 hrs' },
  { level: 'Medium', label: 'Standard', sub: 'Within 24 hours' },
  { level: 'High', label: 'Priority', sub: 'Same-day urgent' },
  { level: 'Emergency', label: 'Emergency', sub: 'Immediate dispatch' },
];

export default function ServiceRequestForm({
  onFindMatches,
  isLoading,
  initialCategory,
  initialUrgency,
  currentUser,
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || CATEGORIES[0].id
  );
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Alex Rivera');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+1 (512) 555-4829');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'alex.rivera@homemail.com');

  const [selectedPreset, setSelectedPreset] = useState(LOCATION_PRESETS[0]);
  const [customAddress, setCustomAddress] = useState(currentUser?.address || LOCATION_PRESETS[0].address);

  const [urgency, setUrgency] = useState(initialUrgency || 'High');
  const [filterCollisions, setFilterCollisions] = useState(true);
  const [details, setDetails] = useState(
    'Keypad relay intermittently failing to trigger secondary smart lighting scene.'
  );

  // Time Slot Selection
  const [timePreset, setTimePreset] = useState('immediate');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Sync with currentUser if logged in
  useEffect(() => {
    if (currentUser && currentUser.role === 'customer') {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
      if (currentUser.email) setCustomerEmail(currentUser.email);
      if (currentUser.address) setCustomAddress(currentUser.address);
    }
  }, [currentUser]);

  // Sync with external initial props if passed
  useEffect(() => {
    if (initialCategory) {
      const match = CATEGORIES.find((c) => c.id === initialCategory);
      if (match) setSelectedCategory(match.id);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialUrgency) {
      setUrgency(initialUrgency);
    }
  }, [initialUrgency]);

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
    <div id="booking-section" className="py-10 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-clean-card relative overflow-hidden">
        {/* Subtle accent background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="contractor-tag mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Collision Shield Dispatch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Schedule Certified Specialist
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 font-medium">
              Multi-factor algorithmic matching: rating, Haversine proximity, price, and guaranteed zero double-booking.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>13 Technicians Available</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Service Category Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              1. Select Service Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`cursor-pointer rounded-2xl p-4.5 transition-all duration-200 border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#EBF5F0] dark:bg-emerald-950/40 border-[#1E3A2B] dark:border-emerald-500 ring-2 ring-[#1E3A2B]/20 shadow-sm'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/10 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#1E3A2B] text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1E3A2B] text-white">
                          Selected
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Customer Location & Coordinates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#1E3A2B] dark:text-emerald-400" />
                2. Service Address & Location Anchor
              </label>
              <span className="text-xs text-slate-500 font-medium">
                Haversine Distance Telemetry
              </span>
            </div>

            {/* Location Presets */}
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
                    className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
                      isMatch
                        ? 'bg-[#1E3A2B] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {loc.name}
                  </button>
                );
              })}
            </div>

            <div>
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="Enter customer service address"
                required
                className="w-full rounded-xl px-4 py-3 text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-[#1E3A2B]"
              />
              <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                <span>Lat: {selectedPreset.lat}</span>
                <span>•</span>
                <span>Lng: {selectedPreset.lng}</span>
              </div>
            </div>
          </div>

          {/* 3. Preferred Time & Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred Time Window */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                <Clock className="w-4 h-4 text-[#1E3A2B] dark:text-emerald-400" />
                3. Preferred Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setTimePreset('immediate')}
                  className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all ${
                    timePreset === 'immediate'
                      ? 'bg-[#1E3A2B] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Immediate (1-2h)
                </button>
                <button
                  type="button"
                  onClick={() => setTimePreset('afternoon')}
                  className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all ${
                    timePreset === 'afternoon'
                      ? 'bg-[#1E3A2B] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  This Afternoon
                </button>
                <button
                  type="button"
                  onClick={() => setTimePreset('tomorrow')}
                  className={`p-2.5 rounded-xl text-center text-xs font-bold transition-all ${
                    timePreset === 'tomorrow'
                      ? 'bg-[#1E3A2B] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Tomorrow AM
                </button>
              </div>

              {/* Strict Collision Filter Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Strict Collision Prevention
                  </span>
                  <p className="text-slate-500 text-[11px] font-medium">
                    Filter out specialists with overlapping schedule slots
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterCollisions(!filterCollisions)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    filterCollisions ? 'bg-[#1E3A2B]' : 'bg-slate-300 dark:bg-slate-700'
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

            {/* Urgency Level */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
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
                          ? 'bg-[#EBF5F0] dark:bg-emerald-950/40 border-[#1E3A2B] dark:border-emerald-500 ring-2 ring-[#1E3A2B]/20 shadow-xs'
                          : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {u.label}
                        </span>
                        {isSel && (
                          <div className="w-2 h-2 rounded-full bg-[#1E3A2B] dark:bg-emerald-400" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                        {u.sub}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Customer Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-[#1E3A2B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Contact
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-[#1E3A2B]"
              />
            </div>
          </div>

          {/* Service Notes */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Service Notes & Problem Description
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E3A2B] focus:border-[#1E3A2B]"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="forest-pill-btn w-full py-4 px-6 text-base font-bold shadow-lg gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Algorithmic Matching...</span>
              </div>
            ) : (
              <>
                <span>Calculate Best Matches & Rankings</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
