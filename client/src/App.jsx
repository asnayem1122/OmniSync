import React, { useState, useEffect } from 'react';
import MeshBackground from './components/MeshBackground';
import Navbar from './components/Navbar';
import ServiceRequestForm from './components/ServiceRequestForm';
import RecommendationView from './components/RecommendationView';
import LiveTrackingTracker from './components/LiveTrackingTracker';
import ProviderDirectory from './components/ProviderDirectory';
import ProviderDashboard from './components/ProviderDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('request'); // 'request' | 'recommendations' | 'tracking' | 'providers' | 'provider-dashboard'
  const [providers, setProviders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [requestSummary, setRequestSummary] = useState(null);
  const [pendingFormPayload, setPendingFormPayload] = useState(null);
  const [activeRequest, setActiveRequest] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  // 1. Fetch initial providers and requests
  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/providers');
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
      const res = await fetch('/api/requests');
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
        // If activeRequest is set, update it to freshest from backend
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
    // Poll updates every 8 seconds for live sync
    const interval = setInterval(() => {
      fetchRequests();
      fetchProviders();
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 2. Submit Request to Matching Engine (Customer)
  const handleFindMatches = async (formPayload) => {
    setIsLoading(true);
    setErrorBanner(null);
    setPendingFormPayload(formPayload);

    try {
      const res = await fetch('/api/match', {
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
        assignedProvider: provider._id,
        matchedProviders: matches.slice(0, 5).map((m) => ({
          providerId: m.provider._id,
          matchScore: m.matchScore,
          breakdown: m.breakdown,
        })),
      };

      const res = await fetch('/api/requests', {
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
      const res = await fetch(`/api/requests/${requestId}/status`, {
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
    } catch (err) {
      console.error('Status update error:', err);
      setErrorBanner(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // 5. Provider Accepts Job from Queue
  const handleProviderAcceptJob = async (job, provider) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/requests/${job._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Accepted',
          providerId: provider?._id || job.assignedProvider?._id,
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

  // 6. Provider Adds Manual Blocked Slot
  const handleAddManualSlot = async (providerId, slotData) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/providers/${providerId}/slots`, {
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

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between pb-16">
      {/* Vibrant Mesh Gradient Background */}
      <MeshBackground />

      <div>
        {/* Horizon UI Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeRequest={activeRequest}
          pendingJobsCount={pendingRequestsCount}
        />

        {/* Global Error Banner */}
        {errorBanner && (
          <div className="max-w-4xl mx-auto px-4 mb-6">
            <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between">
              <span>{errorBanner}</span>
              <button
                onClick={() => setErrorBanner(null)}
                className="font-bold underline ml-4 hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main View Area */}
        <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {activeTab === 'request' && (
            <ServiceRequestForm
              onFindMatches={handleFindMatches}
              isLoading={isLoading}
            />
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
              onNewRequest={() => setActiveTab('request')}
            />
          )}

          {activeTab === 'provider-dashboard' && (
            <ProviderDashboard
              providers={providers}
              requests={requests}
              activeRequestId={activeRequest?._id}
              onAcceptJob={(job) => handleProviderAcceptJob(job, providers[0])}
              onUpdateJobStatus={handleUpdateStatus}
              onAddManualSlot={(slotData) =>
                handleAddManualSlot(providers[0]?._id, slotData)
              }
              isProcessing={isUpdating}
            />
          )}

          {activeTab === 'providers' && <ProviderDirectory providers={providers} />}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-500">
        <p>
          OmniSync Smart Home Automation • Built with MERN, Tailwind CSS & Horizon UI Glassmorphism
        </p>
      </footer>
    </div>
  );
}
