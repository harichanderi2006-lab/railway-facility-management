import React, { useState, useMemo } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { getHindiAnnouncement, getTamilAnnouncement, getEnglishAnnouncement } from '../utils/railwayAudio';
import ChennaiNetworkMap from '../components/ChennaiNetworkMap';
import CrowdBadge from '../components/CrowdBadge';

export default function TrainStatus() {
  const { trains, recentUpdatedTrainId } = useSocket();
  const {
    speak,
    screenReaderMode,
    highContrast,
    announcementLang,
    setAnnouncementLang,
    voiceGender,
    setVoiceGender,
    chimeEnabled,
    setChimeEnabled,
    isAnnouncing,
    announceRailwayTrain,
    testSampleAnnouncement,
    playChime,
  } = useAccessibility();

  const [activeView, setActiveView] = useState('split'); // 'map', 'board', 'split'
  const [activeType, setActiveType] = useState('all'); // 'all', 'departure', 'arrival'
  const [activeCorridorFilter, setActiveCorridorFilter] = useState('all'); // 'all', 'west', 'north', 'south', 'mrts'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrain, setSelectedTrain] = useState(trains[0] || null);
  const [showHaltsModal, setShowHaltsModal] = useState(false);

  // Filter trains
  const filteredTrains = useMemo(() => {
    return trains.filter((train) => {
      // Type filter
      if (activeType !== 'all' && train.type !== activeType) return false;
      // Status filter
      if (statusFilter !== 'ALL' && train.status !== statusFilter) return false;
      // Corridor filter
      if (activeCorridorFilter !== 'all' && train.corridor !== activeCorridorFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          train.trainNumber.toLowerCase().includes(q) ||
          train.trainName.toLowerCase().includes(q) ||
          train.destination.toLowerCase().includes(q) ||
          train.origin.toLowerCase().includes(q) ||
          train.platform.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [trains, activeType, statusFilter, activeCorridorFilter, searchQuery]);

  const currentAnnouncementText = useMemo(() => {
    const t = selectedTrain || filteredTrains[0] || {
      trainNumber: '12804',
      trainName: 'Swarna Jayanti Superfast Express',
      hindiName: 'सुपरफास्ट स्वर्ण जयंती एक्सप्रेस',
      platform: 'Platform 3',
      status: 'ON_TIME',
      type: 'arrival',
    };
    if (announcementLang === 'hindi') return getHindiAnnouncement(t);
    if (announcementLang === 'tamil') return getTamilAnnouncement(t);
    if (announcementLang === 'english') return getEnglishAnnouncement(t);
    return `${getHindiAnnouncement(t)}  •  ${getEnglishAnnouncement(t)}`;
  }, [selectedTrain, filteredTrains, announcementLang]);

  const announceTrain = (train) => {
    announceRailwayTrain(train);
  };

  const getStatusBadge = (status, delayMinutes) => {
    switch (status) {
      case 'ON_TIME':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            ON TIME
          </span>
        );
      case 'DELAYED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-600">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            DELAYED (+{delayMinutes}m)
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-950 text-red-300 border border-red-700">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            CANCELLED
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const getCorridorBadge = (corridor) => {
    switch (corridor) {
      case 'west':
        return <span className="text-[10px] bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-bold">🔴 WEST (AJJ)</span>;
      case 'north':
        return <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-bold">🔵 NORTH (GPD)</span>;
      case 'south':
        return <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-bold">🟢 SOUTH (TBM)</span>;
      case 'mrts':
        return <span className="text-[10px] bg-orange-950 text-orange-300 border border-orange-800 px-2 py-0.5 rounded font-bold">🟠 MRTS (VLCY)</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ── CHENNAI CENTRAL HERITAGE HERO BANNER (Image 1, 2 & 4) ── */}
      <div className="bg-gradient-to-r from-red-900 via-rose-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative rangoli / mandala accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Authentic Yellow Station Signboard Badge (Image 4) */}
            <div className="inline-block bg-chennai-yellow text-black border-2 border-black px-3.5 py-1.5 rounded-xl shadow-lg font-black tracking-wider text-xs">
              <span className="text-[11px] font-bold">சென்னை சென்ட்ரல்</span> • <span className="text-[11px]">चेन्नै सेन्ट्रल</span> • <span className="font-extrabold uppercase">CHENNAI CENTRAL (MAS)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>🚆</span> Live Train Tracking & Transit Network System
            </h1>

            <p className="text-sm text-rose-100 max-w-2xl leading-relaxed">
              Real-time GPS tracking across Chennai's Suburban & Express Railway corridors. Featuring the interactive transit blueprint map (Image 3) with live speeds, platform allocations, and Divyangjan accessibility coaches.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => {
                if (filteredTrains.length > 0) announceTrain(selectedTrain || filteredTrains[0]);
              }}
              disabled={isAnnouncing}
              className="px-5 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs sm:text-sm rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2 border-2 border-black disabled:opacity-50"
              title="Broadcast authentic station voice announcement with 4-note chime"
            >
              <span>{isAnnouncing ? '🔊' : '📢'}</span>
              <span>{isAnnouncing ? 'Broadcasting Announcement...' : 'Broadcast Live PA (Chime + Voice)'}</span>
            </button>
          </div>
        </div>

        {/* ── VIEW MODE SWITCHER TABS ── */}
        <div className="mt-6 pt-5 border-t border-red-800/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-red-700/60">
            <button
              onClick={() => setActiveView('split')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'split'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🔀</span> Split View (Map + Schedule)
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'map'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🗺️</span> Fullscreen Network Map (Image 3)
            </button>
            <button
              onClick={() => setActiveView('board')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'board'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>📋</span> Station Schedule Board
            </button>
          </div>

          {/* Active Train Quick Indicator */}
          {selectedTrain && (
            <div className="text-xs text-amber-200 flex items-center gap-2 bg-black/50 px-3.5 py-2 rounded-xl border border-amber-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Tracking: <strong className="text-white">{selectedTrain.trainNumber} {selectedTrain.trainName}</strong></span>
              <span className="text-amber-400 font-mono">({selectedTrain.currentSpeed || '78 km/h'})</span>
            </div>
          )}
        </div>
      </div>

      {/* ── AUTHENTIC INDIAN RAILWAYS PUBLIC ADDRESS & CHIME STUDIO CONSOLE ── */}
      <div
        className={`rounded-3xl p-5 border-2 shadow-xl transition-colors ${
          highContrast
            ? 'bg-black text-white border-yellow-400'
            : 'bg-gradient-to-r from-slate-950 via-slate-900 to-red-950 text-white border-amber-500/50'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
              📢
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="chennai-signboard px-2.5 py-0.5 rounded text-[10px] font-black uppercase text-black">
                  भारतीय रेल उद्घोषणा • STATION PA SYSTEM
                </span>
                {isAnnouncing && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-black animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    LIVE ON AIR
                  </span>
                )}
              </div>
              <h3 className="text-lg font-black text-white mt-0.5 flex items-center gap-2">
                <span>Station Public Address & Chime Studio</span>
                {isAnnouncing && (
                  <span className="flex items-end gap-1 h-4 ml-1">
                    <span className="w-1 bg-amber-400 rounded-full animate-soundwave-1" />
                    <span className="w-1 bg-amber-400 rounded-full animate-soundwave-2" />
                    <span className="w-1 bg-amber-400 rounded-full animate-soundwave-3" />
                    <span className="w-1 bg-amber-400 rounded-full animate-soundwave-4" />
                    <span className="w-1 bg-amber-400 rounded-full animate-soundwave-5" />
                  </span>
                )}
              </h3>
            </div>
          </div>

          {/* Audio Type Options Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Language Selection */}
            <div className="flex items-center bg-black/60 p-1 rounded-xl border border-slate-700">
              {[
                { id: 'hindi', label: 'हिंदी (Hindi)' },
                { id: 'tamil', label: 'தமிழ்' },
                { id: 'english', label: 'English' },
                { id: 'trilingual', label: 'All 3 (त्रिभाषी)' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setAnnouncementLang(l.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    announcementLang === l.id
                      ? 'bg-amber-400 text-black shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Voice Gender */}
            <div className="flex items-center bg-black/60 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setVoiceGender('female')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  voiceGender === 'female'
                    ? 'bg-amber-400 text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Female Announcer Voice"
              >
                👩 Female
              </button>
              <button
                onClick={() => setVoiceGender('male')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  voiceGender === 'male'
                    ? 'bg-amber-400 text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Male Announcer Voice"
              >
                👨 Male
              </button>
            </div>

            {/* Chime Toggle */}
            <button
              onClick={() => setChimeEnabled(!chimeEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
                chimeEnabled
                  ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Toggle iconic 4-note Indian Railways chime tone"
            >
              <span>🔔</span>
              <span>{chimeEnabled ? 'Chime ON' : 'Chime OFF'}</span>
            </button>
          </div>
        </div>

        {/* Live Audio Script LED Display */}
        <div className="mt-4 p-4 rounded-2xl bg-black/80 border-2 border-amber-500/40 font-mono space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-amber-400 font-bold gap-1">
            <span className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isAnnouncing ? 'bg-red-500 animate-ping' : 'bg-emerald-400'}`} />
              TRANSMITTER: DR. M.G.R. CHENNAI CENTRAL PUBLIC ADDRESS SYSTEM
            </span>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {voiceGender === 'female' ? '👩 Female Announcer (Pitch 1.25x)' : '👨 Male Announcer (Pitch 0.65x)'}
              </span>
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Language: {announcementLang.toUpperCase()}
              </span>
            </div>
          </div>

          <p className="text-base sm:text-lg font-bold text-amber-200 leading-relaxed font-sans">
            "{currentAnnouncementText}"
          </p>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            <span>💡 All languages fully supported across all devices (Native & Phonetic Speech Engine).</span>
            <span className="text-emerald-400 font-bold">● High Clarity Reverb Active</span>
          </div>
        </div>

        {/* 1-Click Audio Action Buttons & Language Demos */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-amber-300 mr-1">Direct Broadcast:</span>

            {/* User's exact requested announcement */}
            <button
              onClick={() => testSampleAnnouncement('hindi', voiceGender)}
              disabled={isAnnouncing}
              className="px-4 py-2 bg-gradient-to-r from-red-600 via-rose-700 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg border border-amber-400/40 flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              title="Broadcast Train 12804 in Hindi (As requested)"
            >
              <span>📢</span>
              <span>12804 Hindi (हिंदी उद्घोषणा)</span>
            </button>

            {/* Tamil Announcement */}
            <button
              onClick={() => testSampleAnnouncement('tamil', voiceGender)}
              disabled={isAnnouncing}
              className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg border border-cyan-400/40 flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              title="Broadcast Train 12804 in Tamil"
            >
              <span>📢</span>
              <span>12804 Tamil (தமிழ் அறிவிப்பு)</span>
            </button>

            {/* English Announcement */}
            <button
              onClick={() => testSampleAnnouncement('english', voiceGender)}
              disabled={isAnnouncing}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs rounded-xl border border-slate-600 flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              title="Broadcast Train 12804 in English"
            >
              <span>📢</span>
              <span>12804 English</span>
            </button>

            {/* Trilingual Sequence */}
            <button
              onClick={() => testSampleAnnouncement('trilingual', voiceGender)}
              disabled={isAnnouncing}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl border-2 border-black flex items-center gap-1.5 active:scale-95 disabled:opacity-50 shadow-md"
              title="Broadcast Trilingual Sequence: Hindi + English + Tamil"
            >
              <span>🌐</span>
              <span>All 3 Languages Sequence</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-bold mr-1">Voice Test:</span>

              {/* Female Voice Test */}
              <button
                onClick={() => {
                  setVoiceGender('female');
                  testSampleAnnouncement(announcementLang, 'female');
                }}
                disabled={isAnnouncing}
                className={`px-3 py-1.5 rounded-lg text-xs font-black border transition flex items-center gap-1.5 ${
                  voiceGender === 'female'
                    ? 'bg-rose-600 text-white border-rose-400 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>👩</span>
                <span>Female Voice (महिला / பெண்)</span>
              </button>

              {/* Male Voice Test */}
              <button
                onClick={() => {
                  setVoiceGender('male');
                  testSampleAnnouncement(announcementLang, 'male');
                }}
                disabled={isAnnouncing}
                className={`px-3 py-1.5 rounded-lg text-xs font-black border transition flex items-center gap-1.5 ${
                  voiceGender === 'male'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span>👨</span>
                <span>Male Voice (पुरुष / ஆண்)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Announce currently selected train */}
              {selectedTrain && (
                <button
                  onClick={() => announceTrain(selectedTrain)}
                  disabled={isAnnouncing}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-yellow-300 text-black font-black text-xs rounded-lg border border-black flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                  title="Announce currently selected train"
                >
                  <span>📢</span>
                  <span>Announce Selected (#{selectedTrain.trainNumber})</span>
                </button>
              )}

              {/* Play Chime Only */}
              <button
                onClick={playChime}
                disabled={isAnnouncing}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-lg border border-slate-700 flex items-center gap-1 transition active:scale-95 disabled:opacity-50"
                title="Play the 4-note station bell chime independently"
              >
                <span>🔔</span>
                <span>Play Chime</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIVE INTERACTIVE NETWORK MAP (Image 3 Blueprint) ── */}
      {(activeView === 'map' || activeView === 'split') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🗺️</span>
              <h2 className="text-lg font-black text-gray-900">
                Interactive Transit Network Tracker — Chennai Suburbs & Intercity
              </h2>
            </div>
            <span className="text-xs text-gray-500 hidden sm:inline">
              Select any train from the schedule below to follow its route on this map
            </span>
          </div>

          <ChennaiNetworkMap
            selectedTrain={selectedTrain}
            onSelectTrain={(tr) => setSelectedTrain(tr)}
            activeCorridor={activeCorridorFilter}
          />
        </div>
      )}

      {/* ── TRAIN BOARD & SCHEDULE SECTION ── */}
      {(activeView === 'board' || activeView === 'split') && (
        <div className="space-y-4">
          {/* Corridor & Search Filters Bar */}
          <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 shadow-lg flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Corridor Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider mr-1">Corridor:</span>
              {[
                { id: 'all', label: 'All Corridors' },
                { id: 'west', label: '🔴 West (Arakkonam)' },
                { id: 'north', label: '🔵 North (Gummidipundi)' },
                { id: 'south', label: '🟢 South (Tambaram)' },
                { id: 'mrts', label: '🟠 MRTS (Velachery)' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCorridorFilter(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCorridorFilter === c.id
                      ? 'bg-amber-500 text-black shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Departures / Arrivals + Status + Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex p-1 bg-slate-800 rounded-xl border border-slate-700">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'departure', label: 'Departures ↗' },
                  { id: 'arrival', label: 'Arrivals ↘' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveType(type.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeType === type.id
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Search box */}
              <div className="relative min-w-[220px]">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search train no, name, platform..."
                  className="pl-9 pr-4 py-2 w-full text-xs rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div
            className={`rounded-3xl border-2 shadow-md overflow-hidden ${
              highContrast
                ? 'bg-black border-yellow-400 text-white'
                : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" aria-label="Chennai Central Train Schedule">
                <thead>
                  <tr
                    className={`text-xs uppercase tracking-wider ${
                      highContrast
                        ? 'bg-black text-yellow-300 border-b-2 border-yellow-400 font-black'
                        : 'bg-slate-900 text-white font-black'
                    }`}
                  >
                    <th className="py-3.5 px-4 font-black">Track Live</th>
                    <th className="py-3.5 px-4 font-black">Train No & Name</th>
                    <th className="py-3.5 px-4 font-black">Corridor</th>
                    <th className="py-3.5 px-4 font-black">Route Origin → Dest</th>
                    <th className="py-3.5 px-4 font-black">Platform</th>
                    <th className="py-3.5 px-4 font-black">Time (Sch / Act)</th>
                    <th className="py-3.5 px-4 font-black">Status</th>
                    <th className="py-3.5 px-4 font-black text-center">Accessibility & Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {filteredTrains.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className={`py-12 text-center font-bold ${
                          highContrast ? 'text-yellow-300' : 'text-slate-700'
                        }`}
                      >
                        <span className="text-3xl block mb-2">🔍</span>
                        No trains found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTrains.map((train) => {
                      const isSelected = selectedTrain?.id === train.id;

                      return (
                        <tr
                          key={train.id}
                          onClick={() => setSelectedTrain(train)}
                          className={`cursor-pointer transition-colors duration-150 ${
                            highContrast
                              ? isSelected
                                ? 'bg-zinc-900 border-l-4 border-yellow-400 text-white'
                                : 'hover:bg-zinc-900/60 text-white'
                              : isSelected
                              ? 'bg-amber-100/70 border-l-4 border-amber-600 text-slate-950'
                              : 'hover:bg-slate-50 text-slate-900'
                          }`}
                        >
                          {/* Live Track CTA */}
                          <td className="py-4 px-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTrain(train);
                                if (activeView === 'board') setActiveView('split');
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm border ${
                                isSelected
                                  ? 'bg-red-700 text-white shadow-md ring-2 ring-red-400 border-red-500'
                                  : highContrast
                                  ? 'bg-black text-yellow-300 border-yellow-400 hover:bg-yellow-400 hover:text-black'
                                  : 'bg-slate-900 text-amber-300 hover:bg-red-700 hover:text-white border-transparent'
                              }`}
                            >
                              <span>📍</span>
                              <span>{isSelected ? 'Tracking' : 'Track'}</span>
                            </button>
                          </td>

                          {/* Train Number & Name */}
                          <td className="py-4 px-4">
                            <div
                              className={`font-black flex items-center gap-2 ${
                                highContrast ? 'text-white' : 'text-slate-950'
                              }`}
                            >
                              <span>{train.trainName}</span>
                              <span className="font-mono text-xs text-red-700 font-black bg-red-100 px-2 py-0.5 rounded border border-red-200">
                                #{train.trainNumber}
                              </span>
                            </div>
                            <div
                              className={`text-xs mt-0.5 font-bold ${
                                highContrast ? 'text-yellow-200' : 'text-slate-700'
                              }`}
                            >
                              Next Halt: <strong className="font-black">{train.nextStation || 'Basin Bridge'}</strong> • Speed: <span className="text-emerald-700 font-black">{train.currentSpeed || '78 km/h'}</span>
                            </div>
                          </td>

                          {/* Corridor */}
                          <td className="py-4 px-4">
                            {getCorridorBadge(train.corridor)}
                          </td>

                          {/* Origin -> Destination */}
                          <td
                            className={`py-4 px-4 text-xs font-bold ${
                              highContrast ? 'text-white' : 'text-slate-800'
                            }`}
                          >
                            <div>{train.origin}</div>
                            <div className="text-amber-600 font-black">↓</div>
                            <div className="font-black">{train.destination}</div>
                          </td>

                          {/* Platform */}
                          <td className="py-4 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 font-black text-xs rounded-lg border ${
                                highContrast
                                  ? 'bg-black text-yellow-300 border-yellow-400'
                                  : 'bg-blue-100 text-blue-950 border-blue-300'
                              }`}
                            >
                              {train.platform}
                            </span>
                          </td>

                          {/* Scheduled / Actual Times */}
                          <td className="py-4 px-4 font-mono text-xs">
                            <div
                              className={`font-bold ${
                                highContrast ? 'text-slate-300' : 'text-slate-700'
                              }`}
                            >
                              Sch: {train.scheduledTime}
                            </div>
                            <div
                              className={`font-black ${
                                train.status === 'DELAYED'
                                  ? 'text-amber-600'
                                  : train.status === 'CANCELLED'
                                  ? 'text-red-600 line-through'
                                  : 'text-emerald-600'
                              }`}
                            >
                              Act: {train.actualTime}
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4">
                            {getStatusBadge(train.status, train.delayMinutes)}
                          </td>

                          {/* Action Info & Speech */}
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTrain(train);
                                  setShowHaltsModal(true);
                                }}
                                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                                title="Inspect train route halts & accessibility coaches"
                              >
                                <span>♿ Details</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  announceTrain(train);
                                }}
                                className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Listen voice announcement"
                              >
                                <span>🔊</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ROUTE HALTS & ACCESSIBILITY DETAIL MODAL ── */}
      {showHaltsModal && selectedTrain && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowHaltsModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-2 border-amber-500 space-y-4 text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-red-700">
                  Dr. M.G.R. Chennai Central • Transit Route Telemetry
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">
                  🚆 #{selectedTrain.trainNumber} - {selectedTrain.trainName}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedTrain.origin} ➔ {selectedTrain.destination} ({selectedTrain.platform})
                </p>
              </div>
              <button
                onClick={() => setShowHaltsModal(false)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Accessibility features */}
            <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-xs space-y-2">
              <div className="font-extrabold text-red-950 flex items-center gap-2">
                <span>♿</span>
                <span>Divyangjan Accessibility & Facilities:</span>
              </div>
              <p className="text-red-900 leading-relaxed font-medium">
                {selectedTrain.accessibleCoaches || 'Divyangjan designated coach adjacent to Guard van.'}
              </p>
              <div className="text-red-800">
                <strong>Platform Assignment:</strong> {selectedTrain.platform} (Step-free tactile guide & Elevator 1 access).
              </div>
            </div>

            {/* Route Halts Progress */}
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-2">
                Scheduled Corridor Station Halts:
              </div>
              <div className="flex flex-wrap gap-2">
                {(selectedTrain.halts || ['Chennai Central', 'Basin Bridge', 'Perambur', 'Avadi', 'Tiruvallur', 'Arakkonam']).map(
                  (halt, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1"
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <span>{halt}</span>
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <button
                onClick={() => announceTrain(selectedTrain)}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center gap-2"
              >
                <span>🔊</span> Listen Voice Announcement
              </button>
              <button
                onClick={() => setShowHaltsModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
