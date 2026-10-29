import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAccessibility } from '../context/AccessibilityContext';
import LiveTrainTicker from '../components/LiveTrainTicker';
import CrowdBadge from '../components/CrowdBadge';

export default function Dashboard() {
  const { trains, facilities, alerts, zones } = useSocket();
  const { speak, screenReaderMode, highContrast } = useAccessibility();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Keep digital clock active
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live statistics
  const totalTrains = trains.length;
  const delayedTrains = trains.filter((t) => t.status === 'DELAYED').length;
  const activeFacilities = facilities.filter((f) => f.isAvailable).length;
  const activeAlerts = alerts.filter((a) => a.active);

  const quickActions = [
    {
      title: 'Find Restroom',
      desc: 'Wheelchair & Divyangjan accessible toilets (PF 1 & PF 4)',
      icon: '🚻',
      path: '/facilities?cat=Toilet',
      gradientClass: 'from-red-800 via-rose-900 to-red-950',
      borderClass: 'border-red-400/60',
      speech: 'Opening Restrooms and accessible toilet facilities',
    },
    {
      title: 'Station Floor Map',
      desc: 'Platform directory, tactile paths & wheelchair lifts',
      icon: '🏛️',
      path: '/map',
      gradientClass: 'from-amber-600 via-orange-600 to-amber-900',
      borderClass: 'border-amber-400/60',
      speech: 'Opening Interactive Chennai Central Station Map',
    },
    {
      title: 'Live Train Tracker',
      desc: 'Image 3 transit network map with real-time GPS feeds',
      icon: '🧭',
      path: '/trains',
      gradientClass: 'from-indigo-800 via-purple-900 to-slate-950',
      borderClass: 'border-indigo-400/60',
      speech: 'Opening Live Train Network Tracking system',
    },
    {
      title: 'Emergency SOS',
      desc: 'Instant medical, security or wheelchair assistance',
      icon: '🆘',
      path: '/sos',
      gradientClass: 'from-red-600 via-red-700 to-rose-950',
      borderClass: 'border-red-400/60',
      speech: 'Opening Emergency SOS assistance request',
    },
  ];

  const handleQuickAction = (action) => {
    if (screenReaderMode) {
      speak(action.speech);
    }
    navigate(action.path);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Live Train Ticker */}
      <LiveTrainTicker />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Banner - High Contrast or Twilight Sunset Theme */}
        <div
          className={`rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden transition-colors ${
            highContrast
              ? 'bg-black border-4 border-yellow-400 text-white'
              : 'chennai-twilight-gradient border-2 border-amber-400/50 shadow-xl'
          }`}
        >
          <div className="relative z-10 max-w-3xl">
            {/* Image 4 Station Signboard Badge */}
            <div className="inline-flex items-center gap-2 chennai-signboard px-3.5 py-1 rounded-md text-xs font-black shadow-md mb-3 border-2 border-black">
              <span>🏛️</span>
              <span className="tracking-wide text-black">சென்னை சென்ட்ரல் • चेन्नै सेन्ट्रल • CHENNAI CENTRAL</span>
              <span className="bg-black text-yellow-300 px-1.5 py-0.5 rounded text-[10px] font-mono font-black">
                MAS
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span
                className={`font-black uppercase tracking-wider ${
                  highContrast ? 'text-yellow-300' : 'text-amber-200 drop-shadow-sm'
                }`}
              >
                Heritage Gateway of Southern Railway
              </span>
              <span className="text-white/60">•</span>
              <span
                className={`font-mono font-black px-2 py-0.5 rounded border ${
                  highContrast
                    ? 'bg-zinc-900 text-yellow-300 border-yellow-400'
                    : 'bg-black/50 text-yellow-200 border-white/20'
                }`}
              >
                🕰️ {currentTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              Dr. M.G.R. Chennai Central Facility Navigation
            </h1>
            <p
              className={`mt-2 text-sm sm:text-base leading-relaxed ${
                highContrast ? 'text-white font-semibold' : 'text-rose-100 font-medium drop-shadow-sm'
              }`}
            >
              Step-free ramp navigation, Divyangjan braille pathways, live suburban transit tracking, and crowd monitoring for all 17 platforms.
            </p>

            {/* High Contrast 3 CTA Buttons */}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/trains"
                className={`font-black px-5 py-2.5 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2 border-2 ${
                  highContrast
                    ? 'bg-yellow-400 hover:bg-yellow-300 text-black border-white'
                    : 'bg-yellow-400 hover:bg-yellow-300 text-black border-black'
                }`}
              >
                <span>🗺️</span> Live Train Network Map
              </Link>
              <Link
                to="/map"
                className={`font-black px-5 py-2.5 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2 border-2 ${
                  highContrast
                    ? 'bg-black hover:bg-zinc-900 text-yellow-300 border-yellow-400'
                    : 'bg-white hover:bg-slate-100 text-slate-950 border-slate-300'
                }`}
              >
                <span>📍</span> Station Platform Layout
              </Link>
              <Link
                to="/sos"
                className={`font-black px-5 py-2.5 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2 border-2 ${
                  highContrast
                    ? 'bg-red-600 hover:bg-red-700 text-white border-yellow-400'
                    : 'bg-red-600 hover:bg-red-700 text-white border-white/60'
                }`}
              >
                <span>🆘</span> Request Assistance
              </Link>
            </div>
          </div>

          {/* Decorative Silhouette */}
          <div className="absolute right-3 sm:right-6 bottom-0 opacity-20 pointer-events-none flex flex-col items-center">
            <span
              className="text-[120px] sm:text-[180px] leading-none select-none filter drop-shadow-xl"
              role="img"
              aria-hidden="true"
            >
              🏛️
            </span>
          </div>
        </div>

        {/* 4 Large Tap-Friendly Quick Action Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2
              className={`text-xl font-black flex items-center gap-2 ${
                highContrast ? 'text-yellow-300' : 'text-slate-950'
              }`}
            >
              <span className="text-red-600">⚡</span> Essential Passenger Shortcuts
            </h2>
            <span
              className={`text-xs font-black ${
                highContrast ? 'text-white' : 'text-slate-800'
              }`}
            >
              Touch or click any card
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={() => handleQuickAction(action)}
                className={`text-left p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 focus:outline-none flex flex-col justify-between min-h-[140px] group border-2 ${
                  highContrast
                    ? 'bg-black text-yellow-300 border-yellow-400 focus:ring-4 focus:ring-yellow-300'
                    : `bg-gradient-to-br ${action.gradientClass} text-white ${action.borderClass} focus:ring-4 focus:ring-amber-300`
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl filter drop-shadow group-hover:scale-110 transition-transform">
                    {action.icon}
                  </span>
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${
                      highContrast
                        ? 'bg-zinc-900 text-yellow-300 border-yellow-400'
                        : 'bg-black/60 text-yellow-300 border-yellow-400/50'
                    }`}
                  >
                    Open →
                  </span>
                </div>
                <div>
                  <h3
                    className={`text-lg font-black mt-3 leading-snug ${
                      highContrast ? 'text-yellow-300' : 'text-white'
                    }`}
                  >
                    {action.title}
                  </h3>
                  <p
                    className={`text-xs mt-1.5 font-bold ${
                      highContrast ? 'text-white' : 'text-amber-100'
                    }`}
                  >
                    {action.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Station Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            className={`p-4 rounded-2xl shadow-sm flex items-center gap-3 border-2 ${
              highContrast
                ? 'bg-black border-yellow-400 text-white'
                : 'bg-white border-slate-300 border-l-4 border-l-red-600'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center text-2xl font-bold flex-shrink-0">
              🚆
            </div>
            <div>
              <div
                className={`text-2xl font-black ${
                  highContrast ? 'text-yellow-300' : 'text-slate-950'
                }`}
              >
                {totalTrains}
              </div>
              <div
                className={`text-xs font-black ${
                  highContrast ? 'text-white' : 'text-slate-800'
                }`}
              >
                Active Trains Today
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl shadow-sm flex items-center gap-3 border-2 ${
              highContrast
                ? 'bg-black border-yellow-400 text-white'
                : 'bg-white border-slate-300 border-l-4 border-l-amber-500'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl font-bold flex-shrink-0">
              ⏱️
            </div>
            <div>
              <div
                className={`text-2xl font-black ${
                  highContrast ? 'text-yellow-300' : 'text-amber-700'
                }`}
              >
                {delayedTrains}
              </div>
              <div
                className={`text-xs font-black ${
                  highContrast ? 'text-white' : 'text-slate-800'
                }`}
              >
                Delayed Services
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl shadow-sm flex items-center gap-3 border-2 ${
              highContrast
                ? 'bg-black border-yellow-400 text-white'
                : 'bg-white border-slate-300 border-l-4 border-l-emerald-600'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold flex-shrink-0">
              ✅
            </div>
            <div>
              <div
                className={`text-2xl font-black ${
                  highContrast ? 'text-yellow-300' : 'text-emerald-700'
                }`}
              >
                {activeFacilities}
              </div>
              <div
                className={`text-xs font-black ${
                  highContrast ? 'text-white' : 'text-slate-800'
                }`}
              >
                Operational Amenities
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-2xl shadow-sm flex items-center gap-3 border-2 ${
              highContrast
                ? 'bg-black border-yellow-400 text-white'
                : 'bg-white border-slate-300 border-l-4 border-l-purple-600'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl font-bold flex-shrink-0">
              ♿
            </div>
            <div>
              <div
                className={`text-2xl font-black ${
                  highContrast ? 'text-yellow-300' : 'text-purple-800'
                }`}
              >
                100%
              </div>
              <div
                className={`text-xs font-black ${
                  highContrast ? 'text-white' : 'text-slate-800'
                }`}
              >
                Accessible Ramps & Lifts
              </div>
            </div>
          </div>
        </div>

        {/* Live Suburban & Express Railway Network Teaser (Image 3) */}
        <div
          className={`rounded-2xl shadow-sm p-5 overflow-hidden border-2 ${
            highContrast
              ? 'bg-black border-yellow-400 text-white'
              : 'bg-white border-slate-300 text-slate-900'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-4 border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 chennai-signboard px-2.5 py-0.5 rounded text-[11px] font-black mb-1 text-black">
                TRANSIT NETWORK • IMAGE 3 SCHEMATIC
              </div>
              <h3
                className={`text-lg font-black flex items-center gap-2 ${
                  highContrast ? 'text-yellow-300' : 'text-slate-950'
                }`}
              >
                <span>🗺️</span> Chennai Suburban & Mainline Railway Live Telemetry
              </h3>
              <p
                className={`text-xs mt-0.5 font-bold ${
                  highContrast ? 'text-white' : 'text-slate-700'
                }`}
              >
                Real-time tracking across 4 arterial corridors connecting Chennai Central & Chennai Beach.
              </p>
            </div>
            <Link
              to="/trains"
              className={`inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl shadow transition border-2 ${
                highContrast
                  ? 'bg-yellow-400 text-black border-white hover:bg-yellow-300'
                  : 'bg-red-700 hover:bg-red-800 text-white border-red-900'
              }`}
            >
              <span>🧭</span> Launch Fullscreen Network Tracker →
            </Link>
          </div>

          {/* 4 Corridor Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              to="/trains"
              className={`p-3.5 rounded-xl border-2 transition block ${
                highContrast
                  ? 'bg-black border-red-500 hover:bg-zinc-900 text-white'
                  : 'bg-red-50 border-red-300 hover:bg-red-100 text-slate-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-red-600 uppercase">West Corridor</span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              </div>
              <div
                className={`font-black text-sm mt-1 ${
                  highContrast ? 'text-yellow-300' : 'text-slate-950'
                }`}
              >
                Arakkonam / Bengaluru / Kovai
              </div>
              <div
                className={`text-xs mt-0.5 font-bold ${
                  highContrast ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Perambur • Villivakkam • Avadi • Tiruvallur
              </div>
            </Link>

            <Link
              to="/trains"
              className={`p-3.5 rounded-xl border-2 transition block ${
                highContrast
                  ? 'bg-black border-blue-400 hover:bg-zinc-900 text-white'
                  : 'bg-blue-50 border-blue-300 hover:bg-blue-100 text-slate-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-600 uppercase">North Corridor</span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
              </div>
              <div
                className={`font-black text-sm mt-1 ${
                  highContrast ? 'text-yellow-300' : 'text-slate-950'
                }`}
              >
                Gummidipundi / Sullurpeta / VJA
              </div>
              <div
                className={`text-xs mt-0.5 font-bold ${
                  highContrast ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Basin Bridge • Korukkupet • Ponneri
              </div>
            </Link>

            <Link
              to="/trains"
              className={`p-3.5 rounded-xl border-2 transition block ${
                highContrast
                  ? 'bg-black border-emerald-400 hover:bg-zinc-900 text-white'
                  : 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100 text-slate-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-600 uppercase">South Corridor</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              </div>
              <div
                className={`font-black text-sm mt-1 ${
                  highContrast ? 'text-yellow-300' : 'text-slate-950'
                }`}
              >
                Tambaram / Chengalpattu / Madurai
              </div>
              <div
                className={`text-xs mt-0.5 font-bold ${
                  highContrast ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Park • Egmore • Mambalam • Guindy • Airport
              </div>
            </Link>

            <Link
              to="/trains"
              className={`p-3.5 rounded-xl border-2 transition block ${
                highContrast
                  ? 'bg-black border-amber-400 hover:bg-zinc-900 text-white'
                  : 'bg-amber-50 border-amber-300 hover:bg-amber-100 text-slate-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-600 uppercase">MRTS Elevated Line</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
              </div>
              <div
                className={`font-black text-sm mt-1 ${
                  highContrast ? 'text-yellow-300' : 'text-slate-950'
                }`}
              >
                Velachery Elevated Corridor
              </div>
              <div
                className={`text-xs mt-0.5 font-bold ${
                  highContrast ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Chennai Fort • Chepauk • Mylapore • Tiruvanmiyur
              </div>
            </Link>
          </div>
        </div>

        {/* Crowd Heatmap & Station Zones Summary */}
        <div
          className={`p-5 rounded-2xl shadow-sm border-2 ${
            highContrast
              ? 'bg-black border-yellow-400 text-white'
              : 'bg-white border-slate-300 text-slate-900'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3
                className={`text-base font-black flex items-center gap-2 ${
                  highContrast ? 'text-yellow-300' : 'text-slate-950'
                }`}
              >
                <span>👥</span> Live Chennai Central Concourse & Platform Crowd Density
              </h3>
              <p
                className={`text-xs font-bold ${
                  highContrast ? 'text-white' : 'text-slate-700'
                }`}
              >
                Current passenger density by area to plan comfortable, step-free navigation.
              </p>
            </div>
            <div
              className={`text-xs font-mono font-black ${
                highContrast ? 'text-yellow-300' : 'text-slate-700'
              }`}
            >
              Updated via IoT Sensors
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className={`p-3.5 rounded-xl border-2 flex flex-col justify-between transition ${
                  highContrast
                    ? 'bg-black border-yellow-400/80 text-white'
                    : 'bg-slate-100 border-slate-300 hover:border-slate-500 text-slate-950'
                }`}
              >
                <div>
                  <div
                    className={`font-black text-sm ${
                      highContrast ? 'text-yellow-300' : 'text-slate-950'
                    }`}
                  >
                    {zone.name}
                  </div>
                  <div
                    className={`text-xs font-bold mt-0.5 ${
                      highContrast ? 'text-white' : 'text-slate-700'
                    }`}
                  >
                    {zone.passengerCount} passengers
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <CrowdBadge level={zone.crowd} size="small" />
                  <span
                    className={`text-[11px] font-black ${
                      highContrast ? 'text-yellow-200' : 'text-slate-800'
                    }`}
                  >
                    {zone.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts & Accessibility Helper Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Alerts (2 Cols) */}
          <div
            className={`lg:col-span-2 p-5 rounded-2xl shadow-sm border-2 ${
              highContrast
                ? 'bg-black border-yellow-400 text-white'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-base font-black flex items-center gap-2 ${
                  highContrast ? 'text-yellow-300' : 'text-slate-950'
                }`}
              >
                <span>📢</span> Station Notice Board & Announcements
              </h3>
              <Link
                to="/alerts"
                className={`text-xs font-black hover:underline ${
                  highContrast ? 'text-yellow-300' : 'text-red-700'
                }`}
              >
                View All Alerts ({alerts.length}) →
              </Link>
            </div>

            <div className="space-y-3">
              {activeAlerts.slice(0, 3).map((alert) => {
                const isEmergency = alert.type === 'EMERGENCY';
                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border-2 ${
                      highContrast
                        ? 'bg-black border-yellow-400 text-white'
                        : isEmergency
                        ? 'bg-red-50 border-red-400 text-red-950'
                        : 'bg-amber-50 border-amber-300 text-slate-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{isEmergency ? '⚠️' : '📢'}</span>
                        <h4
                          className={`font-black text-sm ${
                            highContrast ? 'text-yellow-300' : 'text-slate-950'
                          }`}
                        >
                          {alert.title}
                        </h4>
                      </div>
                      <span
                        className={`text-xs font-black whitespace-nowrap ${
                          highContrast ? 'text-yellow-300' : 'text-slate-700'
                        }`}
                      >
                        {alert.time}
                      </span>
                    </div>
                    <p
                      className={`text-xs sm:text-sm mt-1.5 font-bold leading-relaxed ${
                        highContrast ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {alert.message}
                    </p>
                    {alert.affectedArea && (
                      <div
                        className={`mt-2 text-xs font-black ${
                          highContrast ? 'text-yellow-200' : 'text-slate-900'
                        }`}
                      >
                        Affected Area: <span className="underline">{alert.affectedArea}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Divyangjan & Accessibility Assistant */}
          <div
            className={`p-5 rounded-2xl shadow-lg flex flex-col justify-between border-2 ${
              highContrast
                ? 'bg-black border-4 border-yellow-400 text-white'
                : 'bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white border-red-800/40'
            }`}
          >
            <div>
              <div className="chennai-signboard px-2.5 py-0.5 rounded text-[10px] font-black uppercase mb-3 inline-block text-black">
                <span>♿</span> DIVYANGJAN ASSIST
              </div>
              <h4 className="text-lg font-black text-white">Need Personal Transit Assistance?</h4>
              <p
                className={`text-xs mt-2 leading-relaxed ${
                  highContrast ? 'text-white font-semibold' : 'text-slate-300'
                }`}
              >
                Free battery operated buggies, trained Sahayaks, wheelchair escorts, and braille guides available at Divyangjan Sahayata Kendra (Gate 2).
              </p>

              <div className="mt-4 space-y-2 text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black">✓</span> Step-free ramp to all 17 platforms
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black">✓</span> Talking lifts at Moore Market & Main Concourse
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black">✓</span> Low-height ticket counters (Counter 3 & 14)
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/sos"
                className={`w-full text-center font-black text-sm py-2.5 px-4 rounded-xl block shadow-lg transition-colors border-2 ${
                  highContrast
                    ? 'bg-red-600 hover:bg-red-700 text-white border-yellow-400'
                    : 'bg-red-600 hover:bg-red-700 text-white border-white/40'
                }`}
              >
                Request Buggy / Wheelchair Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
