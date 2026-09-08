import React, { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/testimonials-13-utils/marquee";
import { cn } from "@/lib/utils";
import {
  Star,
  CheckCircle2,
  Award,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Wrench,
  MapPin,
  Clock,
  ThumbsUp,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";

// Service Holders Review Data across all 8 Core Categories
export const SERVICE_HOLDERS_REVIEWS = [
  {
    id: 1,
    providerName: "Apex Appliance & Tech Repair",
    category: "Appliance & Gadget Repair",
    expertiseLevel: "Master Specialist",
    rating: 4.9,
    reviewsCount: 52,
    basePrice: 75,
    location: "Downtown Austin",
    avatar: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&auto=format&fit=crop&q=80",
    badge: "OEM Parts Certified",
    reviewerName: "Marcus & Sarah Turner",
    reviewerLocation: "Westlake Hills, Austin",
    serviceCompleted: "Smart Refrigerator Compressor & Sensor Calibration",
    testimonial:
      "Apex diagnosed our smart refrigerator compressor issue in 15 minutes. The technician had OEM factory parts in his mobile van, calibrated the digital sensors, and finished within an hour. Outstanding craftsmanship and clean work.",
    verifiedDate: "Verified 2 days ago",
  },
  {
    id: 2,
    providerName: "AquaFlow Precision Plumbing",
    category: "Plumbing",
    expertiseLevel: "Master Plumber",
    rating: 4.9,
    reviewsCount: 68,
    basePrice: 90,
    location: "South Congress, Austin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    badge: "Licensed Master Plumber",
    reviewerName: "Claire Bennet",
    reviewerLocation: "Travis Heights, Austin",
    serviceCompleted: "Emergency Pipe Leak & Smart Shutoff Valve",
    testimonial:
      "Had an emergency nighttime pipe leak. AquaFlow dispatched immediately, tracked via GPS, isolated the valve, and replaced the junction with zero damage to our drywall. True master plumbers with transparent flat pricing.",
    verifiedDate: "Verified 3 days ago",
  },
  {
    id: 3,
    providerName: "VoltWave Master Electrical Contractors",
    category: "Electrical",
    expertiseLevel: "Master Electrician",
    rating: 4.9,
    reviewsCount: 75,
    basePrice: 85,
    location: "East Austin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    badge: "TECL Master Certified",
    reviewerName: "James Gordon",
    reviewerLocation: "East Austin Metro",
    serviceCompleted: "48A Tesla Wall Connector & 200A Panel Upgrade",
    testimonial:
      "VoltWave installed our 48A Tesla Wall Connector and upgraded our 200A main breaker panel. The conduit bending and labeling is artwork. Safe, certified, and 100% collision-free scheduling with zero downtime.",
    verifiedDate: "Verified yesterday",
  },
  {
    id: 4,
    providerName: "EcoClean & Precision Pest Defense",
    category: "Cleaning & Pest Control",
    expertiseLevel: "Certified Specialist",
    rating: 4.9,
    reviewsCount: 58,
    basePrice: 55,
    location: "Bouldin Creek, Austin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    badge: "Eco & Pet Safe Certified",
    reviewerName: "Elena Rostova",
    reviewerLocation: "The Domain Enterprise Park",
    serviceCompleted: "Full Hospital-Grade Deep Sanitization & Pest Barrier",
    testimonial:
      "EcoClean performed hospital-grade sanitization and botanical pest defense for our commercial suite and home. Clean botanical scent, zero pests remaining, and immaculate attention to detail on all surfaces.",
    verifiedDate: "Verified 4 days ago",
  },
  {
    id: 5,
    providerName: "Craftsman Pro Home Maintenance & Repair",
    category: "Home Maintenance",
    expertiseLevel: "Expert Handyman",
    rating: 4.8,
    reviewsCount: 61,
    basePrice: 65,
    location: "Mueller District, Austin",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
    badge: "Zero Callback Guarantee",
    reviewerName: "David Chen",
    reviewerLocation: "Downtown Austin",
    serviceCompleted: "Patio Framing, Smart Deadbolts & Gutter Restoration",
    testimonial:
      "Craftsman Pro fixed our patio framing, aligned our smart deadbolts, and secured loose gutters all in one session. Transparent pricing with zero surprise fees. Our go-to maintenance contractor for all residential needs.",
    verifiedDate: "Verified 5 days ago",
  },
  {
    id: 6,
    providerName: "SwiftShift Relocation & Shifting Services",
    category: "Moving & Shifting",
    expertiseLevel: "Master Logistics",
    rating: 4.9,
    reviewsCount: 47,
    basePrice: 95,
    location: "Barton Hills, Austin",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
    badge: "100% Insured Fleet",
    reviewerName: "Rachel & Liam Vance",
    reviewerLocation: "Barton Creek, Austin",
    serviceCompleted: "4-Bedroom Residential Move with Precision Packing",
    testimonial:
      "Moved our entire 4-bedroom home without a single scratch on hardwood floors or glass tables. Punctual, courteous crew with padded wrapping and GPS fleet tracking the entire trip. Highly recommended!",
    verifiedDate: "Verified 6 days ago",
  },
  {
    id: 7,
    providerName: "ReviveAuto Mobile Mechanic & Car Care",
    category: "Car Care & Repair",
    expertiseLevel: "ASE Master Mechanic",
    rating: 4.9,
    reviewsCount: 53,
    basePrice: 85,
    location: "South Lamar, Austin",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
    badge: "ASE Master Technician",
    reviewerName: "Carlos Mendez",
    reviewerLocation: "Central Austin",
    serviceCompleted: "Ceramic Brake Service & Mobile Synthetic Oil Change",
    testimonial:
      "ReviveAuto came to my driveway, completed ceramic brake pad replacement and full synthetic oil service while I worked inside. Professional diagnostic scan report sent directly to my phone. Best car care in town.",
    verifiedDate: "Verified 1 week ago",
  },
  {
    id: 8,
    providerName: "GlowWell Mobile Salon & Personal Care",
    category: "Personal Care",
    expertiseLevel: "Master Stylist",
    rating: 5.0,
    reviewsCount: 49,
    basePrice: 70,
    location: "Zilker Metro, Austin",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
    badge: "Licensed Cosmetology Pro",
    reviewerName: "Aaliyah Washington",
    reviewerLocation: "Travis Heights, Austin",
    serviceCompleted: "Executive In-Home Hair Styling & Spa Manicure",
    testimonial:
      "GlowWell brought luxury spa styling, manicure, and precision haircut directly to our home. Spotless sanitation protocols, punctual arrival, and relaxing master stylist experience. Flawless 5-star service!",
    verifiedDate: "Verified 1 week ago",
  },
];

const CATEGORIES = [
  "All Services",
  "Appliance & Gadget Repair",
  "Plumbing",
  "Electrical",
  "Cleaning & Pest Control",
  "Home Maintenance",
  "Moving & Shifting",
  "Car Care & Repair",
  "Personal Care",
];

export interface TestimonialsProps {
  providers?: any[];
  onSelectService?: (category: string) => void;
  className?: string;
}

export default function Testimonials({
  providers = [],
  onSelectService,
  className,
}: TestimonialsProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [displayMode, setDisplayMode] = useState<"grid" | "marquee">("grid");

  // Merge live providers from DB if available with rich testimonial records
  const items = useMemo(() => {
    return SERVICE_HOLDERS_REVIEWS.map((item) => {
      const match = providers.find(
        (p) =>
          p.category?.toLowerCase() === item.category.toLowerCase() ||
          p.name?.toLowerCase().includes(item.providerName.toLowerCase())
      );
      if (match) {
        return {
          ...item,
          rating: match.rating || item.rating,
          reviewsCount: match.reviewsCount || item.reviewsCount,
          avatar: match.avatar || item.avatar,
          basePrice: match.basePrice || item.basePrice,
          providerName: match.name || item.providerName,
        };
      }
      return item;
    });
  }, [providers]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All Services") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className={cn("px-4 sm:px-6 py-12 max-w-7xl mx-auto space-y-10", className)}>
      {/* ---------------------------------------------------- */}
      {/* 1. Header & Trust Metrics Banner */}
      {/* ---------------------------------------------------- */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-[#1E3A2B] dark:text-emerald-300 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-wider shadow-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Verified Service Holders & Reviews</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Top-Rated Service Specialists
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          Explore certified master technicians across all 8 essential home & auto disciplines. Real star ratings, transparent hourly rates, and verified client testimonials.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. Platform Quality KPI Ribbon */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 p-4 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-white/10 shadow-spatial-sm">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">4.89 / 5.0</span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Average Specialist Rating</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">460+ Reviews</span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">100% Verified Customers</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
          <div className="flex items-center justify-center gap-1 text-[#1E3A2B] dark:text-emerald-300 mb-1">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">Licensed Pro</span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Background Checked</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
          <div className="flex items-center justify-center gap-1 text-teal-600 dark:text-teal-400 mb-1">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">0 Collisions</span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Double-Booking Shield</span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. Category Filter Bar & View Mode Toggle */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1E3A2B] text-white dark:bg-emerald-600 shadow-sm scale-105"
                    : "bg-white dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-end md:self-auto shrink-0">
          <button
            onClick={() => setDisplayMode("grid")}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              displayMode === "grid"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setDisplayMode("marquee")}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              displayMode === "marquee"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
            title="Marquee Carousel View"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Marquee</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. Service Holders Review Cards Display */}
      {/* ---------------------------------------------------- */}
      {displayMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ServiceHolderCard
              key={item.id}
              item={item}
              onSelectService={onSelectService}
            />
          ))}
        </div>
      ) : (
        <div className="mask-x-from-80% py-2">
          <Marquee className="py-2 [--duration:45s] [--gap:24px]" pauseOnHover>
            {filteredItems.map((item) => (
              <div key={item.id} className="w-[380px] shrink-0">
                <ServiceHolderCard
                  item={item}
                  onSelectService={onSelectService}
                />
              </div>
            ))}
          </Marquee>
        </div>
      )}
    </div>
  );
}

