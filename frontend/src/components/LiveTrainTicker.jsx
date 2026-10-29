import React from 'react';
import { Link } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useAccessibility } from '../context/AccessibilityContext';

export default function LiveTrainTicker() {
  const { trains } = useSocket();
  const { highContrast } = useAccessibility();

  // Get upcoming departures (first 6)
  const upcomingTrains = trains
    .filter((t) => t.type === 'departure')
    .slice(0, 6);

  if (upcomingTrains.length === 0) return null;

  return (
    <div
      className={`border-y-2 py-2.5 overflow-hidden shadow-inner flex items-center relative z-20 transition-colors ${
        highContrast
          ? 'bg-black border-yellow-400 text-white'
          : 'bg-slate-950 border-amber-400 text-white'
      }`}
      aria-label="Live Train Departure Ticker"
    >
      {/* Ticker Lead Tag */}
      <div className="flex-shrink-0 chennai-signboard px-3 py-1 ml-4 rounded font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow border-2 border-black">
        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
        <span className="text-black">MAS LIVE DEPARTURES</span>
      </div>

      {/* Marquee Scroller */}
      <div className="overflow-hidden whitespace-nowrap flex-1 ml-3 relative">
        <div className="inline-flex gap-8 animate-marquee hover:[animation-play-state:paused]">
          {upcomingTrains.concat(upcomingTrains).map((train, index) => {
            const isDelayed = train.status === 'DELAYED';
            const isCancelled = train.status === 'CANCELLED';

            return (
              <Link
                key={`${train.id}-${index}`}
                to="/trains"
                className={`inline-flex items-center gap-2 text-sm transition-colors py-0.5 px-2.5 rounded border ${
                  highContrast
                    ? 'border-yellow-400/50 hover:bg-zinc-900 text-white'
                    : 'border-transparent hover:bg-slate-900 text-white'
                }`}
              >
                <span className="font-black text-yellow-300">
                  🚆 {train.trainNumber} {train.trainName}
                </span>
                <span className="text-white font-bold">→ {train.destination}</span>
                <span className="font-black text-amber-300">[{train.platform}]</span>
                <span className="text-xs font-mono font-bold text-yellow-200">
                  Dep: {train.scheduledTime}
                </span>

                {isDelayed ? (
                  <span className="text-xs font-black px-2 py-0.5 bg-red-600 text-white rounded border border-white/40">
                    Delayed (+{train.delayMinutes}m) Exp: {train.actualTime}
                  </span>
                ) : isCancelled ? (
                  <span className="text-xs font-black px-2 py-0.5 bg-zinc-800 text-red-400 rounded border border-red-500">
                    Cancelled
                  </span>
                ) : (
                  <span className="text-xs font-black px-2 py-0.5 bg-emerald-700 text-white rounded border border-emerald-400">
                    On Time
                  </span>
                )}
                <span className="text-yellow-400/60 ml-2 font-black">•</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
