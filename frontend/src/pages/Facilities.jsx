import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAccessibility } from '../context/AccessibilityContext';
import CrowdBadge from '../components/CrowdBadge';

// ─── Dr. M.G.R. Chennai Central Railway Station (MAS) Facilities ───────
export const CHENNAI_FACILITIES = [
  {
    id: 'cf-1',
    name: 'Restroom 1 (Platform 1)',
    shortName: 'Restroom 1',
    category: 'Toilet',
    icon: '🚻',
    floor: 'Platform 1',
    platform: 'Platform 1',
    distance: '85m',
    walkTime: '1.5 min',
    locationDesc: 'Near Gate No.1 entry, north end of Platform 1 (VIP Porch side)',
    crowdLevel: 'low',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: true,
    notes: 'Divyangjan accessible, Braille door signage, tactile ground guide, emergency push button',
    x: 210,
    y: 175,
    steps: [
      'Enter Chennai Central via Main Entrance (Gate 1 - EVR Periyar Salai)',
      'Walk 30 meters straight through the Central Booking & Concourse Hall',
      'Take the tactile ramp on the left leading directly to Platform 1',
      'Restroom 1 is on your right next to AC Waiting Lounge (Pillar A2)',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Central Booking Hall' },
      { x: 300, y: 565, label: 'Tactile Ramp' },
      { x: 300, y: 350, label: 'Platform 1 Passage' },
      { x: 210, y: 175, label: 'Restroom 1 (Platform 1) ✅' },
    ],
  },
  {
    id: 'cf-2',
    name: 'Restroom 2 (Platform 5)',
    shortName: 'Restroom 2',
    category: 'Toilet',
    icon: '🚻',
    floor: 'Platform 5',
    platform: 'Platform 5',
    distance: '210m',
    walkTime: '3.5 min',
    locationDesc: 'Mid-section of Platform 5 near Coach S6 halt indicator & Pillar 22',
    crowdLevel: 'high',
    isAvailable: true,
    wheelchairAccessible: false,
    hasBabyCare: false,
    notes: 'General sanitation unit, continuous cleaning cycle every 30 mins',
    x: 680,
    y: 175,
    steps: [
      'Enter Main Gate 1 and walk into the Main Concourse',
      'Walk straight towards Central Pass and Foot Over Bridge (FOB)',
      'Take FOB Bridge or Platform Cross-Walk towards Platform 5',
      'Descend to Platform 5; Restroom 2 is near Pillar 22',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse' },
      { x: 500, y: 440, label: 'FOB Access' },
      { x: 680, y: 440, label: 'FOB to P5' },
      { x: 680, y: 175, label: 'Restroom 2 (Platform 5) ✅' },
    ],
  },
  {
    id: 'cf-3',
    name: 'Medical Emergency & First Aid',
    shortName: 'Medical Booth',
    category: 'Medical',
    icon: '🏥',
    floor: 'Ground',
    platform: 'Concourse',
    distance: '120m',
    walkTime: '2 min',
    locationDesc: 'Adjacent to Station Superintendent Office, near Gate 2 (Moore Market side)',
    crowdLevel: 'low',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: true,
    notes: 'Government Railway Doctor on duty 24/7, AED Defibrillator, Oxygen cylinders, 2 stretchers. Phone: 044-25354111',
    x: 160,
    y: 340,
    steps: [
      'From Gate 1 or Gate 2, enter Moore Market side of Concourse',
      'Walk past the Southern Railway Commercial Office',
      'Medical First Aid Booth is adjacent to Station Superintendent Office',
      'Emergency Stretcher and Doctor available immediately',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse Hall' },
      { x: 220, y: 565, label: 'Moore Market Wing' },
      { x: 160, y: 440, label: 'Station Master Corridor' },
      { x: 160, y: 340, label: 'Medical Emergency Booth ✅' },
    ],
  },
  {
    id: 'cf-4',
    name: 'Divyangjan Wheelchair & Sahayata Kendra',
    shortName: 'Wheelchair Desk',
    category: 'Wheelchair',
    icon: '♿',
    floor: 'Ground',
    platform: 'Concourse',
    distance: '45m',
    walkTime: '1 min',
    locationDesc: 'Divyangjan Sahayata Kendra — Main Concourse immediately inside Gate 1',
    crowdLevel: 'low',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: false,
    notes: 'Free battery-operated buggy cart service to all 17 platforms, manual wheelchair loans, porter coordination. Helpline: 044-25350011',
    x: 450,
    y: 480,
    steps: [
      'Enter Chennai Central via Gate 1',
      'Walk 40 meters straight ahead inside the concourse',
      'Prominent Blue illuminated kiosk: Divyangjan Sahayata Kendra',
      'Staff on duty will provide a wheelchair or assign a battery buggy cart',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse Entry' },
      { x: 450, y: 480, label: 'Sahayata Kendra (Buggy Desk) ✅' },
    ],
  },
  {
    id: 'cf-5',
    name: 'Elevator 1 (Concourse to FOB)',
    shortName: 'Elevator 1',
    category: 'Elevator',
    icon: '🛗',
    floor: 'Ground',
    platform: 'Platform 1',
    distance: '95m',
    walkTime: '1.5 min',
    locationDesc: 'Foot Over Bridge Access A — North end near Platform 1 ramp',
    crowdLevel: 'medium',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: false,
    notes: 'Capacity 13 persons / 2 wheelchairs, voice floor readout in Tamil, English & Hindi, Braille call buttons',
    x: 390,
    y: 190,
    steps: [
      'Enter Main Gate 1 and proceed toward Platform 1 corridor',
      'Walk toward Foot Over Bridge (FOB) Tower A',
      'Glass elevator shaft located on the right side of FOB steps',
      'Direct barrier-free lift access to overhead walkway',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse' },
      { x: 390, y: 565, label: 'FOB Tower A' },
      { x: 390, y: 350, label: 'Elevator Shaft' },
      { x: 390, y: 190, label: 'Elevator 1 (FOB Access) ✅' },
    ],
  },
  {
    id: 'cf-6',
    name: 'Elevator 2 (Platform 5 to FOB)',
    shortName: 'Elevator 2',
    category: 'Elevator',
    icon: '🛗',
    floor: 'Platform 5',
    platform: 'Platform 5',
    distance: '180m',
    walkTime: '3 min',
    locationDesc: 'Foot Over Bridge Tower B — connects Platform 5 to all island platforms',
    crowdLevel: 'low',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: false,
    notes: 'Operational, low congestion currently. Connects Platform 4, 5, 6, 7',
    x: 510,
    y: 315,
    steps: [
      'From Concourse or Platform 1, cross via FOB Bridge walkway',
      'Exit elevator at Platform 5 / Tower B',
      'Direct level landing onto Platform 5 platform surface',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse' },
      { x: 460, y: 470, label: 'FOB Walkway' },
      { x: 510, y: 315, label: 'Elevator 2 (Platform 5) ✅' },
    ],
  },
  {
    id: 'cf-7',
    name: 'IRCTC Food Plaza & Saravana Bhavan',
    shortName: 'Food Plaza',
    category: 'Food',
    icon: '🍱',
    floor: 'Ground',
    platform: 'Concourse',
    distance: '70m',
    walkTime: '1 min',
    locationDesc: 'Main Concourse North Wing — Dr. M.G.R. Chennai Central Food Court',
    crowdLevel: 'high',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: false,
    notes: 'South Indian meals, hot idli, dosa, filter coffee, vegetarian dining hall with low-height wheelchair seating tables',
    x: 700,
    y: 540,
    steps: [
      'Enter via Main Gate 1',
      'Turn right into the Main Concourse East Arcade',
      'Walk past Higginbothams bookstall',
      'IRCTC Food Plaza is located on your left with wide automatic sliding doors',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse Hall' },
      { x: 700, y: 565, label: 'East Arcade' },
      { x: 700, y: 540, label: 'IRCTC Food Plaza ✅' },
    ],
  },
  {
    id: 'cf-8',
    name: 'Canteen & South Indian Refreshments',
    shortName: 'Platform Canteen',
    category: 'Food',
    icon: '☕',
    floor: 'Platform 1',
    platform: 'Platform 1',
    distance: '140m',
    walkTime: '2 min',
    locationDesc: 'Mid-platform 1 near Coach B2 halt marker',
    crowdLevel: 'medium',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: false,
    notes: 'Hot snacks, mineral water, packed biscuits, quick tea & filter coffee stall',
    x: 600,
    y: 175,
    steps: [
      'Take Platform 1 ramp from Main Gate',
      'Walk past Coach A1 marker along the platform yellow safety line',
      'Canteen stall is located beside Pillar 12',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse' },
      { x: 300, y: 565, label: 'Platform 1 Entry' },
      { x: 600, y: 175, label: 'Platform 1 Canteen ✅' },
    ],
  },
  {
    id: 'cf-9',
    name: 'Indian Bank 24×7 ATM Kiosk',
    shortName: 'Indian Bank ATM',
    category: 'ATM',
    icon: '🏧',
    floor: 'Ground',
    platform: 'Concourse',
    distance: '50m',
    walkTime: '1 min',
    locationDesc: 'Ticket Hall Wing — inside Gate 1 corner near Unreserved Counters',
    crowdLevel: 'low',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: false,
    notes: 'Talking ATM with audio headphone jack for visually impaired travelers, Braille embossed keypad, cash deposit available',
    x: 195,
    y: 480,
    steps: [
      'Enter Gate 1 Main Entrance',
      'Turn immediate left into the Ticket Booking Wing',
      'Indian Bank ATM kiosk is next to Counter 1',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse' },
      { x: 195, y: 565, label: 'Ticket Hall Wing' },
      { x: 195, y: 480, label: 'Indian Bank ATM Kiosk ✅' },
    ],
  },
  {
    id: 'cf-10',
    name: 'State Bank of India (SBI) ATM',
    shortName: 'SBI ATM',
    category: 'ATM',
    icon: '🏧',
    floor: 'Ground',
    platform: 'Concourse',
    distance: '110m',
    walkTime: '1.5 min',
    locationDesc: 'Near Passenger Reservation Complex, Gate 3 (Poonamallee High Rd side)',
    crowdLevel: 'low',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: false,
    notes: 'SBI Multi-currency card support, cash withdrawal, barrier-free ramp access',
    x: 820,
    y: 480,
    steps: [
      'From Concourse, walk east toward Gate 3 Exit (Poonamallee High Road)',
      'SBI ATM is adjacent to the Passenger Reservation System (PRS) entrance',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse' },
      { x: 820, y: 565, label: 'Gate 3 PRS Wing' },
      { x: 820, y: 480, label: 'SBI ATM Kiosk ✅' },
    ],
  },
  {
    id: 'cf-11',
    name: 'Senior Citizen & Divyangjan Ticket Counter',
    shortName: 'Ticket Counter 1',
    category: 'Ticket',
    icon: '🎟️',
    floor: 'Ground',
    platform: 'Concourse',
    distance: '60m',
    walkTime: '1 min',
    locationDesc: 'Moore Market Booking Complex — Dedicated Priority Counter 1',
    crowdLevel: 'medium',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: false,
    notes: 'Low-height counter for wheelchair travelers, hearing loop induction system for hearing aid users, priority queue',
    x: 290,
    y: 500,
    steps: [
      'Enter via Gate 1 or Gate 2',
      'Walk into the Booking Hall',
      'Counter 1 on the far left has blue signage for Senior Citizens & Persons with Disabilities',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse' },
      { x: 290, y: 565, label: 'Booking Hall Entry' },
      { x: 290, y: 500, label: 'Counter 1 (Divyangjan) ✅' },
    ],
  },
  {
    id: 'cf-12',
    name: 'AC Executive Waiting Lounge',
    shortName: 'AC Lounge',
    category: 'Waiting',
    icon: '🛋️',
    floor: 'Platform 1',
    platform: 'Platform 1',
    distance: '110m',
    walkTime: '2 min',
    locationDesc: 'Near VIP Entry, Platform 1 North End — Dr. M.G.R. Chennai Central',
    crowdLevel: 'medium',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: true,
    notes: 'Air conditioned lounge, free high-speed RailWire Wi-Fi, accessible charging stations, dedicated mother & baby nursing cubicle',
    x: 130,
    y: 220,
    steps: [
      'Enter Main Gate 1 and proceed to Platform 1',
      'Walk north toward the VIP Porch area',
      'Glass sliding doors on your right: AC Executive Waiting Lounge',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse' },
      { x: 300, y: 565, label: 'Platform 1 Entrance' },
      { x: 130, y: 350, label: 'VIP Corridor' },
      { x: 130, y: 220, label: 'AC Executive Lounge ✅' },
    ],
  },
  {
    id: 'cf-13',
    name: 'Cold RO Filtered Drinking Water Booth',
    shortName: 'Water Booth',
    category: 'Food',
    icon: '💧',
    floor: 'Platform 5',
    platform: 'Platform 5',
    distance: '200m',
    walkTime: '3 min',
    locationDesc: 'Platform 5 beside Pillar 18 near Coach S4 halt marker',
    crowdLevel: 'low',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: false,
    notes: 'Purified chilled drinking water kiosk. Free glass water & ₹5 refill. Wheelchair height accessible drinking tap.',
    x: 760,
    y: 315,
    steps: [
      'Cross to Platform 5 via Foot Over Bridge or cross-track ramp',
      'Walk along Platform 5 toward Coach S4 position',
      'Stainless steel RO water kiosk near Pillar 18',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse' },
      { x: 460, y: 470, label: 'FOB Bridge' },
      { x: 760, y: 470, label: 'Platform 5 Walk' },
      { x: 760, y: 315, label: 'RO Water Booth ✅' },
    ],
  },
  {
    id: 'cf-14',
    name: 'Cloak Room & Left Luggage Office',
    shortName: 'Cloak Room',
    category: 'Shop',
    icon: '🧳',
    floor: 'Ground',
    platform: 'Concourse',
    distance: '90m',
    walkTime: '1.5 min',
    locationDesc: 'Opposite Railway Parcel Office, near Gate 4 (Wallajah / Salt Cotaurs side)',
    crowdLevel: 'low',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: false,
    notes: 'Safe electronic smart luggage lockers and 24-hr manual baggage deposit. Rate: ₹30/day per luggage item.',
    x: 760,
    y: 540,
    steps: [
      'From Main Concourse, take the south-east corridor toward Gate 4',
      'Cloak Room is right opposite the Parcel Office with dedicated baggage scanner',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse' },
      { x: 760, y: 565, label: 'Parcel Arcade' },
      { x: 760, y: 540, label: 'Luggage Cloak Room ✅' },
    ],
  },
  {
    id: 'cf-15',
    name: 'Higginbothams Heritage Bookstall & Magazine Shop',
    shortName: 'Book Stall',
    category: 'Shop',
    icon: '📚',
    floor: 'Concourse',
    platform: 'Concourse',
    distance: '65m',
    walkTime: '1 min',
    locationDesc: 'Higginbothams Historic Bookstall — Main Concourse Hall near Gate 1',
    crowdLevel: 'low',
    isAvailable: true,
    wheelchairAccessible: true,
    hasBabyCare: false,
    notes: 'Newspapers in Tamil, English, Telugu, Hindi, novels, station maps, magazines, travel adaptors, stationery',
    x: 820,
    y: 540,
    steps: [
      'Enter via Main Gate 1',
      'Turn right inside the grand concourse hall',
      'Higginbothams wooden heritage bookstall is prominently positioned near Platform 1 entry',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 565, label: 'Concourse' },
      { x: 820, y: 565, label: 'East Arcade' },
      { x: 820, y: 540, label: 'Higginbothams Bookstall ✅' },
    ],
  },
];

