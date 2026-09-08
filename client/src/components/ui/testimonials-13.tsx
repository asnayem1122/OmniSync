import Link from "next/link";
import React, { useState, useMemo, ComponentProps } from "react";
import {
  Logo01,
  Logo02,
  Logo03,
  Logo04,
  Logo05,
  Logo06,
  Logo07,
  Logo08,
} from "@/components/ui/testimonials-13-utils/logos";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/testimonials-13-utils/marquee";
import { cn } from "@/lib/utils";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  Award,
  ArrowUpRight,
  SlidersHorizontal,
  LayoutGrid,
} from "lucide-react";

// Website Service Holders Testimonial Records across all 8 Core Categories
export const serviceHolders = [
  {
    id: 1,
    name: "VoltWave Master Electrical",
    designation: "Master Electrician • Electrical",
    category: "Electrical",
    rating: 4.9,
    reviewsCount: 75,
    basePrice: 85,
    testimonial:
      "VoltWave installed our 48A Tesla Wall Connector and upgraded our 200A main breaker panel with zero downtime. Cleanest conduit work in Austin. Arrived in 20 minutes with full diagnostic gear!",
    reviewer: "James Gordon • East Austin",
    jobDone: "200A Electrical Panel & EV Charger",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    logo: Logo01,
  },
  {
    id: 2,
    name: "AquaFlow Precision Plumbing",
    designation: "Master Plumber • Plumbing",
    category: "Plumbing",
    rating: 4.9,
    reviewsCount: 68,
    basePrice: 90,
    testimonial:
      "Emergency nighttime pipe leak under the foundation. AquaFlow dispatched immediately, tracked via GPS, isolated the line, and replaced the junction with zero drywall damage. True master plumbers.",
    reviewer: "Claire Bennet • South Congress",
    jobDone: "Emergency Slab Leak & Shutoff Valve",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
    logo: Logo02,
  },
  {
    id: 3,
    name: "Apex Appliance & Tech Repair",
    designation: "Certified Technician • Appliance Repair",
    category: "Appliance & Gadget Repair",
    rating: 4.9,
    reviewsCount: 52,
    basePrice: 75,
    testimonial:
      "Apex diagnosed our smart refrigerator compressor issue in 15 minutes. The technician had OEM factory parts in his truck, calibrated the digital sensors, and finished within an hour. Outstanding service!",
    reviewer: "Marcus & Sarah Turner • Westlake Hills",
    jobDone: "Smart Refrigerator Sensor & Board",
    avatar:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=160&q=80",
    logo: Logo03,
  },
  {
    id: 4,
    name: "EcoClean Pest Defense",
    designation: "Sanitization Pro • Cleaning & Pest",
    category: "Cleaning & Pest Control",
    rating: 4.9,
    reviewsCount: 58,
    basePrice: 55,
    testimonial:
      "EcoClean performed hospital-grade sanitization and botanical pest defense for our commercial facility and residence. Clean botanical scent, zero pests remaining, and immaculate attention to detail.",
    reviewer: "Elena Rostova • The Domain",
    jobDone: "Deep Sanitization & Pest Barrier",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
    logo: Logo04,
  },
  {
    id: 5,
    name: "SwiftShift Relocation Fleet",
    designation: "Logistics Master • Moving & Shifting",
    category: "Moving & Shifting",
    rating: 4.9,
    reviewsCount: 47,
    basePrice: 95,
    testimonial:
      "Moved our entire 4-bedroom home without a single scratch on hardwood floors or glass tables. Punctual, courteous crew with padded wrapping and GPS fleet tracking the entire trip. Highly recommended!",
    reviewer: "Rachel & Liam Vance • Barton Hills",
    jobDone: "4-Bedroom Residential Relocation",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80",
    logo: Logo05,
  },
  {
    id: 6,
    name: "ReviveAuto Mobile Mechanic",
    designation: "ASE Master Mechanic • Car Care",
    category: "Car Care & Repair",
    rating: 4.9,
    reviewsCount: 53,
    basePrice: 85,
    testimonial:
      "ReviveAuto came directly to my driveway, completed ceramic brake pad replacement and full synthetic oil service while I worked inside. Professional diagnostic scan report sent to my phone. Best car care in town.",
    reviewer: "Carlos Mendez • Central Austin",
    jobDone: "Ceramic Brake Service & Diagnostics",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80",
    logo: Logo06,
  },
  {
    id: 7,
    name: "GlowWell Salon & Wellness",
    designation: "Master Stylist • Personal Care",
    category: "Personal Care",
    rating: 5.0,
    reviewsCount: 49,
    basePrice: 70,
    testimonial:
      "GlowWell brought luxury spa styling, manicure, and precision haircut directly to our home. Spotless sanitation protocols, punctual arrival, and relaxing master stylist experience. Flawless 5-star service!",
    reviewer: "Aaliyah Washington • Travis Heights",
    jobDone: "Executive In-Home Hair & Spa Care",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
    logo: Logo07,
  },
  {
    id: 8,
    name: "Craftsman Pro Maintenance",
    designation: "Master Handyman • Home Maintenance",
    category: "Home Maintenance",
    rating: 4.8,
    reviewsCount: 61,
    basePrice: 65,
    testimonial:
      "Craftsman Pro fixed our patio framing, aligned our smart deadbolts, and secured loose gutters all in one session. Transparent pricing with zero surprise fees. Our go-to maintenance contractor.",
    reviewer: "David Chen • Mueller District",
    jobDone: "Patio Framing & Smart Deadbolts",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
    logo: Logo08,
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
  const [viewMode, setViewMode] = useState<"marquee" | "grid">("marquee");

  // Synchronize live rating and reviews count from database providers
  const displayItems = useMemo(() => {
    return serviceHolders.map((sh) => {
      const live = providers.find(
        (p) =>
          p.category?.toLowerCase() === sh.category.toLowerCase() ||
          p.name?.toLowerCase().includes(sh.name.toLowerCase())
      );
      if (live) {
        return {
          ...sh,
          rating: live.rating || sh.rating,
          reviewsCount: live.reviewsCount || sh.reviewsCount,
          avatar: live.avatar || sh.avatar,
          name: live.name || sh.name,
          basePrice: live.basePrice || sh.basePrice,
        };
      }
      return sh;
    });
  }, [providers]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All Services") return displayItems;
    return displayItems.filter((item) => item.category === selectedCategory);
  }, [displayItems, selectedCategory]);

  return (
    <div className={cn("px-4 sm:px-6 py-16 max-w-7xl mx-auto space-y-10", className)}>
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-[#1E3A2B] dark:text-emerald-300 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-wider shadow-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Verified Service Holders & Reviews</span>
        </div>
        <h2 className="text-center font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-[-0.04em] text-slate-900 dark:text-white">
          Service Specialists with Star Ratings
        </h2>
        <p className="mt-3.5 text-center text-slate-600 dark:text-slate-300 text-base sm:text-lg tracking-[-0.015em] font-medium">
          Real client reviews, verified five-star ratings, and certified contractor insignias across all 8 essential disciplines.
        </p>
      </div>

      {/* KPI Trust Strip */}
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
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Verified Customer Jobs</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
          <div className="flex items-center justify-center gap-1 text-[#1E3A2B] dark:text-emerald-300 mb-1">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">Licensed Pros</span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">100% Background Checked</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center">
          <div className="flex items-center justify-center gap-1 text-teal-600 dark:text-teal-400 mb-1">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">0 Collisions</span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">Double-Booking Shield</span>
        </div>
      </div>

      {/* Category Pills & View Switcher */}
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

        {/* View Switcher: Marquee vs Grid */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-end md:self-auto shrink-0">
          <button
            onClick={() => setViewMode("marquee")}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "marquee"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
            title="Staggered Marquee Mode"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Marquee Wave</span>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
            }`}
            title="Grid Mode"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
        </div>
      </div>

      {/* Staggered testimonials-13 Showcase */}
      {viewMode === "marquee" ? (
        <div className="mask-x-from-80% mt-8 space-y-px border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/30 rounded-3xl overflow-hidden shadow-clean-card">
          <Marquee className="py-0 [--duration:50s] [--gap:0px]" pauseOnHover>
            <TestimonialList items={filteredItems} onSelectService={onSelectService} />
          </Marquee>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredItems.map((item) => (
            <SingleServiceHolderCard
              key={item.id}
              item={item}
              onSelectService={onSelectService}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Alternating staggered list conforming to the exact testimonials-13 architecture
const TestimonialList = ({
  items,
  onSelectService,
  className,
  ...props
}: {
  items: typeof serviceHolders;
  onSelectService?: (category: string) => void;
  className?: string;
} & ComponentProps<"div">) =>
  items.map((testimonial) => (
    <div
      className="-mx-1 flex w-full max-w-sm flex-col odd:flex-col-reverse shrink-0"
      key={testimonial.id}
    >
      {/* 1. Testimonial Card with Star Rating */}
      <div
        className={cn(
          "rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900/90 shadow-clean-card transition-all hover:border-emerald-500/50 m-2 flex flex-col justify-between",
          className
        )}
        {...props}
      >
        <div className="p-6">
          {/* Service Holder Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-11 rounded-2xl border-2 border-[#1E3A2B] dark:border-emerald-500 shadow-xs">
                <AvatarImage
                  className="object-cover"
                  src={testimonial.avatar}
                  alt={testimonial.name}
                />
                <AvatarFallback className="bg-[#1E3A2B] font-bold text-white text-base">
                  {testimonial.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight">
                  {testimonial.name}
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 font-bold text-xs mt-0.5">
                  {testimonial.designation}
                </p>
              </div>
            </div>

            <Button
              asChild
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-[10px] font-extrabold rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300"
            >
              <span>৳{testimonial.basePrice}/hr</span>
            </Button>
          </div>

          {/* PROMINENT STAR RATING */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-400/30 mt-3.5 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {testimonial.rating.toFixed(1)} ★
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
              {testimonial.reviewsCount} Verified Reviews
            </span>
          </div>

          {/* Testimonial Quote */}
          <p className="mt-3 text-[14px] leading-relaxed text-slate-700 dark:text-slate-300 italic font-medium">
            "{testimonial.testimonial}"
          </p>

          {/* Attribution & Book Action */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-2">
            <div className="text-[11px]">
              <span className="font-bold text-slate-900 dark:text-white block">
                {testimonial.reviewer}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Job: {testimonial.jobDone}
              </span>
            </div>

            <button
              onClick={() => {
                if (onSelectService) {
                  onSelectService(testimonial.category);
                } else {
                  const el = document.getElementById("booking-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-3 py-1.5 rounded-xl text-[11px] font-extrabold text-white bg-[#1E3A2B] hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span>Book</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visual Partner Blueprint Emblem Container */}
      <div className="mask-y-from-75% mask-x-from-75% relative flex h-44 w-96 items-center justify-center p-6 mx-2 my-1">
        <testimonial.logo className="h-16 w-48 text-slate-700 dark:text-slate-300 filter drop-shadow-sm" />

        {/* Blueprint Grid Background from testimonials-13 */}
        <div
          className="absolute inset-0 isolate -z-1 opacity-20 dark:opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(16,185,129,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(16,185,129,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 0",
            maskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              )
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              )
            `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />
      </div>
    </div>
  ));

// Single card for responsive Grid View
function SingleServiceHolderCard({
  item,
  onSelectService,
}: {
  item: (typeof serviceHolders)[0];
  onSelectService?: (category: string) => void;
}) {
  return (
    <div className="spatial-card spatial-card-hover rounded-3xl p-6 border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-900/60 shadow-clean-card flex flex-col justify-between relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 rounded-2xl border-2 border-[#1E3A2B] dark:border-emerald-500 shadow-sm">
              <AvatarImage src={item.avatar} alt={item.name} className="object-cover" />
              <AvatarFallback className="bg-[#1E3A2B] text-white font-bold">
                {item.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {item.name}
              </h3>
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold block mt-0.5">
                {item.designation}
              </span>
            </div>
          </div>
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
            ৳{item.basePrice}/hr
          </span>
        </div>

        {/* PROMINENT STAR RATING */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-500/[0.08] dark:bg-amber-400/[0.05] border border-amber-400/30 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white">
              {item.rating.toFixed(1)} ★
            </span>
          </div>
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
            {item.reviewsCount} Verified Reviews
          </span>
        </div>

        {/* Testimonial Quote */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 mb-4 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          <p className="italic mb-2.5">"{item.testimonial}"</p>
          <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-900 dark:text-white">{item.reviewer}</span>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
              ★ Verified Job
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
        <item.logo className="h-8 w-32 text-slate-600 dark:text-slate-400" />

        <button
          onClick={() => {
            if (onSelectService) {
              onSelectService(item.category);
            } else {
              const el = document.getElementById("booking-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#1E3A2B] to-emerald-700 hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span>Book Specialist</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
