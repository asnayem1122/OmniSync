import React from 'react';
import {
  Zap,
  Thermometer,
  Shield,
  Speaker,
  Wifi,
  Cpu,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const SERVICES = [
  {
    id: 'Smart Lighting & Control',
    title: 'Smart Lighting & Shading',
    description:
      'Architectural keypad programming, Lutron Caseta / HomeWorks systems, motorized solar shades, and circadian lighting loops.',
    icon: Zap,
  },
  {
    id: 'HVAC & Climate Automation',
    title: 'Climate & HVAC Automation',
    description:
      'Multi-zone damper balancing, Ecobee & Nest integration, heat pump telemetry, and predictive energy load management.',
    icon: Thermometer,
  },
  {
    id: 'Smart Security & Access',
    title: 'Security & Access Control',
    description:
      '4K AI-powered PoE surveillance, biometric keypad deadbolts, motorized gate access, and unified perimeter alarms.',
    icon: Shield,
  },
  {
    id: 'Home Audio & Theater',
    title: 'Whole-Home Audio & Cinema',
    description:
      'Multi-room audio matrix distribution, hidden architectural speakers, and dedicated high-fidelity Dolby Atmos cinema calibration.',
    icon: Speaker,
  },
  {
    id: 'Smart Appliance Integration',
    title: 'Enterprise Mesh & IoT Networks',
    description:
      'Commercial Wi-Fi 7 access points, isolated IoT VLAN subnets, and robust Matter, Zigbee & Thread mesh coordination.',
    icon: Wifi,
  },
  {
    id: 'Automated Blinds & Shading',
    title: 'Proactive Health & Diagnostics',
    description:
      'Continuous sensor telemetry, offline hub detection, relay health checks, and scheduled preventive contractor tune-ups.',
    icon: Cpu,
  },
];

export default function CompleteServicesGrid({ onSelectService }) {
  const handleCardClick = (serviceId) => {
    if (onSelectService) {
      onSelectService(serviceId);
    }
    const el = document.getElementById('booking-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services-section" className="py-12 sm:py-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
        <div className="contractor-tag mb-3">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>What We Offer</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Complete Smart Home Automation Services
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
          Comprehensive smart automation, precision diagnostics, and reliable emergency repairs for modern residences and facilities.
        </p>
      </div>

      {/* 6-Card Minimalist Contractor Grid (2x3 Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {SERVICES.map((srv) => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.id}
              onClick={() => handleCardClick(srv.id)}
              className="minimal-grid-card group flex flex-col justify-between cursor-pointer border border-slate-200/90 dark:border-white/10 dark:bg-slate-800/80 hover:border-emerald-500/50"
            >
              <div>
                {/* Icon in soft forest circle */}
                <div className="w-12 h-12 rounded-2xl bg-[#EBF5F0] dark:bg-emerald-950/60 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200">
                  <Icon className="w-6 h-6 text-[#1E3A2B] dark:text-emerald-400" />
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2.5 group-hover:text-[#1E3A2B] dark:group-hover:text-emerald-400 transition-colors">
                  {srv.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-6">
                  {srv.description}
                </p>
              </div>

              {/* Bottom Interactive Link */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#1E3A2B] dark:group-hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                  Explore Service
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#1E3A2B] dark:text-emerald-400" />
                </span>
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  Available Now
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
