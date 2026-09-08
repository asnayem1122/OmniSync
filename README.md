# OmniSync • Smart Home Service Automation MVP

> **8-Hour Hackathon Build** — A full-stack MERN application connecting smart homeowners with pre-vetted specialists using multi-factor algorithmic matching, collision-free scheduling, and live job tracking.

Designed with **Horizon UI Glassmorphism** aesthetic: rich emerald, teal, and slate color palettes, ambient gradient mesh backdrops, circular SVG progress meters, and responsive pipeline steppers.

---

## 🌟 Key Architecture & Features

### 1. Phase 1: Backend Architecture & Core Matching Engine
- **Mongoose Schemas**:
  - `Provider`: Name, category, coordinates (`lat`, `lng`, address), rating, hourly base rate, expertise level (`Beginner`, `Intermediate`, `Expert`, `Master`), and `bookedSlots` array.
  - `Request`: Customer dossier, service category, location coordinates, urgency tier (`Low`, `Medium`, `High`, `Emergency`), preferred time window, match history, and the 5-stage pipeline (`Requested` $\rightarrow$ `Accepted` $\rightarrow$ `On the Way` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`).
- **Zero-Config Database**:
  - Automatically spins up an embedded in-memory MongoDB server (`mongodb-memory-server`) with graceful fallback to `MONGO_URI`. No local database installation required!
- **Mock Seeder**:
  - Pre-populates 13 realistic providers across 6 smart home domains (Lighting, HVAC, Security, Audio/Cinema, Motorized Shading, Appliances).
- **Core Matching Engine (`POST /api/match`)**:
  - **Strict Double-Booking Collision Filter**:
    $$(\text{slot.start} < T_{\text{end}}) \land (\text{slot.end} > T_{\text{start}})$$
    Providers with overlapping calendar commitments receive an availability score of `0` and are filtered out of recommendations.
  - **Multi-Factor Scoring (0–100 Normalization)**:
    $$\text{Match Score} = \min\left(100, \max\left(0, \text{round}\left(S_{\text{avail}} + S_{\text{dist}} + S_{\text{rating}} + S_{\text{price}} + S_{\text{exp}} + S_{\text{urgency}}\right)\right)\right)$$
    - **Availability (25 pts)**: Full credit if completely free; partial credit if open during requested window.
    - **Proximity (25 pts)**: Great-Circle Haversine distance with linear decay up to 30 km.
    - **Rating (20 pts)**: $(\text{rating} / 5.0) \times 20$.
    - **Price Competitiveness (15 pts)**: Relative to the matching category price spread.
    - **Service Expertise (15 pts)**: Master (15), Expert (12), Intermediate (9), Beginner (6).
    - **Urgency Boost (5 pts)**: Bonus for close, master-certified specialists during Emergency requests.

---

### 2. Phase 2: Customer UI Dashboard
- **Horizon UI Glassmorphic Layout**:
  - Deep slate background (`#070C18`) layered with floating emerald and teal blurred ambient orbs and tech grid texture.
- **Service Request Form**:
  - 6 service categories with dedicated iconography.
  - Geolocation coordinate anchor with 4 quick presets (Downtown Austin, South Congress, The Domain, Mueller Tech District).
  - Time window presets (Immediate 1-2h, Afternoon, Tomorrow AM) with collision toggle.
  - 4-tier urgency selector (Low, Medium, High, Emergency).
- **Recommendation View**:
  - Glass-pane provider cards with hover lift.
  - **Circular Progress Meter**: Animated SVG ring with emerald-to-teal gradient stroke, drop-shadow glow, and centered 0–100 match percentage.
  - Granular breakdown badges: Availability (`/25`), Proximity (`/25`, km), Rating (`/20`), Price (`/15`), and Expertise (`/15`).
  - One-click instant booking dispatch.
- **Live Tracking Tracker**:
  - Responsive 5-stage pipeline stepper:
    `Requested` $\rightarrow$ `Accepted` $\rightarrow$ `On the Way` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`.
  - Glowing active dots, connected gradient progress line, and pulse rings.
  - Assigned technician dossier with simulated direct calling and GPS navigation.
  - **Hackathon Stage Simulator**: Controls allowing judges to simulate real-time pipeline status updates (`PATCH /api/requests/:id/status`) on the live database.

---

### 3. Phase 3: Provider UI Dashboard (Technician Portal)
- **Specialist Persona Switcher**:
  - Switch dynamically between any of the 13 providers to view their personalized technician dashboard.
- **Incoming Jobs Queue**:
  - Real-time queue displaying customer requests matching the technician's discipline.
  - Prominent, glowing **Accept (Emerald)** and **Decline (Rose)** buttons.
  - Accepting a job automatically locks the time slot in the provider's calendar and prevents future double bookings.
- **Visual Schedule & Calendar View**:
  - Daily timeline (08:00 to 20:00) with visual blocked-out busy slots.
  - Busy periods displayed with frosted glass badges, job title, and client name.
  - Free slots highlighted with "Available for incoming service dispatch".
  - **Manual Time Blocker**: Modal allowing technicians to block out personal windows or lunch breaks.
- **Active Job & Status Controls**:
  - Dedicated operational dossier for the active accepted job.
  - Prominent button group to transition between stages (`Accepted` $\rightarrow$ `On the Way` $\rightarrow$ `In Progress` $\rightarrow$ `Completed`).
  - Instant two-way synchronization with MongoDB backend and Customer Live Tracker.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# 1. Install server dependencies
cd server
npm install

# 2. Install client dependencies
cd ../client
npm install
```

### Running the Application

In terminal 1 (Backend Server):
```bash
cd server
npm start
# Runs on http://localhost:5000 (auto-seeds 13 providers into in-memory MongoDB)
```

In terminal 2 (Frontend Client):
```bash
cd client
npm run dev
# Runs on http://localhost:3000 (proxies /api to port 5000)
```

Open your browser to:
**http://localhost:3000**

---

## 🧪 Testing & Verification

Run the automated mathematical matching unit test suite:
```bash
cd server
npm run test:match
```
**Results**:
- Haversine Proximity Calculation: 2/2 tests passed
- Double-Booking Collision Prevention: 4/4 boundary tests passed
- Multi-Factor Normalization (0–100): 4/4 tests passed
- **Total: 10 / 10 passed (100%)**

Run the end-to-end API integration test:
```bash
cd server
node test/test-api.js
```
Verifies server bootstrap, in-memory MongoDB startup, auto-seeding, provider queries, matching calculation, request creation, and status transitions.
