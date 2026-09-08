import React from 'react';
import {
  ArrowUpRight,
  ShieldCheck,
  Star,
  Zap,
  CheckCircle,
  Home,
  Cpu,
  Clock,
  ChevronRight,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export default function HomeHero({ onSelectServiceAndScroll, onScheduleClick }) {
  return (
    <section id="hero-section" className="relative pt-4 pb-12 sm:pb-20">
      {/* Hero Container */}
      <div className="bg-[#F8FAFC] dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-14 relative overflow-hidden shadow-contractor-pill">
        {/* Subtle decorative background gradients */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-100 dark:bg-emerald-950/30 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1E3A2B]/5 dark:bg-emerald-950/20 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-10 sm:mb-14">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Pill Tag */}
            <div className="contractor-tag">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Safe, Fast & Reliable Contractor</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Safe, Fast & Reliable <br />
              <span className="text-[#1E3A2B] dark:text-emerald-400">
                Smart Home Automation
              </span>{' '}
              Solutions
            </h1>

            {/* Subhead Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
              From intelligent climate control and automated lighting to whole-home security networks, our certified master technicians deliver precision installation and 24/7 reliability.
            </p>

            {/* Dual CTA Pills */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onScheduleClick}
                className="forest-pill-btn px-7 py-4 text-sm sm:text-base font-bold gap-2 group cursor-pointer"
              >
                <span>Schedule Specialist</span>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-emerald-300" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('services-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="outline-pill-btn px-7 py-4 text-sm sm:text-base font-bold hover:bg-slate-50 cursor-pointer"
              >
                <span>Explore All Services</span>
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-900 dark:text-white">4.9/5</span>
                <span className="text-slate-500 dark:text-slate-400">(1,400+ Homes)</span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Double-Booking Guarantee</span>
              </div>

              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>15-Min Fast Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual with Technician Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800">
              <img
                src="/images/technician_hero.jpg"
                alt="OmniSync Smart Home Technician Specialist"
                className="w-full h-80 sm:h-[420px] object-cover object-center"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80';
                }}
              />

              {/* Gradient overlay on bottom of photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge Top Left */}
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl px-3.5 py-2 shadow-lg border border-slate-200/80 dark:border-white/10 flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Licensed Master Electricians</span>
              </div>

              {/* Floating Badge Bottom Right */}
              <div className="absolute bottom-4 right-4 bg-[#1E3A2B]/95 text-white backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl border border-emerald-500/30 flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div>
                  <div className="text-xs font-extrabold">13 Specialists Online</div>
                  <div className="text-[10px] text-emerald-200">Austin & Surrounding Metro</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 3 OVERLAID FLOATING FEATURE CARDS (Signature Reference Style) */}
        {/* ---------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          {/* Card 1: Solid Forest Green Dark Card */}
          <div
            onClick={() => onSelectServiceAndScroll?.('Smart Lighting & Control')}
            className="rounded-2xl bg-[#1E3A2B] text-white p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between border border-emerald-900/60 group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5 border border-white/15 group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6 text-emerald-300" />
              </div>
              <h3 className="text-lg font-extrabold text-white mb-2">
                Residential Smart Systems
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal mb-6">
                Lutron architectural lighting, automated motorized shades, and unified touch screen controllers for luxury living.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 group-hover:text-white transition-colors">
              <span>Book Residential Dispatch</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 2: Crisp White Card with Forest Icon */}
          <div
            onClick={() => onSelectServiceAndScroll?.('Smart Security & Access')}
            className="rounded-2xl bg-white dark:bg-slate-800/90 p-6 sm:p-7 shadow-clean-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between border border-slate-200/80 dark:border-white/10 group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-5 border border-emerald-100 dark:border-emerald-800/30 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6 text-[#1E3A2B] dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                Commercial IoT & Facilities
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-6">
                Enterprise access control, sensor networks, automated conference AV suites, and multi-tenant security telemetry.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A2B] dark:text-emerald-400 group-hover:text-emerald-600 transition-colors">
              <span>Explore Commercial</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Card 3: Crisp White Card with Forest/Teal Icon */}
          <div
            onClick={() => onSelectServiceAndScroll?.('HVAC & Climate Automation', 'Emergency')}
            className="rounded-2xl bg-white dark:bg-slate-800/90 p-6 sm:p-7 shadow-clean-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between border border-slate-200/80 dark:border-white/10 group"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center mb-5 border border-teal-100 dark:border-teal-800/30 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6 text-[#1E3A2B] dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                24/7 Emergency Dispatch
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-6">
                Rapid collision-free routing for unresponsive climate controllers, smart deadbolt lockouts, or electrical faults.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A2B] dark:text-teal-400 group-hover:text-teal-600 transition-colors">
              <span>Emergency Service</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
