import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import {
  initialTrains,
  initialFacilities,
  initialAlerts,
  initialLostFound,
  initialSOSRequests,
  stationZones,
} from '../utils/mockData';

const SocketContext = createContext();

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLiveSocket, setIsLiveSocket] = useState(false);

  // Real-time Station State with mock fallback
  const [trains, setTrains] = useState(() => {
    const saved = localStorage.getItem('railway_trains');
    return saved ? JSON.parse(saved) : initialTrains;
  });

  const [facilities, setFacilities] = useState(() => {
    const saved = localStorage.getItem('railway_facilities');
    return saved ? JSON.parse(saved) : initialFacilities;
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('railway_alerts');
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  const [lostFoundList, setLostFoundList] = useState(() => {
    const saved = localStorage.getItem('railway_lost_found');
    return saved ? JSON.parse(saved) : initialLostFound;
  });

  const [sosRequests, setSosRequests] = useState(() => {
    const saved = localStorage.getItem('railway_sos');
    return saved ? JSON.parse(saved) : initialSOSRequests;
  });

  const [zones, setZones] = useState(() => {
    const saved = localStorage.getItem('railway_zones');
    return saved ? JSON.parse(saved) : stationZones;
  });

  // Recent update highlight tracker
  const [recentUpdatedTrainId, setRecentUpdatedTrainId] = useState(null);

  // Persist local state whenever it changes for offline resilience
  useEffect(() => {
    localStorage.setItem('railway_trains', JSON.stringify(trains));
  }, [trains]);

  useEffect(() => {
    localStorage.setItem('railway_facilities', JSON.stringify(facilities));
  }, [facilities]);

  useEffect(() => {
    localStorage.setItem('railway_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('railway_lost_found', JSON.stringify(lostFoundList));
  }, [lostFoundList]);

  useEffect(() => {
    localStorage.setItem('railway_sos', JSON.stringify(sosRequests));
  }, [sosRequests]);

  useEffect(() => {
    localStorage.setItem('railway_zones', JSON.stringify(zones));
  }, [zones]);

  // Establish socket connection
  useEffect(() => {
    let newSocket;
    try {
      newSocket = io(SOCKET_SERVER_URL, {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        timeout: 5000,
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        setIsLiveSocket(true);
        console.log('✅ Connected to Station Real-time Socket Server');
        toast.success('Live Station Feed Connected', { id: 'socket-status' });
      });

      newSocket.on('disconnect', (reason) => {
        setIsConnected(false);
        setIsLiveSocket(false);
        console.warn('⚠️ Disconnected from Socket Server:', reason);
      });

      newSocket.on('connect_error', (err) => {
        setIsConnected(false);
        setIsLiveSocket(false);
        // Silent fallback to mock data
      });

      // Socket Event Listeners for real-time updates
      newSocket.on('trains:list', (data) => {
        if (Array.isArray(data)) setTrains(data);
      });

      newSocket.on('train:updated', (updatedTrain) => {
        setTrains((prev) =>
          prev.map((t) => (t.id === updatedTrain.id ? { ...t, ...updatedTrain } : t))
        );
        setRecentUpdatedTrainId(updatedTrain.id);
        setTimeout(() => setRecentUpdatedTrainId(null), 4000);
        toast(`Train ${updatedTrain.trainNumber} updated: ${updatedTrain.status}`, {
          icon: '🚆',
        });
      });

      newSocket.on('facility:updated', (updatedFacility) => {
        setFacilities((prev) =>
          prev.map((f) => (f.id === updatedFacility.id ? { ...f, ...updatedFacility } : f))
        );
        toast(`Facility "${updatedFacility.name}" status updated`, {
          icon: '📍',
        });
      });

      newSocket.on('alert:new', (newAlert) => {
        setAlerts((prev) => [newAlert, ...prev]);
        toast.error(`ALERT: ${newAlert.title}`, {
          duration: 6000,
          icon: '🚨',
        });
      });

      newSocket.on('sos:new', (newSOS) => {
        setSosRequests((prev) => [newSOS, ...prev]);
        toast.error(`EMERGENCY SOS: ${newSOS.category} at ${newSOS.location}`, {
          duration: 8000,
          icon: '🆘',
        });
      });

      newSocket.on('sos:status_changed', ({ id, status, assignedTo }) => {
        setSosRequests((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status, assignedTo } : s))
        );
      });

      newSocket.on('crowd:zone_updated', (updatedZone) => {
        setZones((prev) =>
          prev.map((z) => (z.id === updatedZone.id ? { ...z, ...updatedZone } : z))
        );
      });

      setSocket(newSocket);
    } catch (e) {
      console.warn('Socket initialization error, running in offline mock mode:', e);
    }

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  // Action methods with seamless offline/mock fallback
  const sendSOS = (sosData) => {
    const newRecord = {
      id: `sos-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING',
      ...sosData,
    };

    if (socket && isLiveSocket) {
      socket.emit('sos:create', newRecord);
    }

    // Always update local state
    setSosRequests((prev) => [newRecord, ...prev]);

    // Simulate automatic security / medical dispatch after 3 seconds if in mock mode
    setTimeout(() => {
      setSosRequests((prev) =>
        prev.map((s) =>
          s.id === newRecord.id
            ? {
                ...s,
                status: 'DISPATCHED',
                assignedTo: 'RPF Station Quick Reaction Team #2',
              }
            : s
        )
      );
      toast.success('Help Dispatched! Staff is on the way to your location.', {
        icon: '🛡️',
        duration: 5000,
      });
    }, 3500);

    return newRecord;
  };

  const updateSOSStatus = (id, status, assignedTo) => {
    if (socket && isLiveSocket) {
      socket.emit('sos:update_status', { id, status, assignedTo });
    }
    setSosRequests((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, ...(assignedTo && { assignedTo }) } : s))
    );
  };

  const updateTrain = (trainId, updatedFields) => {
    if (socket && isLiveSocket) {
      socket.emit('train:update', { id: trainId, ...updatedFields });
    }
    setTrains((prev) =>
      prev.map((t) => (t.id === trainId ? { ...t, ...updatedFields } : t))
    );
    setRecentUpdatedTrainId(trainId);
    setTimeout(() => setRecentUpdatedTrainId(null), 3000);
  };

  const addTrain = (newTrain) => {
    const record = {
      id: `tr-${Date.now()}`,
      ...newTrain,
    };
    if (socket && isLiveSocket) {
      socket.emit('train:create', record);
    }
    setTrains((prev) => [record, ...prev]);
  };

  const updateFacility = (facilityId, updatedFields) => {
    if (socket && isLiveSocket) {
      socket.emit('facility:update', { id: facilityId, ...updatedFields });
    }
    setFacilities((prev) =>
      prev.map((f) => (f.id === facilityId ? { ...f, ...updatedFields } : f))
    );
  };

  const broadcastAlert = (alertData) => {
    const newAlert = {
      id: `alt-${Date.now()}`,
      time: 'Just now',
      active: true,
      ...alertData,
    };
    if (socket && isLiveSocket) {
      socket.emit('alert:create', newAlert);
    }
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const updateZoneCrowd = (zoneId, crowdLevel) => {
    if (socket && isLiveSocket) {
      socket.emit('crowd:update', { id: zoneId, crowd: crowdLevel });
    }
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, crowd: crowdLevel } : z))
    );
  };

  const addLostFound = (item) => {
    const newItem = {
      id: `lf-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: item.type === 'found' ? 'In Station Custody' : 'Reported',
      ...item,
    };
    if (socket && isLiveSocket) {
      socket.emit('lost_found:create', newItem);
    }
    setLostFoundList((prev) => [newItem, ...prev]);
    return newItem;
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        isLiveSocket,
        trains,
        facilities,
        alerts,
        lostFoundList,
        sosRequests,
        zones,
        recentUpdatedTrainId,
        sendSOS,
        updateSOSStatus,
        updateTrain,
        addTrain,
        updateFacility,
        broadcastAlert,
        updateZoneCrowd,
        addLostFound,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
