const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const trainRoutes = require('./routes/trains');
const facilityRoutes = require('./routes/facilities');
const alertRoutes = require('./routes/alerts');
const lostFoundRoutes = require('./routes/lostFound');
const userRoutes = require('./routes/users');
const crowdRoutes = require('./routes/crowd');

// Import socket handler
const { initSocket } = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// Environment configuration
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/railway_station_db';
const CLIENT_URL = process.env.CLIENT_URL || '*';

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL === '*' ? '*' : [CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Attach socket.io to express app so routes can broadcast events
app.set('io', io);

// Initialize Socket.io events and live simulations
initSocket(io);

// Middleware
app.use(
  cors({
    origin: CLIENT_URL === '*' ? '*' : [CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
  });
}

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    connectedClients: io.engine.clientsCount,
  });
});

// PDF Report Direct Serving Route
app.get('/report.pdf', (req, res) => {
  const pdfFile = path.join(__dirname, 'report.pdf');
  if (fs.existsSync(pdfFile)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="RAILWAY_STATION_PROJECT_REPORT.pdf"');
    res.sendFile(pdfFile);
  } else {
    res.status(404).send('Report PDF not found. Run node build-report-pdf.js first.');
  }
});
app.get('/api/report/pdf', (req, res) => {
  res.redirect('/report.pdf');
});

// Word (.docx) Report Direct Serving Route
app.get('/report.docx', (req, res) => {
  const docxFile = path.join(__dirname, 'report.docx');
  if (fs.existsSync(docxFile)) {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="RAILWAY_FACILITY_AND_MANAGEMENT_REPORT.docx"');
    res.sendFile(docxFile);
  } else {
    res.status(404).send('Word report not found. Run node generate-word-report.js first.');
  }
});
app.get('/api/report/docx', (req, res) => {
  res.redirect('/report.docx');
});

// API Documentation summary route
app.get('/', (req, res) => {
  res.json({
    name: 'Railway Station Facility Navigation & Accessibility API',
    version: '1.0.0',
    endpoints: {
      trains: '/api/trains',
      facilities: '/api/facilities',
      alerts: '/api/alerts',
      lostFound: '/api/lost-found',
      users: '/api/users',
      crowd: '/api/crowd',
      health: '/api/health',
    },
    sockets: {
      events_emitted: ['trainUpdate', 'crowdUpdate', 'facilityUpdate', 'emergencyAlert', 'sosAlert'],
      events_listened: ['joinArea', 'leaveArea', 'sosAlert', 'emergencyAlert', 'requestFacilityUpdate'],
    },
  });
});

// Mount Routes
app.use('/api/trains', trainRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crowd', crowdRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// MongoDB Connection
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log(`[MongoDB] Connected successfully to database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error(`[MongoDB] Connection error: ${err.message}`);
    console.warn('[MongoDB] Running server in standalone mode (some persistence features may wait for DB).');
  });

// Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` Railway Station Backend Server Running on Port: ${PORT}`);
  console.log(` HTTP API: http://localhost:${PORT}/`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(` Socket.io initialized & broadcasting simulations`);
  console.log(`=======================================================`);
});

module.exports = { app, server, io };
