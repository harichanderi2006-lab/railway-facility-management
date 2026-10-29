import React, { useState, useMemo, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAccessibility } from '../context/AccessibilityContext';

// ─────────────────────────────────────────────────────────────
// CHENNAI CENTRAL (MAS) STATION LAYOUT CONSTANTS
// ─────────────────────────────────────────────────────────────
const MAP_W = 1000;
const MAP_H = 680;

// All clickable facilities with SVG coords + route path from MAIN GATE 1
const FACILITIES = [
  {
    id: 'f-1', name: 'AC Executive Lounge', category: 'Waiting', icon: '🛋️',
    x: 145, y: 175, floor: 'Platform 1', crowdLevel: 'medium', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'Free RailWire Wi-Fi, mobile charging docks, accessible sofa lounge',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1 (EVR Periyar Salai)' },
      { x: 500, y: 570, label: 'Central Concourse' },
      { x: 280, y: 570, label: 'Turn Left to P1 Ramp' },
      { x: 280, y: 470, label: 'Booking Arcade' },
      { x: 180, y: 350, label: 'VIP Corridor' },
      { x: 145, y: 175, label: 'AC Executive Lounge ✅' },
    ],
    steps: [
      'Enter Chennai Central Gate 1',
      'Walk through the Central Concourse hall',
      'Turn left towards Booking Arcade & Platform 1 ramp',
      'Follow the tactile path to the VIP corridor',
      'AC Executive Lounge is on your right (glass sliding doors)',
    ],
  },
  {
    id: 'f-2', name: 'Restroom 1 (Platform 1)', category: 'Toilet', icon: '🚻',
    x: 235, y: 175, floor: 'Platform 1', crowdLevel: 'low', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'Divyangjan accessible, Braille door plaque, emergency alarm pull cord, baby care station',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Central Concourse' },
      { x: 280, y: 570, label: 'P1 Accessible Ramp' },
      { x: 280, y: 470, label: 'Platform 1 Entry' },
      { x: 235, y: 175, label: 'Restroom 1 (Platform 1) ✅' },
    ],
    steps: [
      'Enter via Main Gate 1 (EVR Periyar Salai)',
      'Walk straight into the Main Concourse Hall',
      'Take the tactile ramp on the left to Platform 1',
      'Walk 25 meters down Platform 1 near Pillar A2',
      'Restroom 1 is on your right with wheelchair sliding door',
    ],
  },
  {
    id: 'f-3', name: 'Restroom 2 (Platform 5)', category: 'Toilet', icon: '🚻',
    x: 680, y: 320, floor: 'Platform 5', crowdLevel: 'high', isAvailable: true,
    wheelchairAccessible: false,
    desc: 'Mid-platform 5 near Pillar 22. Cleaned every 30 mins.',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse' },
      { x: 450, y: 470, label: 'FOB Access Bridge' },
      { x: 450, y: 350, label: 'FOB Overhead Span' },
      { x: 680, y: 320, label: 'Restroom 2 (Platform 5) ✅' },
    ],
    steps: [
      'Enter Main Gate 1 and walk into the Concourse',
      'Proceed to Foot Over Bridge (FOB Tower B)',
      'Take stairs or Elevator 2 to cross toward Platform 5',
      'Descend to Platform 5 near Coach S6 position',
      'Restroom 2 is straight ahead beside Pillar 22',
    ],
  },
  {
    id: 'f-4', name: 'Medical Emergency Booth', category: 'Medical', icon: '🏥',
    x: 160, y: 340, floor: 'Ground', crowdLevel: 'low', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'Railway Doctor 24/7, AED defibrillator, oxygen, stretchers. Ph: 044-25354111',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse' },
      { x: 220, y: 570, label: 'Moore Market Corridor' },
      { x: 160, y: 470, label: 'Station Master Wing' },
      { x: 160, y: 340, label: 'Medical Emergency Booth ✅' },
    ],
    steps: [
      'Enter Main Gate 1 or Gate 2 (Moore Market side)',
      'Head left toward the Station Superintendent office',
      'Medical Booth is adjacent to Station Master Office',
      'Emergency helpline: 044-25354111 / 139',
    ],
  },
  {
    id: 'f-5', name: 'Wheelchair / Sahayata Desk', category: 'Wheelchair', icon: '♿',
    x: 450, y: 480, floor: 'Concourse', crowdLevel: 'low', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'Free battery cart buggy to all 17 platforms, manual wheelchair loan',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse Entry' },
      { x: 450, y: 480, label: 'Sahayata Kendra (Buggy Desk) ✅' },
    ],
    steps: [
      'Enter Main Gate 1',
      'Walk 30 meters straight into the grand concourse hall',
      'Blue illuminated desk straight ahead: Divyangjan Sahayata Kendra',
    ],
  },
  {
    id: 'f-6', name: 'Elevator 1 (Concourse to FOB)', category: 'Elevator', icon: '🛗',
    x: 390, y: 190, floor: 'Platform 1', crowdLevel: 'medium', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'Capacity 13 persons / 2 wheelchairs, voice floor readout in Tamil/English/Hindi',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse' },
      { x: 390, y: 570, label: 'FOB Tower A' },
      { x: 390, y: 350, label: 'Elevator Shaft' },
      { x: 390, y: 190, label: 'Elevator 1 ✅' },
    ],
    steps: [
      'Enter Main Gate 1, proceed towards Platform 1 corridor',
      'Locate FOB Tower A glass elevator shaft on the right',
      'Direct level lift service to the overhead footbridge',
    ],
  },
  {
    id: 'f-7', name: 'Elevator 2 (Platform 5)', category: 'Elevator', icon: '🛗',
    x: 510, y: 315, floor: 'Platform 5', crowdLevel: 'low', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'Connects overhead FOB to Platform 5 & island berths',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse' },
      { x: 460, y: 470, label: 'FOB Bridge Walk' },
      { x: 510, y: 315, label: 'Elevator 2 (Platform 5) ✅' },
    ],
    steps: [
      'From Concourse or Platform 1, cross via FOB Bridge walkway',
      'Take Elevator 2 at Tower B down to Platform 5 surface',
    ],
  },
  {
    id: 'f-8', name: 'IRCTC Food Plaza & Saravana Bhavan', category: 'Food', icon: '🍱',
    x: 700, y: 540, floor: 'Concourse', crowdLevel: 'high', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'South Indian meals, idli, dosa, cafeteria with low wheelchair counter',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse' },
      { x: 700, y: 570, label: 'East Arcade' },
      { x: 700, y: 540, label: 'IRCTC Food Plaza ✅' },
    ],
    steps: [
      'Enter Main Gate 1',
      'Turn right into the Main Concourse East Arcade',
      'IRCTC Food Plaza is on your left with wide sliding doors',
    ],
  },
  {
    id: 'f-9', name: 'Higginbothams Bookstall', category: 'Shop', icon: '📚',
    x: 820, y: 540, floor: 'Concourse', crowdLevel: 'low', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'Heritage bookstall, Tamil/English dailies, novels, maps, travel essentials',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse' },
      { x: 820, y: 570, label: 'East Arcade' },
      { x: 820, y: 540, label: 'Higginbothams Bookstall ✅' },
    ],
    steps: [
      'Enter Main Gate 1, turn right into the grand concourse hall',
      'Higginbothams heritage bookshop is near Platform 1 entrance',
    ],
  },
  {
    id: 'f-10', name: 'Indian Bank 24×7 ATM', category: 'ATM', icon: '🏧',
    x: 195, y: 480, floor: 'Concourse', crowdLevel: 'low', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'Talking ATM with audio headphone jack for blind passengers, Braille keypad',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse' },
      { x: 195, y: 570, label: 'Ticket Hall Wing' },
      { x: 195, y: 480, label: 'Indian Bank ATM ✅' },
    ],
    steps: [
      'Enter Gate 1 Main Entrance',
      'Turn immediate left into the Ticket Booking Wing',
      'Indian Bank talking ATM kiosk is near Counter 1',
    ],
  },
  {
    id: 'f-11', name: 'Priority Ticket Counter 1', category: 'Ticket', icon: '🎟️',
    x: 290, y: 500, floor: 'Concourse', crowdLevel: 'medium', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'Dedicated low counter for Senior Citizens & Divyangjan passengers',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse' },
      { x: 290, y: 570, label: 'Booking Hall Entry' },
      { x: 290, y: 500, label: 'Counter 1 (Priority) ✅' },
    ],
    steps: [
      'Enter via Gate 1, walk into Booking Hall on the left',
      'Counter 1 has dedicated blue signage for Senior Citizens & Persons with Disabilities',
    ],
  },
  {
    id: 'f-12', name: 'RO Drinking Water Booth', category: 'Food', icon: '💧',
    x: 760, y: 315, floor: 'Platform 5', crowdLevel: 'low', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'Purified chilled drinking water kiosk. Free glass water & ₹5 refill. Wheelchair height accessible drinking tap.',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse' },
      { x: 460, y: 470, label: 'FOB Walkway' },
      { x: 760, y: 470, label: 'Platform 5 Surface' },
      { x: 760, y: 315, label: 'RO Water Booth ✅' },
    ],
    steps: [
      'Cross to Platform 5 via Foot Over Bridge or level track ramp',
      'Walk along Platform 5 toward Coach S4 position near Pillar 18',
    ],
  },
  {
    id: 'f-13', name: 'Cloak Room & Luggage Lockers', category: 'Shop', icon: '🧳',
    x: 760, y: 540, floor: 'Concourse', crowdLevel: 'low', isAvailable: true,
    wheelchairAccessible: true,
    desc: 'Safe electronic smart luggage lockers and 24-hr manual baggage deposit. Rate: ₹30/day.',
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse' },
      { x: 760, y: 565, label: 'Parcel Arcade' },
      { x: 760, y: 540, label: 'Luggage Cloak Room ✅' },
    ],
    steps: [
      'From Main Concourse, take south-east corridor toward Gate 4',
      'Cloak Room is right opposite Railway Parcel Office with scanner',
    ],
  },
];

