import React, { useState, useEffect } from 'react';
import MeshBackground from './components/MeshBackground';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import CompleteServicesGrid from './components/CompleteServicesGrid';
import TrustAndShowcase from './components/TrustAndShowcase';
import ServiceRequestForm from './components/ServiceRequestForm';
import RecommendationView from './components/RecommendationView';
import LiveTrackingTracker from './components/LiveTrackingTracker';
import ProviderDirectory from './components/ProviderDirectory';
import ProviderDashboard from './components/ProviderDashboard';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import RatingReviewModal from './components/RatingReviewModal';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('omnisync-theme') || 'light';
  });

  // Authenticated User Session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('omnisync-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [reviewTargetRequest, setReviewTargetRequest] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [activeTab, setActiveTab] = useState('request'); // 'request' | 'recommendations' | 'tracking' | 'providers' | 'provider-dashboard'
  const [providers, setProviders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [requestSummary, setRequestSummary] = useState(null);
  const [pendingFormPayload, setPendingFormPayload] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);

  // External form pre-sets from hero or services grid clicks
  const [formCategory, setFormCategory] = useState('Smart Lighting & Control');
  const [formUrgency, setFormUrgency] = useState('High');

  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  // Sync theme with html class & localStorage
  useEffect(() => {
    localStorage.setItem('omnisync-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync currentUser to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('omnisync-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('omnisync-user');
    }
  }, [currentUser]);

  // 1. Fetch initial providers and requests
  const fetchProviders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/providers`);
      const data = await res.json();
      if (data.success) {
        setProviders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch providers:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/requests`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
        if (activeRequest) {
          const fresh = data.data.find((r) => r._id === activeRequest._id);
          if (fresh) setActiveRequest(fresh);
        }
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  useEffect(() => {
    fetchProviders();
    fetchRequests();
    const interval = setInterval(() => {
      fetchRequests();
      fetchProviders();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBooking = () => {
    setActiveTab('request');
    setTimeout(() => {
      const el = document.getElementById('booking-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleSelectServiceAndScroll = (category, urgency = 'High') => {
    setFormCategory(category);
    setFormUrgency(urgency);
    scrollToBooking();
  };

  // Auth Handlers
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData.role === 'provider') {
      setActiveTab('provider-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('request');
  };

  // 2. Submit Request to Matching Engine (Customer)
  const handleFindMatches = async (formPayload) => {
    setIsLoading(true);
    setErrorBanner(null);
    setPendingFormPayload(formPayload);

    try {
      const res = await fetch(`${API_BASE}/api/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to match providers');
      }

      setMatches(data.results || []);
      setRequestSummary(data.requestSummary || null);
      setActiveTab('recommendations');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Matching error:', err);
      setErrorBanner(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Select & Book Provider (Customer)
  const handleSelectProvider = async (provider, matchScore, breakdown) => {
    if (!pendingFormPayload) return;
    setIsBooking(true);
    setErrorBanner(null);

    try {
      const createPayload = {
        customer: pendingFormPayload.customer,
        serviceType: pendingFormPayload.serviceType,
        location: pendingFormPayload.location,
        preferredTimeRange: pendingFormPayload.preferredTimeRange,
        urgency: pendingFormPayload.urgency,
        details: pendingFormPayload.details,
        image: pendingFormPayload.image || '',
        assignedProvider: provider._id,
        matchedProviders: matches.slice(0, 5).map((m) => ({
          providerId: m.provider._id,
          matchScore: m.matchScore,
          breakdown: m.breakdown,
        })),
      };

      const res = await fetch(`${API_BASE}/api/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createPayload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to create service booking');
      }

      setActiveRequest(data.data);
      setActiveTab('tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchProviders();
      fetchRequests();
    } catch (err) {
      console.error('Booking error:', err);
      setErrorBanner(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  // 4. Update Request Status (Both Customer & Provider)
  const handleUpdateStatus = async (requestId, nextStatus, customNote) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/requests/${requestId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          note: customNote || `Pipeline transition to ${nextStatus}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update status');
      }

      setActiveRequest(data.data);
      fetchProviders();
      fetchRequests();

      // If status transitioned to Completed, prompt rating review
      if (nextStatus === 'Completed' && !data.data.review?.rating) {
        setReviewTargetRequest(data.data);
        setIsRatingModalOpen(true);
      }
    } catch (err) {
      console.error('Status update error:', err);
      setErrorBanner(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // 5. Submit Rating & Review after completion
  const handleSubmitReview = async (requestId, rating, comment) => {
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`${API_BASE}/api/requests/${requestId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setActiveRequest(data.data);
      setIsRatingModalOpen(false);
      setReviewTargetRequest(null);
      fetchProviders();
      fetchRequests();
    } catch (err) {
      console.error('Review error:', err);
      setErrorBanner(err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // 6. Provider Accepts Job from Queue
  const handleProviderAcceptJob = async (job, provider) => {
    setIsUpdating(true);
    try {
      const assignedId = provider?._id || currentProviderId || job.assignedProvider?._id;
      const res = await fetch(`${API_BASE}/api/requests/${job._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Accepted',
          providerId: assignedId,
          note: `Technician accepted job from incoming dispatch queue.`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to accept job');
      }

      setActiveRequest(data.data);
      fetchProviders();
      fetchRequests();
    } catch (err) {
      console.error('Error accepting job:', err);
      setErrorBanner(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // 7. Provider Adds Manual Blocked Slot
  const handleAddManualSlot = async (providerId, slotData) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/providers/${providerId}/slots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slotData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to block slot');
      }

      fetchProviders();
    } catch (err) {
      console.error('Error blocking slot:', err);
      setErrorBanner(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'Requested').length;

  const currentProviderId =
    currentUser?.role === 'provider'
      ? currentUser.providerId || currentUser.id
      : providers[0]?._id;

  return (
    <div
      className={`relative min-h-screen ${
        theme === 'dark' ? 'dark text-slate-100' : 'text-slate-800'
      } flex flex-col justify-between transition-colors duration-300 font-sans antialiased selection:bg-[#1E3A2B] selection:text-white bg-[#F8FAFC] dark:bg-[#070C18]`}
    >
      {/* Background Ambience */}
      <MeshBackground theme={theme} />

      <div>
        {/* Floating Capsule Pill Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeRequest={activeRequest}
          pendingJobsCount={pendingRequestsCount}
          theme={theme}
          setTheme={setTheme}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Global Error Banner */}
        {errorBanner && (
          <div className="max-w-4xl mx-auto px-4 mb-6">
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between shadow-sm backdrop-blur-md">
              <span className="font-medium">{errorBanner}</span>
              <button
                onClick={() => setErrorBanner(null)}
                className="font-bold underline ml-4 hover:opacity-80 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main View Area */}
        <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {activeTab === 'request' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Signature Hero Section */}
              <HomeHero
                onSelectServiceAndScroll={handleSelectServiceAndScroll}
                onScheduleClick={scrollToBooking}
              />

              {/* 6-Card Service Grid */}
              <CompleteServicesGrid
                onSelectService={(catId) => handleSelectServiceAndScroll(catId)}
              />

              {/* Service Request & Scheduling Form */}
              <ServiceRequestForm
                onFindMatches={handleFindMatches}
                isLoading={isLoading}
                initialCategory={formCategory}
                initialUrgency={formUrgency}
                currentUser={currentUser}
              />

              {/* Trust, Before/After & Customer Reviews */}
              <TrustAndShowcase onScheduleClick={scrollToBooking} />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <RecommendationView
              matches={matches}
              requestSummary={requestSummary}
              onSelectProvider={handleSelectProvider}
              onBack={() => setActiveTab('request')}
              isBooking={isBooking}
            />
          )}

          {activeTab === 'tracking' && (
            <LiveTrackingTracker
              request={activeRequest}
              onUpdateStatus={handleUpdateStatus}
              isUpdating={isUpdating}
              onNewRequest={() => {
                setActiveTab('request');
                scrollToBooking();
              }}
              onOpenReviewModal={(req) => {
                setReviewTargetRequest(req);
                setIsRatingModalOpen(true);
              }}
            />
          )}

          {activeTab === 'provider-dashboard' && (
            <ProviderDashboard
              providers={providers}
              requests={requests}
              activeRequestId={activeRequest?._id}
              currentUser={currentUser}
              onAcceptJob={(job) =>
                handleProviderAcceptJob(
                  job,
                  providers.find((p) => String(p._id) === String(currentProviderId)) || providers[0]
                )
              }
              onUpdateJobStatus={handleUpdateStatus}
              onAddManualSlot={(slotData) =>
                handleAddManualSlot(currentProviderId, slotData)
              }
              isProcessing={isUpdating}
            />
          )}

          {activeTab === 'providers' && <ProviderDirectory providers={providers} />}
        </main>
      </div>

      {/* Contractor Polish Footer */}
      <Footer
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onScheduleClick={scrollToBooking}
      />

      {/* Auth Modal (Customer & Service Holder Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        providers={providers}
      />

      {/* Post-Completion Rating & Review Modal */}
      <RatingReviewModal
        isOpen={isRatingModalOpen}
        onClose={() => {
          setIsRatingModalOpen(false);
          setReviewTargetRequest(null);
        }}
        request={reviewTargetRequest}
        onSubmitReview={handleSubmitReview}
        isSubmitting={isSubmittingReview}
      />
    </div>
  );
}
