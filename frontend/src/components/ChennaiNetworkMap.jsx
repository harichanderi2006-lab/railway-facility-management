import React, { useState, useEffect } from 'react';

// ─── STATIONS ON CHENNAI TRANSIT NETWORK (Image 3) ──────────────────
export const NETWORK_STATIONS = [
  // West Corridor (Red)
  { id: 'mas', name: 'Chennai Central (MMC)', code: 'MAS', x: 740, y: 350, isTerminus: true, line: 'west', interchange: ['Metro', 'Bus', 'MRTS'] },
  { id: 'bbq', name: 'Basin Bridge Jn', code: 'BBQ', x: 670, y: 320, isTerminus: false, line: 'west', interchange: ['North Line Interchange'] },
  { id: 'vpj', name: 'Vyasarpadi Jeeva', code: 'VPJ', x: 620, y: 320, isTerminus: false, line: 'west', interchange: [] },
  { id: 'per', name: 'Perambur', code: 'PER', x: 560, y: 320, isTerminus: false, line: 'west', interchange: ['Bus Terminus'] },
  { id: 'vjm', name: 'Villivakkam', code: 'VLK', x: 500, y: 320, isTerminus: false, line: 'west', interchange: [] },
  { id: 'abr', name: 'Ambattur', code: 'ABU', x: 440, y: 320, isTerminus: false, line: 'west', interchange: ['Industrial Estate Bus'] },
  { id: 'avd', name: 'Avadi', code: 'AVD', x: 380, y: 320, isTerminus: true, line: 'west', interchange: ['Bus Terminus', 'Military Base'] },
  { id: 'pab', name: 'Pattabiram', code: 'PAB', x: 320, y: 320, isTerminus: false, line: 'west', interchange: [] },
  { id: 'tiru', name: 'Thirunindravur', code: 'TI', x: 260, y: 320, isTerminus: false, line: 'west', interchange: [] },
  { id: 'trl', name: 'Tiruvallur', code: 'TRL', x: 200, y: 320, isTerminus: true, line: 'west', interchange: ['District HQ Bus'] },
  { id: 'kbt', name: 'Kadambattur', code: 'KBT', x: 150, y: 320, isTerminus: false, line: 'west', interchange: [] },
  { id: 'tlg', name: 'Thiruvalangadu', code: 'TLG', x: 110, y: 300, isTerminus: false, line: 'west', interchange: [] },
  { id: 'ajj', name: 'Arakkonam Jn', code: 'AJJ', x: 70, y: 270, isTerminus: true, line: 'west', interchange: ['Katpadi / Tirupati Line'] },

  // North Corridor (Blue)
  { id: 'koko', name: 'Korukkupet', code: 'KOK', x: 670, y: 260, isTerminus: false, line: 'north', interchange: [] },
  { id: 'tondi', name: 'Tondiarpet', code: 'TNP', x: 670, y: 220, isTerminus: false, line: 'north', interchange: [] },
  { id: 'tvt', name: 'Thiruvottiyur', code: 'TVT', x: 670, y: 180, isTerminus: false, line: 'north', interchange: ['Metro Blue Line'] },
  { id: 'wimco', name: 'Wimco Nagar', code: 'WCN', x: 670, y: 150, isTerminus: false, line: 'north', interchange: [] },
  { id: 'enr', name: 'Ennore', code: 'ENR', x: 670, y: 120, isTerminus: false, line: 'north', interchange: ['Port Rail Link'] },
  { id: 'mjr', name: 'Minjur', code: 'MJR', x: 670, y: 90, isTerminus: false, line: 'north', interchange: [] },
  { id: 'pon', name: 'Ponneri', code: 'PON', x: 670, y: 65, isTerminus: false, line: 'north', interchange: [] },
  { id: 'gpd', name: 'Gummidipundi', code: 'GPD', x: 670, y: 40, isTerminus: true, line: 'north', interchange: ['Andhra Border Bus Link'] },
  { id: 'spe', name: 'Sullurpeta', code: 'SPE', x: 670, y: 15, isTerminus: true, line: 'north', interchange: ['Sriharikota / Gudur'] },

  // South Corridor (Green)
  { id: 'msb', name: 'Chennai Beach', code: 'MSB', x: 770, y: 320, isTerminus: true, line: 'south', interchange: ['Port Terminal', 'Ferry'] },
  { id: 'msf', name: 'Chennai Fort', code: 'MSF', x: 770, y: 350, isTerminus: false, line: 'south', interchange: [] },
  { id: 'mpk', name: 'Chennai Park', code: 'MPK', x: 755, y: 375, isTerminus: false, line: 'south', interchange: ['Walk to Central (MAS)'] },
  { id: 'ms', name: 'Chennai Egmore', code: 'MS', x: 710, y: 410, isTerminus: true, line: 'south', interchange: ['Metro Green Line', 'South TN Express'] },
  { id: 'msc', name: 'Chetpet', code: 'MSC', x: 680, y: 435, isTerminus: false, line: 'south', interchange: [] },
  { id: 'nbk', name: 'Nungambakkam', code: 'NBK', x: 650, y: 460, isTerminus: false, line: 'south', interchange: [] },
  { id: 'mbr', name: 'Mambalam', code: 'MBM', x: 615, y: 490, isTerminus: false, line: 'south', interchange: ['T. Nagar Bus Terminus'] },
  { id: 'gdy', name: 'Guindy', code: 'GDY', x: 575, y: 530, isTerminus: false, line: 'south', interchange: ['Metro Blue Line', 'Industrial Hub'] },
  { id: 'stm', name: 'St. Thomas Mount', code: 'STM', x: 540, y: 565, isTerminus: false, line: 'south', interchange: ['Metro Line 2 Interchange'] },
  { id: 'tlm', name: 'Tirusulam (Airport)', code: 'TLM', x: 505, y: 600, isTerminus: false, line: 'south', interchange: ['Chennai International Airport ✈️'] },
  { id: 'tbm', name: 'Tambaram', code: 'TBM', x: 450, y: 650, isTerminus: true, line: 'south', interchange: ['Major South Railway Terminus'] },
  { id: 'cgl', name: 'Chengalpattu Jn', code: 'CGL', x: 380, y: 700, isTerminus: true, line: 'south', interchange: ['Towards Villupuram / Madurai'] },

  // MRTS Elevated Corridor (Orange)
  { id: 'prt', name: 'Park Town', code: 'MPKT', x: 790, y: 365, isTerminus: false, line: 'mrts', interchange: ['Subway to Central MAS'] },
  { id: 'mcpk', name: 'Chintadripet', code: 'MCPK', x: 810, y: 400, isTerminus: false, line: 'mrts', interchange: ['Cooum River Skywalk'] },
  { id: 'cpk', name: 'Chepauk', code: 'MCPK2', x: 825, y: 435, isTerminus: false, line: 'mrts', interchange: ['MA Chidambaram Cricket Stadium 🏏'] },
  { id: 'lh', name: 'Light House', code: 'MLHS', x: 835, y: 470, isTerminus: false, line: 'mrts', interchange: ['Marina Beach Promenade'] },
  { id: 'mkm', name: 'Mundakanni Amman', code: 'MKAK', x: 840, y: 505, isTerminus: false, line: 'mrts', interchange: [] },
  { id: 'myl', name: 'Thirumayilai (Mylapore)', code: 'MTMY', x: 840, y: 540, isTerminus: true, line: 'mrts', interchange: ['Kapaleeshwarar Temple', 'Bus Hub'] },
  { id: 'tvm', name: 'Thiruvanmiyur', code: 'MTVM', x: 830, y: 585, isTerminus: false, line: 'mrts', interchange: ['OMR IT Corridor Expressway'] },
  { id: 'vel', name: 'Velachery', code: 'VLCY', x: 810, y: 640, isTerminus: true, line: 'mrts', interchange: ['MRTS Terminus / St. Thomas Mount Link'] },
];