const crowdBgClass = (lvl) =>
  lvl === 'low' ? 'bg-green-500' : lvl === 'medium' ? 'bg-yellow-400' : 'bg-red-500';

const MAP_W = 1000;
const MAP_H = 680;

// ─── Interactive Route MiniMap Modal ────────────────────────────────
function RouteMinimap({ fac, onClose }) {
  const { speak } = useAccessibility();
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const route = fac.route || [];
  const steps = fac.steps || [];

  // Auto-advance animation
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStep((s) => {
        if (s < route.length - 1) return s + 1;
        setIsPlaying(false);
        return s;
      });
    }, 1100);
    return () => clearInterval(timer);
  }, [isPlaying, route.length]);

  const pathD = route
    .slice(0, step + 1)
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 0.28} ${p.y * 0.28}`)
    .join(' ');

  const currentStepText = steps[Math.min(step, steps.length - 1)] || '';

  const handleReadStep = () => {
    speak(`Step ${step + 1} of ${steps.length}: ${currentStepText}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center text-2xl shadow-inner">
              {fac.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-extrabold text-base sm:text-lg leading-tight">
                  {fac.name}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-black uppercase ${
                    fac.crowdLevel === 'low'
                      ? 'bg-green-400'
                      : fac.crowdLevel === 'medium'
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                  }`}
                >
                  {fac.crowdLevel} Crowd
                </span>
              </div>
              <p className="text-cyan-300 text-xs mt-0.5 flex items-center gap-2">
                <span>📍 {fac.locationDesc}</span>
                <span className="text-slate-400">•</span>
                <span className="text-yellow-300 font-semibold">📏 {fac.distance} ({fac.walkTime})</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xl transition-colors"
            aria-label="Close Minimap"
          >
            ✕
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row">
          {/* Mini SVG Map Box */}
          <div className="flex-1 bg-slate-950 p-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Dr. M.G.R. Chennai Central — Live Walking Route
                </span>
                <span className="text-xs text-cyan-300 font-mono bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                  {Math.round(((step + 1) / route.length) * 100)}%
                </span>
              </div>

              {/* SVG Canvas */}
              <svg
                viewBox={`0 0 ${MAP_W * 0.28} ${MAP_H * 0.28}`}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 shadow-inner"
                style={{ maxHeight: 250 }}
              >
                {/* Background Grid */}
                <pattern id="modalGrid" width="14" height="14" patternUnits="userSpaceOnUse">
                  <path d="M 14 0 L 0 0 0 14" fill="none" stroke="#111827" strokeWidth="0.8" />
                </pattern>
                <rect width={MAP_W * 0.28} height={MAP_H * 0.28} fill="url(#modalGrid)" />

                {/* Tracks */}
                <rect x={60 * 0.28} y={76 * 0.28} width={880 * 0.28} height={10 * 0.28} fill="#1e3a5f" rx="1.5" />
                <rect x={60 * 0.28} y={244 * 0.28} width={880 * 0.28} height={10 * 0.28} fill="#0f2942" rx="1.5" />
                <rect x={60 * 0.28} y={390 * 0.28} width={880 * 0.28} height={9 * 0.28} fill="#0f172a" rx="1.5" />

                {/* Platform 1 (MAS Express) */}
                <rect
                  x={60 * 0.28}
                  y={100 * 0.28}
                  width={880 * 0.28}
                  height={135 * 0.28}
                  fill="#172554"
                  stroke="#2563eb"
                  strokeWidth="0.8"
                  rx="3"
                  opacity="0.85"
                />
                <rect x={60 * 0.28} y={100 * 0.28} width={880 * 0.28} height={2} fill="#eab308" />
                <rect x={60 * 0.28} y={(100 + 133) * 0.28} width={880 * 0.28} height={2} fill="#eab308" />
                <text x={75 * 0.28} y={122 * 0.28} fill="#93c5fd" fontSize="6" fontWeight="bold">
                  PLATFORM 1 (MAS EXPRESS BERTH)
                </text>

                {/* Platform 5 (Main Line) */}
                <rect
                  x={60 * 0.28}
                  y={265 * 0.28}
                  width={880 * 0.28}
                  height={115 * 0.28}
                  fill="#0c4a6e"
                  stroke="#0284c7"
                  strokeWidth="0.8"
                  rx="3"
                  opacity="0.85"
                />
                <rect x={60 * 0.28} y={265 * 0.28} width={880 * 0.28} height={2} fill="#eab308" />
                <text x={75 * 0.28} y={285 * 0.28} fill="#7dd3fc" fontSize="6" fontWeight="bold">
                  PLATFORM 5 (MAIN LINE PASSAGE)
                </text>

                {/* Main Concourse */}
                <rect
                  x={60 * 0.28}
                  y={412 * 0.28}
                  width={880 * 0.28}
                  height={205 * 0.28}
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="0.8"
                  rx="3"
                />
                <text x={75 * 0.28} y={435 * 0.28} fill="#94a3b8" fontSize="5.5" fontWeight="bold">
                  MAIN CONCOURSE (MOORE MARKET COMPLEX)
                </text>

                {/* Foot Over Bridge */}
                <rect
                  x={410 * 0.28}
                  y={76 * 0.28}
                  width={75 * 0.28}
                  height={350 * 0.28}
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="0.8"
                  rx="2"
                  opacity="0.7"
                />
                <text
                  x={445 * 0.28}
                  y={240 * 0.28}
                  fill="#cbd5e1"
                  fontSize="4.5"
                  fontWeight="bold"
                  transform={`rotate(-90 ${445 * 0.28} ${240 * 0.28})`}
                  textAnchor="middle"
                >
                  FOB WALKWAY
                </text>

                {/* Main Gate 1 Indicator */}
                <rect x={420 * 0.28} y={615 * 0.28} width={160 * 0.28} height={15 * 0.28} fill="#16a34a" rx="2" />
                <text x={500 * 0.28} y={626 * 0.28} fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle">
                  ▲ MAIN GATE 1 (START) ▲
                </text>

                {/* Animated Neon Cyan Walking Path */}
                {step > 0 && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="6 3"
                  />
                )}

                {/* Waypoints along route */}
                {route.slice(0, step + 1).map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x * 0.28}
                      cy={p.y * 0.28}
                      r={i === step ? 6 : 3.5}
                      fill={
                        i === route.length - 1
                          ? '#22c55e'
                          : i === 0
                          ? '#f59e0b'
                          : '#00f0ff'
                      }
                      stroke="#020617"
                      strokeWidth="1.5"
                    />
                    {i === step && (
                      <circle
                        cx={p.x * 0.28}
                        cy={p.y * 0.28}
                        r="11"
                        fill="none"
                        stroke={i === route.length - 1 ? '#22c55e' : '#00f0ff'}
                        strokeWidth="1.8"
                        opacity="0.8"
                        className="animate-ping"
                      />
                    )}
                  </g>
                ))}

                {/* Target Pin Marker */}
                <g transform={`translate(${fac.x * 0.28}, ${fac.y * 0.28})`}>
                  <circle r="12" fill="#ef4444" opacity="0.3" className="animate-ping" />
                  <circle r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <text y="3" fontSize="8" textAnchor="middle" fill="#ffffff">
                    🎯
                  </text>
                  <rect x="-35" y="12" width="70" height="12" rx="2" fill="#000000" opacity="0.85" />
                  <text x="0" y="21" fill="#22c55e" fontSize="5" fontWeight="bold" textAnchor="middle">
                    {fac.shortName || fac.name}
                  </text>
                </g>
              </svg>
            </div>

            {/* Playback Controls & Progress Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-green-400 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${((step + 1) / route.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setStep(0);
                      setIsPlaying(true);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                  >
                    ↺ Restart
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-2.5 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700 rounded-lg font-medium transition-colors"
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                  </button>
                </div>
                <span className="text-slate-400">
                  Step <strong className="text-white">{step + 1}</strong> of {steps.length}
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Directions Panel */}
          <div className="md:w-72 p-4 bg-slate-900 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Step-by-Step Directions
                </span>
                <button
                  onClick={handleReadStep}
                  className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1 bg-cyan-950/70 border border-cyan-800/80 px-2 py-0.5 rounded-lg"
                  title="Listen to this step"
                >
                  <span>🔊</span> Listen
                </button>
              </div>

              {/* Steps List */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {steps.map((st, i) => {
                  const isActive = i === Math.min(step, steps.length - 1);
                  const isDone = i < step;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setStep(i);
                        setIsPlaying(false);
                      }}
                      className={`cursor-pointer p-2 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                        isActive
                          ? 'bg-blue-900/80 border-2 border-cyan-400 text-white shadow-md'
                          : isDone
                          ? 'bg-slate-800/60 text-slate-300 border border-slate-700'
                          : 'opacity-40 hover:opacity-75 bg-slate-800/30 text-slate-400'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 ${
                          isDone
                            ? 'bg-green-500 text-white'
                            : isActive
                            ? 'bg-cyan-400 text-black'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isDone ? '✓' : i + 1}
                      </div>
                      <p className="leading-relaxed flex-1">{st}</p>
                    </div>
                  );
                })}
              </div>

              {/* Extra Metadata */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Accessibility:</span>
                  <span className="font-semibold text-cyan-400">
                    {fac.wheelchairAccessible ? '♿ Barrier-Free Ramp' : '⚠️ Steps Required'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Operating Status:</span>
                  <span
                    className={`font-semibold ${
                      fac.isAvailable ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {fac.isAvailable ? '● Open & Operational' : '● Under Maintenance'}
                  </span>
                </div>
                {fac.notes && (
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                    {fac.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Got It — Back to Facilities ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Facilities Component ──────────────────────────────────────
export default function Facilities() {
  const { speak, screenReaderMode } = useAccessibility();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || 'ALL';

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [myLocation, setMyLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [routeFac, setRouteFac] = useState(null); // When set, opens RouteMinimap!

  const categories = [
    { id: 'ALL', name: 'All Facilities', icon: '🏢' },
    { id: 'Toilet', name: 'Restrooms', icon: '🚻' },
    { id: 'Medical', name: 'Medical Aid', icon: '🏥' },
    { id: 'Wheelchair', name: 'Wheelchair / Buggy', icon: '♿' },
    { id: 'Elevator', name: 'Lifts / FOB', icon: '🛗' },
    { id: 'Food', name: 'Food & Dining', icon: '🍱' },
    { id: 'ATM', name: 'ATM & Banking', icon: '🏧' },
    { id: 'Ticket', name: 'Ticket Counter', icon: '🎟️' },
    { id: 'Shop', name: 'Books & Cloakroom', icon: '🏪' },
    { id: 'Waiting', name: 'Waiting Lounges', icon: '🛋️' },
  ];

  // Quick 1-tap route targets requested specifically by user
  const quickRoutePills = [
    { id: 'cf-1', label: 'Restroom 1 (Platform 1)', icon: '🚻', color: 'bg-indigo-600 hover:bg-indigo-500' },
    { id: 'cf-2', label: 'Restroom 2 (Platform 5)', icon: '🚻', color: 'bg-slate-700 hover:bg-slate-600' },
    { id: 'cf-3', label: 'Medical First Aid Booth', icon: '🏥', color: 'bg-red-700 hover:bg-red-600' },
    { id: 'cf-4', label: 'Wheelchair / Buggy Desk', icon: '♿', color: 'bg-blue-600 hover:bg-blue-500' },
    { id: 'cf-7', label: 'IRCTC Food Plaza', icon: '🍱', color: 'bg-amber-600 hover:bg-amber-500' },
    { id: 'cf-9', label: 'Indian Bank ATM', icon: '🏧', color: 'bg-emerald-700 hover:bg-emerald-600' },
    { id: 'cf-11', label: 'Priority Ticket Counter', icon: '🎟️', color: 'bg-purple-700 hover:bg-purple-600' },
  ];

  const distanceRank = (fac, loc) => {
    if (!loc) return 0;
    if (fac.platform?.toLowerCase().includes(loc.toLowerCase())) return -10;
    if (fac.platform === 'Concourse') return 2;
    return 8;
  };

  const filtered = useMemo(() => {
    let result = CHENNAI_FACILITIES.filter((f) => {
      const matchCat = activeCategory === 'ALL' || f.category === activeCategory;
      const matchWC = !wheelchairOnly || f.wheelchairAccessible;
      const matchQ =
        !searchQuery.trim() ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.locationDesc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchWC && matchQ;
    });
    if (myLocation) {
      result = [...result].sort((a, b) => distanceRank(a, myLocation) - distanceRank(b, myLocation));
    }
    return result;
  }, [activeCategory, wheelchairOnly, searchQuery, myLocation]);

  const openRoute = (fac) => {
    setRouteFac(fac);
    if (screenReaderMode) {
      speak(`Opening interactive route minimap to ${fac.name}. Follow the steps on screen.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ── CHENNAI CENTRAL BANNER ── */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-blue-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wider">
                Dr. M.G.R. Chennai Central (MAS)
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900 text-green-300 border border-green-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live Facility Tracking
              </span>
              <span className="text-xs text-blue-300 hidden sm:inline">
                Southern Railway Headquarters
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>🚻</span> Station Facility Directory & Minimap Navigation
            </h1>
            <p className="text-sm text-blue-200 max-w-2xl leading-relaxed">
              Click any amenity (such as <strong>Restroom 1</strong>) to view instant turn-by-turn walking routes from Main Gate 1. Includes step-free tactile pathways for Divyangjan travelers.
            </p>
          </div>

          <button
            onClick={() => {
              const next = !wheelchairOnly;
              setWheelchairOnly(next);
              if (screenReaderMode) {
                speak(next ? 'Showing wheelchair accessible amenities only' : 'Showing all amenities');
              }
            }}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold shadow-md transition-all self-start md:self-auto ${
              wheelchairOnly
                ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-400/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <span className="text-lg">♿</span>
            <span>Wheelchair Only</span>
            <span
              className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                wheelchairOnly ? 'bg-slate-950 text-cyan-400' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {wheelchairOnly ? '✓' : 'O'}
            </span>
          </button>
        </div>
      </div>

      {/* ── ⚡ 1-TAP QUICK ROUTE NAVIGATION BAR ── */}
      <div className="bg-slate-900 border border-blue-900/60 rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span>⚡</span> One-Tap Quick Route Minimap (Click to launch route immediately):
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Interactive visual route simulation
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {quickRoutePills.map((pill) => {
            const target = CHENNAI_FACILITIES.find((f) => f.id === pill.id);
            return (
              <button
                key={pill.id}
                onClick={() => target && openRoute(target)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white whitespace-nowrap transition-all shadow-sm ${pill.color} active:scale-95`}
              >
                <span className="text-sm">{pill.icon}</span>
                <span>{pill.label}</span>
                <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded">Route →</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── LOCATION SELECTOR & SEARCH ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Where am I at Chennai Central */}
        <div className="flex-1 bg-white border border-blue-200 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">📍</span>
          <div className="flex-1">
            <p className="text-xs font-bold text-blue-900">Where are you at Chennai Central?</p>
            <select
              value={myLocation}
              onChange={(e) => setMyLocation(e.target.value)}
              className="mt-0.5 w-full bg-transparent text-sm text-gray-800 font-semibold focus:outline-none"
            >
              <option value="">-- All Station Areas (Sort by Nearest) --</option>
              <option value="Platform 1">Platform 1 (VIP Porch & Express Line)</option>
              <option value="Platform 5">Platform 5 (Island Platform)</option>
              <option value="Concourse">Main Concourse (Gate 1 & Booking Hall)</option>
              <option value="Foot Over Bridge">Foot Over Bridge (FOB Overhead)</option>
              <option value="Moore Market">Moore Market Suburban Complex (Gate 2)</option>
            </select>
          </div>
          {myLocation && (
            <button
              onClick={() => setMyLocation('')}
              className="text-xs text-red-500 font-bold hover:underline"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative sm:w-72">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Restroom 1, ATM, Food..."
            className="w-full pl-10 pr-8 py-3.5 bg-white border border-gray-300 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── CATEGORY FILTER PILLS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
              activeCategory === cat.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* ── RESULTS HEADER ── */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 px-1">
        <span>
          Showing <strong className="text-gray-900 font-bold">{filtered.length}</strong> facilities
          {myLocation && <span className="text-blue-600 font-semibold ml-1">near {myLocation}</span>}
        </span>
        <span className="text-cyan-700 font-semibold flex items-center gap-1">
          <span>💡</span> Press any card to launch interactive Minimap
        </span>
      </div>

      {/* ── FACILITIES GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((fac) => (
          <div
            key={fac.id}
            onClick={() => openRoute(fac)}
            className="group cursor-pointer bg-white rounded-3xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200 p-5 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top Indicator Strip */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-3xl shadow-sm transition-colors flex-shrink-0">
                  {fac.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base leading-tight group-hover:text-blue-600 transition-colors">
                    {fac.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                      {fac.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-gray-500 font-medium">
                      {fac.platform}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status / Crowd */}
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white uppercase ${crowdBgClass(
                    fac.crowdLevel
                  )}`}
                >
                  {fac.crowdLevel}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    fac.isAvailable ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {fac.isAvailable ? '● Open' : '● Maintenance'}
                </span>
              </div>
            </div>

            {/* Description & Details */}
            <div className="mt-4 space-y-2 text-xs text-gray-600">
              <p className="line-clamp-2">
                <strong className="text-gray-800">Location:</strong> {fac.locationDesc}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="bg-yellow-50 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded-lg font-semibold text-[11px]">
                  📏 {fac.distance} (~{fac.walkTime})
                </span>
                {fac.wheelchairAccessible && (
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg font-bold text-[11px] flex items-center gap-1">
                    <span>♿</span> Barrier-Free
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Launch Button */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openRoute(fac);
                }}
                className="flex-1 py-2.5 px-3 bg-slate-900 group-hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>🗺️</span>
                <span>Open Route Minimap</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speak(
                    `${fac.name} at Chennai Central. ${fac.locationDesc}. Walking distance is ${fac.distance}. Current crowd is ${fac.crowdLevel}.`
                  );
                }}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs transition-colors"
                title={`Listen audio guidance for ${fac.name}`}
              >
                <span>🔊</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-200">
          <span className="text-4xl block mb-2">🔍</span>
          <h3 className="text-lg font-bold text-gray-800">No facilities match your search</h3>
          <p className="text-sm text-gray-500 mt-1">Try clearing filters or searching for "Restroom" or "ATM".</p>
        </div>
      )}

      {/* ── ACTIVE ROUTE MINIMAP MODAL ── */}
      {routeFac && <RouteMinimap fac={routeFac} onClose={() => setRouteFac(null)} />}
    </div>
  );
}
