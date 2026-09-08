import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDistanceKm } from '../utils/geo.js';
import { hasSlotCollision, computeMatchScore } from '../controllers/matchController.js';
import { mockProviders } from '../seed/seeder.js';

// ============================================================================
// SUITE 1: Haversine Geo Proximity Calculations
// ============================================================================
test('Haversine: Identical coordinates return 0 km', () => {
  const dist = calculateDistanceKm(30.2672, -97.7431, 30.2672, -97.7431);
  assert.equal(dist, 0);
});

test('Haversine: Fallback distance 999 for missing coordinates', () => {
  assert.equal(calculateDistanceKm(undefined, -97.74, 30.26, -97.74), 999);
  assert.equal(calculateDistanceKm(30.26, undefined, 30.26, -97.74), 999);
  assert.equal(calculateDistanceKm(30.26, -97.74, undefined, -97.74), 999);
  assert.equal(calculateDistanceKm(30.26, -97.74, 30.26, undefined), 999);
});

test('Haversine: Symmetry - dist(A, B) equals dist(B, A)', () => {
  const d1 = calculateDistanceKm(30.2672, -97.7431, 30.395, -97.725);
  const d2 = calculateDistanceKm(30.395, -97.725, 30.2672, -97.7431);
  assert.equal(d1, d2);
});

test('Haversine: Expected Austin Downtown to Domain Austin (~14.3 km)', () => {
  const d = calculateDistanceKm(30.2672, -97.7431, 30.395, -97.725);
  assert.ok(d >= 14.0 && d <= 15.0, `Expected 14-15km, got ${d}`);
});

test('Haversine: Negative coordinates across hemispheres (London to Sydney)', () => {
  const dist = calculateDistanceKm(51.5074, -0.1278, -33.8688, 151.2093);
  assert.ok(dist >= 16900 && dist <= 17100, `Expected ~17000km, got ${dist}`);
});

// ============================================================================
// SUITE 2: Double-Booking Collision Detection
// ============================================================================
const sampleSlots = [
  {
    start: new Date('2026-09-08T09:00:00Z'),
    end: new Date('2026-09-08T11:00:00Z'),
    title: 'Morning Diagnostics',
  },
  {
    start: new Date('2026-09-08T14:00:00Z'),
    end: new Date('2026-09-08T16:00:00Z'),
    title: 'Afternoon Installation',
  },
];

test('Collision: Empty booked slots always returns false', () => {
  const res = hasSlotCollision([], '2026-09-08T10:00:00Z', '2026-09-08T12:00:00Z');
  assert.equal(res, false);
});

test('Collision: Disjoint window before all slots returns false', () => {
  const res = hasSlotCollision(sampleSlots, '2026-09-08T07:00:00Z', '2026-09-08T08:30:00Z');
  assert.equal(res, false);
});

test('Collision: Disjoint window between slots returns false', () => {
  const res = hasSlotCollision(sampleSlots, '2026-09-08T11:30:00Z', '2026-09-08T13:30:00Z');
  assert.equal(res, false);
});

test('Collision: Exact abutting boundary at start (11:00 to 13:00) returns false', () => {
  const res = hasSlotCollision(sampleSlots, '2026-09-08T11:00:00Z', '2026-09-08T13:00:00Z');
  assert.equal(res, false);
});

test('Collision: Exact abutting boundary at end (12:00 to 14:00) returns false', () => {
  const res = hasSlotCollision(sampleSlots, '2026-09-08T12:00:00Z', '2026-09-08T14:00:00Z');
  assert.equal(res, false);
});

test('Collision: Overlap at start of slot (08:30 to 10:00) returns true', () => {
  const res = hasSlotCollision(sampleSlots, '2026-09-08T08:30:00Z', '2026-09-08T10:00:00Z');
  assert.equal(res, true);
});

test('Collision: Overlap at end of slot (10:30 to 12:00) returns true', () => {
  const res = hasSlotCollision(sampleSlots, '2026-09-08T10:30:00Z', '2026-09-08T12:00:00Z');
  assert.equal(res, true);
});

test('Collision: Enclosed inside slot (09:30 to 10:30) returns true', () => {
  const res = hasSlotCollision(sampleSlots, '2026-09-08T09:30:00Z', '2026-09-08T10:30:00Z');
  assert.equal(res, true);
});

test('Collision: Request completely envelopes slot (08:00 to 12:00) returns true', () => {
  const res = hasSlotCollision(sampleSlots, '2026-09-08T08:00:00Z', '2026-09-08T12:00:00Z');
  assert.equal(res, true);
});

// ============================================================================
// SUITE 3: Multi-Factor Scoring Algorithm
// ============================================================================
const baseProvider = {
  name: 'Test Pro',
  category: 'Electrical',
  location: { lat: 30.267, lng: -97.743 },
  rating: 5.0,
  basePrice: 60,
  expertiseLevel: 'Master',
  bookedSlots: [],
};

const customerLoc = { lat: 30.267, lng: -97.743 }; // Exactly 0 km

test('Scoring: Fully available, 0km, 5.0 rating, Master, lowest price yields maximum 100', () => {
  const result = computeMatchScore({
    provider: { ...baseProvider, basePrice: 50 },
    customerLocation: customerLoc,
    preferredTimeRange: {
      start: '2026-09-08T12:00:00Z',
      end: '2026-09-08T14:00:00Z',
    },
    urgency: 'Medium',
    minPricePool: 50,
    maxPricePool: 130,
  });

  assert.equal(result.isAvailable, true);
  assert.equal(result.totalScore, 100);
  assert.equal(result.breakdown.availability, 25);
  assert.equal(result.breakdown.distance, 25);
  assert.equal(result.breakdown.rating, 20);
  assert.equal(result.breakdown.expertise, 15);
});