// Chennai Central Platforms
const PLATFORMS = [
  {
    id: 'plt-1', name: 'Platform 1 (MAS Express Berth)', icon: '🚉',
    rectX: 60, rectY: 100, rectW: 880, rectH: 140,
    crowdLevel: 'low',
    trains: [
      '12695 Chennai–TVC Superfast (18:30)',
      '22653 Vande Bharat Express (06:00)',
      '12658 Bangalore Mail (21:30)',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Central Concourse' },
      { x: 280, y: 570, label: 'Platform 1 Ramp' },
      { x: 280, y: 350, label: 'Tactile Pathway' },
      { x: 280, y: 140, label: 'Platform 1 Berth ✅' },
    ],
    steps: [
      'Enter via Main Gate 1 (EVR Periyar Salai)',
      'Walk through the Main Concourse Hall',
      'Follow the tactile bright yellow guide on the left',
      'Take the gentle gradient ramp onto Platform 1 surface',
      'Platform 1 — Accommodates 24-coach Express & Vande Bharat trains',
    ],
  },
  {
    id: 'plt-2', name: 'Platform 2 & 3 (Main Line Arrivals)', icon: '🚉',
    rectX: 60, rectY: 265, rectW: 880, rectH: 120,
    crowdLevel: 'high',
    trains: [
      '12163 Chennai–Dadar SF (18:55)',
      '12621 Tamil Nadu Express (07:10)',
      '22625 Double Decker Express (20:00)',
    ],
    route: [
      { x: 500, y: 648, label: 'Main Gate 1' },
      { x: 500, y: 570, label: 'Concourse' },
      { x: 450, y: 470, label: 'FOB Elevator 1 / Ramp' },
      { x: 450, y: 265, label: 'Platform 2 & 3 ✅' },
    ],
    steps: [
      'Enter Main Gate 1 and walk into Concourse Center',
      'Take Foot Over Bridge (FOB) via Elevator 1 or Ramp B',
      'Descend directly onto Platform 2/3 Island Platform',
      'Platform 2 & 3 — Main Line arrivals and departures',
    ],
  },
];

