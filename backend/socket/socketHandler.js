const Train = require('../models/Train');
const Facility = require('../models/Facility');
const Alert = require('../models/Alert');
const CrowdData = require('../models/CrowdData');

const STATION_AREAS = [
  'Platform 1',
  'Platform 2',
  'Platform 3',
  'Main Concourse',
  'Ticket Counter',
  'Waiting Hall',
  'Food Court',
  'Foot Overbridge',
];

const CROWD_LEVELS = ['low', 'medium', 'high'];

/**
 * Initializes Socket.IO events and automated simulation loops
 * @param {import('socket.io').Server} io
 */
function initSocket(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join room by station area (for localized alerts and crowd levels)
    socket.on('joinArea', (area) => {
      if (area) {
        const room = `area_${area}`;
        socket.join(room);
        console.log(`[Socket.io] Socket ${socket.id} joined room ${room}`);
        socket.emit('joinedArea', { area, message: `Subscribed to real-time updates for ${area}` });
      }
    });

    // Leave area room
    socket.on('leaveArea', (area) => {
      if (area) {
        const room = `area_${area}`;
        socket.leave(room);
        console.log(`[Socket.io] Socket ${socket.id} left room ${room}`);
      }
    });

    // Handle SOS Alert from client (Accessibility / Emergency assistance)
    socket.on('sosAlert', async (data) => {
      try {
        console.warn(`[SOS ALERT RECEIVED] from socket ${socket.id}:`, data);

        const sosPayload = {
          type: 'emergency',
          message: data?.message || 'Emergency SOS assistance triggered by passenger',
          area: data?.area || 'Unknown Area',
          user: data?.user || { name: 'Anonymous Passenger' },
          location: data?.location || null,
          needWheelchair: Boolean(data?.needWheelchair),
          needMedical: Boolean(data?.needMedical),
          timestamp: new Date().toISOString(),
          sosId: 'SOS-' + Date.now(),
        };

        // Try saving to database as an active emergency alert
        try {
          const alertDoc = new Alert({
            type: 'emergency',
            message: `[SOS] ${sosPayload.message} at ${sosPayload.area}`,
            area: sosPayload.area,
            isActive: true,
          });
          await alertDoc.save();
          sosPayload.alertId = alertDoc._id;
        } catch (dbErr) {
          console.error('[Socket.io] Could not persist SOS alert to DB:', dbErr.message);
        }

        // Broadcast urgent SOS to all connected clients (passengers, station staff, admins)
        io.emit('sosAlert', sosPayload);
        io.emit('emergencyAlert', sosPayload);
      } catch (err) {
        console.error('[Socket.io] Error processing sosAlert:', err);
      }
    });

    // Handle emergency alert broadcast
    socket.on('emergencyAlert', async (data) => {
      try {
        console.warn('[EMERGENCY ALERT BROADCAST]:', data);
        const alertData = {
          type: 'emergency',
          message: data?.message || 'Station Emergency Alert',
          area: data?.area || 'Station-Wide',
          timestamp: new Date().toISOString(),
        };

        try {
          const alertDoc = new Alert({
            type: 'emergency',
            message: alertData.message,
            area: alertData.area,
            isActive: true,
          });
          await alertDoc.save();
          alertData.alertId = alertDoc._id;
        } catch (dbErr) {
          console.error('[Socket.io] Error persisting emergency alert:', dbErr.message);
        }

        io.emit('emergencyAlert', alertData);
      } catch (err) {
        console.error('[Socket.io] Error broadcasting emergency alert:', err);
      }
    });

    // Handle on-demand facility update request
    socket.on('requestFacilityUpdate', async (facilityId) => {
      try {
        if (facilityId) {
          const facility = await Facility.findById(facilityId);
          if (facility) {
            socket.emit('facilityUpdate', facility);
          }
        } else {
          const allFacilities = await Facility.find();
          socket.emit('allFacilitiesUpdate', allFacilities);
        }
      } catch (err) {
        console.error('[Socket.io] Error handling requestFacilityUpdate:', err.message);
      }
    });

    // Handle manual facility update from staff
    socket.on('facilityUpdate', (facility) => {
      io.emit('facilityUpdate', facility);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  // =========================================================================
  // SIMULATION INTERVALS
  // =========================================================================

  // 1. Emit crowdUpdate every 10 seconds with simulated crowd levels per area
  setInterval(async () => {
    try {
      const randomArea = STATION_AREAS[Math.floor(Math.random() * STATION_AREAS.length)];
      const randomCrowdLevel = CROWD_LEVELS[Math.floor(Math.random() * CROWD_LEVELS.length)];
      
      let baseCount = 20;
      if (randomCrowdLevel === 'medium') baseCount = 75;
      if (randomCrowdLevel === 'high') baseCount = 180;
      const count = baseCount + Math.floor(Math.random() * 30);

      const crowdRecord = {
        area: randomArea,
        crowdLevel: randomCrowdLevel,
        count,
        timestamp: new Date(),
      };

      // Persist simulation data to DB if available
      try {
        const crowdDoc = new CrowdData(crowdRecord);
        await crowdDoc.save();
      } catch (e) {
        // DB might be temporarily offline or non-blocking
      }

      // Broadcast to all clients
      io.emit('crowdUpdate', crowdRecord);

      // Also emit to specific area room
      io.to(`area_${randomArea}`).emit('areaCrowdUpdate', crowdRecord);
    } catch (err) {
      console.error('[Socket.io] Error in crowd simulation interval:', err.message);
    }
  }, 10000);

  // 2. Emit trainUpdate every 15 seconds with simulated data
  setInterval(async () => {
    try {
      let trainToUpdate = null;

      try {
        // Pick a random train from database if available
        const count = await Train.countDocuments();
        if (count > 0) {
          const random = Math.floor(Math.random() * count);
          trainToUpdate = await Train.findOne().skip(random);
        }
      } catch (e) {
        // Fallback to purely simulated train if DB is empty
      }

      let trainPayload;
      if (trainToUpdate) {
        // Randomly modify delay or platform
        const delayDrift = Math.floor(Math.random() * 5); // +0 to 4 minutes
        const isDelayed = Math.random() > 0.4;
        const newDelay = isDelayed ? trainToUpdate.delay + delayDrift : 0;
        const newStatus = newDelay > 0 ? 'delayed' : 'on-time';

        trainToUpdate.delay = newDelay;
        trainToUpdate.status = newStatus;
        trainToUpdate.updatedAt = new Date();

        try {
          await trainToUpdate.save();
        } catch (saveErr) {}

        trainPayload = trainToUpdate;
      } else {
        // Synthetic simulated train
        const sampleNumbers = ['12626', '12002', '12951', '22691', '12301'];
        const sampleNames = [
          'Kerala Express',
          'Bhopal Shatabdi',
          'Mumbai Rajdhani',
          'Bengaluru Rajdhani',
          'Howrah Rajdhani',
        ];
        const idx = Math.floor(Math.random() * sampleNumbers.length);
        const randomDelay = Math.floor(Math.random() * 25);

        trainPayload = {
          trainNumber: sampleNumbers[idx],
          name: sampleNames[idx],
          platform: String(Math.floor(Math.random() * 5) + 1),
          status: randomDelay > 0 ? 'delayed' : 'on-time',
          arrivalTime: '15:30',
          departureTime: '15:45',
          delay: randomDelay,
          destination: 'New Delhi (NDLS)',
          origin: 'Chennai Central (MAS)',
          updatedAt: new Date(),
        };
      }

      // Broadcast train update to all connected clients
      io.emit('trainUpdate', trainPayload);
    } catch (err) {
      console.error('[Socket.io] Error in train simulation interval:', err.message);
    }
  }, 15000);

  console.log('[Socket.io] Socket handler and simulation intervals initialized successfully');
}

module.exports = { initSocket };
