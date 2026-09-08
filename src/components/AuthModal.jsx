import React, { useState } from 'react';
import {
  User,
  Wrench,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  Phone,
  MapPin,
} from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  providers = [],
}) {
  const [roleTab, setRoleTab] = useState('customer'); // 'customer' | 'provider'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Custom Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState(
    providers[0]?._id || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleDemoCustomerLogin = (customerPreset) => {
    onLoginSuccess({
      id: customerPreset.id,
      name: customerPreset.name,
      email: customerPreset.email,
      phone: customerPreset.phone,
      address: customerPreset.address,
      role: 'customer',
      avatar: customerPreset.avatar,
    });
    onClose();
  };

  const handleDemoProviderLogin = (prov) => {
    onLoginSuccess({
      id: prov._id,
      providerId: prov._id,
      name: prov.name,
      email: `${prov.name.toLowerCase().replace(/\s+/g, '.')}@omnisync-tech.com`,
      role: 'provider',
      avatar: prov.avatar,
      category: prov.category,
      phone: prov.phone,
      rating: prov.rating,
      reviewsCount: prov.reviewsCount,
      expertiseLevel: prov.expertiseLevel,
      earnings: prov.earnings || 1480,
      isAvailable: prov.isAvailable ?? true,
    });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const bodyPayload =
        roleTab === 'customer'
          ? {
              email: email || 'alex.rivera@homemail.com',
              name: name || 'Alex Rivera',
              phone: phone || '+1 (512) 555-4829',
              address: address || '600 Congress Ave, Austin, TX',
              role: 'customer',
            }
          : {
              role: 'provider',
              providerId: selectedProviderId || providers[0]?._id,
              name: name || 'Specialist',
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Decorative ambient gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        {/* Header & Close Button */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-white/10 relative z-10">
          <div>
            <div className="contractor-tag mb-1 text-[10px]">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>OmniSync Access Portal</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {authMode === 'login' ? 'Sign In to Your Account' : 'Create New Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Role Tabs: Customer vs Service Holder */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRoleTab('customer')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleTab === 'customer'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-[#1E3A2B] dark:text-emerald-400" />
            <span>Customer Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setRoleTab('provider')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              roleTab === 'provider'
                ? 'bg-[#1E3A2B] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4 text-emerald-300" />
            <span>Service Specialist</span>
          </button>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 1-Click Demo Profiles (For Instant Hackathon & Evaluation Test) */}
        {/* ---------------------------------------------------------------- */}
        <div className="mb-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-white/5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ⚡ Fast 1-Click Demo Profiles
            </span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">
              Instant Session
            </span>
          </div>

          {roleTab === 'customer' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleDemoCustomerLogin({
                    id: 'cust_1',
                    name: 'Alex Rivera',
                    email: 'alex.rivera@homemail.com',
                    phone: '+1 (512) 555-4829',
                    address: '600 Congress Ave, Austin, TX',
                    avatar:
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  })
                }
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#1E3A2B] dark:hover:border-emerald-500 text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1E3A2B] dark:group-hover:text-emerald-400">
                  Alex Rivera
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Residential Homeowner</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDemoCustomerLogin({
                    id: 'cust_2',
                    name: 'Elena Rostova',
                    email: 'elena.rostova@techfacilities.io',
                    phone: '+1 (512) 555-9081',
                    address: '11410 Century Oaks, Austin, TX',
                    avatar:
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                  })
                }
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#1E3A2B] dark:hover:border-emerald-500 text-left transition-all group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#1E3A2B] dark:group-hover:text-emerald-400">
                  Elena Rostova
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Commercial Facility Mgr</div>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {providers.slice(0, 2).map((prov) => (
                <button
                  key={prov._id}
                  type="button"
                  onClick={() => handleDemoProviderLogin(prov)}
                  className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#1E3A2B] dark:hover:border-emerald-500 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#1E3A2B] dark:group-hover:text-emerald-400">
                    {prov.name}
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold truncate">
                    {prov.category.split('&')[0]} • ★ {prov.rating}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Login / Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {roleTab === 'provider' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Specialist Profile
              </label>
              <select
                value={selectedProviderId}
                onChange={(e) => setSelectedProviderId(e.target.value)}
                className="w-full rounded-xl px-3.5 py-2.5 text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1E3A2B]"
              >
                {providers.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} — {p.category}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1E3A2B]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1E3A2B]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (512) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#1E3A2B]"
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full forest-pill-btn py-3 px-4 text-xs font-bold gap-2 cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {roleTab === 'provider'
                    ? 'Launch Specialist Dashboard'
                    : authMode === 'login'
                    ? 'Sign In as Customer'
                    : 'Register Account'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {roleTab === 'customer' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-xs font-semibold text-slate-500 hover:text-[#1E3A2B] dark:hover:text-emerald-400 transition-colors"
            >
              {authMode === 'login'
                ? "Don't have an account? Sign up here"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