const crowdColor = (level) =>
  level === 'low' ? '#22c55e' : level === 'medium' ? '#eab308' : '#ef4444';

const crowdBg = (level) =>
  level === 'low' ? 'bg-green-500' : level === 'medium' ? 'bg-yellow-400' : 'bg-red-500';

// ─────────────────────────────────────────────────────────────
// MINIMAP ROUTE PANEL
// ─────────────────────────────────────────────────────────────
function RouteMinimap({ target, onClose }) {
  const [step, setStep] = useState(0);
  const route = target.route || [];
  const steps = target.steps || [];

  // Auto-advance animation
  useEffect(() => {
    setStep(0);
    const timer = setInterval(() => {
      setStep((s) => (s < route.length - 1 ? s + 1 : s));
    }, 1000);
    return () => clearInterval(timer);
  }, [target.id, route.length]);

  const pathD = route
    .slice(0, step + 1)
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 0.28} ${p.y * 0.28}`)
    .join(' ');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-600/30 border border-cyan-400/50 flex items-center justify-center text-2xl">
              {target.icon}
            </div>
            <div>
              <h3 className="text-white font-extrabold text-base sm:text-lg">{target.name}</h3>
              <p className="text-cyan-300 text-xs">
                {target.floor || target.desc} • Dr. M.G.R. Chennai Central (MAS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Mini Route Map SVG */}
          <div className="flex-1 bg-slate-950 p-4 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div className="w-full">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2 text-center">
                Walking Route from Main Gate 1
              </p>
              <svg
                viewBox={`0 0 ${MAP_W * 0.28} ${MAP_H * 0.28}`}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950"
                style={{ maxHeight: 240 }}
              >
                <rect width={MAP_W * 0.28} height={MAP_H * 0.28} fill="#090d16" />
                {/* Mini tracks */}
                <rect x={60 * 0.28} y={85 * 0.28} width={880 * 0.28} height={10 * 0.28} fill="#1e3a5f" rx="1.5" />
                <rect x={60 * 0.28} y={248 * 0.28} width={880 * 0.28} height={10 * 0.28} fill="#0f2942" rx="1.5" />
                <rect x={60 * 0.28} y={395 * 0.28} width={880 * 0.28} height={9 * 0.28} fill="#0f172a" rx="1.5" />

                {/* Mini Platform 1 */}
                <rect
                  x={60 * 0.28}
                  y={100 * 0.28}
                  width={880 * 0.28}
                  height={140 * 0.28}
                  fill="#172554"
                  stroke="#2563eb"
                  strokeWidth="0.8"
                  rx="3"
                  opacity="0.85"
                />
                <text x={80 * 0.28} y={122 * 0.28} fill="#93c5fd" fontSize="5.5" fontWeight="bold">
                  PLATFORM 1 (MAS EXPRESS)
                </text>

                {/* Mini Platform 2 */}
                <rect
                  x={60 * 0.28}
                  y={265 * 0.28}
                  width={880 * 0.28}
                  height={120 * 0.28}
                  fill="#0c4a6e"
                  stroke="#0284c7"
                  strokeWidth="0.8"
                  rx="3"
                  opacity="0.85"
                />
                <text x={80 * 0.28} y={285 * 0.28} fill="#7dd3fc" fontSize="5.5" fontWeight="bold">
                  PLATFORM 2 & 3 (MAIN LINE)
                </text>

                {/* Mini Concourse */}
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
                <text x={80 * 0.28} y={435 * 0.28} fill="#94a3b8" fontSize="5" fontWeight="bold">
                  CONCOURSE (MOORE MARKET)
                </text>

                {/* Mini FOB */}
                <rect
                  x={410 * 0.28}
                  y={85 * 0.28}
                  width={70 * 0.28}
                  height={350 * 0.28}
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="0.8"
                  rx="2"
                  opacity="0.6"
                />

                {/* Animated route path */}
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

                {/* Waypoint dots */}
                {route.slice(0, step + 1).map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.x * 0.28}
                      cy={p.y * 0.28}
                      r={i === step ? 5.5 : 3.5}
                      fill={
                        i === route.length - 1
                          ? '#22c55e'
                          : i === 0
                          ? '#f59e0b'
                          : '#00f0ff'
                      }
                      stroke="#020617"
                      strokeWidth="1.2"
                    />
                  </g>
                ))}

                {/* Start marker */}
                <text x={route[0]?.x * 0.28} y={route[0]?.y * 0.28 + 12} fill="#f59e0b" fontSize="5" textAnchor="middle">
                  GATE 1
                </text>
                {/* End marker */}
                {step === route.length - 1 && (
                  <text
                    x={(target.x || route[route.length - 1]?.x) * 0.28}
                    y={(target.y || route[route.length - 1]?.y) * 0.28 + 14}
                    fill="#22c55e"
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    DESTINATION
                  </text>
                )}
              </svg>
            </div>

            {/* Progress bar */}
            <div className="w-full mt-3">
              <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-green-400 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${((step + 1) / route.length) * 100}%` }}
                />
              </div>
              <p className="text-slate-500 text-xs text-center mt-1">
                Step {Math.min(step + 1, steps.length)} of {steps.length}
              </p>
            </div>
          </div>

          {/* Step-by-step directions */}
          <div className="md:w-72 p-4 bg-slate-900 flex flex-col justify-between">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-3 font-bold">
                Directions
              </p>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    onClick={() => setStep(i)}
                    className={`cursor-pointer flex items-start gap-2.5 p-2 rounded-xl transition-all ${
                      i === Math.min(step, steps.length - 1)
                        ? 'bg-blue-900/80 border-2 border-cyan-400 text-white'
                        : i < step
                        ? 'bg-slate-800/60 text-slate-300'
                        : 'opacity-40 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                        i < step
                          ? 'bg-green-600 text-white'
                          : i === Math.min(step, steps.length - 1)
                          ? 'bg-cyan-400 text-black'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {i < step ? '✓' : i + 1}
                    </div>
                    <p className="text-xs leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>

              {/* Facility info */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                {target.crowdLevel && (
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${crowdBg(target.crowdLevel)}`} />
                    <span className="capitalize">Crowd Level: {target.crowdLevel}</span>
                  </div>
                )}
                {target.wheelchairAccessible !== undefined && (
                  <div className="flex items-center gap-2">
                    <span>{target.wheelchairAccessible ? '♿' : '⚠️'}</span>
                    <span>
                      {target.wheelchairAccessible
                        ? 'Barrier-Free Tactile Route'
                        : 'Steps / Stairs Required'}
                    </span>
                  </div>
                )}
                {target.trains && (
                  <div className="space-y-1 pt-1">
                    <p className="text-slate-300 font-semibold text-[11px]">Next Trains:</p>
                    {target.trains.map((t, i) => (
                      <p key={i} className="text-cyan-300 text-[11px] pl-2 border-l border-cyan-700">
                        {t}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-medium"
              >
                ↺ Restart
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 text-xs bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl font-bold transition-colors"
              >
                Got it ✓
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN CHENNAI CENTRAL STATION MAP COMPONENT
// ─────────────────────────────────────────────────────────────
export default function StationMap() {
  const { speak, screenReaderMode } = useAccessibility();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showAccessible, setShowAccessible] = useState(true);
  const [routeTarget, setRouteTarget] = useState(null); // opens minimap
  const [hoveredId, setHoveredId] = useState(null);

  const categories = ['ALL', 'Toilet', 'Medical', 'Food', 'ATM', 'Elevator', 'Wheelchair', 'Ticket', 'Shop'];

  const filtered = useMemo(() => {
    return FACILITIES.filter((f) => {
      const matchCat = activeCategory === 'ALL' || f.category === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const openRoute = (target) => {
    setRouteTarget(target);
    if (screenReaderMode) speak(`Opening route to ${target.name} at Chennai Central`);
  };

  return (
    <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* ── TOP BAR ── */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <h2 className="text-white font-extrabold text-lg sm:text-xl">
              Dr. M.G.R. Chennai Central (MAS) — Interactive Station Map
            </h2>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            Click any facility (such as Restroom 1) or Platform to launch the turn-by-turn route minimap
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Restroom 1, ATM..."
              className="pl-8 pr-8 py-2 text-sm bg-slate-800 border border-slate-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 w-48"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Accessible toggle */}
          <button
            onClick={() => setShowAccessible(!showAccessible)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
              showAccessible
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900'
                : 'bg-slate-800 text-slate-400 border border-slate-600'
            }`}
          >
            ♿ <span className="hidden sm:inline">{showAccessible ? 'Tactile Route ON' : 'Route OFF'}</span>
          </button>
        </div>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex gap-1.5 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── MAIN SVG MAP ── */}
      <div className="relative overflow-x-auto bg-slate-950 flex justify-center p-3 select-none">
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="w-full rounded-2xl border border-slate-800"
          style={{ minWidth: 700, maxWidth: 1100, background: '#020617' }}
          role="img"
          aria-label="Dr. M.G.R. Chennai Central Interactive Railway Station Layout"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f172a" strokeWidth="1" />
            </pattern>
            <pattern id="railTie" width="24" height="14" patternUnits="userSpaceOnUse">
              <rect x="0" y="1" width="24" height="2.5" fill="#334155" />
              <rect x="0" y="9" width="24" height="2.5" fill="#334155" />
              <rect x="10" y="0" width="3" height="14" fill="#1e293b" />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="cyanGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="p1Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="p2Grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0c2340" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="concGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect width={MAP_W} height={MAP_H} fill="url(#grid)" />

          {/* ── CHENNAI CENTRAL TRACKS ── */}
          {/* Track 1 (MAS Terminal Track) */}
          <rect x="60" y="76" width="880" height="22" fill="url(#railTie)" rx="3" />
          <line x1="60" y1="78" x2="940" y2="78" stroke="#475569" strokeWidth="2.5" />
          <line x1="60" y1="96" x2="940" y2="96" stroke="#475569" strokeWidth="2.5" />
          <text x="75" y="72" fill="#64748b" fontSize="10" fontWeight="bold" letterSpacing="1">
            TRACK 1 (UP LINE — Towards Arakkonam / Bengaluru / Coimbatore)
          </text>

          {/* Track 2 & 3 */}
          <rect x="60" y="244" width="880" height="20" fill="url(#railTie)" rx="3" />
          <line x1="60" y1="246" x2="940" y2="246" stroke="#334155" strokeWidth="2" />
          <line x1="60" y1="262" x2="940" y2="262" stroke="#334155" strokeWidth="2" />
          <text x="75" y="242" fill="#475569" fontSize="10" fontWeight="bold">
            TRACK 2 & 3 (Central Yard Passenger Leads)
          </text>

          {/* Track 4 (Suburban Leads) */}
          <rect x="60" y="390" width="880" height="18" fill="url(#railTie)" rx="3" />
          <line x1="60" y1="392" x2="940" y2="392" stroke="#334155" strokeWidth="2" />
          <text x="75" y="388" fill="#475569" fontSize="10" fontWeight="bold">
            TRACK 4 & 5 (Towards Chennai Beach / Moore Market Complex)
          </text>

          {/* ── PLATFORM 1 ── (clickable) */}
          {PLATFORMS.slice(0, 1).map((plt) => (
            <g key={plt.id} className="cursor-pointer" onClick={() => openRoute(plt)}>
              <rect
                x={plt.rectX}
                y={plt.rectY}
                width={plt.rectW}
                height={plt.rectH}
                fill="url(#p1Grad)"
                stroke="#3b82f6"
                strokeWidth="2"
                rx="6"
              />
              {/* Tactile yellow edge */}
              <rect x={plt.rectX} y={plt.rectY} width={plt.rectW} height="7" fill="#eab308" rx="3" />
              <rect x={plt.rectX} y={plt.rectY + plt.rectH - 7} width={plt.rectW} height="7" fill="#eab308" />

              {/* Label */}
              <rect x="75" y="112" width="230" height="28" rx="6" fill="#1d4ed8" />
              <text x="88" y="131" fill="#fff" fontSize="13" fontWeight="bold">
                🚉 PLATFORM 1 (MAS EXPRESS)
              </text>
              <text x="315" y="131" fill="#93c5fd" fontSize="11">
                (Vande Bharat · Bangalore Mail · TVC Superfast)
              </text>

              {/* Crowd badge */}
              <circle cx="880" cy="126" r="10" fill={crowdColor(plt.crowdLevel)} />
              <text x="880" y="131" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">
                LOW
              </text>

              {/* AC Lounge Area */}
              <rect
                x="75"
                y="145"
                width="145"
                height="80"
                fill="#0f172a"
                stroke="#334155"
                strokeDasharray="4 3"
                rx="4"
              />
              <text x="85" y="168" fill="#94a3b8" fontSize="10" fontWeight="bold">
                🛋️ AC Waiting Lounge
              </text>
              <text x="85" y="185" fill="#475569" fontSize="9">
                VIP Entry • Tactile guide
              </text>

              <text
                x={plt.rectX + plt.rectW / 2}
                y={plt.rectY + plt.rectH - 14}
                fill="#3b82f6"
                fontSize="9"
                textAnchor="middle"
                fontStyle="italic"
              >
                👆 Click Platform 1 to see route & upcoming trains
              </text>
            </g>
          ))}

          {/* ── PLATFORM 2 ── (clickable) */}
          {PLATFORMS.slice(1).map((plt) => (
            <g key={plt.id} className="cursor-pointer" onClick={() => openRoute(plt)}>
              <rect
                x={plt.rectX}
                y={plt.rectY}
                width={plt.rectW}
                height={plt.rectH}
                fill="url(#p2Grad)"
                stroke="#0369a1"
                strokeWidth="1.5"
                rx="6"
              />
              <rect x={plt.rectX} y={plt.rectY} width={plt.rectW} height="7" fill="#eab308" rx="3" />
              <rect x={plt.rectX} y={plt.rectY + plt.rectH - 7} width={plt.rectW} height="7" fill="#eab308" />

              <rect x="75" y="276" width="240" height="28" rx="6" fill="#075985" />
              <text x="88" y="295" fill="#fff" fontSize="13" fontWeight="bold">
                🚉 PLATFORM 2 & 3 (MAIN LINE)
              </text>
              <text x="325" y="295" fill="#7dd3fc" fontSize="11">
                (Tamil Nadu Exp · Dadar SF · Double Decker)
              </text>

              <circle cx="880" cy="310" r="10" fill={crowdColor(plt.crowdLevel)} />
              <text x="880" y="315" fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">
                RUSH
              </text>

              <text
                x={plt.rectX + plt.rectW / 2}
                y={plt.rectY + plt.rectH - 14}
                fill="#0369a1"
                fontSize="9"
                textAnchor="middle"
                fontStyle="italic"
              >
                👆 Click Platform 2 to see route
              </text>
            </g>
          ))}

          {/* ── FOOT OVER BRIDGE ── */}
          <rect x="410" y="76" width="80" height="374" fill="#1e293b" stroke="#475569" strokeWidth="1.5" rx="6" opacity="0.85" />
          <text
            x="450"
            y="268"
            fill="#94a3b8"
            fontSize="11"
            fontWeight="bold"
            transform="rotate(-90 450 268)"
            textAnchor="middle"
          >
            FOOT OVER BRIDGE (OVERHEAD WALKWAY)
          </text>

          {/* ── MAIN CONCOURSE ── */}
          <rect x="60" y="412" width="880" height="210" fill="url(#concGrad)" stroke="#334155" strokeWidth="2" rx="10" />

          {/* Booking Hall */}
          <rect x="80" y="445" width="270" height="145" fill="#0f172a" stroke="#1e3a5f" strokeWidth="1" rx="5" />
          <text x="92" y="465" fill="#38bdf8" fontSize="11" fontWeight="bold">
            🎫 Moore Market Booking Hall
          </text>
          <text x="92" y="480" fill="#64748b" fontSize="9">
            Counter 1: Senior Citizens & Divyangjan
          </text>

          {/* Concourse Label */}
          <rect x="360" y="445" width="280" height="30" rx="5" fill="#0c2340" />
          <text x="375" y="465" fill="#94a3b8" fontSize="12" fontWeight="bold">
            DR. M.G.R. CHENNAI CENTRAL CONCOURSE
          </text>

          {/* Food Court */}
          <rect x="640" y="445" width="295" height="145" fill="#1a0f00" stroke="#78350f" strokeWidth="1" rx="5" />
          <text x="655" y="465" fill="#f59e0b" fontSize="11" fontWeight="bold">
            🍱 IRCTC Food Plaza & Saravana Bhavan
          </text>
          <text x="655" y="480" fill="#78350f" fontSize="9">
            Wheelchair accessible low-height seating
          </text>

          {/* Main Gate 1 */}
          <rect x="420" y="610" width="160" height="18" fill="#16a34a" rx="3" />
          <text x="500" y="623" fill="#fff" fontSize="10" fontWeight="bold" textAnchor="middle">
            ▲ MAIN ENTRY GATE 1 ▲
          </text>

          {/* ── TACTILE STEP-FREE ACCESSIBLE ROUTE ── */}
          {showAccessible && (
            <g filter="url(#cyanGlow)">
              <path
                d="M 500 628 L 500 565 L 380 565 L 380 440 L 410 415 L 410 270 L 200 270 L 200 240"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="4"
                strokeDasharray="10 6"
                strokeLinecap="round"
              />
              <path
                d="M 410 415 L 480 415 L 480 390 L 480 340"
                fill="none"
                stroke="#00f0ff"
                strokeWidth="4"
                strokeDasharray="10 6"
                strokeLinecap="round"
              />
              {[[500, 565], [380, 565], [380, 440], [410, 350], [480, 340]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="5" fill="#fff" opacity="0.8" />
              ))}
              <rect x="418" y="578" width="130" height="20" rx="4" fill="#020617" stroke="#00f0ff" strokeWidth="1" />
              <text x="426" y="592" fill="#00f0ff" fontSize="10" fontWeight="bold">
                ♿ Tactile Guide Route
              </text>
            </g>
          )}

          {/* ── CLICKABLE FACILITY NODES ── */}
          {filtered.map((fac) => {
            const isHovered = hoveredId === fac.id;
            const cc = crowdColor(fac.crowdLevel);
            return (
              <g
                key={fac.id}
                className="cursor-pointer"
                onClick={() => openRoute(fac)}
                onMouseEnter={() => setHoveredId(fac.id)}
                onMouseLeave={() => setHoveredId(null)}
                tabIndex={0}
                role="button"
                aria-label={`${fac.name} — click to view route`}
              >
                {isHovered && (
                  <circle cx={fac.x} cy={fac.y} r="32" fill="none" stroke={cc} strokeWidth="2" opacity="0.4" />
                )}
                <circle
                  cx={fac.x}
                  cy={fac.y}
                  r="22"
                  fill="#0f172a"
                  stroke={cc}
                  strokeWidth={isHovered ? 3 : 2}
                  filter={isHovered ? 'url(#glow)' : undefined}
                />
                <text x={fac.x} y={fac.y + 7} fontSize="18" textAnchor="middle">
                  {fac.icon}
                </text>
                <circle cx={fac.x + 14} cy={fac.y - 14} r="6" fill={cc} stroke="#020617" strokeWidth="1.5" />
                <rect x={fac.x - 46} y={fac.y + 26} width="92" height="16" rx="4" fill="#000" opacity="0.75" />
                <text
                  x={fac.x}
                  y={fac.y + 37}
                  fill="#e2e8f0"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {fac.name.length > 14 ? fac.name.slice(0, 12) + '…' : fac.name}
                </text>
                {isHovered && (
                  <text x={fac.x} y={fac.y - 30} fill="#00f0ff" fontSize="9" textAnchor="middle" fontWeight="bold">
                    → Show Route
                  </text>
                )}
              </g>
            );
          })}

          {/* ── MAP LEGEND ── */}
          <rect x="808" y="418" width="128" height="110" rx="6" fill="#0f172a" stroke="#1e293b" strokeWidth="1" opacity="0.95" />
          <text x="820" y="434" fill="#94a3b8" fontSize="9" fontWeight="bold">
            CHENNAI CENTRAL
          </text>
          <circle cx="820" cy="448" r="5" fill="#22c55e" /><text x="830" y="452" fill="#94a3b8" fontSize="8">Low Crowd</text>
          <circle cx="820" cy="464" r="5" fill="#eab308" /><text x="830" y="468" fill="#94a3b8" fontSize="8">Moderate Crowd</text>
          <circle cx="820" cy="480" r="5" fill="#ef4444" /><text x="830" y="484" fill="#94a3b8" fontSize="8">High Rush</text>
          <line x1="814" y1="497" x2="834" y2="497" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 2" />
          <text x="838" y="501" fill="#00f0ff" fontSize="8">♿ Tactile Path</text>
        </svg>

        {/* Floating Info */}
        <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-3.5 text-xs shadow-xl hidden md:block">
          <p className="text-white font-bold mb-1 flex items-center gap-1.5">
            <span>🚉</span> Dr. M.G.R. Chennai Central
          </p>
          <p className="text-slate-400">Click any amenity (e.g. Restroom 1)</p>
          <p className="text-slate-400">to view animated walking directions</p>
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2">
            <span className="w-3 h-0.5 bg-cyan-400 block rounded" />
            <span className="text-cyan-400 font-semibold">♿ Tactile Accessible Route</span>
          </div>
        </div>
      </div>

      {/* ── QUICK CARDS UNDER MAP ── */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <p className="text-slate-400 text-xs uppercase tracking-widest mb-3 font-semibold">
          Quick Access (Click to view route minimap)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {FACILITIES.slice(0, 12).map((fac) => (
            <button
              key={fac.id}
              onClick={() => openRoute(fac)}
              className="flex flex-col items-center gap-1 p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 rounded-2xl transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{fac.icon}</span>
              <span className="text-slate-200 text-xs text-center leading-tight font-semibold">
                {fac.name.length > 16 ? fac.name.slice(0, 14) + '…' : fac.name}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full text-white font-bold ${crowdBg(fac.crowdLevel)}`}>
                {fac.crowdLevel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── ROUTE MINIMAP MODAL ── */}
      {routeTarget && <RouteMinimap target={routeTarget} onClose={() => setRouteTarget(null)} />}
    </div>
  );
}
