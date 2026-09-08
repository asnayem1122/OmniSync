import { hasSlotCollision, computeMatchScore } from '../controllers/matchController.js';
import { calculateDistanceKm } from '../utils/geo.js';

console.log('🧪 ==========================================');
console.log('🧪 SMART HOME AUTOMATION MATCHING ENGINE TEST');
console.log('🧪 ==========================================\n');

let testsPassed = 0;
let testsTotal = 0;

function assert(condition, message) {
  testsTotal++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

// ----------------------------------------------------
// TEST SUITE 1: Haversine Geo Calculation
// ----------------------------------------------------
console.log('📍 Test Suite 1: Haversine Proximity Calculation');
const austinDowntown = { lat: 30.2672, lng: -97.7431 };
const domainAustin = { lat: 30.395, lng: -97.725 }; // ~14-15km away
const southAustin = { lat: 30.245, lng: -97.739 }; // ~2.5km away

const d1 = calculateDistanceKm(austinDowntown.lat, austinDowntown.lng, domainAustin.lat, domainAustin.lng);
const d2 = calculateDistanceKm(austinDowntown.lat, austinDowntown.lng, southAustin.lat, southAustin.lng);

assert(d1 > 13 && d1 < 16, `Downtown to Domain distance expected ~14-15km, got ${d1}km`);
assert(d2 > 1.5 && d2 < 3.5, `Downtown to South Austin expected ~2.5km, got ${d2}km`);

// ----------------------------------------------------
// TEST SUITE 2: Double-Booking Collision Detection
// ----------------------------------------------------
console.log('\n⏱️ Test Suite 2: Double-Booking Collision Prevention');

const bookedSlots = [
  {
    start: new Date('2026-09-08T10:00:00Z'),
    end: new Date('2026-09-08T12:00:00Z'),
    title: 'Morning HVAC Maintenance',
  },
  {
    start: new Date('2026-09-08T14:00:00Z'),
    end: new Date('2026-09-08T16:00:00Z'),
    title: 'Afternoon Thermostat Setup',
  },
];

// Test 2.1: Request completely outside booked slots (12:30 - 13:30) -> Should NOT collide
const openSlotStart = new Date('2026-09-08T12:30:00Z');
const openSlotEnd = new Date('2026-09-08T13:30:00Z');
const collides1 = hasSlotCollision(bookedSlots, openSlotStart, openSlotEnd);
assert(!collides1, 'No collision for 12:30-13:30 slot (free window)');

// Test 2.2: Overlapping start (11:30 - 13:00) -> Should collide
const overlapStart = new Date('2026-09-08T11:30:00Z');
const overlapEnd = new Date('2026-09-08T13:00:00Z');
const collides2 = hasSlotCollision(bookedSlots, overlapStart, overlapEnd);
assert(collides2, 'Collision detected for overlapping start time (11:30-13:00)');

// Test 2.3: Overlapping inside booked slot (10:15 - 11:45) -> Should collide
const insideStart = new Date('2026-09-08T10:15:00Z');
const insideEnd = new Date('2026-09-08T11:45:00Z');
const collides3 = hasSlotCollision(bookedSlots, insideStart, insideEnd);
assert(collides3, 'Collision detected when request is enclosed in existing slot');

// Test 2.4: Exact boundary slot (12:00 - 14:00) -> Should NOT collide (ends at 12, next starts at 14)
const boundaryStart = new Date('2026-09-08T12:00:00Z');
const boundaryEnd = new Date('2026-09-08T14:00:00Z');
const collides4 = hasSlotCollision(bookedSlots, boundaryStart, boundaryEnd);
assert(!collides4, 'Exact boundary edge-to-edge does not collide');

// ----------------------------------------------------
// TEST SUITE 3: Multi-Factor Scoring & 0-100 Normalization
// ----------------------------------------------------
console.log('\n📊 Test Suite 3: Multi-Factor Match Score Engine');

const mockTechnicianMaster = {
  name: 'EcoBreeze Smart Climate',
  category: 'HVAC & Climate Automation',
  location: { lat: 30.267, lng: -97.743 }, // Right at customer location
  rating: 4.9,
  basePrice: 60, // Low/competitive price
  expertiseLevel: 'Master',
  bookedSlots: [], // Free all day
};

const mockTechnicianFar = {
  name: 'FarAway HVAC Beginner',
  category: 'HVAC & Climate Automation',
  location: { lat: 30.45, lng: -97.6 }, // Far away (~25km)
  rating: 3.5,
  basePrice: 120, // Higher price
  expertiseLevel: 'Beginner',
  bookedSlots: [],
};

const resultMaster = computeMatchScore({
  provider: mockTechnicianMaster,
  customerLocation: austinDowntown,
  preferredTimeRange: {
    start: new Date('2026-09-08T13:00:00Z'),
    end: new Date('2026-09-08T15:00:00Z'),
  },
  urgency: 'High',
  minPricePool: 50,
  maxPricePool: 130,
});

const resultFar = computeMatchScore({
  provider: mockTechnicianFar,
  customerLocation: austinDowntown,
  preferredTimeRange: {
    start: new Date('2026-09-08T13:00:00Z'),
    end: new Date('2026-09-08T15:00:00Z'),
  },
  urgency: 'High',
  minPricePool: 50,
  maxPricePool: 130,
});

console.log('  Master Technician Score Result:', JSON.stringify(resultMaster, null, 2));
console.log('  Far Technician Score Result:', JSON.stringify(resultFar, null, 2));

assert(
  resultMaster.totalScore >= 85 && resultMaster.totalScore <= 100,
  `Master technician score within expected 85-100 range: got ${resultMaster.totalScore}`
);
assert(
  resultFar.totalScore < resultMaster.totalScore,
  `Far beginner technician score (${resultFar.totalScore}) is lower than Master (${resultMaster.totalScore})`
);
assert(
  resultMaster.totalScore >= 0 && resultMaster.totalScore <= 100,
  'Score is strictly normalized between 0 and 100'
);
assert(
  resultMaster.breakdown.distance >= 24,
  `Downtown tech got maximum distance score: ${resultMaster.breakdown.distance}`
);

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n==========================================');
console.log(`🏁 TESTS SUMMARY: ${testsPassed} / ${testsTotal} PASSED`);
console.log('==========================================\n');

if (testsPassed === testsTotal) {
  process.exit(0);
} else {
  process.exit(1);
}
