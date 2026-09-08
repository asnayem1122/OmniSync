import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Navigation,
  Car,
  MapPin,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  ShieldCheck,
  Radio,
  Gauge,
  Clock,
  Sparkles,
} from 'lucide-react';

// Haversine distance in km
function calculateHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function LiveServiceMap({
  provider,
  customerLocation,
  customerAddress,
  customerName,
  status = 'On the Way',
  urgency = 'Medium',
}) {
  // Map View Mode: 'spatial' (clean architectural) or 'radar' (dark GIS satellite)
  const [mapMode, setMapMode] = useState('spatial');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSimulatingDrive, setIsSimulatingDrive] = useState(false);
  const [transitProgress, setTransitProgress] = useState(() => {
    switch (status) {
      case 'Requested':
        return 0;
      case 'Accepted':
        return 0.08;
      case 'On the Way':
        return 0.45;
      case 'In Progress':
      case 'Completed':
        return 1.0;
      default:
        return 0.3;
    }
  });

  // Keep progress in sync with status changes if not manually simulating
  useEffect(() => {
    if (!isSimulatingDrive) {
      if (status === 'Requested') setTransitProgress(0);
      else if (status === 'Accepted') setTransitProgress(0.08);
      else if (status === 'On the Way') setTransitProgress((prev) => (prev < 0.2 ? 0.35 : prev));
      else if (status === 'In Progress' || status === 'Completed') setTransitProgress(1.0);
    }
  }, [status, isSimulatingDrive]);

  // Coordinates Setup (with solid defaults in Austin metro if omitted)
  const pLat = provider?.location?.lat || 30.2912;
  const pLng = provider?.location?.lng || -97.7491;
  const cLat = customerLocation?.lat || 30.2645;
  const cLng = customerLocation?.lng || -97.7312;

  // Path Waypoints coordinates in SVG space [x, y] from 0 to 800, 0 to 480
  // Provider starts top-left/center-left, customer is bottom-right/center-right
  const startPt = { x: 130, y: 110 };
  const wp1 = { x: 260, y: 130 };
  const wp2 = { x: 330, y: 220 };
  const wp3 = { x: 450, y: 210 };
  const wp4 = { x: 540, y: 310 };
  const endPt = { x: 670, y: 360 };

  // SVG route path string
  const routePathD = `M ${startPt.x} ${startPt.y} L ${wp1.x} ${wp1.y} Q ${wp2.x} ${wp2.y} ${wp3.x} ${wp3.y} T ${wp4.x} ${wp4.y} L ${endPt.x} ${endPt.y}`;

  // Measure route point along SVG path
  const pathRef = useRef(null);
  const [carPos, setCarPos] = useState({ x: startPt.x, y: startPt.y, angle: 0 });

  useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current;
      const totalLen = path.getTotalLength();
      const clampedProg = Math.max(0, Math.min(1, transitProgress));
      const targetDist = clampedProg * totalLen;
      const pt = path.getPointAtLength(targetDist);

      // Tangent angle for realistic vehicle heading
      const aheadDist = Math.min(totalLen, targetDist + 2);
      const aheadPt = path.getPointAtLength(aheadDist);
      const angle =
        (Math.atan2(aheadPt.y - pt.y, aheadPt.x - pt.x) * 180) / Math.PI;

      setCarPos({ x: pt.x, y: pt.y, angle });
    }
  }, [transitProgress]);

  // Real-time animation loop when simulating or "On the Way"
  useEffect(() => {
    let animFrame;
    if (isSimulatingDrive || (status === 'On the Way' && isSimulatingDrive)) {
      const interval = setInterval(() => {
        setTransitProgress((prev) => {
          if (prev >= 1) {
            setIsSimulatingDrive(false);
            return 1;
          }
          return Math.min(1, prev + 0.006);
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSimulatingDrive, status]);

  // Dynamic Telemetry Calculations
  const totalDistanceKm = useMemo(() => {
    return calculateHaversine(pLat, pLng, cLat, cLng);
  }, [pLat, pLng, cLat, cLng]);

  const remainingDistKm = Math.max(0, (totalDistanceKm * (1 - transitProgress))).toFixed(1);
  const currentVehicleLat = (pLat + (cLat - pLat) * transitProgress).toFixed(5);
  const currentVehicleLng = (pLng + (cLng - pLng) * transitProgress).toFixed(5);

  const etaMinutes = useMemo(() => {
    if (transitProgress >= 1) return 0;
    const est = Math.ceil((1 - transitProgress) * 18);
    return est > 0 ? est : 1;
  }, [transitProgress]);

  const isDark = mapMode === 'radar';

  return (
    <div className="spatial-panel rounded-3xl overflow-hidden border border-white/90 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 shadow-spatial-lg relative">
      {/* Map Header HUD Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                Live GPS Telemetry Map
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-extrabold border border-emerald-500/30 shadow-xs">
                RTK Precision 100%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Tracking vehicle transponder to destination • {status}
            </p>
          </div>
        </div>

        {/* Action Controls: Mode Switcher & Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMapMode((m) => (m === 'spatial' ? 'radar' : 'spatial'))}
            className={`text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isDark
                ? 'bg-slate-800 text-emerald-400 border-emerald-500/40 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 shadow-xs hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isDark ? 'GIS Radar Mode' : 'Spatial Vector Mode'}</span>
          </button>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
              className="p-1.5 hover:text-emerald-600 text-slate-500 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold px-1 text-slate-600 dark:text-slate-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
              className="p-1.5 hover:text-emerald-600 text-slate-500 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div
        className={`relative w-full aspect-[16/9] sm:aspect-[21/10] overflow-hidden select-none transition-colors duration-500 ${
          isDark
            ? 'bg-[#060D17] text-emerald-400'
            : 'bg-[#EBF2F0] dark:bg-[#0B1522] text-slate-800'
        }`}
      >
        {/* Animated Radar Sweep Overlay in Radar mode */}
        {isDark && (
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_70%)] animate-pulse" />
        )}

        {/* SVG GIS Vector Map Content */}
        <div
          className="w-full h-full transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 800 480"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Grid Pattern */}
              <pattern
                id="mapGrid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={isDark ? 'rgba(16,185,129,0.06)' : 'rgba(30,58,43,0.06)'}
                  strokeWidth="1"
                />
              </pattern>

              {/* Glowing Route Gradient */}
              <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>

              {/* Vehicle Glow Filter */}
              <filter id="glowFilter" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Grid Layer */}
            <rect width="100%" height="100%" fill="url(#mapGrid)" />

            {/* River / Lady Bird Lake feature */}
            <path
              d="M -10 390 C 180 430, 290 350, 480 390 C 620 420, 730 380, 820 410 L 820 490 L -10 490 Z"
              fill={isDark ? '#081726' : '#D1E6E1'}
              opacity="0.85"
            />
            <text
              x="310"
              y="425"
              fill={isDark ? '#163854' : '#88B0A5'}
              fontSize="10"
              fontWeight="bold"
              letterSpacing="2"
            >
              COLORADO WATERWAY
            </text>

            {/* Urban Parks / Green spaces */}
            <path
              d="M 60 40 Q 140 30 180 80 Q 220 140 140 160 Q 50 160 60 40 Z"
              fill={isDark ? '#061D1A' : '#D7EDE4'}
              opacity="0.7"
            />
            <text
              x="90"
              y="100"
              fill={isDark ? '#0E4F42' : '#689B88'}
              fontSize="9"
              fontWeight="bold"
            >
              NORTH PARK
            </text>

            <path
              d="M 460 70 Q 590 50 630 120 Q 640 180 520 170 Q 430 150 460 70 Z"
              fill={isDark ? '#061D1A' : '#D7EDE4'}
              opacity="0.7"
            />

            {/* Secondary Street Grid */}
            <g stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'} strokeWidth="3" fill="none">
              {/* Horizontal Streets */}
              <line x1="0" y1="80" x2="800" y2="80" />
              <line x1="0" y1="160" x2="800" y2="160" />
              <line x1="0" y1="240" x2="800" y2="240" />
              <line x1="0" y1="320" x2="800" y2="320" />

              {/* Vertical Streets */}
              <line x1="120" y1="0" x2="120" y2="480" />
              <line x1="240" y1="0" x2="240" y2="480" />
              <line x1="380" y1="0" x2="380" y2="480" />
              <line x1="520" y1="0" x2="520" y2="480" />
              <line x1="660" y1="0" x2="660" y2="480" />
            </g>

            {/* Major Arteries / Expressways (Thicker lines) */}
            <g stroke={isDark ? '#192C3D' : '#CFDED8'} strokeWidth="10" fill="none" strokeLinecap="round">
              <path d="M 40 40 L 760 440" />
              <path d="M 200 480 L 200 0" />
              <path d="M 620 480 L 620 0" />
            </g>
            <g stroke={isDark ? '#2B4A63' : '#FFFFFF'} strokeWidth="5" fill="none" strokeLinecap="round">
              <path d="M 40 40 L 760 440" />
              <path d="M 200 480 L 200 0" />
              <path d="M 620 480 L 620 0" />
            </g>

            {/* Street Names */}
            <text
              x="205"
              y="50"
              fill={isDark ? '#3D688A' : '#738C82'}
              fontSize="9"
              fontWeight="bold"
              letterSpacing="1"
            >
              LAMAR BLVD
            </text>
            <text
              x="625"
              y="50"
              fill={isDark ? '#3D688A' : '#738C82'}
              fontSize="9"
              fontWeight="bold"
              letterSpacing="1"
            >
              I-35 EXPRESSWAY
            </text>
            <text
              x="420"
              y="155"
              fill={isDark ? '#3D688A' : '#738C82'}
              fontSize="9"
              fontWeight="bold"
              letterSpacing="1"
            >
              CONGRESS AVE
            </text>

            {/* -------------------------------------------------- */}
            {/* INVISIBLE REFERENCE ROUTE PATH FOR COMPUTING POS */}
            {/* -------------------------------------------------- */}
            <path
              ref={pathRef}
              d={routePathD}
              fill="none"
              stroke="transparent"
              strokeWidth="1"
            />

            {/* ROUTE UNDERLAY CASING */}
            <path
              d={routePathD}
              fill="none"
              stroke={isDark ? '#064E3B' : '#A7F3D0'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />

            {/* ACTIVE ROUTE LINE */}
            <path
              d={routePathD}
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 4"
              className="animate-[dash_20s_linear_infinite]"
            />

            {/* TRAVELED ROUTE HIGHLIGHT */}
            <path
              d={routePathD}
              fill="none"
              stroke="#10B981"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: pathRef.current ? pathRef.current.getTotalLength() : 800,
                strokeDashoffset:
                  (pathRef.current ? pathRef.current.getTotalLength() : 800) *
                  (1 - transitProgress),
              }}
            />

            {/* -------------------------------------------------- */}
            {/* START POINT: PROVIDER DISPATCH BASE */}
            {/* -------------------------------------------------- */}
            <g transform={`translate(${startPt.x}, ${startPt.y})`}>
              <circle r="14" fill={isDark ? '#064E3B' : '#E6F4EA'} />
              <circle r="7" fill="#10B981" />
              <text
                x="20"
                y="4"
                fill={isDark ? '#A7F3D0' : '#1E3A2B'}
                fontSize="10"
                fontWeight="extrabold"
              >
                Specialist Hub
              </text>
            </g>

            {/* -------------------------------------------------- */}
            {/* END POINT: CUSTOMER DESTINATION */}
            {/* -------------------------------------------------- */}
            <g transform={`translate(${endPt.x}, ${endPt.y})`}>
              {/* Concentric Pulse Rings */}
              <circle
                r="30"
                fill="none"
                stroke="#10B981"
                strokeWidth="1.5"
                opacity="0.3"
                className="animate-ping origin-center"
              />
              <circle
                r="18"
                fill="#10B981"
                opacity="0.2"
              />
              <circle
                r="10"
                fill="#059669"
              />
              {/* Target pin icon */}
              <circle r="5" fill="#FFFFFF" />

              {/* Callout Box */}
              <g transform="translate(18, -24)">
                <rect
                  x="0"
                  y="0"
                  width="140"
                  height="44"
                  rx="10"
                  fill={isDark ? '#0F172A' : '#FFFFFF'}
                  stroke={isDark ? '#1E293B' : '#CBD5E1'}
                  strokeWidth="1.5"
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
                />
                <text
                  x="10"
                  y="16"
                  fill={isDark ? '#F1F5F9' : '#0F172A'}
                  fontSize="10"
                  fontWeight="bold"
                >
                  {customerName || 'Service Location'}
                </text>
                <text
                  x="10"
                  y="32"
                  fill={isDark ? '#94A3B8' : '#64748B'}
                  fontSize="8.5"
                  fontWeight="medium"
                >
                  {customerAddress ? customerAddress.slice(0, 22) + '...' : 'Destination Point'}
                </text>
              </g>
            </g>

            {/* -------------------------------------------------- */}
            {/* MOVING SERVICE VEHICLE MARKER */}
            {/* -------------------------------------------------- */}
            <g
              transform={`translate(${carPos.x}, ${carPos.y})`}
              filter="url(#glowFilter)"
              className="transition-transform duration-100"
            >
              {/* Radar Ping Waves */}
              <circle
                r="22"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                opacity="0.6"
                className="animate-ping origin-center"
              />

              {/* Vehicle Body Container with Heading Rotation */}
              <g transform={`rotate(${carPos.angle})`}>
                {/* Headlights Beam Cone */}
                <path
                  d="M 10 -4 L 40 -16 L 40 16 L 10 4 Z"
                  fill="url(#routeGrad)"
                  opacity="0.25"
                />

                {/* Car Base */}
                <rect
                  x="-14"
                  y="-9"
                  width="28"
                  height="18"
                  rx="6"
                  fill="#0F172A"
                  stroke="#10B981"
                  strokeWidth="2.5"
                />
                {/* Windshield */}
                <rect x="2" y="-6" width="6" height="12" rx="2" fill="#38BDF8" opacity="0.9" />
                {/* Wheels */}
                <rect x="-10" y="-11" width="6" height="2.5" rx="1" fill="#475569" />
                <rect x="4" y="-11" width="6" height="2.5" rx="1" fill="#475569" />
                <rect x="-10" y="8.5" width="6" height="2.5" rx="1" fill="#475569" />
                <rect x="4" y="8.5" width="6" height="2.5" rx="1" fill="#475569" />
              </g>

              {/* Technician Live Avatar Bubble above vehicle */}
              <g transform="translate(0, -32)">
                <circle
                  r="14"
                  fill="#FFFFFF"
                  stroke="#10B981"
                  strokeWidth="2"
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                />
                {provider?.avatar ? (
                  <clipPath id="avatarClip">
                    <circle r="12" />
                  </clipPath>
                ) : null}
                {provider?.avatar ? (
                  <image
                    href={provider.avatar}
                    x="-12"
                    y="-12"
                    width="24"
                    height="24"
                    clipPath="url(#avatarClip)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <circle r="12" fill="#10B981" />
                )}
                {/* Mini Online Dot */}
                <circle cx="10" cy="10" r="3.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
              </g>
            </g>
          </svg>
        </div>

        {/* Floating Telemetry Glass Card (HUD) */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-xs p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-spatial-md space-y-2.5 pointer-events-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white">
                Transit Telemetry
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              {transitProgress >= 1 ? 'ARRIVED' : 'EN ROUTE'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                Distance Remaining
              </span>
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {remainingDistKm} km
              </span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/5">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                Estimated Arrival
              </span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {etaMinutes === 0 ? 'On Site' : `~${etaMinutes} mins`}
              </span>
            </div>
          </div>

          {/* Real-time coordinates readout */}
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-black/30 p-2 rounded-xl flex items-center justify-between">
            <span>GPS: {currentVehicleLat}, {currentVehicleLng}</span>
            <span className="text-emerald-600 font-bold">{transitProgress >= 1 ? '0 km/h' : '42 km/h'}</span>
          </div>
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setTransitProgress(0)}
            className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-sm cursor-pointer"
            title="Reset to Dispatch Station"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSimulatingDrive((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
              isSimulatingDrive
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {isSimulatingDrive ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>Pause Drive</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Simulate Drive</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Manual Route Progress Scrubber for Demo / Hackathon evaluation */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Sliders className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0">
            Route Transit Scrub:
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={transitProgress}
            onChange={(e) => {
              setIsSimulatingDrive(false);
              setTransitProgress(parseFloat(e.target.value));
            }}
            className="w-full sm:w-48 accent-emerald-500 cursor-pointer"
          />
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 w-12 text-right">
            {Math.round(transitProgress * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] font-medium w-full sm:w-auto justify-between sm:justify-end">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" />
            Origin: Specialist Hub
          </span>
          <span>→</span>
          <span className="flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-teal-600" />
            Destination: {customerAddress ? customerAddress.slice(0, 18) + '...' : 'Client Location'}
          </span>
        </div>
      </div>
    </div>
  );
}