test('Scoring: Score is strictly clamped between 0 and 100', () => {
  const highResult = computeMatchScore({
    provider: baseProvider,
    customerLocation: customerLoc,
    preferredTimeRange: {
      start: '2026-09-08T12:00:00Z',
      end: '2026-09-08T14:00:00Z',
    },
    urgency: 'Emergency',
    minPricePool: 50,
    maxPricePool: 130,
  });
  assert.ok(highResult.totalScore <= 100, `High score bounded at 100: got ${highResult.totalScore}`);

  const farBadProvider = {
    ...baseProvider,
    location: { lat: 31.5, lng: -98.5 }, // Far > 30km
    rating: 1.0,
    basePrice: 200,
    expertiseLevel: 'Beginner',
    bookedSlots: [{ start: '2026-09-08T12:00:00Z', end: '2026-09-08T14:00:00Z' }],
  };

  const lowResult = computeMatchScore({
    provider: farBadProvider,
    customerLocation: customerLoc,
    preferredTimeRange: {
      start: '2026-09-08T12:00:00Z',
      end: '2026-09-08T14:00:00Z',
    },
    urgency: 'Low',
    minPricePool: 50,
    maxPricePool: 130,
  });
  assert.equal(lowResult.isAvailable, false);
  assert.ok(lowResult.totalScore >= 0, `Low score bounded at 0: got ${lowResult.totalScore}`);
  assert.equal(lowResult.breakdown.availability, 0);
  assert.equal(lowResult.breakdown.distance, 0);
});

test('Scoring: Distance linear decay drops to 0 at 30km', () => {
  const providerAt30Km = {
    ...baseProvider,
    location: { lat: 30.537, lng: -97.743 }, // ~30km north
  };

  const res = computeMatchScore({
    provider: providerAt30Km,
    customerLocation: customerLoc,
    preferredTimeRange: {
      start: '2026-09-08T12:00:00Z',
      end: '2026-09-08T14:00:00Z',
    },
    urgency: 'Medium',
    minPricePool: 50,
    maxPricePool: 130,
  });
  assert.equal(res.breakdown.distance, 0);
});

test('Scoring: Expertise tiers Master (15) > Expert (12) > Intermediate (9) > Beginner (6)', () => {
  const levels = ['Master', 'Expert', 'Intermediate', 'Beginner'];
  const scores = levels.map((lvl) => {
    const res = computeMatchScore({
      provider: { ...baseProvider, expertiseLevel: lvl },
      customerLocation: customerLoc,
      preferredTimeRange: {
        start: '2026-09-08T12:00:00Z',
        end: '2026-09-08T14:00:00Z',
      },
      minPricePool: 50,
      maxPricePool: 130,
    });
    return res.breakdown.expertise;
  });

  assert.deepEqual(scores, [15, 12, 9, 6]);
});

test('Scoring: Emergency urgency grants bonus for close Master technician', () => {
  const resEmergency = computeMatchScore({
    provider: baseProvider,
    customerLocation: customerLoc,
    preferredTimeRange: {
      start: '2026-09-08T12:00:00Z',
      end: '2026-09-08T14:00:00Z',
    },
    urgency: 'Emergency',
    minPricePool: 50,
    maxPricePool: 130,
  });

  const resMedium = computeMatchScore({
    provider: baseProvider,
    customerLocation: customerLoc,
    preferredTimeRange: {
      start: '2026-09-08T12:00:00Z',
      end: '2026-09-08T14:00:00Z',
    },
    urgency: 'Medium',
    minPricePool: 50,
    maxPricePool: 130,
  });

  assert.equal(resEmergency.breakdown.urgencyBonus, 5); // 3 (dist < 8) + 2 (Master)
  assert.equal(resMedium.breakdown.urgencyBonus, 0);
});

// ============================================================================
// SUITE 4: Provider Data & Integrity Specs
// ============================================================================
test('Providers: 16 certified specialists pre-seeded', () => {
  assert.equal(mockProviders.length, 16);
});

test('Providers: Every provider adheres to schema constraints', () => {
  const validCategories = new Set([
    'Appliance & Gadget Repair',
    'Plumbing',
    'Electrical',
    'Cleaning & Pest Control',
    'Home Maintenance',
    'Moving & Shifting',
    'Car Care & Repair',
    'Personal Care',
  ]);

  for (const prov of mockProviders) {
    assert.ok(prov.name && prov.name.length > 0, `Provider missing name: ${JSON.stringify(prov)}`);
    assert.ok(validCategories.has(prov.category), `Invalid category: ${prov.category}`);
    assert.ok(prov.location && typeof prov.location.lat === 'number', 'Invalid lat');
    assert.ok(prov.location && typeof prov.location.lng === 'number', 'Invalid lng');
    assert.ok(prov.basePrice >= 20, `Price too low: ${prov.basePrice}`);
    assert.ok(prov.rating >= 1.0 && prov.rating <= 5.0, `Rating out of range: ${prov.rating}`);
    assert.ok(Array.isArray(prov.bookedSlots), 'bookedSlots must be array');
    assert.ok(
      ['Beginner', 'Intermediate', 'Expert', 'Master'].includes(prov.expertiseLevel),
      `Invalid expertise: ${prov.expertiseLevel}`
    );
  }
});
