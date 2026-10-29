import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import CrowdBadge from '../components/CrowdBadge';

export default function AdminDashboard() {
  const {
    trains,
    facilities,
    alerts,
    sosRequests,
    zones,
    updateTrain,
    addTrain,
    updateFacility,
    broadcastAlert,
    updateSOSStatus,
    updateZoneCrowd,
  } = useSocket();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('railway_admin_auth') === 'true';
  });
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState('sos'); // 'sos', 'trains', 'facilities', 'alerts', 'crowd'

  // Form states
  const [newTrainData, setNewTrainData] = useState({
    trainNumber: '',
    trainName: '',
    type: 'departure',
    origin: 'New Delhi (NDLS)',
    destination: '',
    platform: 'Platform 1',
    scheduledTime: '12:00',
    actualTime: '12:00',
    delayMinutes: 0,
    status: 'ON_TIME',
    crowdLevel: 'low',
    accessibleCoaches: 'Coaches A1, B1 with accessible toilet',
  });

  const [newAlertData, setNewAlertData] = useState({
    type: 'EMERGENCY',
    title: '',
    message: '',
    affectedArea: '',
    priority: 'high',
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginCreds.username === 'admin' && loginCreds.password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('railway_admin_auth', 'true');
      setLoginError('');
      toast.success('Welcome, Station Master Admin!');
    } else {
      setLoginError('Invalid credentials. Use admin / admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('railway_admin_auth');
    toast('Logged out from Admin Console');
  };

  const handleAddTrain = (e) => {
    e.preventDefault();
    if (!newTrainData.trainNumber || !newTrainData.trainName || !newTrainData.destination) {
      toast.error('Please fill in train number, name and destination.');
      return;
    }

    addTrain(newTrainData);
    toast.success(`Train ${newTrainData.trainNumber} added to live schedule!`);
    setNewTrainData({
      trainNumber: '',
      trainName: '',
      type: 'departure',
      origin: 'New Delhi (NDLS)',
      destination: '',
      platform: 'Platform 1',
      scheduledTime: '12:00',
      actualTime: '12:00',
      delayMinutes: 0,
      status: 'ON_TIME',
      crowdLevel: 'low',
      accessibleCoaches: 'Accessible toilet in B1',
    });
  };

  const handleBroadcastAlert = (e) => {
    e.preventDefault();
    if (!newAlertData.title || !newAlertData.message) {
      toast.error('Please enter title and message for public alert.');
      return;
    }

    broadcastAlert(newAlertData);
    toast.success('Emergency public notice broadcasted to all passengers!');
    setNewAlertData({
      type: 'EMERGENCY',
      title: '',
      message: '',
      affectedArea: '',
      priority: 'high',
    });
  };

  // Simple Login Gate View
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-4xl" role="img" aria-label="shield">🛡️</span>
            <h1 className="text-2xl font-black text-gray-900">Station Staff Portal</h1>
            <p className="text-xs text-gray-500">
              Authorized access for Station Masters, RPF Dispatchers & Controllers.
            </p>
          </div>

          {loginError && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 font-medium">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={loginCreds.username}
                onChange={(e) => setLoginCreds({ ...loginCreds, username: e.target.value })}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-railBlue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginCreds.password}
                onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                placeholder="admin123"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-railBlue"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-4 rounded-xl shadow transition-colors"
            >
              Sign In to Station Console
            </button>
          </form>

          <div className="text-center text-xs text-gray-400 bg-gray-50 p-2.5 rounded-xl">
            Demo Credentials: <span className="font-mono text-gray-700">admin</span> / <span className="font-mono text-gray-700">admin123</span>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Console View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-600/40 text-blue-300 text-xs px-2.5 py-0.5 rounded-full font-bold mb-1">
            <span>● 24/7 Operations Hub</span>
          </div>
          <h1 className="text-2xl font-black">Station Operations & Admin Control</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage live train schedules, facility occupancy, emergency alerts, and passenger SOS dispatch.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow"
        >
          Sign Out
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        {[
          { id: 'sos', label: `🚨 SOS Requests (${sosRequests.length})` },
          { id: 'trains', label: `🚆 Train Control (${trains.length})` },
          { id: 'facilities', label: `🚻 Facility Maintenance (${facilities.length})` },
          { id: 'alerts', label: `📢 Emergency Alerts (${alerts.length})` },
          { id: 'crowd', label: '👥 Station Crowd Density' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-5 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-railBlue text-railBlue'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SOS REQUESTS DISPATCH */}
      {activeTab === 'sos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Live Passenger SOS Queue</h2>
            <span className="text-xs text-gray-500">Real-time updates via WebSocket</span>
          </div>

          <div className="space-y-3">
            {sosRequests.map((sos) => {
              const isPending = sos.status === 'PENDING';
              const isDispatched = sos.status === 'DISPATCHED';

              return (
                <div
                  key={sos.id}
                  className={`p-5 rounded-2xl border ${
                    isPending
                      ? 'bg-red-50 border-red-300'
                      : isDispatched
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-white border-gray-200'
                  } shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-500">#{sos.id}</span>
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase ${
                          isPending
                            ? 'bg-red-600 text-white animate-pulse'
                            : isDispatched
                            ? 'bg-amber-500 text-white'
                            : 'bg-green-600 text-white'
                        }`}
                      >
                        {sos.status}
                      </span>
                      <span className="text-xs text-gray-400">{sos.timestamp}</span>
                    </div>

                    <h3 className="text-base font-black text-gray-900 mt-1">
                      {sos.category} at <span className="text-railBlue">{sos.location}</span>
                    </h3>

                    <div className="text-xs text-gray-600 flex flex-wrap gap-4 mt-1">
                      <span>Passenger: <strong>{sos.passengerName}</strong></span>
                      <span>Phone: <strong>{sos.phone}</strong></span>
                      {sos.assignedTo && (
                        <span>Assigned: <strong className="text-green-700">{sos.assignedTo}</strong></span>
                      )}
                    </div>

                    {sos.notes && (
                      <p className="text-xs text-gray-500 italic mt-1">Note: {sos.notes}</p>
                    )}
                  </div>

                  {/* Status Change Buttons */}
                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {isPending && (
                      <button
                        onClick={() =>
                          updateSOSStatus(sos.id, 'DISPATCHED', 'RPF Quick Reaction Team')
                        }
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
                      >
                        Dispatch Staff
                      </button>
                    )}
                    {sos.status !== 'RESOLVED' && (
                      <button
                        onClick={() =>
                          updateSOSStatus(sos.id, 'RESOLVED', sos.assignedTo || 'Duty Officer')
                        }
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                      >
                        Mark Resolved ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TRAIN MANAGEMENT */}
      {activeTab === 'trains' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Train Form */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-black text-gray-900 flex items-center gap-1.5">
              <span>➕</span> Add New Train Schedule
            </h2>

            <form onSubmit={handleAddTrain} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Train Number</label>
                <input
                  type="text"
                  required
                  value={newTrainData.trainNumber}
                  onChange={(e) =>
                    setNewTrainData({ ...newTrainData, trainNumber: e.target.value })
                  }
                  placeholder="e.g. 12002"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Train Name</label>
                <input
                  type="text"
                  required
                  value={newTrainData.trainName}
                  onChange={(e) =>
                    setNewTrainData({ ...newTrainData, trainName: e.target.value })
                  }
                  placeholder="e.g. Bhopal Shatabdi"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Type</label>
                  <select
                    value={newTrainData.type}
                    onChange={(e) =>
                      setNewTrainData({ ...newTrainData, type: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="departure">Departure</option>
                    <option value="arrival">Arrival</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Platform</label>
                  <select
                    value={newTrainData.platform}
                    onChange={(e) =>
                      setNewTrainData({ ...newTrainData, platform: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="Platform 1">Platform 1</option>
                    <option value="Platform 2">Platform 2</option>
                    <option value="Platform 3">Platform 3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Destination Station</label>
                <input
                  type="text"
                  required
                  value={newTrainData.destination}
                  onChange={(e) =>
                    setNewTrainData({ ...newTrainData, destination: e.target.value })
                  }
                  placeholder="e.g. Bhopal Jn (BPL)"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    value={newTrainData.scheduledTime}
                    onChange={(e) =>
                      setNewTrainData({
                        ...newTrainData,
                        scheduledTime: e.target.value,
                        actualTime: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={newTrainData.status}
                    onChange={(e) =>
                      setNewTrainData({ ...newTrainData, status: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg bg-white"
                  >
                    <option value="ON_TIME">ON_TIME</option>
                    <option value="DELAYED">DELAYED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-railBlue hover:bg-railBlue-dark text-white font-bold py-2.5 rounded-xl shadow transition-colors text-xs"
              >
                Publish Train Schedule
              </button>
            </form>
          </div>

          {/* Active Trains List & In-Place Quick Editors */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-base font-black text-gray-900">Current Train List & Quick Status Controls</h2>
            <div className="space-y-3">
              {trains.map((train) => (
                <div
                  key={train.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-black text-sm text-gray-900">
                      🚆 {train.trainNumber} - {train.trainName}
                    </div>
                    <div className="text-gray-500 mt-0.5">
                      {train.origin} → {train.destination} | Sched: {train.scheduledTime}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Platform Selector */}
                    <select
                      value={train.platform}
                      onChange={(e) => updateTrain(train.id, { platform: e.target.value })}
                      className="p-1.5 border rounded-lg bg-gray-50 text-xs font-bold"
                      aria-label="Change Platform"
                    >
                      <option value="Platform 1">Platform 1</option>
                      <option value="Platform 2">Platform 2</option>
                      <option value="Platform 3">Platform 3</option>
                    </select>

                    {/* Status Changer */}
                    <select
                      value={train.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        const delay = newStatus === 'DELAYED' ? 20 : 0;
                        updateTrain(train.id, {
                          status: newStatus,
                          delayMinutes: delay,
                          actualTime: newStatus === 'CANCELLED' ? 'Cancelled' : train.scheduledTime,
                        });
                      }}
                      className="p-1.5 border rounded-lg bg-gray-50 text-xs font-bold"
                      aria-label="Change Status"
                    >
                      <option value="ON_TIME">ON_TIME</option>
                      <option value="DELAYED">DELAYED (+20m)</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FACILITY MAINTENANCE */}
      {activeTab === 'facilities' && (
        <div className="space-y-3">
          <h2 className="text-base font-black text-gray-900">Facility Operations & Availability Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{fac.icon}</span>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{fac.name}</div>
                    <div className="text-gray-500">{fac.platform} - {fac.locationDesc}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Availability Toggle */}
                  <button
                    onClick={() => updateFacility(fac.id, { isAvailable: !fac.isAvailable })}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                      fac.isAvailable
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {fac.isAvailable ? 'Operational' : 'Maintenance'}
                  </button>

                  {/* Crowd Level Selector */}
                  <select
                    value={fac.crowdLevel}
                    onChange={(e) => updateFacility(fac.id, { crowdLevel: e.target.value })}
                    className="p-1.5 border rounded-lg bg-gray-50 text-xs"
                    aria-label="Change Crowd Level"
                  >
                    <option value="low">Low Crowd</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EMERGENCY ALERTS BROADCASTER */}
      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
              <span>📢</span> Broadcast Station Alert
            </h2>

            <form onSubmit={handleBroadcastAlert} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Alert Category</label>
                <select
                  value={newAlertData.type}
                  onChange={(e) =>
                    setNewAlertData({ ...newAlertData, type: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="EMERGENCY">EMERGENCY (Red Flash)</option>
                  <option value="WARNING">WARNING (Amber Notice)</option>
                  <option value="INFO">INFO (General Advisory)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Headline Title</label>
                <input
                  type="text"
                  required
                  value={newAlertData.title}
                  onChange={(e) =>
                    setNewAlertData({ ...newAlertData, title: e.target.value })
                  }
                  placeholder="e.g. Platform 2 Escalator Under Inspection"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Announcement Message</label>
                <textarea
                  rows="3"
                  required
                  value={newAlertData.message}
                  onChange={(e) =>
                    setNewAlertData({ ...newAlertData, message: e.target.value })
                  }
                  placeholder="Detail instructions for passengers and alternate paths..."
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Affected Area</label>
                <input
                  type="text"
                  value={newAlertData.affectedArea}
                  onChange={(e) =>
                    setNewAlertData({ ...newAlertData, affectedArea: e.target.value })
                  }
                  placeholder="e.g. Foot Over Bridge North Span"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl shadow transition-colors text-xs"
              >
                Broadcast to All Displays
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-base font-black text-gray-900">Current Broadcasts ({alerts.length})</h2>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase px-2 py-0.5 rounded bg-gray-100">
                        {alert.type}
                      </span>
                      <span className="text-gray-400">{alert.time}</span>
                    </div>
                    <div className="font-bold text-sm text-gray-900 mt-1">{alert.title}</div>
                    <p className="text-gray-600 mt-0.5">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CROWD DENSITY ADJUSTER */}
      {activeTab === 'crowd' && (
        <div className="space-y-4">
          <h2 className="text-base font-black text-gray-900">Station Zone Crowd Density Override</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="font-bold text-sm text-gray-900">{zone.name}</div>
                  <CrowdBadge level={zone.crowd} size="small" />
                </div>
                <div className="text-xs text-gray-500">
                  Current estimate: {zone.passengerCount} passengers
                </div>

                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => updateZoneCrowd(zone.id, lvl)}
                      className={`flex-1 py-1 text-xs rounded-lg font-bold capitalize transition-all ${
                        zone.crowd === lvl
                          ? 'bg-slate-900 text-white shadow'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
