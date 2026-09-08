import http from 'http';
import { calculateDistanceKm } from '../utils/geo.js';
import { hasSlotCollision, computeMatchScore } from '../controllers/matchController.js';

const BASE_URL = 'http://localhost:5000';

console.log('====================================================');
console.log('🧪 OMNISYNC COMPREHENSIVE END-TO-END PLATFORM TEST');
console.log('====================================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? `(${details})` : ''}`);
    failedTests++;
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json();
  return { status: response.status, ok: response.ok, data };
}

async function runAllTests() {
  const CATEGORIES = [
    'Appliance & Gadget Repair',
    'Plumbing',
    'Electrical',
    'Cleaning & Pest Control',
    'Home Maintenance',
    'Moving & Shifting',
    'Car Care & Repair',
    'Personal Care',
  ];

  // ----------------------------------------------------
  // TEST SUITE 1: Server Connectivity & Provider Discovery
  // ----------------------------------------------------
  console.log('📦 Test Suite 1: Provider Seeding & Category Coverage');
  const allProvidersRes = await request('/api/providers');
  assert(allProvidersRes.ok, 'GET /api/providers returns 200 OK');
  assert(
    allProvidersRes.data.data && allProvidersRes.data.data.length >= 16,
    `Database has all 16 certified specialists: found ${allProvidersRes.data.data?.length}`
  );

  for (const cat of CATEGORIES) {
    const catRes = await request(`/api/providers?category=${encodeURIComponent(cat)}`);
    const count = catRes.data.data?.length || 0;
    assert(count >= 2, `Category [${cat}] has at least 2 specialists (found: ${count})`);
  }

  // ----------------------------------------------------
  // TEST SUITE 2: Haversine Geo Calculation
  // ----------------------------------------------------
  console.log('\n📍 Test Suite 2: Haversine Proximity Calculation');
  const austinDowntown = { lat: 30.2672, lng: -97.7431 };
  const domainAustin = { lat: 30.395, lng: -97.725 };
  const southAustin = { lat: 30.245, lng: -97.739 };

  const d1 = calculateDistanceKm(austinDowntown.lat, austinDowntown.lng, domainAustin.lat, domainAustin.lng);
  const d2 = calculateDistanceKm(austinDowntown.lat, austinDowntown.lng, southAustin.lat, southAustin.lng);

  assert(d1 >= 13 && d1 <= 16, `Downtown to Domain distance ~14-15km (got ${d1.toFixed(2)}km)`);
  assert(d2 >= 2 && d2 <= 3.5, `Downtown to South Austin distance ~2.5km (got ${d2.toFixed(2)}km)`);

  // ----------------------------------------------------
  // TEST SUITE 3: Double-Booking Collision Shield
  // ----------------------------------------------------
  console.log('\n⏱️ Test Suite 3: Double-Booking Collision Shield');
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  const sampleBooked = [
    { start: new Date(y, m, d, 10, 0), end: new Date(y, m, d, 12, 0), title: 'Task A' },
    { start: new Date(y, m, d, 14, 0), end: new Date(y, m, d, 16, 0), title: 'Task B' },
  ];

  const slotFree = hasSlotCollision(sampleBooked, new Date(y, m, d, 12, 30), new Date(y, m, d, 13, 30));
  assert(!slotFree, 'Free window 12:30-13:30 correctly reports NO collision');

  const slotCollidingStart = hasSlotCollision(sampleBooked, new Date(y, m, d, 11, 0), new Date(y, m, d, 13, 0));
  assert(slotCollidingStart, 'Overlap at start (11:00-13:00) reports collision');

  const slotEnclosed = hasSlotCollision(sampleBooked, new Date(y, m, d, 10, 15), new Date(y, m, d, 11, 45));
  assert(slotEnclosed, 'Enclosed slot (10:15-11:45) reports collision');

  // ----------------------------------------------------
  // TEST SUITE 4: Multi-Factor Provider Matching Engine
  // ----------------------------------------------------
  console.log('\n⚡ Test Suite 4: Smart Matching Engine Algorithm');
  const matchPayload = {
    serviceType: 'Electrical',
    location: {
      address: '1100 Congress Ave, Austin, TX 78701',
      lat: 30.274,
      lng: -97.74,
      city: 'Downtown Austin',
    },
    preferredTimeRange: {
      start: new Date(y, m, d, 14, 0).toISOString(),
      end: new Date(y, m, d, 16, 0).toISOString(),
    },
    urgency: 'Emergency',
    details: 'Sparks from electrical sub-panel',
    filterCollisions: false,
  };

  const matchRes = await request('/api/match', {
    method: 'POST',
    body: JSON.stringify(matchPayload),
  });

  assert(matchRes.ok, 'POST /api/match returns 200 OK');
  const candidates = matchRes.data.results || matchRes.data.data || [];
  assert(candidates.length > 0, 'Matching algorithm returns provider candidates');

  const topMatch = candidates[0];
  assert(topMatch.matchScore >= 70 && topMatch.matchScore <= 100, `Top match score in realistic 70-100 range: got ${topMatch.matchScore}`);
  assert(topMatch.breakdown != null, 'Algorithmic factor breakdown is present');
  assert(topMatch.breakdown.availability != null, 'Availability factor score present');
  assert(topMatch.breakdown.distance != null, 'Proximity factor score present');
  assert(topMatch.breakdown.rating != null, 'Rating factor score present');
  assert(topMatch.breakdown.price >= 4, `Price competitiveness factor is non-zero (baseline guaranteed): got ${topMatch.breakdown.price}/15`);
  assert(topMatch.breakdown.expertise != null, 'Expertise factor score present');

  // ----------------------------------------------------
  // TEST SUITE 5: Service Request Creation & Problem Photo
  // ----------------------------------------------------
  console.log('\n📝 Test Suite 5: Service Request Creation with Image');
  const selectedProvider = topMatch.provider;

  const createPayload = {
    customer: {
      name: 'Tanvir Hossain',
      email: 'tanvir@testmail.com',
      phone: '+880 1711-234567',
      address: 'Gulshan 2, Dhaka 1212',
    },
    serviceType: 'Electrical',
    location: {
      address: 'Gulshan 2, Dhaka 1212',
      lat: 23.7925,
      lng: 90.4078,
      city: 'Dhaka',
    },
    preferredTimeRange: {
      start: new Date(y, m, d, 15, 0).toISOString(),
      end: new Date(y, m, d, 17, 0).toISOString(),
    },
    urgency: 'High',
    details: 'Tripping MCB breaker and burning smell near distribution board',
    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80',
    assignedProvider: null,
    matchedProviders: candidates.slice(0, 3).map((m) => ({
      providerId: m.provider._id,
      matchScore: m.matchScore,
      breakdown: m.breakdown,
    })),
  };

  const createRes = await request('/api/requests', {
    method: 'POST',
    body: JSON.stringify(createPayload),
  });

  assert(createRes.ok, 'POST /api/requests returns 201 Created');
  assert(createRes.data.success, 'Booking payload saved successfully');
  const createdRequest = createRes.data.data;
  assert(createdRequest.status === 'Requested', 'Initial status is "Requested"');
  assert(
    createdRequest.image === createPayload.image,
    'Optional problem image URL successfully stored on request'
  );
  assert(
    createdRequest.customer?.phone === '+880 1711-234567',
    'Customer contact details accurately recorded'
  );

  // ----------------------------------------------------
  // TEST SUITE 6: Real-time Request Pipeline Transitions
  // ----------------------------------------------------
  console.log('\n🚀 Test Suite 6: Five-Stage Pipeline State Transitions');
  const reqId = createdRequest._id;

  // Stage 1 -> Stage 2: Accepted (with Specialist Assignment)
  const acceptRes = await request(`/api/requests/${reqId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'Accepted',
      providerId: selectedProvider._id,
      note: 'Specialist accepted the dispatch order',
    }),
  });
  assert(acceptRes.ok && acceptRes.data.data.status === 'Accepted', 'Transition: Requested → Accepted');

  // Stage 2 -> Stage 3: On the Way
  const onTheWayRes = await request(`/api/requests/${reqId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'On the Way', note: 'Technician van dispatched with OEM parts' }),
  });
  assert(onTheWayRes.ok && onTheWayRes.data.data.status === 'On the Way', 'Transition: Accepted → On the Way');

  // Stage 3 -> Stage 4: In Progress
  const inProgressRes = await request(`/api/requests/${reqId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'In Progress', note: 'Technician on-site performing electrical diagnosis' }),
  });
  assert(inProgressRes.ok && inProgressRes.data.data.status === 'In Progress', 'Transition: On the Way → In Progress');

  // Stage 4 -> Stage 5: Completed
  const completedRes = await request(`/api/requests/${reqId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'Completed', note: 'Replaced faulty 32A breaker, load tested OK' }),
  });
  assert(completedRes.ok && completedRes.data.data.status === 'Completed', 'Transition: In Progress → Completed');

  // ----------------------------------------------------
  // TEST SUITE 7: Customer Rating & Score Recalculation
  // ----------------------------------------------------
  console.log('\n⭐ Test Suite 7: Customer Rating & Provider Rating Recalculation');
  const oldRating = selectedProvider.rating;
  const oldCount = selectedProvider.reviewsCount;
  const submittedRating = 5;

  const reviewRes = await request(`/api/requests/${reqId}/review`, {
    method: 'POST',
    body: JSON.stringify({
      rating: submittedRating,
      comment: 'Excellent, arrived promptly and resolved the panel issue safely! ৳BDT rate was very fair.',
    }),
  });

  assert(reviewRes.ok, 'POST /api/requests/:id/review returns 200 OK');
  const updatedProv = reviewRes.data.provider || reviewRes.data.data?.assignedProvider;
  assert(updatedProv != null, 'Updated provider returned in review response');
  assert(updatedProv.reviewsCount === oldCount + 1, `Reviews count incremented by 1 (${oldCount} → ${updatedProv.reviewsCount})`);

  const expectedNewRating = Math.round((((oldRating * oldCount) + submittedRating) / (oldCount + 1)) * 10) / 10;
  assert(
    Math.abs(updatedProv.rating - expectedNewRating) <= 0.1,
    `Provider overall rating accurately recalculated: expected ${expectedNewRating}, got ${updatedProv.rating}`
  );

  // ----------------------------------------------------
  // TEST SUITE 8: Provider Schedule Slot Blocking
  // ----------------------------------------------------
  console.log('\n📅 Test Suite 8: Provider Calendar Slot Blocking');
  const blockStart = new Date(y, m, d, 18, 0).toISOString();
  const blockEnd = new Date(y, m, d, 20, 0).toISOString();

  const addSlotRes = await request(`/api/providers/${selectedProvider._id}/slots`, {
    method: 'POST',
    body: JSON.stringify({
      start: blockStart,
      end: blockEnd,
      title: 'Workshop Tool Maintenance & Calibration',
    }),
  });

  assert(addSlotRes.ok, 'POST /api/providers/:id/slots returns 200/201');
  assert(addSlotRes.data.success, 'New busy slot successfully saved on provider schedule');

  // ----------------------------------------------------
  // TEST SUITE 9: Currency (BDT / ৳) Consistency Check
  // ----------------------------------------------------
  console.log('\n🇧🇩 Test Suite 9: BDT Currency & Rate Integrity');
  const provDetails = await request(`/api/providers/${selectedProvider._id}`);
  assert(provDetails.ok, 'Provider details fetched');
  const baseRate = provDetails.data.data.basePrice;
  assert(typeof baseRate === 'number' && baseRate > 0, `Base hourly rate is valid numeric value: ৳${baseRate}/hr`);
  assert(baseRate >= 40 && baseRate <= 150, `Base hourly rate falls within standard BDT service pricing: ৳${baseRate}`);

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`🏁 PLATFORM E2E TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('====================================================\n');

  if (failedTests === 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
