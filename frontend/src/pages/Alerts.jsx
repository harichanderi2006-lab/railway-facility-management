import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAccessibility } from '../context/AccessibilityContext';

export default function Alerts() {
  const { alerts } = useSocket();
  const { speak, screenReaderMode } = useAccessibility();
  const [filterType, setFilterType] = useState('ALL');

  const emergencyAlerts = alerts.filter(
    (a) => a.active && a.type === 'EMERGENCY'
  );

  const filteredAlerts = alerts.filter((a) => {
    if (filterType === 'ACTIVE') return a.active;
    if (filterType === 'EMERGENCY') return a.type === 'EMERGENCY';
    if (filterType === 'WARNING') return a.type === 'WARNING';
    if (filterType === 'INFO') return a.type === 'INFO';
    return true;
  });

  const handleSpeakAlert = (alert) => {
    speak(`${alert.type} Alert: ${alert.title}. ${alert.message}. Affected area: ${alert.affectedArea || 'Station premises'}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            <span>🔔</span> Station Emergency & Service Alerts
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Real-time public notices, platform updates, maintenance advisories, and emergency broadcasts.
          </p>
        </div>

        {emergencyAlerts.length > 0 && (
          <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-xl border border-red-300 text-sm font-bold animate-pulse">
            <span>🚨</span> {emergencyAlerts.length} Critical Notice Active
          </div>
        )}
      </div>

      {/* TOP EMERGENCY ALERT BANNER (If any active) */}
      {emergencyAlerts.length > 0 && (
        <div className="space-y-3">
          {emergencyAlerts.map((em) => (
            <div
              key={em.id}
              className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-2 border-red-300"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl animate-bounce">🚨</span>
                <div>
                  <div className="inline-block px-2 py-0.5 bg-black/30 rounded text-xs font-black uppercase tracking-widest text-red-200 mb-1">
                    Emergency Broadcast
                  </div>
                  <h2 className="text-lg sm:text-xl font-black">{em.title}</h2>
                  <p className="text-sm text-red-100 mt-1 leading-relaxed">{em.message}</p>
                  {em.affectedArea && (
                    <div className="text-xs text-red-200 mt-2 font-semibold">
                      Location Affected: <span className="text-white underline">{em.affectedArea}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleSpeakAlert(em)}
                className="bg-white text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap shadow flex items-center gap-2 transition-colors self-end md:self-auto"
              >
                <span>🔊</span> Listen Notice
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap gap-2">
        {[
          { id: 'ALL', label: `All Alerts (${alerts.length})` },
          { id: 'ACTIVE', label: 'Active Now' },
          { id: 'EMERGENCY', label: 'Critical / Emergency' },
          { id: 'WARNING', label: 'Warnings' },
          { id: 'INFO', label: 'General Info' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterType === f.id
                ? 'bg-slate-900 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isEmergency = alert.type === 'EMERGENCY';
          const isWarning = alert.type === 'WARNING';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all ${
                isEmergency
                  ? 'bg-red-50/70 border-red-300'
                  : isWarning
                  ? 'bg-amber-50/70 border-amber-300'
                  : 'bg-white border-gray-200'
              } shadow-sm hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
            >
              <div className="flex items-start gap-3.5">
                <span className="text-3xl flex-shrink-0">
                  {isEmergency ? '🚨' : isWarning ? '⚠️' : '📢'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        isEmergency
                          ? 'bg-red-600 text-white'
                          : isWarning
                          ? 'bg-amber-500 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {alert.type}
                    </span>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                    {alert.active ? (
                      <span className="text-xs text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded">
                        Active
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        Archived
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-2">
                    {alert.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                    {alert.message}
                  </p>

                  {alert.affectedArea && (
                    <div className="text-xs text-gray-500 mt-2 font-medium">
                      Affected Zone: <span className="font-semibold text-gray-800">{alert.affectedArea}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleSpeakAlert(alert)}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-slate-800 hover:text-white transition-colors text-gray-700 text-xs font-semibold flex items-center gap-1.5 self-end md:self-auto"
                title="Play voice readout"
                aria-label={`Listen voice alert for ${alert.title}`}
              >
                <span>🔊</span> Listen
              </button>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
            <span className="text-4xl block mb-2">✅</span>
            <h3 className="text-lg font-bold text-gray-800">No alerts found</h3>
            <p className="text-sm text-gray-500 mt-1">All station operations running normally.</p>
          </div>
        )}
      </div>
    </div>
  );
}
