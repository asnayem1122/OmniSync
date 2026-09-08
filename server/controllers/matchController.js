import mongoose from 'mongoose';
import Provider from '../models/Provider.js';
import Request from '../models/Request.js';
import { calculateDistanceKm } from '../utils/geo.js';
import { mockProviders } from '../seed/seeder.js';

/**
 * Checks whether any booked slot overlaps with the requested time range.
 * Overlap condition: slot.start < reqEnd && slot.end > reqStart
 */
export function hasSlotCollision(bookedSlots = [], reqStart, reqEnd) {
  const start = new Date(reqStart).getTime();
  const end = new Date(reqEnd).getTime();

  return bookedSlots.some((slot) => {
    const slotStart = new Date(slot.start).getTime();
    const slotEnd = new Date(slot.end).getTime();
    return slotStart < end && slotEnd > start;
  });
}

/**
 * Computes the multi-factor match score (0 - 100) and returns component breakdown.
 * Formula: Match Score = Availability + Distance + Rating + Price + Service Expertise (+ Urgency Adjustment)
 */
export function computeMatchScore({
  provider,
  customerLocation,
  preferredTimeRange,
  urgency = 'Medium',
  minPricePool = 50,
  maxPricePool = 130,
}) {
  const MAX_RADIUS_KM = 30; // Max service radius considered for scaling

  // 1. Double-Booking & Availability (25 pts max)
  const isColliding = hasSlotCollision(
    provider.bookedSlots,
    preferredTimeRange.start,
    preferredTimeRange.end
  );

  let availabilityScore = 0;
  if (!isColliding) {
    // If completely free today: 25 pts. If has slots on other times of day: 20 pts
    const slotsCount = provider.bookedSlots?.length || 0;
    availabilityScore = slotsCount === 0 ? 25 : 20;
  }

  // 2. Distance Proximity Score (25 pts max)
  const distanceKm = calculateDistanceKm(
    customerLocation.lat,
    customerLocation.lng,
    provider.location.lat,
    provider.location.lng
  );

  let distanceScore = 0;
  if (distanceKm <= 2) {
    distanceScore = 25;
  } else if (distanceKm < MAX_RADIUS_KM) {
    distanceScore = 25 * (1 - (distanceKm - 2) / (MAX_RADIUS_KM - 2));
  } else {
    distanceScore = 0;
  }

  // 3. Rating Score (20 pts max)
  const rating = Number(provider.rating) || 4.0;
  const ratingScore = (Math.min(5, Math.max(1, rating)) / 5.0) * 20;

  // 4. Price Competitiveness Score (15 pts max)
  const price = Number(provider.basePrice) || 80;
  const priceRange = Math.max(1, maxPricePool - minPricePool);
  const normalizedPriceRatio = Math.max(0, Math.min(1, (price - minPricePool) / priceRange));
  // Guarantee a competitive baseline so certified master providers are not penalized to 0
  const priceScore = Math.max(4, 15 * (1 - normalizedPriceRatio * 0.75));

  // 5. Service Expertise Score (15 pts max)
  const expertiseMap = {
    Master: 15,
    Expert: 12,
    Intermediate: 9,
    Beginner: 6,
  };
  const expertiseScore = expertiseMap[provider.expertiseLevel] || 9;

  // 6. Urgency Modifier Bonus (0 - 5 bonus points)
  let urgencyBonus = 0;
  if (urgency === 'Emergency') {
    // Fast response bonus for close & master technicians
    if (distanceKm < 8) urgencyBonus += 3;
    if (provider.expertiseLevel === 'Master' || provider.expertiseLevel === 'Expert') {
      urgencyBonus += 2;
    }
  } else if (urgency === 'High' && distanceKm < 12) {
    urgencyBonus += 2;
  }

  // Mathematical Normalization to 0 - 100
  const rawTotal =
    availabilityScore + distanceScore + ratingScore + priceScore + expertiseScore + urgencyBonus;

  // Clean rounding and bounding
  const normalizedScore = Math.min(100, Math.max(0, Math.round(rawTotal)));

  return {
    totalScore: normalizedScore,
    isAvailable: !isColliding,
    breakdown: {
      availability: Math.round(availabilityScore * 10) / 10,
      distance: Math.round(distanceScore * 10) / 10,
      rating: Math.round(ratingScore * 10) / 10,
      price: Math.round(priceScore * 10) / 10,
      expertise: Math.round(expertiseScore * 10) / 10,
      urgencyBonus: Math.round(urgencyBonus * 10) / 10,
      distanceKm: Math.round(distanceKm * 10) / 10,
    },
  };
}

/**
 * Controller: Match Providers for a given Service Request
 * POST /api/match
 */
export const matchProviders = async (req, res) => {
  try {
    const {
      serviceType,
      location,
      preferredTimeRange,
      urgency = 'Medium',
      filterCollisions = true, // Filter out providers with double bookings
    } = req.body;

    if (!serviceType) {
      return res.status(400).json({ success: false, message: 'Service type is required' });
    }

    if (!location || location.lat === undefined || location.lng === undefined) {
      return res.status(400).json({ success: false, message: 'Location with lat and lng is required' });
    }

    if (!preferredTimeRange || !preferredTimeRange.start || !preferredTimeRange.end) {
      return res
        .status(400)
        .json({ success: false, message: 'preferredTimeRange with start and end is required' });
    }

    // 1. Query candidate providers matching category or partial match
    let candidates = [];
    if (mongoose.connection.readyState >= 1) {
      const categoryQuery = {
        $or: [
          { category: new RegExp(serviceType.trim(), 'i') },
          { bio: new RegExp(serviceType.trim(), 'i') },
        ],
        isAvailable: true,
      };
      candidates = await Provider.find(categoryQuery);
      if (candidates.length === 0) {
        candidates = await Provider.find({ isAvailable: true });
      }
    } else {
      // In-memory fallback
      candidates = mockProviders.filter(
        (p) =>
          p.category.toLowerCase().includes(serviceType.toLowerCase()) ||
          p.bio.toLowerCase().includes(serviceType.toLowerCase())
      );
      if (candidates.length === 0) {
        candidates = mockProviders;
      }
    }

    // 2. Compute dynamic min and max price pool for accurate normalization
    const prices = candidates.map((p) => p.basePrice).filter(Boolean);
    const minPricePool = prices.length ? Math.min(...prices) : 50;
    const maxPricePool = prices.length ? Math.max(...prices) : 130;

    // 3. Process each provider through collision detection and scoring
    const scoredProviders = candidates
      .map((provider) => {
        const scoreResult = computeMatchScore({
          provider,
          customerLocation: location,
          preferredTimeRange,
          urgency,
          minPricePool,
          maxPricePool,
        });

        return {
          provider,
          matchScore: scoreResult.totalScore,
          isAvailable: scoreResult.isAvailable,
          breakdown: scoreResult.breakdown,
        };
      })
      // Double-booking filter: Eliminate providers with conflicting booked slots
      .filter((item) => {
        if (filterCollisions) {
          return item.isAvailable;
        }
        return true;
      })
      // Sort descending by Match Score
      .sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      requestSummary: {
        serviceType,
        location,
        preferredTimeRange,
        urgency,
        totalCandidates: candidates.length,
        matchedCount: scoredProviders.length,
      },
      results: scoredProviders,
    });
  } catch (error) {
    console.error('Error in matchProviders controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process matching algorithm',
      error: error.message,
    });
  }
};
