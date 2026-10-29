import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';

export default function SOSButton() {
  const location = useLocation();
  const { speak, screenReaderMode } = useAccessibility();

  // Hide button on the SOS page itself to avoid duplication
  if (location.pathname === '/sos') {
    return null;
  }

  const handleClick = () => {
    if (screenReaderMode) {
      speak('Opening Emergency Assistance SOS Page');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Pulse wave ring */}
      <div className="absolute -inset-1 rounded-full bg-red-600 opacity-75 blur-sm animate-ping group-hover:opacity-100" />

      {/* Main button */}
      <Link
        to="/sos"
        onClick={handleClick}
        aria-label="Emergency Assistance SOS Button. Click for immediate railway staff, medical, or wheelchair help."
        className="relative flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold px-5 py-3.5 rounded-full shadow-2xl transition-all duration-200 transform group-hover:scale-105 border-2 border-white focus:outline-none focus:ring-4 focus:ring-red-400"
      >
        <span className="text-2xl animate-bounce" role="img" aria-label="Alert">🚨</span>
        <span className="text-lg tracking-wider font-black">SOS HELP</span>
        <span className="hidden sm:inline-block text-xs bg-red-900/60 px-2 py-0.5 rounded-full uppercase tracking-widest text-red-100 border border-red-400/40">
          Emergency
        </span>
      </Link>
    </div>
  );
}