// Sub-Component: Individual Service Holder Review Card
function ServiceHolderCard({
  item,
  onSelectService,
}: {
  item: any;
  onSelectService?: (category: string) => void;
}) {
  const handleBook = () => {
    if (onSelectService) {
      onSelectService(item.category);
    } else {
      const el = document.getElementById("booking-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="spatial-card spatial-card-hover rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 shadow-clean-card hover:border-emerald-500/50 transition-all flex flex-col justify-between relative overflow-hidden group">
      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 opacity-80" />

      <div>
        {/* Service Holder Header Dossier */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="size-13 rounded-2xl border-2 border-[#1E3A2B] dark:border-emerald-500 shadow-sm">
                <AvatarImage src={item.avatar} alt={item.providerName} className="object-cover" />
                <AvatarFallback className="bg-[#1E3A2B] text-white font-bold">
                  {item.providerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-xs" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {item.providerName}
              </h3>
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold block mt-0.5">
                {item.category}
              </span>
            </div>
          </div>

          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 shrink-0">
            ${item.basePrice}/hr
          </span>
        </div>

        {/* PROMINENT STAR RATING BAR */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/[0.08] dark:bg-amber-400/[0.05] border border-amber-400/30 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(item.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-amber-400/40 text-amber-400"
                  )}
                />
              ))}
            </div>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {Number(item.rating).toFixed(1)}
            </span>
          </div>

          <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
            {item.reviewsCount} Verified Reviews
          </span>
        </div>

        {/* Customer Testimonial Quote */}
        <div className="relative p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 mb-4 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          <p className="italic mb-3">"{item.testimonial}"</p>

          <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 dark:text-white text-[11px]">
                {item.reviewerName}
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                ★ Verified Customer
              </span>
            </div>
            <span className="text-[10px] text-slate-400">{item.reviewerLocation}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Job: {item.serviceCompleted}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer: Book / Schedule Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>{item.location}</span>
        </div>

        <button
          onClick={handleBook}
          className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#1E3A2B] to-emerald-700 hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-1.5 shadow-sm group-hover:shadow-md cursor-pointer"
        >
          <span>Book Specialist</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
