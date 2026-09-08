import React, { useState } from 'react';
import Testimonials from '@/components/ui/testimonials-13';
import {
  ShieldCheck,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Award,
  ArrowUpRight,
  ThumbsUp,
  Sliders,
} from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Sarah & Marcus Turner',
    location: 'Westlake Hills, Austin',
    service: 'Smart Lighting & Home Cinema',
    rating: 5,
    text: 'OmniSync rewired our entire Lutron system and calibrated our Dolby Atmos cinema in an afternoon. The technician arrived with all parts in hand and the live tracking was spot-on.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'David Chen',
    location: 'Downtown Austin',
    service: 'HVAC Automation & Damper Balancer',
    rating: 5,
    text: 'Our multi-zone climate controller failed during a heatwave. OmniSync dispatched an automation engineer in 25 minutes. Zero double-booking delays and transparent pricing.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  },
  {
    name: 'Elena Rostova',
    location: 'The Domain Enterprise Park',
    service: 'Access Control & 4K AI Security',
    rating: 5,
    text: 'Upgraded our commercial facility with biometric deadbolts and PoE AI surveillance. Cleanest cable management I have ever seen. Highly recommend their certified crew.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
  },
];

export default function TrustAndShowcase({ onScheduleClick }) {
  const [activeCompareView, setActiveCompareView] = useState('after');

  return (
    <div id="trust-showcase-section" className="space-y-16 py-10">
      {/* ---------------------------------------------------- */}
      {/* 1. Before / After Craftsmanship Comparison */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-clean-card">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="contractor-tag mb-3">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>Contractor Standards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The OmniSync Craftsmanship Difference
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            See how our certified master technicians eliminate smart home headaches with clean architectural installation.
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-6">
            <button
              onClick={() => setActiveCompareView('before')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeCompareView === 'before'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Without OmniSync (DIY & Legacy)
            </button>
            <button
              onClick={() => setActiveCompareView('after')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                activeCompareView === 'after'
                  ? 'bg-[#1E3A2B] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              With OmniSync Certified Techs
            </button>
          </div>
        </div>

        {/* Comparison Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Box 1: Without OmniSync */}
          <div
            className={`p-7 rounded-2xl border transition-all duration-300 ${
              activeCompareView === 'before'
                ? 'border-rose-400/80 bg-rose-500/[0.03] ring-2 ring-rose-400/20'
                : 'border-slate-200 dark:border-white/5 opacity-70'
            }`}
          >
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-extrabold uppercase tracking-wider mb-4">
              <XCircle className="w-4 h-4" />
              <span>Legacy Contracting & DIY Frustrations</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Tangled Wires, Missed Appointments & Offline Hubs
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Unreliable technicians double-booking time slots and arriving hours late</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Rat's nest low-voltage cabling behind walls prone to interference and heat</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>5 different proprietary smartphone apps that refuse to speak to each other</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span>No live tracking, no transparent dispatch telemetry, and surprise invoices</span>
              </li>
            </ul>
          </div>

          {/* Box 2: With OmniSync */}
          <div
            className={`p-7 rounded-2xl border transition-all duration-300 ${
              activeCompareView === 'after'
                ? 'border-emerald-500/80 bg-emerald-500/[0.04] ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-white/5 opacity-70'
            }`}
          >
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>OmniSync Master Contractor Standard</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Flawless Architectural Integration & Zero Collisions
            </h3>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Guaranteed zero double-booking algorithm with 15-minute emergency response</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Color-coded, neatly combed rack cable management adhering to NEC standards</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Single spatial control panel uniting Apple Home, Matter, Lutron & HVAC</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Full real-time GPS telemetry pipeline from dispatch to final sign-off</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. Customer Reviews (Testimonials-13 Marquee & Grid) */}
      {/* ---------------------------------------------------- */}
      <div id="reviews-section" className="pt-2">
        <Testimonials />
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. Contractor Guarantee Banner */}
      {/* ---------------------------------------------------- */}
      <div className="bg-[#1E3A2B] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>100% Satisfaction & Punctuality Guarantee</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              If Our Specialist Is Late, Diagnostics Are On Us.
            </h3>
            <p className="text-emerald-100/80 text-sm sm:text-base font-normal">
              We respect your time. Our algorithmic collision shield reserves real dedicated time blocks with zero double-booking. If your technician arrives more than 15 minutes past your window, your diagnostic inspection fee is 100% waived.
            </p>
          </div>

          <button
            onClick={onScheduleClick}
            className="shrink-0 bg-white hover:bg-slate-100 text-[#1E3A2B] font-extrabold px-8 py-4 rounded-full text-sm sm:text-base transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 flex items-center gap-2 cursor-pointer"
          >
            <span>Schedule Guaranteed Service</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
