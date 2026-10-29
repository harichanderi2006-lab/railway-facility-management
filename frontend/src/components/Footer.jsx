import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-chennai-night text-slate-300 border-t-4 border-chennai-yellow mt-auto pt-10 pb-8 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Station Pulse Branding */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl" role="img" aria-label="train station">🏛️</span>
              <span className="text-xl font-black tracking-tight text-white">
                Station<span className="text-chennai-yellow">Pulse</span>
              </span>
            </div>
            
            {/* Image 4 Yellow Signboard Tag */}
            <div className="inline-block chennai-signboard px-3 py-1 rounded text-xs font-black shadow-md border border-black/40">
              சென்னை சென்ட்ரல் • CHENNAI CENTRAL
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Dr. M.G.R. Chennai Central Railway Station (MAS) Facility Navigation & Divyangjan Accessibility Assistance System.
            </p>
            <div className="text-[11px] text-amber-200/80">
              Barrier-free travel for everyone. High contrast, tactile pathways & live suburban tracking.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-chennai-yellow">🧭</span> Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-chennai-yellow transition-colors">Station Dashboard</Link>
              </li>
              <li>
                <Link to="/trains" className="hover:text-chennai-yellow transition-colors font-semibold text-amber-300">Live Train Tracking (Transit Map)</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-chennai-yellow transition-colors">Station Floor Map & Minimap</Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-chennai-yellow transition-colors">Facility Directory & Routes</Link>
              </li>
              <li>
                <Link to="/lost-found" className="hover:text-chennai-yellow transition-colors">Lost & Found Portal</Link>
              </li>
              <li>
                <Link to="/alerts" className="hover:text-chennai-yellow transition-colors">Emergency Bulletins</Link>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-chennai-red">🚨</span> 24x7 Helplines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
                <span className="text-slate-300">Southern Railway Helpline</span>
                <a href="tel:139" className="text-chennai-yellow font-black hover:underline">139</a>
              </li>
              <li className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
                <span className="text-slate-300">RPF Chennai Central Post</span>
                <a href="tel:182" className="text-chennai-yellow font-black hover:underline">182</a>
              </li>
              <li className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
                <span className="text-slate-300">Divyangjan Sahayata (Gate 2)</span>
                <a href="tel:04425353545" className="text-emerald-400 font-bold hover:underline">044-25353545</a>
              </li>
              <li className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-lg border border-slate-800">
                <span className="text-slate-300">National Emergency Unified</span>
                <a href="tel:112" className="text-red-400 font-black hover:underline">112</a>
              </li>
            </ul>
          </div>

          {/* Accessibility & Admin */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-purple-400">♿</span> Divyangjan Support
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Designed according to Accessible India (Sugamya Bharat) standards with tactile flooring paths and ramp guides.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                to="/sos"
                className="inline-flex items-center justify-center gap-1.5 bg-chennai-red hover:bg-chennai-crimson text-white font-black text-xs py-2 px-3 rounded-xl shadow-lg transition-colors border border-white/20"
              >
                <span>🆘</span> Request Immediate Assistance
              </Link>
              <Link
                to="/admin"
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-block mt-2 text-center"
              >
                Station Staff & Admin Portal →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} StationPulse Dr. M.G.R. Chennai Central (MAS) — Southern Railway.</p>
          <div className="flex items-center gap-3">
            <span className="text-green-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping inline-block" />
              Live Telemetry & IoT Active
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-300 font-mono">Platform 1 - 17 Connected</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
