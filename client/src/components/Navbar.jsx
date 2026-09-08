import React, { useState, useEffect } from 'react';
import {
  Home,
  Activity,
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
  Star,
  ChevronRight,
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

  // Close drawer on Escape key or outside interactions
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
    <>
      <header className="sticky top-2 sm:top-3 z-40 px-2.5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-3 sm:mb-6 transition-all duration-300">
        <nav className="w-full max-w-full rounded-full px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between border border-slate-200/90 dark:border-white/10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl shadow-contractor-pill">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('request', 'hero-section')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group min-w-0 shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1E3A2B] dark:bg-emerald-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base sm:text-lg whitespace-nowrap">
                  OmniSync
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-400 -mt-0.5 hidden sm:block whitespace-nowrap">
                Smart Home Solutions
              </span>
            </div>
          </div>

          {/* Center Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
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
              onClick={() => handleNavClick('reviews')}
              className={`transition-colors hover:text-[#1E3A2B] dark:hover:text-white cursor-pointer ${
                activeTab === 'reviews' ? 'text-[#1E3A2B] dark:text-emerald-400 font-bold' : ''
              }`}
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
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* User Profile or Sign In Capsule */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-1 sm:pr-1.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-[#1E3A2B]/40 shrink-0"
                />
                <div className="hidden xl:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[90px] whitespace-nowrap">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] uppercase font-extrabold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                    {currentUser.role === 'provider' ? 'Specialist' : 'Customer'}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Log Out"
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-[#1E3A2B] dark:text-emerald-400 shrink-0" />
                <span className="whitespace-nowrap">Log In</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            {setTheme && (
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label="Toggle Theme"
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-xs cursor-pointer shrink-0"
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 shrink-0" />
                )}
              </button>
            )}

            {/* Primary CTA Capsule Button (Shown ONLY on desktop lg+) */}
            {currentUser?.role === 'provider' ? (
              <button
                onClick={() => handleNavClick('provider-dashboard')}
                className="!hidden lg:!inline-flex items-center justify-center forest-pill-btn px-4 py-2 text-xs tracking-wide gap-1.5 group cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span>Workspace</span>
                <Wrench className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              </button>
            ) : (
              <button
                onClick={() => scrollToSection('booking-section')}
                className="!hidden lg:!inline-flex items-center justify-center forest-pill-btn px-4 py-2 text-xs tracking-wide gap-1.5 group cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span>Schedule Service</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-emerald-300 shrink-0" />
              </button>
            )}

            {/* Mobile Drawer Trigger (md:hidden) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700 dark:text-emerald-400" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </nav>

      </header>

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Menu Sheet */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="md:hidden fixed top-16 left-3 right-3 sm:left-6 sm:right-6 max-w-lg mx-auto z-50 p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-white/10 backdrop-blur-2xl shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200 max-h-[82vh] overflow-y-auto"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#1E3A2B] dark:bg-emerald-600 flex items-center justify-center text-white">
                <Home className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">OmniSync Menu</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile or Sign In inside drawer */}
          {currentUser ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#1E3A2B]/40 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                    {currentUser.role === 'provider' ? 'Certified Specialist' : 'Verified Customer'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Sign In or Register</span>
            </button>
          )}

          {/* Navigation Links List */}
          <div className="space-y-1 pt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => handleNavClick('request', 'hero-section')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'request'
                  ? 'bg-emerald-500/10 text-[#1E3A2B] dark:text-emerald-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Home Overview</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavClick('request', 'services-section')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>All Services & Categories</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavClick('request', 'trust-showcase-section')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Why OmniSync Quality</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavClick('reviews')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-emerald-500/10 text-[#1E3A2B] dark:text-emerald-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Customer Reviews & Ratings</span>
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => handleNavClick('tracking')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-emerald-500/10 text-[#1E3A2B] dark:text-emerald-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Live Dispatch Tracker</span>
              </span>
              {activeRequest ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Active</span>
                </span>
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('provider-dashboard')}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'provider-dashboard'
                  ? 'bg-emerald-500/10 text-[#1E3A2B] dark:text-emerald-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-emerald-600" />
                <span>Technician Portal</span>
              </span>
              {pendingJobsCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  {pendingJobsCount} pending
                </span>
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>

          {/* Quick Action CTA in Drawer */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/10">
            <button
              onClick={() => scrollToSection('booking-section')}
              className="w-full forest-pill-btn justify-center py-2.5 text-xs tracking-wide gap-2 group cursor-pointer"
            >
              <span>Book Smart Home Service</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-emerald-300" />
            </button>
          </div>
        </div>
      )}

      {/* Native App-Style Mobile Bottom Navigation Bar (Synchronized with md:hidden) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-white/10 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pb-safe"
      >
        {/* Home */}
        <button
          onClick={() => handleNavClick('request', 'hero-section')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] ${
            activeTab === 'request'
              ? 'text-[#1E3A2B] dark:text-emerald-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* Services */}
        <button
          onClick={() => handleNavClick('request', 'services-section')}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer min-h-[48px]"
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Services</span>
        </button>

        {/* Center Floating CTA: Book Now */}
        <button
          onClick={() => scrollToSection('booking-section')}
          className="flex flex-col items-center justify-center -mt-5 cursor-pointer group px-2"
          aria-label="Book a Service"
        >
          <div className="w-12 h-12 rounded-full bg-[#1E3A2B] dark:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/30 group-active:scale-95 transition-transform ring-4 ring-white dark:ring-slate-900">
            <ArrowUpRight className="w-5 h-5 text-emerald-300" />
          </div>
          <span className="text-[10px] font-extrabold text-[#1E3A2B] dark:text-emerald-400 mt-0.5">Book</span>
        </button>

        {/* Live Tracker */}
        <button
          onClick={() => handleNavClick('tracking')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl relative transition-all cursor-pointer min-h-[48px] ${
            activeTab === 'tracking'
              ? 'text-[#1E3A2B] dark:text-emerald-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <Activity className="w-5 h-5 mb-0.5" />
            {activeRequest && (
              <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            )}
          </div>
          <span className="text-[10px] tracking-tight">Tracker</span>
        </button>

        {/* Technician Portal */}
        <button
          onClick={() => handleNavClick('provider-dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl relative transition-all cursor-pointer min-h-[48px] ${
            activeTab === 'provider-dashboard'
              ? 'text-[#1E3A2B] dark:text-emerald-400 font-bold scale-105'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <Wrench className="w-5 h-5 mb-0.5" />
            {pendingJobsCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 rounded-full text-[8px] bg-rose-500 text-white font-extrabold">
                {pendingJobsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Portal</span>
        </button>
      </nav>
    </>
  );
}
