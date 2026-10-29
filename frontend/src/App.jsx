import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SOSButton from './components/SOSButton';

import Dashboard from './pages/Dashboard';
import StationMap from './components/StationMap';
import TrainStatus from './pages/TrainStatus';
import Facilities from './pages/Facilities';
import LostFound from './pages/LostFound';
import Alerts from './pages/Alerts';
import SOSPage from './pages/SOSPage';
import AdminDashboard from './pages/AdminDashboard';

// Dedicated Map Page wrapper with header and instructions
function MapPageWrapper() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            <span>🗺️</span> Station Facility Navigation & Accessibility Map
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Tap any facility icon to view accessibility details, voice guidance, and real-time passenger crowd level.
          </p>
        </div>
      </div>
      <StationMap />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 transition-colors duration-200">
      {/* Toast Notification Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#0f172a',
            color: '#fff',
            fontSize: '13px',
            fontWeight: '600',
          },
        }}
      />

      {/* Main App Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<MapPageWrapper />} />
          <Route path="/trains" element={<TrainStatus />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/sos" element={<SOSPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Floating SOS button across pages */}
      <SOSButton />

      {/* Footer */}
      <Footer />
    </div>
  );
}