export default function ChennaiNetworkMap({ selectedTrain, onSelectTrain, activeCorridor = 'all' }) {
  const [hoveredStation, setHoveredStation] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [simProgress, setSimProgress] = useState(0.42); // 0 to 1 along current train route
  const [isSimulating, setIsSimulating] = useState(true);

  // Live simulation tick: gently glides train beacon along its designated line
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setSimProgress((prev) => (prev >= 0.98 ? 0.05 : prev + 0.015));
    }, 700);
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Determine current active train path
  const trainCorridor = selectedTrain?.corridor || 'west';

  // Compute animated train coordinates based on corridor
  const getTrainBeaconPosition = (progress, corridor) => {
    if (corridor === 'west') {
      // West line: starts at MAS (740, 350) -> BBQ (670, 320) -> AJJ (70, 270)
      const startX = 740;
      const endX = 70;
      const curX = startX - progress * (startX - endX);
      const curY = curX > 670 ? 350 - ((740 - curX) / 70) * 30 : 320 - (1 - curX / 670) * 50;
      return { x: curX, y: curY, heading: 'Westbound' };
    } else if (corridor === 'north') {
      // North line: starts at BBQ (670, 320) -> goes north up to SPE (670, 15)
      const curY = 320 - progress * (320 - 15);
      return { x: 670, y: curY, heading: 'Northbound' };
    } else if (corridor === 'south') {
      // South line: starts at MSB (770, 320) -> passes Egmore -> CGL (380, 700)
      const curX = 770 - progress * (770 - 380);
      const curY = 320 + progress * (700 - 320);
      return { x: curX, y: curY, heading: 'Southbound' };
    } else {
      // MRTS line: 790 -> 840 -> 810, Y: 365 -> 640
      const curY = 365 + progress * (640 - 365);
      const curX = 810 + Math.sin(progress * Math.PI) * 30;
      return { x: curX, y: curY, heading: 'Down MRTS' };
    }
  };

  const beacon = getTrainBeaconPosition(simProgress, trainCorridor);

  // Approximate nearest station to the beacon
  const nearestStation = NETWORK_STATIONS.reduce((nearest, st) => {
    const dist = Math.hypot(st.x - beacon.x, st.y - beacon.y);
    return dist < nearest.dist ? { station: st, dist } : nearest;
  }, { station: NETWORK_STATIONS[0], dist: 9999 }).station;

  return (
    <div className="bg-slate-950 rounded-3xl border-2 border-chennai-yellow/40 shadow-2xl overflow-hidden relative text-white">
      {/* ── MAP TOP BANNER (Styled faithful to Image 3 Header) ── */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 border-b-2 border-chennai-yellow flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-2xl border-2 border-chennai-yellow flex items-center justify-center text-2xl shadow-lg">
            🚆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-black text-chennai-yellow text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">
                Image 3 Transit Blueprint
              </span>
              <span className="text-xs text-amber-100 font-semibold hidden sm:inline">
                Southern Railway / MTC Interconnectivity
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow">
              Chennai Suburban Railway Network & Bus Interconnectivity Map
            </h2>
          </div>
        </div>

        {/* Live GPS Telemetry Status */}
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-chennai-yellow/50">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div className="text-left">
            <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
              {isSimulating ? 'Live GPS Signal Active' : 'Simulation Paused'}
            </div>
            <div className="text-xs font-mono font-bold text-white">
              {selectedTrain ? selectedTrain.trainName : '12695 TVC Superfast'} • Platform {selectedTrain?.platform || '1'}
            </div>
          </div>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="ml-2 px-2.5 py-1 text-[11px] bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-lg transition-colors"
          >
            {isSimulating ? '⏸ Pause' : '▶ Resume'}
          </button>
        </div>
      </div>

      {/* ── CORRIDOR COLOR LEGEND BAR ── */}
      <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-4 h-1.5 rounded-full bg-red-600 inline-block" />
            <span className="text-red-400">West Line (Central ↔ Arakkonam)</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-4 h-1.5 rounded-full bg-blue-600 inline-block" />
            <span className="text-blue-400">North Line (Central ↔ Gummidipundi / Sullurpeta)</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-4 h-1.5 rounded-full bg-emerald-600 inline-block" />
            <span className="text-emerald-400">South Line (Beach/Egmore ↔ Tambaram/Chengalpattu)</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-4 h-1.5 rounded-full bg-orange-500 inline-block" />
            <span className="text-orange-400">MRTS Line (Beach ↔ Velachery)</span>
          </div>
        </div>

        <span className="text-slate-400 text-[11px] italic">
          💡 Click any station node on the map to inspect incoming trains
        </span>
      </div>

      {/* ── INTERACTIVE SVG NETWORK MAP CANVAS ── */}
      <div className="relative overflow-x-auto bg-[#fffdf0] p-3 sm:p-5 flex justify-center items-center select-none">
        <svg
          viewBox="0 0 920 740"
          className="w-full max-w-5xl rounded-2xl shadow-2xl border-4 border-slate-900 bg-[#fffbe8]"
          style={{ minWidth: 780 }}
          role="img"
          aria-label="Chennai Suburban Railway Network Map"
        >
          {/* Background Grid Lines from transit blueprint */}
          <defs>
            <pattern id="transitGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f1e6bf" strokeWidth="0.8" />
            </pattern>
            {/* Glow filters */}
            <filter id="trainBeaconGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width="920" height="740" fill="#fffbe8" />
          <rect width="920" height="740" fill="url(#transitGrid)" />

          {/* Geographical Bay of Bengal Blue Coast on East */}
          <path
            d="M 870 0 Q 865 300 870 450 Q 880 600 865 740 L 920 740 L 920 0 Z"
            fill="#dbeafe"
            opacity="0.8"
          />
          <text
            x="895"
            y="370"
            fill="#3b82f6"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="3"
            transform="rotate(90 895 370)"
            textAnchor="middle"
          >
            BAY OF BENGAL (COASTAL CORRIDOR)
          </text>

          {/* ═════ 1. WEST CORRIDOR (RED LINE) ═════ */}
          <path
            d="M 740 350 L 670 320 L 560 320 L 440 320 L 380 320 L 200 320 L 150 320 L 70 270"
            fill="none"
            stroke="#dc2626"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* West extensions to Katpadi & Tirupati */}
          <path
            d="M 70 270 L 25 210 M 70 270 L 20 330"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="5"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
          <text x="35" y="195" fill="#475569" fontSize="9" fontWeight="bold">To Tirupati / Renigunta ↗</text>
          <text x="25" y="348" fill="#475569" fontSize="9" fontWeight="bold">To Katpadi / Bengaluru ↘</text>

          {/* ═════ 2. NORTH CORRIDOR (BLUE LINE) ═════ */}
          <path
            d="M 670 320 L 670 260 L 670 180 L 670 90 L 670 40 L 670 15"
            fill="none"
            stroke="#2563eb"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* North extension to Gudur / Vijayawada */}
          <path
            d="M 670 15 L 670 0"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="5"
            strokeDasharray="5 3"
          />
          <text x="685" y="18" fill="#1e40af" fontSize="9" fontWeight="bold">To Gudur / Kolkata ↑</text>

          {/* ═════ 3. SOUTH CORRIDOR (GREEN LINE) ═════ */}
          <path
            d="M 770 320 L 770 350 L 755 375 L 710 410 L 650 460 L 615 490 L 575 530 L 505 600 L 450 650 L 380 700"
            fill="none"
            stroke="#16a34a"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* South extension towards Villupuram */}
          <path
            d="M 380 700 L 330 735"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="5"
            strokeDasharray="5 3"
          />
          <text x="340" y="735" fill="#15803d" fontSize="9" fontWeight="bold">To Villupuram / Madurai ↓</text>

          {/* ═════ 4. MRTS ELEVATED LINE (ORANGE) ═════ */}
          <path
            d="M 770 320 L 790 365 L 810 400 L 825 435 L 835 470 L 840 540 L 830 585 L 810 640"
            fill="none"
            stroke="#ea580c"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interchange Loop: Chennai Central (MMC) to Chennai Park & Park Town */}
          <path
            d="M 740 350 L 755 375 L 790 365"
            fill="none"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />

          {/* ═════ 5. STATIONS RENDERING ═════ */}
          {NETWORK_STATIONS.map((st) => {
            const isHovered = hoveredStation?.id === st.id;
            const isSelected = selectedStation?.id === st.id;

            return (
              <g
                key={st.id}
                onClick={() => setSelectedStation(st)}
                onMouseEnter={() => setHoveredStation(st)}
                onMouseLeave={() => setHoveredStation(null)}
                className="cursor-pointer group"
                tabIndex={0}
                role="button"
                aria-label={`${st.name} Railway Station`}
              >
                {/* Outer Ring on Hover / Terminus */}
                {st.isTerminus && (
                  <rect
                    x={st.x - 9}
                    y={st.y - 9}
                    width="18"
                    height="18"
                    rx="3"
                    fill="#0f172a"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                )}

                {/* Station Node Circle */}
                <circle
                  cx={st.x}
                  cy={st.y}
                  r={st.isTerminus ? 6 : 4.5}
                  fill={
                    st.id === 'mas'
                      ? '#facc15'
                      : isHovered || isSelected
                      ? '#ffffff'
                      : '#0f172a'
                  }
                  stroke={
                    st.id === 'mas'
                      ? '#000000'
                      : st.line === 'west'
                      ? '#dc2626'
                      : st.line === 'north'
                      ? '#2563eb'
                      : st.line === 'south'
                      ? '#16a34a'
                      : '#ea580c'
                  }
                  strokeWidth={st.id === 'mas' ? 3 : 2}
                  className="transition-transform group-hover:scale-125"
                />

                {/* Station Label */}
                <text
                  x={
                    st.id === 'mas'
                      ? st.x + 12
                      : st.line === 'north'
                      ? st.x + 10
                      : st.line === 'mrts'
                      ? st.x + 10
                      : st.line === 'south'
                      ? st.x - 10
                      : st.x
                  }
                  y={
                    st.id === 'mas'
                      ? st.y + 4
                      : st.line === 'north'
                      ? st.y + 3
                      : st.line === 'mrts'
                      ? st.y + 3
                      : st.line === 'south'
                      ? st.y + 4
                      : st.y - 9
                  }
                  textAnchor={
                    st.id === 'mas'
                      ? 'start'
                      : st.line === 'north' || st.line === 'mrts'
                      ? 'start'
                      : st.line === 'south'
                      ? 'end'
                      : 'middle'
                  }
                  fill={st.id === 'mas' ? '#991b1b' : '#0f172a'}
                  fontSize={st.id === 'mas' ? '12' : st.isTerminus ? '9.5' : '8'}
                  fontWeight={st.id === 'mas' || st.isTerminus ? '900' : '700'}
                  className="select-none pointer-events-none drop-shadow-sm font-sans"
                >
                  {st.name}
                </text>
              </g>
            );
          })}

          {/* ═════ 6. CENTRAL TERMINUS HIGHLIGHT SIGN (Image 4 Board) ═════ */}
          <g transform="translate(685, 365)" className="cursor-pointer" onClick={() => setSelectedStation(NETWORK_STATIONS[0])}>
            <rect
              x="0"
              y="0"
              width="155"
              height="38"
              rx="4"
              fill="#facc15"
              stroke="#000000"
              strokeWidth="2.5"
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
            />
            <text x="77" y="12" fill="#000000" fontSize="8" fontWeight="bold" textAnchor="middle">
              சென்னை சென்ட்ரல்
            </text>
            <text x="77" y="23" fill="#000000" fontSize="7.5" fontWeight="bold" textAnchor="middle">
              चेन्नै सेन्ट्रल
            </text>
            <text x="77" y="34" fill="#000000" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="0.5">
              CHENNAI CENTRAL (MAS)
            </text>
          </g>

          {/* ═════ 7. LIVE TRAIN MOVING BEACON (Live GPS Tracker) ═════ */}
          <g transform={`translate(${beacon.x}, ${beacon.y})`} filter="url(#trainBeaconGlow)">
            {/* Pulsing Beacon Waves */}
            <circle r="18" fill="#e11d48" opacity="0.3" className="animate-ping" />
            <circle r="12" fill="#ef4444" opacity="0.6" />
            <circle r="7" fill="#ffffff" stroke="#991b1b" strokeWidth="2" />
            <text y="4" fontSize="11" textAnchor="middle">
              🚆
            </text>

            {/* Float Speed & Name Badge */}
            <g transform="translate(0, -22)">
              <rect x="-45" y="-12" width="90" height="18" rx="4" fill="#0f172a" stroke="#facc15" strokeWidth="1.2" />
              <text x="0" y="1" fill="#facc15" fontSize="8.5" fontWeight="900" textAnchor="middle">
                LIVE: {selectedTrain?.trainNumber || '12695'} • {Math.round(65 + Math.sin(simProgress * 10) * 20)} km/h
              </text>
            </g>
          </g>
        </svg>

        {/* ── FLOATING ROUTE TELEMETRY WIDGET (Bottom Right Overlay) ── */}
        <div className="absolute bottom-5 right-5 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border-2 border-chennai-yellow text-white max-w-xs shadow-2xl space-y-2">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold text-xs uppercase text-amber-300">
                Live GPS Tracker Telemetry
              </span>
            </div>
            <span className="text-[10px] bg-red-950 text-red-300 border border-red-700 px-1.5 py-0.5 rounded font-mono">
              REAL-TIME
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Tracked Train:</span>
              <span className="font-bold text-white text-right">
                {selectedTrain ? selectedTrain.trainName : 'Chennai–TVC Superfast (12695)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Position:</span>
              <span className="font-bold text-emerald-400">Near {nearestStation.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Platform at MAS:</span>
              <span className="font-bold text-amber-300">
                {selectedTrain?.platform || 'Platform 1'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Live Speed:</span>
              <span className="font-mono font-bold text-cyan-300">
                {Math.round(65 + Math.sin(simProgress * 10) * 20)} km/h
              </span>
            </div>
          </div>

          {/* Quick Step Bar */}
          <div className="pt-2">
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-red-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.round(simProgress * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Origin</span>
              <span className="text-amber-300 font-bold">{Math.round(simProgress * 100)}% en route</span>
              <span>Chennai Central</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATION INSPECTOR MODAL (When clicking any station on map) ── */}
      {selectedStation && (
        <div className="p-4 bg-slate-900 border-t-2 border-chennai-yellow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black font-black flex items-center justify-center text-base border-2 border-white shadow">
              {selectedStation.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-white text-base">
                  {selectedStation.name} Railway Station
                </h4>
                <span className="text-xs uppercase px-2 py-0.5 rounded-full font-bold bg-slate-800 text-amber-300 border border-slate-700">
                  {selectedStation.line.toUpperCase()} CORRIDOR
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Connected Services:{' '}
                {selectedStation.interchange.length > 0
                  ? selectedStation.interchange.join(' • ')
                  : 'Regular Passenger & Express Halt'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                alert(`Viewing live suburban timetable for ${selectedStation.name}`);
              }}
              className="px-3.5 py-1.5 bg-chennai-yellow hover:bg-yellow-400 text-black font-extrabold text-xs rounded-xl shadow transition-colors"
            >
              🚉 View Station Timetable
            </button>
            <button
              onClick={() => setSelectedStation(null)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
