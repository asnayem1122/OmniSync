import React from 'react';
import {
  Home,
  Activity,
  Users,
  Sparkles,
  Wrench,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, activeRequest, pendingJobsCount = 0 }) {
  return (
    <header className="sticky top-4 z-50 px-4 md:px-8 mb-8 max-w-7xl mx-auto w-full">
      <nav className="glass-panel rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('request')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Home className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-lg">OmniSync</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Smart Home Automation Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-xl border border-white/5">
          {/* Customer Tabs */}
          <button
            onClick={() => setActiveTab('request')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'request'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Request Service
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'tracking'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4" />
            Live Tracker
            {activeRequest && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </button>

          <div className="w-[1px] h-5 bg-white/10 mx-1 hidden sm:block" />

          {/* Provider Portal Tab */}
          <button
            onClick={() => setActiveTab('provider-dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'provider-dashboard'
                ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold shadow-md shadow-teal-500/30 ring-1 ring-emerald-300/40'
                : 'text-teal-300 hover:text-white hover:bg-teal-500/10'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Technician Portal</span>
            {pendingJobsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-500 text-slate-950">
                {pendingJobsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 ${
              activeTab === 'providers'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            Directory
          </button>
        </div>

        {/* Live Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Double-Booking Shield: Active</span>
        </div>
      </nav>
    </header>
  );
}
