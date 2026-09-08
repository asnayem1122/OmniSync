import React from 'react';
import {
  Home,
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  ArrowUpRight,
} from 'lucide-react';

export default function Footer({ onNavigateTab, onScheduleClick }) {
  return (
    <footer className="mt-20 border-t border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950 pt-14 pb-12 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200/80 dark:border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1E3A2B] text-white flex items-center justify-center">
                <Home className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight">
                OmniSync
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm font-medium">
              Austin’s premier smart home automation and low-voltage electrical contractor. Real-time algorithmic dispatch, certified master technicians, and zero double-booking collision guarantee.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> TECL #49120
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-emerald-600" /> CEDIA Certified
              </span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a
                  href="#services-section"
                  className="hover:text-[#1E3A2B] dark:hover:text-emerald-400 transition-colors"
                >
                  Smart Lighting & Shading
                </a>
              </li>
              <li>
                <a
                  href="#services-section"
                  className="hover:text-[#1E3A2B] dark:hover:text-emerald-400 transition-colors"
                >
                  HVAC & Climate Systems
                </a>
              </li>
              <li>
                <a
                  href="#services-section"
                  className="hover:text-[#1E3A2B] dark:hover:text-emerald-400 transition-colors"
                >
                  Biometric Access & Security
                </a>
              </li>
              <li>
                <a
                  href="#services-section"
                  className="hover:text-[#1E3A2B] dark:hover:text-emerald-400 transition-colors"
                >
                  Whole-Home Audio Cinema
                </a>
              </li>
              <li>
                <a
                  href="#services-section"
                  className="hover:text-[#1E3A2B] dark:hover:text-emerald-400 transition-colors"
                >
                  Enterprise Mesh Networks
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Portal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Platform & Tech
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button
                  onClick={() => onNavigateTab?.('provider-dashboard')}
                  className="hover:text-[#1E3A2B] dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Technician Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('tracking')}
                  className="hover:text-[#1E3A2B] dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Live Dispatch Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('reviews')}
                  className="hover:text-[#1E3A2B] dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Verified Reviews & Ratings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab?.('providers')}
                  className="hover:text-[#1E3A2B] dark:hover:text-emerald-400 transition-colors text-left"
                >
                  Specialist Directory
                </button>
              </li>
              <li>
                <a
                  href="#trust-showcase-section"
                  className="hover:text-[#1E3A2B] dark:hover:text-emerald-400 transition-colors"
                >
                  Collision Shield Guarantee
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & 24/7 Hotline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Emergency Dispatch
            </h4>
            <div className="text-sm space-y-2 font-medium">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>(800) 555-SYNC</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>dispatch@omnisync-home.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Austin, Texas & Greater Metro</span>
              </div>
            </div>

            <button
              onClick={onScheduleClick}
              className="mt-3 w-full forest-pill-btn py-2.5 px-4 text-xs font-bold gap-1"
            >
              <span>Schedule Tech</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} OmniSync Automation Systems Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for Modern Smart Homes</span>
            <span>•</span>
            <span>Zero Double-Booking Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
