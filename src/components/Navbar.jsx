import React, { useState } from 'react';
import {
  Home,
  Activity,
  Users,
  Wrench,
  Sun,
  Moon,
  ArrowUpRight,
  ShieldCheck,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  activeRequest,
  pendingJobsCount = 0,
  theme = 'light',
  setTheme,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) {
  const isDark = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    setActiveTab('request');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleNavClick = (tabName, sectionId = null) => {
    setMobileMenuOpen(false);
    if (sectionId) {
      scrollToSection(sectionId);
    } else {
      setActiveTab(tabName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-3 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-6 transition-all duration-300">
      <nav className="rounded-full px-5 sm:px-7 py-3 flex items-center justify-between border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl shadow-contractor-pill">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('request', 'hero-section')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-full bg-[#1E3A2B] dark:bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-lg">
                OmniSync
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400 -mt-1 hidden sm:block">
              Smart Home Solutions
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick('request', 'hero-section')}
            className={`transition-colors hover:text-[#1E3A2B] dark:hover:text-white cursor-pointer ${
              activeTab === 'request' ? 'text-[#1E3A2B] dark:text-emerald-400 font-bold' : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('request', 'services-section')}
            className="transition-colors hover:text-[#1E3A2B] dark:hover:text-white cursor-pointer"
          >
            Services
          </button>

          <button
            onClick={() => handleNavClick('request', 'trust-showcase-section')}
            className="transition-colors hover:text-[#1E3A2B] dark:hover:text-white cursor-pointer"
          >
            Why Us
          </button>

          <button
            onClick={() => handleNavClick('request', 'reviews-section')}
            className="transition-colors hover:text-[#1E3A2B] dark:hover:text-white cursor-pointer"
          >
            Reviews
          </button>

          <button
            onClick={() => handleNavClick('tracking')}
            className={`flex items-center gap-1.5 transition-colors hover:text-[#1E3A2B] dark:hover:text-white cursor-pointer ${
              activeTab === 'tracking' ? 'text-[#1E3A2B] dark:text-emerald-400 font-bold' : ''
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Tracker</span>
            {activeRequest && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('provider-dashboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'provider-dashboard'
                ? 'bg-[#1E3A2B] text-white dark:bg-emerald-600 shadow-sm'
                : 'text-slate-700 hover:text-slate-900 bg-slate-100 dark:bg-white/10 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tech Portal</span>
            {pendingJobsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-rose-500 text-white font-extrabold">
                {pendingJobsCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Actions: Auth Capsule, Theme Switcher & Schedule CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* User Profile or Sign In Capsule */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-[#1E3A2B]/40"
              />
              <div className="hidden lg:flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[100px]">
                  {currentUser.name}
                </span>
                <span className="text-[9px] uppercase font-extrabold text-emerald-700 dark:text-emerald-400">
                  {currentUser.role === 'provider' ? 'Specialist' : 'Customer'}
                </span>
              </div>
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
            >
              <User className="w-3.5 h-3.5 text-[#1E3A2B] dark:text-emerald-400" />
              <span>Log In</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          {setTheme && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle Theme"
              className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-xs cursor-pointer"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          )}

          {/* Primary CTA Capsule Button */}
          {currentUser?.role === 'provider' ? (
            <button
              onClick={() => handleNavClick('provider-dashboard')}
              className="forest-pill-btn px-4 sm:px-5 py-2.5 text-xs sm:text-sm tracking-wide gap-1.5 group cursor-pointer"
            >
              <span>My Workspace</span>
              <Wrench className="w-4 h-4 text-emerald-300" />
            </button>
          ) : (
            <button
              onClick={() => scrollToSection('booking-section')}
              className="forest-pill-btn px-4 sm:px-5 py-2.5 text-xs sm:text-sm tracking-wide gap-1.5 group cursor-pointer"
            >
              <span>Schedule Service</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-emerald-300" />
            </button>
          )}

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-xl space-y-3">
          {currentUser && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold uppercase">{currentUser.role}</div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-xs text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          )}

          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => handleNavClick('request', 'hero-section')}
              className="text-left py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('request', 'services-section')}
              className="text-left py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick('request', 'trust-showcase-section')}
              className="text-left py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
            >
              Why OmniSync
            </button>
            <button
              onClick={() => handleNavClick('request', 'reviews-section')}
              className="text-left py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
            >
              Customer Reviews
            </button>
            <button
              onClick={() => handleNavClick('tracking')}
              className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Live Tracker
              </span>
              {activeRequest && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>
            <button
              onClick={() => handleNavClick('provider-dashboard')}
              className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-600" /> Technician Portal
              </span>
              {pendingJobsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  {pendingJobsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
