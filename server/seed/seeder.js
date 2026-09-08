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
  // 1. Appliance & Gadget Repair
  {
    name: 'Apex Appliance & Tech Repair',
    category: 'Appliance & Gadget Repair',
    location: {
      lat: 30.271,
      lng: -97.741,
      address: '701 Congress Ave, Austin, TX 78701',
      city: 'Downtown Austin',
    },
    rating: 4.9,
    reviewsCount: 52,
    basePrice: 75,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0101',
    bio: 'Certified repair for smart refrigerators, washing machines, dryers, induction cooktops, and smart home gadgets.',
    badges: ['Certified Master', 'OEM Parts Guaranteed', '5-Star Rating'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 9, 0),
        end: new Date(todayYear, todayMonth, todayDate, 11, 30),
        title: 'Smart Washer Diagnostic & Board Replacement',
        customerName: 'Robert Langdon',
      },
    ],
  },
  {
    name: 'GadgetFix Electronics & Appliance Care',
    category: 'Appliance & Gadget Repair',
    location: {
      lat: 30.298,
      lng: -97.738,
      address: '2901 Medical Arts St, Austin, TX 78705',
      city: 'Central Austin',
    },
    rating: 4.6,
    reviewsCount: 38,
    basePrice: 60,
    expertiseLevel: 'Intermediate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0102',
    bio: 'Microwaves, smart dishwashers, robotic vacuums, and small home appliance restoration.',
    badges: ['Quick Dispatch', 'Budget Friendly'],
    bookedSlots: [],
  },

  // 2. Plumbing
  {
    name: 'AquaFlow Precision Plumbing',
    category: 'Plumbing',
    location: {
      lat: 30.252,
      lng: -97.755,
      address: '1400 S Congress Ave, Austin, TX 78704',
      city: 'South Congress',
    },
    rating: 4.9,
    reviewsCount: 68,
    basePrice: 90,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0201',
    bio: 'Master licensed plumbing: leak detection, tankless water heaters, smart shutoff valves, and sewer scoping.',
    badges: ['Licensed Master Plumber', 'Flo by Moen Partner', '24/7 Emergency'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 14, 0),
        end: new Date(todayYear, todayMonth, todayDate, 16, 30),
        title: 'Emergency Pipe Leak & Valve Repair',
        customerName: 'Claire Bennet',
      },
    ],
  },
  {
    name: 'MasterDrain Hydro & Pipe Specialists',
    category: 'Plumbing',
    location: {
      lat: 30.315,
      lng: -97.715,
      address: '5100 Airport Blvd, Austin, TX 78751',
      city: 'North Loop',
    },
    rating: 4.7,
    reviewsCount: 44,
    basePrice: 70,
    expertiseLevel: 'Expert',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0202',
    bio: 'Hydro jetting, drain clearing, toilet installation, and faucet cartridge replacements.',
    badges: ['Licensed Contractor', 'Same-Day Service'],
    bookedSlots: [],
  },

  // 3. Electrical
  {
    name: 'VoltWave Master Electrical Contractors',
    category: 'Electrical',
    location: {
      lat: 30.264,
      lng: -97.732,
      address: '1100 E 6th St, Austin, TX 78702',
      city: 'East Austin',
    },
    rating: 4.9,
    reviewsCount: 74,
    basePrice: 85,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0301',
    bio: 'Master electricians: 200A panel upgrades, EV chargers, whole-home rewiring, and smart circuit breakers.',
    badges: ['TECL Master Electrician', 'Tesla Certified EV Installer', 'Zero Collision'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 10, 0),
        end: new Date(todayYear, todayMonth, todayDate, 12, 0),
        title: 'EV Wall Connector 48A Installation',
        customerName: 'James Gordon',
      },
    ],
  },
  {
    name: 'Apex Spark Residential Electric',
    category: 'Electrical',
    location: {
      lat: 30.231,
      lng: -97.788,
      address: '4001 S Lamar Blvd, Austin, TX 78704',
      city: 'South Lamar',
    },
    rating: 4.7,
    reviewsCount: 39,
    basePrice: 65,
    expertiseLevel: 'Intermediate',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0302',
    bio: 'Lighting switches, GFCI outlet replacements, ceiling fans, and circuit troubleshooting.',
    badges: ['Licensed Electrician', 'Rapid Dispatch'],
    bookedSlots: [],
  },

  // 4. Cleaning & Pest Control
  {
    name: 'EcoClean & Precision Pest Defense',
    category: 'Cleaning & Pest Control',
    location: {
      lat: 30.285,
      lng: -97.76,
      address: '2200 Enfield Rd, Austin, TX 78703',
      city: 'Tarrytown',
    },
    rating: 4.9,
    reviewsCount: 82,
    basePrice: 55,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0401',
    bio: 'Eco-friendly deep cleaning, pet-safe pest elimination, termite shields, and hospital-grade sanitization.',
    badges: ['Eco-Friendly Certified', 'Pet Safe', 'Guaranteed Pest-Free'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 13, 0),
        end: new Date(todayYear, todayMonth, todayDate, 15, 30),
        title: 'Full House Sanitization & Perimeter Defense',
        customerName: 'Diana Prince',
      },
    ],
  },
  {
    name: 'Pristine Spaces Deep Cleaning & Pest',
    category: 'Cleaning & Pest Control',
    location: {
      lat: 30.345,
      lng: -97.728,
      address: '6800 Burnet Rd, Austin, TX 78757',
      city: 'Brentwood',
    },
    rating: 4.6,
    reviewsCount: 45,
    basePrice: 45,
    expertiseLevel: 'Expert',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0402',
    bio: 'Move-out deep clean, carpet steam extraction, rodent barrier sealing, and seasonal insect defense.',
    badges: ['Bonded & Insured', 'Spotless Guarantee'],
    bookedSlots: [],
  },

  // 5. Home Maintenance
  {
    name: 'Craftsman Pro Home Maintenance & Repair',
    category: 'Home Maintenance',
    location: {
      lat: 30.275,
      lng: -97.765,
      address: '1600 West Lynn St, Austin, TX 78703',
      city: 'Clarksville',
    },
    rating: 4.8,
    reviewsCount: 63,
    basePrice: 65,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0501',
    bio: 'Drywall repairs, door realignment, smart lock installation, gutter cleaning, and custom finish carpentry.',
    badges: ['Master Handyman', '5-Star Rating', 'Licensed Contractor'],
    bookedSlots: [],
  },
  {
    name: 'FixItRight Residential Handyman',
    category: 'Home Maintenance',
    location: {
      lat: 30.395,
      lng: -97.725,
      address: '10900 Domain Dr, Austin, TX 78758',
      city: 'The Domain',
    },
    rating: 4.5,
    reviewsCount: 31,
    basePrice: 50,
    expertiseLevel: 'Intermediate',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0502',
    bio: 'Cabinet adjustments, tile repair, TV wall mounting, weatherproofing, and general home upkeep.',
    badges: ['Fast & Reliable', 'Tools Included'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 15, 0),
        end: new Date(todayYear, todayMonth, todayDate, 17, 0),
        title: 'Drywall Patching & Trim Installation',
        customerName: 'Arthur Curry',
      },
    ],
  },

  // 6. Moving & Shifting
  {
    name: 'SwiftShift Relocation & Shifting Services',
    category: 'Moving & Shifting',
    location: {
      lat: 30.261,
      lng: -97.747,
      address: '300 Colorado St, Austin, TX 78701',
      city: 'Downtown Austin',
    },
    rating: 4.9,
    reviewsCount: 57,
    basePrice: 95,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0601',
    bio: 'Full residential moving, piano & artwork transport, professional packing, and heavy furniture assembly.',
    badges: ['Licensed & Insured Mover', 'Zero Damage Guarantee', 'Padded Fleet'],
    bookedSlots: [],
  },
  {
    name: 'MetroHaul Express Moving Crew',
    category: 'Moving & Shifting',
    location: {
      lat: 30.302,
      lng: -97.702,
      address: '1900 Aldrich St, Austin, TX 78723',
      city: 'Mueller',
    },
    rating: 4.7,
    reviewsCount: 42,
    basePrice: 80,
    expertiseLevel: 'Expert',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0602',
    bio: 'Apartment shifting, office relocations, loading/unloading assistance, and secure box transportation.',
    badges: ['Fast Lift Crew', 'Truck Included'],
    bookedSlots: [
      {
        start: new Date(todayYear, todayMonth, todayDate, 8, 30),
        end: new Date(todayYear, todayMonth, todayDate, 11, 0),
        title: 'Condo 2-Bedroom Relocation',
        customerName: 'Barry Allen',
      },
    ],
  },

  // 7. Car Care & Repair
  {
    name: 'ReviveAuto Mobile Mechanic & Car Care',
    category: 'Car Care & Repair',
    location: {
      lat: 30.245,
      lng: -97.739,
      address: '2100 S 1st St, Austin, TX 78704',
      city: 'South First',
    },
    rating: 4.9,
    reviewsCount: 66,
    basePrice: 85,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0701',
    bio: 'Mobile ASE-certified mechanics: computerized engine diagnostics, brake pad replacement, battery jump, oil changes at your driveway.',
    badges: ['ASE Master Technician', 'Mobile Van Equipped', 'Warranty on Parts'],
    bookedSlots: [],
  },
  {
    name: 'Precision Detail & Quick Auto Care',
    category: 'Car Care & Repair',
    location: {
      lat: 30.325,
      lng: -97.705,
      address: '7100 Cameron Rd, Austin, TX 78752',
      city: 'Highland',
    },
    rating: 4.6,
    reviewsCount: 34,
    basePrice: 65,
    expertiseLevel: 'Intermediate',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0702',
    bio: 'Full ceramic coating, interior shampoo detailing, headlight restoration, and alternator checks.',
    badges: ['Mobile Detail Unit', 'Waterless Tech'],
    bookedSlots: [],
  },

  // 8. Personal Care
  {
    name: 'GlowWell Mobile Salon & Personal Care',
    category: 'Personal Care',
    location: {
      lat: 30.272,
      lng: -97.749,
      address: '1200 W 6th St, Austin, TX 78703',
      city: 'Old West Austin',
    },
    rating: 5.0,
    reviewsCount: 58,
    basePrice: 70,
    expertiseLevel: 'Master',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0801',
    bio: 'In-home hair styling, luxury manicures, therapeutic massage, skincare facials, and wellness grooming.',
    badges: ['Licensed Cosmetologist', 'Sanitized Kits', '5-Star Experience'],
    bookedSlots: [],
  },
  {
    name: 'Serenity In-Home Wellness & Grooming',
    category: 'Personal Care',
    location: {
      lat: 30.292,
      lng: -97.721,
      address: '3800 Manor Rd, Austin, TX 78722',
      city: 'Manor Corridor',
    },
    rating: 4.8,
    reviewsCount: 37,
    basePrice: 55,
    expertiseLevel: 'Expert',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (512) 555-0802',
    bio: 'Therapeutic deep tissue massage, men’s precision grooming, nail art, and holistic personal wellness.',
    badges: ['Licensed Therapist', 'Relaxation Pro'],
    bookedSlots: [],
  },
];

export const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to database for seeding...');
    await connectDB();

    console.log('🧹 Clearing existing providers...');
    await Provider.deleteMany({});

    console.log(`🚀 Seeding ${mockProviders.length} mock providers across 8 service categories...`);
    const inserted = await Provider.insertMany(mockProviders);
    console.log(`✅ Successfully seeded ${inserted.length} providers across 8 service categories.`);

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
