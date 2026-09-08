import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Droplet,
  Zap,
  Sparkles,
  Hammer,
  Truck,
  Car,
  Scissors,
  MapPin,
  Clock,
  AlertTriangle,
  ArrowRight,
  User,
  Phone,
  ShieldCheck,
  Camera,
  Image as ImageIcon,
  X,
  UploadCloud,
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'Appliance & Gadget Repair',
    title: 'Appliance & Gadget Repair',
    desc: 'Smart refrigerators, washing machines, dryers, ovens & smart gadgets',
    icon: Wrench,
  },
  {
    id: 'Plumbing',
    title: 'Plumbing',
    desc: 'Pipe leak repairs, smart water shutoffs, drain clearing & water heaters',
    icon: Droplet,
  },
  {
    id: 'Electrical',
    title: 'Electrical',
    desc: 'Breaker panels, EV charger installs, smart switches & circuit wiring',
    icon: Zap,
  },
  {
    id: 'Cleaning & Pest Control',
    title: 'Cleaning & Pest Control',
    desc: 'Deep home cleaning, eco-friendly sanitization & pet-safe pest defense',
    icon: Sparkles,
  },
  {
    id: 'Home Maintenance',
    title: 'Home Maintenance',
    desc: 'Drywall repairs, door realignment, smart deadbolts, gutters & caulking',
    icon: Hammer,
  },
  {
    id: 'Moving & Shifting',
    title: 'Moving & Shifting',
    desc: 'Full residential moving, heavy furniture transport & item shifting',
    icon: Truck,
  },
  {
    id: 'Car Care & Repair',
    title: 'Car Care & Repair',
    desc: 'Driveway mobile mechanic, computerized OBD diagnostics & mobile detail',
    icon: Car,
  },
  {
    id: 'Personal Care',
    title: 'Personal Care',
    desc: 'In-home hair styling, luxury grooming, massage & personal wellness',
    icon: Scissors,
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

const SAMPLE_ISSUE_PHOTOS = [
  {
    label: 'Pipe Leak',
    url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Electrical Panel',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Appliance Fault',
    url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=400&q=80',
  },
  {
    label: 'Car Engine Light',
    url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
  },
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
    'Unit is displaying intermittent fault alert. Please inspect and bring necessary diagnostics tools.'
  );

  // Optional Image Attachment State
  const [issueImage, setIssueImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  // Handle Local Image File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIssueImage(reader.result);
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

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
      image: issueImage,
      filterCollisions,
    };

    onFindMatches(requestPayload);
  };

  return (
    <div id="booking-section" className="py-6 sm:py-10 max-w-5xl mx-auto">
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-10 lg:p-12 shadow-clean-card relative overflow-hidden">
        {/* Accent background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="contractor-tag mb-2 inline-flex">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Smart Collision Shield Dispatch</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Book a Service Specialist
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1 font-medium">
              Multi-factor algorithmic matching: Availability (25) + Distance (25) + Rating (20) + Price (15) + Expertise (15)
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-bold text-slate-800 dark:text-white shadow-xs self-start md:self-auto">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>16 Certified Specialists</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* 1. Service Category Selection (8 Categories) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 sm:mb-3">
              1. Select Service Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`cursor-pointer rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#EBF5F0] dark:bg-emerald-950/40 border-[#1E3A2B] dark:border-emerald-500 ring-2 ring-[#1E3A2B]/20 shadow-xs'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-white/10 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#1E3A2B] text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      {isSelected && (
                        <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-[#1E3A2B] text-white">
                          Selected
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs leading-snug">
                        {cat.title}
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
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
                2. Service Location & Real-Time Proximity Anchor
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
                    className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
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
                className="w-full rounded-xl px-4 py-3 text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]"
              />
              <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                <span>Latitude: {selectedPreset.lat}</span>
                <span>•</span>
                <span>Longitude: {selectedPreset.lng}</span>
              </div>
            </div>
          </div>

          {/* 3. Preferred Time & Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred Time Window */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                <Clock className="w-4 h-4 text-[#1E3A2B] dark:text-emerald-400" />
                3. Preferred Date & Time Slot
              </label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setTimePreset('immediate')}
                  className={`p-2 sm:p-2.5 rounded-xl text-center text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
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
                  className={`p-2 sm:p-2.5 rounded-xl text-center text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
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
                  className={`p-2 sm:p-2.5 rounded-xl text-center text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
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
                    Strict Double-Booking Protection
                  </span>
                  <p className="text-slate-500 text-[11px] font-medium">
                    Filter out specialists with overlapping schedule slots
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterCollisions(!filterCollisions)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
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

          {/* 4. Basic Problem Details & Optional Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                5. Problem Details & Description
              </label>
              <textarea
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe the issue, device model, or maintenance required..."
                className="w-full rounded-xl px-3.5 py-2.5 text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1E3A2B]"
              />
            </div>

            {/* Optional Image Upload & Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#1E3A2B] dark:text-emerald-400" />
                  <span>Optional Problem Photo</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Helps technician bring exact parts</span>
              </div>

              {issueImage ? (
                <div className="relative rounded-2xl border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
                  <img
                    src={issueImage}
                    alt="Attached Issue"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-300 dark:border-slate-600 shadow-sm"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block truncate">
                      Photo Attached Successfully
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Transmitted to dispatched technician
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIssueImage('')}
                    className="p-1.5 rounded-full hover:bg-rose-100 text-rose-500 transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-3 text-center bg-slate-50/50 dark:bg-slate-800/30">
                  <label className="cursor-pointer flex flex-col items-center justify-center">
                    <UploadCloud className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Upload photo from device
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or WEBP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Preset quick test images */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1">Sample:</span>
                    {SAMPLE_ISSUE_PHOTOS.map((sample, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => setIssueImage(sample.url)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-300 font-medium cursor-pointer"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Customer Contact Information */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
              6. Contact Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full rounded-xl px-3.5 py-2.5 sm:py-3 text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1E3A2B]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Phone Contact
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  className="w-full rounded-xl px-3.5 py-2.5 sm:py-3 text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1E3A2B]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="w-full rounded-xl px-3.5 py-2.5 sm:py-3 text-sm font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1E3A2B]"
                />
              </div>
            </div>
          </div>

          {/* Primary Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="forest-pill-btn w-full py-3.5 sm:py-4 px-5 sm:px-6 text-sm sm:text-base font-bold shadow-lg gap-2 cursor-pointer disabled:opacity-50 justify-center"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Calculating Multi-Factor Rankings...</span>
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
