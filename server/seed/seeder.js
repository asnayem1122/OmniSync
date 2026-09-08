import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import Provider from '../models/Provider.js';

// Base reference center: Austin Metro Area (Lat: 30.2672, Lng: -97.7431)
const now = new Date();
const todayYear = now.getFullYear();
const todayMonth = now.getMonth();
const todayDate = now.getDate();

export const mockProviders = [
  // 1. Smart Lighting & Control
  {
    name: 'AuraLum Smart Lighting Specialists',
    category: 'Smart Lighting & Control',
    location: {
      lat: 30.271,
      lng: -97.741,
      address: '701 Congress Ave, Austin, TX 78701',
      city: 'Downtown Austin',
    },
    rating: 4.9,
    reviewsCount: 48,
    basePrice: 85,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0101',
    bio: 'Lutron & Hue certified master installers specializing in architectural LED and scene automation.',
    badges: ['Certified Master', 'Lutron Pro', '5-Star Rating'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 9, 0),
        end: new Date(todayYear, todayMonth, todayDate, 11, 30),
        title: 'Lutron RadioRA3 Integration',
        customerName: 'Robert Langdon',
      },
    ],
  },
  {
    name: 'VoltWave Automation & Circuits',
    category: 'Smart Lighting & Control',
    location: {
      lat: 30.298,
      lng: -97.738,
      address: '2901 Medical Arts St, Austin, TX 78705',
      city: 'Central Austin',
    },
    rating: 4.6,
    reviewsCount: 32,
    basePrice: 65,
    expertiseLevel: 'Intermediate',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0102',
    bio: 'Smart relay switches, neutral wire retrofits, and smart circuit panel integration.',
    badges: ['Licensed Electrician', 'Quick Dispatch'],
    bookedSlots: [],
  },

  // 2. HVAC & Climate Automation
  {
    name: 'EcoBreeze Smart Climate & HVAC',
    category: 'HVAC & Climate Automation',
    location: {
      lat: 30.252,
      lng: -97.755,
      address: '1400 S Congress Ave, Austin, TX 78704',
      city: 'South Congress',
    },
    rating: 4.9,
    reviewsCount: 64,
    basePrice: 95,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0201',
    bio: 'Dual-fuel smart heat pump integration, smart zoning damper systems, and Nest/Ecobee calibration.',
    badges: ['EPA Certified', 'Smart Zoning Specialist', 'Top Rated'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 14, 0),
        end: new Date(todayYear, todayMonth, todayDate, 16, 30),
        title: 'Multi-zone Heat Pump Diagnostic',
        customerName: 'Claire Bennet',
      },
    ],
  },
  {
    name: 'ThermaTech Smart HVAC Solutions',
    category: 'HVAC & Climate Automation',
    location: {
      lat: 30.315,
      lng: -97.715,
      address: '5100 Airport Blvd, Austin, TX 78751',
      city: 'North Loop',
    },
    rating: 4.5,
    reviewsCount: 19,
    basePrice: 70,
    expertiseLevel: 'Intermediate',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0202',
    bio: 'Thermostat retrofits, C-wire adapter additions, and smart dehumidifier ducting.',
    badges: ['Ecobee Certified', 'Budget Friendly'],
    bookedSlots: [],
  },

  // 3. Smart Security & Access
  {
    name: 'SentinelGuard Smart Security Systems',
    category: 'Smart Security & Access',
    location: {
      lat: 30.264,
      lng: -97.732,
      address: '1100 E 6th St, Austin, TX 78702',
      city: 'East Austin',
    },
    rating: 4.8,
    reviewsCount: 52,
    basePrice: 90,
    expertiseLevel: 'Expert',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0301',
    bio: 'PoE 4K cameras, UniFi Protect security ecosystems, smart biometric deadbolts, and access panels.',
    badges: ['Security Licensed', '24/7 Support', 'Fast Responder'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 10, 0),
        end: new Date(todayYear, todayMonth, todayDate, 12, 0),
        title: 'UniFi 6-Camera Deployment',
        customerName: 'James Gordon',
      },
    ],
  },
  {
    name: 'Ironclad Lock & Perimeter AI',
    category: 'Smart Security & Access',
    location: {
      lat: 30.231,
      lng: -97.788,
      address: '4001 S Lamar Blvd, Austin, TX 78704',
      city: 'South Lamar',
    },
    rating: 4.7,
    reviewsCount: 38,
    basePrice: 75,
    expertiseLevel: 'Intermediate',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0302',
    bio: 'Video doorbells, keypad locks, perimeter motion radar, and Home Assistant security hubs.',
    badges: ['Locksmith Certified', 'Emergency Ready'],
    bookedSlots: [],
  },

  // 4. Home Audio & Theater
  {
    name: 'AcousticPulse Cinema & Hi-Fi',
    category: 'Home Audio & Theater',
    location: {
      lat: 30.285,
      lng: -97.76,
      address: '2200 Enfield Rd, Austin, TX 78703',
      city: 'Tarrytown',
    },
    rating: 5.0,
    reviewsCount: 41,
    basePrice: 120,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0401',
    bio: 'Dolby Atmos 7.2.4 calibration, concealed in-wall architectural speakers, Sonos multi-room matrix.',
    badges: ['Dolby Certified Pro', 'CEDIA Member', '5-Star Rating'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 13, 0),
        end: new Date(todayYear, todayMonth, todayDate, 17, 0),
        title: 'Home Theater Calibration & Acoustic Tuning',
        customerName: 'Diana Prince',
      },
    ],
  },
  {
    name: 'SonicLink Multi-Zone Sound',
    category: 'Home Audio & Theater',
    location: {
      lat: 30.345,
      lng: -97.728,
      address: '6800 Burnet Rd, Austin, TX 78757',
      city: 'Brentwood',
    },
    rating: 4.4,
    reviewsCount: 22,
    basePrice: 80,
    expertiseLevel: 'Intermediate',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0402',
    bio: 'Outdoor pool audio, AirPlay 2 whole-house streaming, and TV soundbar optimization.',
    badges: ['Sonos Specialist', 'Clean Cable Routing'],
    bookedSlots: [],
  },

  // 5. Automated Blinds & Shading
  {
    name: 'Solaris Smart Motorized Shades',
    category: 'Automated Blinds & Shading',
    location: {
      lat: 30.275,
      lng: -97.765,
      address: '1600 West Lynn St, Austin, TX 78703',
      city: 'Clarksville',
    },
    rating: 4.8,
    reviewsCount: 29,
    basePrice: 85,
    expertiseLevel: 'Expert',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0501',
    bio: 'Somfy & Lutron Serena custom architectural motorized roller shades and solar tracking integration.',
    badges: ['Somfy Certified', 'Solar Integration Expert'],
    bookedSlots: [],
  },
  {
    name: 'OptiShade Window Automation',
    category: 'Automated Blinds & Shading',
    location: {
      lat: 30.395,
      lng: -97.725,
      address: '10900 Domain Dr, Austin, TX 78758',
      city: 'The Domain',
    },
    rating: 4.5,
    reviewsCount: 16,
    basePrice: 70,
    expertiseLevel: 'Beginner',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0502',
    bio: 'Smart blind retrofits, Matter-over-Thread shade motors, and scheduled daylight management.',
    badges: ['Thread/Matter Certified'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 15, 0),
        end: new Date(todayYear, todayMonth, todayDate, 18, 0),
        title: 'Living Room Motorized Shade Calibration',
        customerName: 'Arthur Curry',
      },
    ],
  },

  // 6. Smart Appliance Integration
  {
    name: 'Nexus Smart Appliance & Energy Systems',
    category: 'Smart Appliance Integration',
    location: {
      lat: 30.261,
      lng: -97.747,
      address: '300 Colorado St, Austin, TX 78701',
      city: 'Downtown Austin',
    },
    rating: 4.9,
    reviewsCount: 35,
    basePrice: 90,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0601',
    bio: 'Smart refrigeration, induction hobs, Emporia whole-home energy monitors, and solar EV chargers.',
    badges: ['Smart Grid Certified', 'Energy Specialist', 'Top Rated'],
    bookedSlots: [],
  },
  {
    name: 'Synapse Home Automation Hubs',
    category: 'Smart Appliance Integration',
    location: {
      lat: 30.302,
      lng: -97.702,
      address: '1900 Aldrich St, Austin, TX 78723',
      city: 'Mueller',
    },
    rating: 4.6,
    reviewsCount: 27,
    basePrice: 75,
    expertiseLevel: 'Expert',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0602',
    bio: 'Matter & Zigbee mesh bridge unification, smart water shutoff valves, and smart washer diagnostics.',
    badges: ['Matter Alliance Member', 'Quick Response'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 8, 30),
        end: new Date(todayYear, todayMonth, todayDate, 10, 30),
        title: 'Flo by Moen Smart Water Shutoff Setup',
        customerName: 'Barry Allen',
      },
    ],
  },

  // 7. General Smart Home Multi-Category Pro
  {
    name: 'OmniSmart Unified Automation',
    category: 'Smart Lighting & Control',
    location: {
      lat: 30.245,
      lng: -97.739,
      address: '2100 S 1st St, Austin, TX 78704',
      city: 'South First',
    },
    rating: 4.8,
    reviewsCount: 57,
    basePrice: 88,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0701',
    bio: 'Turnkey full-home automation, Crestron, Control4, Apple HomeKit, and Home Assistant setup.',
    badges: ['Control4 Certified', 'Full Home Specialist'],
    bookedSlots: [],
  },
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to database for seeding...');
    await connectDB();

    console.log('🧹 Clearing existing providers...');
    await Provider.deleteMany({});

    console.log(`🚀 Seeding ${mockProviders.length} mock providers...`);
    const inserted = await Provider.insertMany(mockProviders);
    console.log(`✅ Successfully seeded ${inserted.length} providers across 6 service categories.`);

    return inserted;
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    throw err;
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seeder.js')) {
  seedDatabase()
    .then(async () => {
      console.log('🌱 Seeding process complete.');
      await closeDB();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('❌ Seeder failed:', err);
      await closeDB();
      process.exit(1);
    });
}
