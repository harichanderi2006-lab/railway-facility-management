import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { useSocket } from '../context/SocketContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioSettingsOpen, setAudioSettingsOpen] = useState(false);
  const {
    highContrast,
    toggleHighContrast,
    largeText,
    toggleLargeText,
    screenReaderMode,
    toggleScreenReader,
    speak,
    announcementLang,
    setAnnouncementLang,
    chimeEnabled,
    setChimeEnabled,
    voiceGender,
    setVoiceGender,
    isAnnouncing,
    testSampleAnnouncement,
  } = useAccessibility();

  const { isLiveSocket, alerts } = useSocket();
  const activeAlertsCount = alerts.filter((a) => a.active).length;

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: '🏠' },
    { name: 'Station Map', path: '/map', icon: '🗺️' },
    { name: 'Live Train Tracker', path: '/trains', icon: '🚆' },
    { name: 'Facilities', path: '/facilities', icon: '🚻' },
    { name: 'Lost & Found', path: '/lost-found', icon: '🔍' },
    {
      name: 'Alerts',
      path: '/alerts',
      icon: '🔔',
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
    },
    { name: 'SOS Help', path: '/sos', icon: '🆘', isEmergency: true },
  ];

  const handleNavClick = (linkName) => {
    if (screenReaderMode) {
      speak(`Navigating to ${linkName}`);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-200 ${
        highContrast
          ? 'bg-black border-b-4 border-yellow-400 text-white shadow-xl'
          : 'bg-white/95 text-slate-900 backdrop-blur-md border-b-2 border-amber-500/60 shadow-md'
      }`}
    >
      {/* Top Accessibility & Heritage Utility Bar */}
      <div
        className={`text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center transition-colors ${
          highContrast
            ? 'bg-zinc-900 text-white border-b border-yellow-400/50'
            : 'bg-gradient-to-r from-red-950 via-slate-900 to-red-950 text-white border-b border-red-900/60'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-amber-300 font-black tracking-wide">
            Accessibility:
          </span>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            className={`px-2.5 py-1 rounded font-black text-xs flex items-center gap-1 transition-colors border-2 ${
              highContrast
                ? 'bg-yellow-400 text-black border-yellow-400'
                : 'bg-black/60 hover:bg-black text-amber-200 border-amber-400/70'
            }`}
            title="Toggle High Contrast Mode"
          >
            <span>🌓</span>
            <span>{highContrast ? 'Normal Theme' : 'High Contrast'}</span>
          </button>

          {/* Large Font Size Toggle */}
          <button
            onClick={toggleLargeText}
            aria-pressed={largeText}
            className={`px-2.5 py-1 rounded font-black text-xs flex items-center gap-1 transition-colors border-2 ${
              largeText
                ? 'bg-amber-400 text-black border-amber-400'
                : 'bg-black/60 hover:bg-black text-amber-200 border-amber-400/70'
            }`}
            title="Toggle Larger Text Size"
          >
            <span className="font-serif font-black">A+</span>
            <span>{largeText ? 'Standard' : 'Large'}</span>
          </button>

          {/* Voice Screen Reader Toggle */}
          <button
            onClick={toggleScreenReader}
            aria-pressed={screenReaderMode}
            className={`px-2.5 py-1 rounded font-black text-xs flex items-center gap-1 transition-colors border-2 ${
              screenReaderMode
                ? 'bg-emerald-400 text-black border-emerald-400'
                : 'bg-black/60 hover:bg-black text-emerald-300 border-emerald-500/70'
            }`}
            title="Toggle Voice Assistance"
          >
            <span>🔊</span>
            <span>{screenReaderMode ? 'Voice ON' : 'Voice Guide'}</span>
          </button>

          {/* Authentic Station PA Audio & Chime Selector */}
          <div className="relative">
            <button
              onClick={() => setAudioSettingsOpen(!audioSettingsOpen)}
              className={`px-2.5 py-1 rounded font-black text-xs flex items-center gap-1.5 transition-colors border-2 ${
                isAnnouncing
                  ? 'bg-amber-400 text-black border-amber-300 animate-pulse'
                  : highContrast
                  ? 'bg-zinc-800 text-yellow-300 border-yellow-400'
                  : 'bg-black/60 hover:bg-black text-yellow-300 border-yellow-500/70'
              }`}
              title="Station Public Address (PA) Audio & Chime Settings"
            >
              <span>📢</span>
              <span className="hidden sm:inline">PA Voice:</span>
              <span className="bg-amber-500 text-black px-1.5 py-0.5 rounded text-[10px] font-black uppercase">
                {announcementLang === 'hindi'
                  ? 'हिंदी (Hindi)'
                  : announcementLang === 'tamil'
                  ? 'தமிழ்'
                  : announcementLang === 'english'
                  ? 'English'
                  : 'All 3'}
              </span>
              {isAnnouncing ? (
                <span className="flex items-end gap-0.5 h-3 ml-0.5">
                  <span className="w-1 bg-black rounded-full animate-soundwave-1" />
                  <span className="w-1 bg-black rounded-full animate-soundwave-2" />
                  <span className="w-1 bg-black rounded-full animate-soundwave-3" />
                </span>
              ) : (
                <span className="text-[10px]">▼</span>
              )}
            </button>

            {/* Dropdown Menu for PA Audio Settings */}
            {audioSettingsOpen && (
              <div
                className={`absolute left-0 mt-1.5 w-64 p-3 rounded-2xl shadow-2xl z-50 border-2 ${
                  highContrast
                    ? 'bg-black text-white border-yellow-400'
                    : 'bg-slate-900 text-white border-amber-500 shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
                  <span className="font-black text-xs text-amber-300 flex items-center gap-1">
                    <span>🔔</span> Station PA Voice & Music
                  </span>
                  <button
                    onClick={() => setAudioSettingsOpen(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Language Select */}
                <div className="space-y-1 mb-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Announcement Language:</span>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    {[
                      { id: 'hindi', label: 'हिंदी (Hindi)' },
                      { id: 'tamil', label: 'தமிழ் (Tamil)' },
                      { id: 'english', label: 'English' },
                      { id: 'trilingual', label: 'All 3 (त्रिभाषी)' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => setAnnouncementLang(l.id)}
                        className={`py-1 px-1.5 rounded font-bold text-center border transition ${
                          announcementLang === l.id
                            ? 'bg-amber-400 text-black border-amber-400 font-black'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice Gender */}
                <div className="flex items-center justify-between py-1.5 border-t border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-300">Announcer Voice:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setVoiceGender('female')}
                      className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                        voiceGender === 'female'
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      👩 Female
                    </button>
                    <button
                      onClick={() => setVoiceGender('male')}
                      className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                        voiceGender === 'male'
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      👨 Male
                    </button>
                  </div>
                </div>

                {/* Chime Toggle */}
                <div className="flex items-center justify-between py-1.5 border-t border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-300">Station Chime (Music):</span>
                  <button
                    onClick={() => setChimeEnabled(!chimeEnabled)}
                    className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                      chimeEnabled
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {chimeEnabled ? '🔔 ON' : '🔕 OFF'}
                  </button>
                </div>

                {/* Test Sample Button */}
                <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1.5">
                  <button
                    onClick={() => {
                      testSampleAnnouncement(announcementLang, voiceGender);
                    }}
                    disabled={isAnnouncing}
                    className="w-full py-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg text-xs font-black shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <span>{isAnnouncing ? '🔊 Playing...' : `▶️ Test 12804 (${announcementLang.toUpperCase()} - ${voiceGender.toUpperCase()})`}</span>
                  </button>
                  <div className="flex gap-1 text-[10px]">
                    <button
                      onClick={() => testSampleAnnouncement('hindi', voiceGender)}
                      disabled={isAnnouncing}
                      className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded border border-slate-700 text-center"
                    >
                      Test Hindi
                    </button>
                    <button
                      onClick={() => testSampleAnnouncement('tamil', voiceGender)}
                      disabled={isAnnouncing}
                      className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded border border-slate-700 text-center"
                    >
                      Test Tamil
                    </button>
                    <button
                      onClick={() => testSampleAnnouncement('english', voiceGender)}
                      disabled={isAnnouncing}
                      className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded border border-slate-700 text-center"
                    >
                      English
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Network & Clocktower Time */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5"
            title={isLiveSocket ? 'Connected to Station WebSocket' : 'Running in Offline Mode'}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLiveSocket ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span
              className={`text-[11px] font-bold ${
                highContrast ? 'text-yellow-300' : 'text-slate-200'
              }`}
            >
              {isLiveSocket ? 'Live MAS Feed' : 'Local Mode'}
            </span>
          </div>

          <Link
            to="/admin"
            className={`transition-colors text-[11px] font-black underline ml-2 ${
              highContrast ? 'text-yellow-300 hover:text-white' : 'text-amber-300 hover:text-white'
            }`}
          >
            Staff Console
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-2">
          {/* Authentic Logo featuring Image 4 Platform Nameboard Style */}
          <Link
            to="/"
            onClick={() => handleNavClick('Dashboard')}
            className="flex items-center gap-3 focus:outline-none rounded-xl p-1 group"
          >
            {/* Clock Tower Icon */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border-2 shadow-md group-hover:scale-105 transition-transform flex-shrink-0 ${
                highContrast
                  ? 'bg-black text-yellow-300 border-yellow-400'
                  : 'bg-gradient-to-b from-red-800 to-red-950 text-white border-amber-400'
              }`}
            >
              🏛️
            </div>

            {/* Chennai Central Signboard (Image 4) */}
            <div>
              <div className="chennai-signboard px-2.5 py-0.5 rounded-lg shadow-sm font-black flex flex-col leading-none">
                <span className="text-[9px] font-bold tracking-tight text-black">
                  சென்னை சென்ட்ரல் • चेन्नै सेन्ट्रल
                </span>
                <span className="text-xs font-black tracking-wider uppercase text-black">
                  CHENNAI CENTRAL (MAS)
                </span>
              </div>
              <span
                className={`hidden sm:block text-[10px] font-black uppercase tracking-widest mt-0.5 ${
                  highContrast ? 'text-yellow-300' : 'text-red-950'
                }`}
              >
                Southern Railway • StationPulse
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links with High Visibility Font Styling */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              if (link.isEmergency) {
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => handleNavClick(link.name)}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-xs uppercase tracking-wide transition-all shadow-md ${
                        highContrast
                          ? 'bg-red-600 text-white border-2 border-yellow-400'
                          : isActive
                          ? 'bg-red-700 text-white ring-2 ring-red-400'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      } animate-pulse-fast`
                    }
                  >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                  </NavLink>
                );
              }

              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => handleNavClick(link.name)}
                  className={({ isActive }) => {
                    if (highContrast) {
                      return `relative flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs lg:text-sm transition-all border-2 ${
                        isActive
                          ? 'bg-yellow-400 text-black border-yellow-400 shadow-md'
                          : 'bg-black text-yellow-300 hover:text-black hover:bg-yellow-400 border-yellow-400/80'
                      }`;
                    }

                    return `relative flex items-center gap-1.5 px-3 py-2 rounded-xl font-black text-xs lg:text-sm transition-all ${
                      isActive
                        ? 'bg-red-950 text-amber-300 shadow-md border border-amber-500/50'
                        : 'text-slate-900 hover:text-red-950 hover:bg-amber-100/70'
                    }`;
                  }}
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.name}</span>

                  {link.badge && (
                    <span className="w-5 h-5 bg-red-600 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-bounce shadow">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl focus:outline-none border-2 ${
                highContrast
                  ? 'bg-black text-yellow-300 border-yellow-400'
                  : 'bg-amber-50 text-slate-900 border-slate-300 hover:bg-amber-100'
              }`}
              aria-label="Toggle menu"
            >
              <span className="text-2xl font-black">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-t px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-fadeIn ${
            highContrast
              ? 'bg-black text-white border-yellow-400'
              : 'bg-white text-slate-900 border-slate-200'
          }`}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => handleNavClick(link.name)}
              className={({ isActive }) => {
                if (link.isEmergency) {
                  return 'flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-black bg-red-600 text-white shadow';
                }
                if (highContrast) {
                  return `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-black border-2 ${
                    isActive
                      ? 'bg-yellow-400 text-black border-yellow-400'
                      : 'bg-black text-yellow-300 border-yellow-400/80 hover:bg-zinc-900'
                  }`;
                }
                return `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-black transition-colors ${
                  isActive
                    ? 'bg-red-950 text-amber-300 shadow'
                    : 'text-slate-900 hover:bg-amber-50'
                }`;
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{link.icon}</span>
                <span>{link.name}</span>
              </div>
              {link.badge && (
                <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-black">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
