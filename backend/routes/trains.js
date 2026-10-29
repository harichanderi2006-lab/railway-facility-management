const express = require('express');
const router = express.Router();
const Train = require('../models/Train');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// @route   GET /api/trains
// @desc    Get all trains (with optional status & platform filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, platform, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (platform) {
      query.platform = platform;
    }
    if (search) {
      query.$or = [
        { trainNumber: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { origin: { $regex: search, $options: 'i' } },
      ];
    }

    const trains = await Train.find(query).sort({ arrivalTime: 1 });
    res.json({
      success: true,
      count: trains.length,
      data: trains,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trains',
      error: error.message,
    });
  }
});

// @route   GET /api/trains/platform/:platform
// @desc    Get trains scheduled on a specific platform
// @access  Public
router.get('/platform/:platform', async (req, res) => {
  try {
    const trains = await Train.find({ platform: req.params.platform }).sort({ arrivalTime: 1 });
    res.json({
      success: true,
      platform: req.params.platform,
      count: trains.length,
      data: trains,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch trains for platform ${req.params.platform}`,
      error: error.message,
    });
  }
});

// @route   GET /api/trains/:id
// @desc    Get train by ID or trainNumber
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let train;

    // Check if ID is a valid Mongo ObjectId, otherwise search by trainNumber
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      train = await Train.findById(id);
    }
    if (!train) {
      train = await Train.findOne({ trainNumber: id.toUpperCase() });
    }

    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found',
      });
    }

    res.json({
      success: true,
      data: train,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve train details',
      error: error.message,
    });
  }
});

// @route   POST /api/trains
// @desc    Create a new train schedule
// @access  Public (or protected by staff/admin if token supplied)
router.post('/', async (req, res) => {
  try {
    const {
      trainNumber,
      name,
      platform,
      status,
      arrivalTime,
      departureTime,
      delay,
      destination,
      origin,
    } = req.body;

    // Check duplicate
    const existing = await Train.findOne({ trainNumber: trainNumber.toUpperCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Train with number ${trainNumber} already exists`,
      });
    }

    const train = new Train({
      trainNumber,
      name,
      platform,
      status: status || 'on-time',
      arrivalTime,
      departureTime,
      delay: delay || 0,
      destination,
      origin,
    });

    const savedTrain = await train.save();

    // Broadcast update via socket.io if initialized
    const io = req.app.get('io');
    if (io) {
      io.emit('trainCreated', savedTrain);
      io.emit('trainUpdate', savedTrain);
    }

    res.status(201).json({
      success: true,
      message: 'Train schedule created successfully',
      data: savedTrain,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create train',
      error: error.message,
    });
  }
});

// @route   PUT /api/trains/:id/status
// @desc    Update train status, delay, and platform
// @access  Public
router.put('/:id/status', async (req, res) => {
  try {
    const { status, delay, platform } = req.body;
    const { id } = req.params;

    const updateFields = { updatedAt: new Date() };
    if (status !== undefined) updateFields.status = status;
    if (delay !== undefined) updateFields.delay = Number(delay);
    if (platform !== undefined) updateFields.platform = platform;

    let train;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      train = await Train.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
    }
    if (!train) {
      train = await Train.findOneAndUpdate(
        { trainNumber: id.toUpperCase() },
        updateFields,
        { new: true, runValidators: true }
      );
    }

    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found',
      });
    }

    // Broadcast real-time update to all connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('trainUpdate', train);
    }

    res.json({
      success: true,
      message: 'Train status updated successfully',
      data: train,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update train status',
      error: error.message,
    });
  }
});

// @route   PUT /api/trains/:id
// @desc    Update full train details
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let train;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      train = await Train.findByIdAndUpdate(id, { ...req.body, updatedAt: new Date() }, {
        new: true,
        runValidators: true,
      });
    } else {
      train = await Train.findOneAndUpdate(
        { trainNumber: id.toUpperCase() },
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    }

    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found',
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('trainUpdate', train);
    }

    res.json({
      success: true,
      message: 'Train updated successfully',
      data: train,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update train',
      error: error.message,
    });
  }
});

// @route   DELETE /api/trains/:id
// @desc    Delete train schedule
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let train;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      train = await Train.findByIdAndDelete(id);
    } else {
      train = await Train.findOneAndDelete({ trainNumber: id.toUpperCase() });
    }

    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found',
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('trainDeleted', { id: train._id, trainNumber: train.trainNumber });
    }

    res.json({
      success: true,
      message: 'Train schedule deleted successfully',
      data: train,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete train',
      error: error.message,
    });
  }
});

module.exports = router;
