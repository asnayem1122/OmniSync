import React from 'react';
import {
  Wrench,
  Droplet,
  Zap,
  Sparkles,
  Hammer,
  Truck,
  Car,
  Scissors,
  ArrowRight,
} from 'lucide-react';

export const SERVICES = [
  {
    id: 'Appliance & Gadget Repair',
    title: 'Appliance & Gadget Repair',
    description:
      'Certified diagnostics & repair for smart fridges, washers, dryers, ovens, induction hobs, and IoT devices.',
    icon: Wrench,
  },
  {
    id: 'Plumbing',
    title: 'Plumbing',
    description:
      'Emergency pipe leaks, smart water shutoff valves, drain cleaning, water heaters, and fixture installation.',
    icon: Droplet,
  },
  {
    id: 'Electrical',
    title: 'Electrical',
    description:
      'Master electricians for 200A panel upgrades, EV chargers, lighting circuits, smart relays, and wiring.',
    icon: Zap,
  },
  {
    id: 'Cleaning & Pest Control',
    title: 'Cleaning & Pest Control',
    description:
      'Eco-friendly deep cleaning, carpet steam sanitization, pet-safe pest elimination, and termite defense.',
    icon: Sparkles,
  },
  {
    id: 'Home Maintenance',
    title: 'Home Maintenance',
    description:
      'Drywall repairs, door realignment, smart deadbolt fitting, caulking, gutter clearing, and carpentry.',
    icon: Hammer,
  },
  {
    id: 'Moving & Shifting',
    title: 'Moving & Shifting',
    description:
      'Full home relocation, heavy furniture moving, professional packing, secure transport, and item shifting.',
    icon: Truck,
  },
  {
    id: 'Car Care & Repair',
    title: 'Car Care & Repair',
    description:
      'Driveway mobile mechanics, engine OBD-II diagnostics, brake service, battery jump, and mobile detailing.',
    icon: Car,
  },
  {
    id: 'Personal Care',
    title: 'Personal Care',
    description:
      'In-home hairstyling, manicure & grooming, therapeutic deep tissue massage, and personal wellness.',
    icon: Scissors,
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
          <span>8 Core Service Disciplines</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Complete On-Demand Service Solutions
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
          Multi-factor algorithmic matching, certified specialists, real-time GPS tracking, and guaranteed zero double-booking.
        </p>
      </div>

      {/* 8-Card Minimalist Contractor Grid (4x2 Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {SERVICES.map((srv) => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.id}
              onClick={() => handleCardClick(srv.id)}
              className="minimal-grid-card group flex flex-col justify-between cursor-pointer border border-slate-200/90 dark:border-white/10 dark:bg-slate-800/80 hover:border-emerald-500/50 p-6"
            >
              <div>
                {/* Icon in soft forest circle */}
                <div className="w-12 h-12 rounded-2xl bg-[#EBF5F0] dark:bg-emerald-950/60 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-200">
                  <Icon className="w-6 h-6 text-[#1E3A2B] dark:text-emerald-400" />
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 group-hover:text-[#1E3A2B] dark:group-hover:text-emerald-400 transition-colors">
                  {srv.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-5 line-clamp-3">
                  {srv.description}
                </p>
              </div>

              {/* Bottom Interactive Link */}
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-[#1E3A2B] dark:group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                  Explore
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#1E3A2B] dark:text-emerald-400" />
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  Available
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
