import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { emergencyHelplines } from '../utils/mockData';

export default function SOSPage() {
  const { sendSOS } = useSocket();
  const { speak, screenReaderMode } = useAccessibility();

  const [category, setCategory] = useState('Medical Emergency');
  const [location, setLocation] = useState('Platform 1');
  const [passengerName, setPassengerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeSOS, setActiveSOS] = useState(null);
  const [isTriggering, setIsTriggering] = useState(false);

  const categories = [
    { id: 'Medical Emergency', label: '🏥 Medical Emergency', desc: 'Heart issue, fainting, injury or doctor needed' },
    { id: 'Wheelchair Help', label: '♿ Wheelchair / Divyangjan Help', desc: 'Battery cart, wheelchair loan, elderly assistance' },
    { id: 'Lost Child', label: '👶 Lost Child / Missing Person', desc: 'Child separated from family or senior citizen missing' },
    { id: 'Security', label: '🛡️ Security & Women Safety', desc: 'Harassment, theft, suspicious activity, RPF police' },
    { id: 'Fire / Hazard', label: '🔥 Fire / Station Hazard', desc: 'Smoke, short-circuit or electrical danger' },
  ];

  const stationLocations = [
    'Platform 1 (North End)',
    'Platform 1 (Center / Waiting Hall)',
    'Platform 1 (South End)',
    'Platform 2 (North End)',
    'Platform 2 (Center / Foot Over Bridge)',
    'Platform 2 (South End)',
    'Main Concourse (Gate 1 & Ticket Hall)',
    'Main Concourse (Gate 2 & Sahayata Kendra)',
    'Foot Over Bridge (Ramp / Elevator 1)',
    'AC Waiting Lounge',
    'Food Court Area',
  ];

  const handleSOSSubmit = () => {
    setIsTriggering(true);

    const sosPayload = {
      category,
      location,
      passengerName: passengerName.trim() || 'Passenger in Station',
      phone: phone.trim() || 'Self Triggered SOS',
      notes: notes.trim(),
    };

    const record = sendSOS(sosPayload);
    setActiveSOS(record);
    setIsSubmitted(true);
    setIsTriggering(false);

    toast.error('EMERGENCY SOS BROADCASTED! STATION CONTROL ALERTED.', {
      duration: 8000,
      icon: '🚨',
    });

    // Voice announcement for passenger reassurance and screen reader
    speak(
      `Emergency help request sent for ${category} at ${location}. Station security and medical officers are dispatched and on the way.`
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with High-Visibility Emergency Notice */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border border-red-300 animate-pulse">
          <span>🚨</span> Immediate Emergency Assistance Dispatch
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Passenger SOS & Help Center
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          Press the large SOS button below or select your situation. Station Control Room, RPF, and Medical Team will be alerted immediately.
        </p>
      </div>

      {/* CONFIRMATION BANNER IF DISPATCHED */}
      {isSubmitted && activeSOS ? (
        <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-red-300 animate-bounce-short">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-white text-red-600 flex items-center justify-center text-4xl font-bold shadow-lg flex-shrink-0 animate-pulse">
              🛡️
            </div>
            <div className="flex-1 space-y-2">
              <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Status: Help is on the way!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                Station Quick Response Team Dispatched
              </h2>
              <p className="text-red-100 text-sm leading-relaxed">
                Emergency Alert Reference: <span className="font-mono font-bold text-white">#{activeSOS.id}</span>
                <br />
                Location: <strong>{activeSOS.location}</strong> | Type: <strong>{activeSOS.category}</strong>
              </p>
              <div className="text-xs bg-black/20 p-2.5 rounded-xl text-red-100">
                Staff estimated arrival time: <strong>1 to 3 minutes</strong>. Please stay at your current location. If you can, wave to the nearest CCTV camera or security patrol.
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-red-400 flex flex-wrap justify-between items-center gap-3">
            <span className="text-xs text-red-200">
              Need immediate voice contact? Call Railway Emergency:
            </span>
            <div className="flex gap-2">
              <a
                href="tel:139"
                className="bg-white text-red-700 font-black px-4 py-2 rounded-xl text-sm shadow hover:bg-red-50 transition-colors"
              >
                📞 Call 139 (Helpline)
              </a>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-black/30 hover:bg-black/40 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                Send Another Request
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* SOS TRIGGER SECTION */
        <div className="space-y-8">
          {/* GIANT RED SOS BUTTON */}
          <div className="flex flex-col items-center justify-center py-4">
            <button
              onClick={handleSOSSubmit}
              disabled={isTriggering}
              aria-label="PRESS FOR IMMEDIATE SOS HELP"
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 hover:from-red-600 hover:to-red-900 text-white shadow-2xl flex flex-col items-center justify-center border-8 border-red-200 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-8 focus:ring-red-400 select-none group"
            >
              <span className="text-5xl sm:text-6xl animate-pulse group-hover:scale-110 transition-transform">
                🚨
              </span>
              <span className="text-3xl sm:text-4xl font-black tracking-widest mt-2">
                SOS
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-200 mt-1">
                TAP TO SEND HELP
              </span>
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center font-medium">
              * Tapping triggers an instant high-priority emergency beacon to station masters & RPF post.
            </p>
          </div>

          {/* Details Configurator (Category, Location, Details) */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-gray-900 border-b border-gray-100 pb-3">
              Help Details & Location
            </h2>

            {/* 1. Category Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                1. Select Assistance Category:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      category === cat.id
                        ? 'border-red-600 bg-red-50/70 text-red-900 ring-2 ring-red-400'
                        : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-sm">{cat.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{cat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Location Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                2. Where are you currently situated?
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {stationLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    📍 {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Optional Passenger Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Passenger / Helper Name (Optional)
                </label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Contact Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Additional Notes / Specific Needs
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Passenger is diabetic, wheelchair battery dead, elderly woman traveling alone..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              type="button"
              onClick={handleSOSSubmit}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-base py-3.5 px-6 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>🚨</span>
              <span>Confirm & Dispatch Immediate Help</span>
            </button>
          </div>
        </div>
      )}

      {/* Emergency Helpline Directory */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <span>📞</span> 24x7 Direct Helpline Numbers
        </h3>
        <p className="text-xs text-slate-400">
          If your device cannot send requests, dial any of the numbers below directly:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {emergencyHelplines.map((hl) => (
            <a
              key={hl.number}
              href={`tel:${hl.number}`}
              className="bg-slate-800/80 hover:bg-slate-700 border border-slate-700 p-3.5 rounded-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-xs text-slate-400 font-medium">{hl.name}</div>
                <div className="text-xl font-black text-yellow-400 mt-1">{hl.number}</div>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">{hl.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
