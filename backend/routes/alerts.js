const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// @route   GET /api/alerts
// @desc    Get active alerts (or all if ?all=true)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { all, type, area } = req.query;
    let query = {};

    if (all !== 'true') {
      query.isActive = true;
    }
    if (type) {
      query.type = type.toLowerCase();
    }
    if (area) {
      query.area = { $regex: area, $options: 'i' };
    }

    const alerts = await Alert.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve alerts',
      error: error.message,
    });
  }
});

// @route   GET /api/alerts/:id
// @desc    Get single alert
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }
    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve alert',
      error: error.message,
    });
  }
});

// @route   POST /api/alerts
// @desc    Create new station alert (broadcasts via WebSocket)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { type, message, area, isActive } = req.body;

    if (!type || !message) {
      return res.status(400).json({
        success: false,
        message: 'Alert type and message are required',
      });
    }

    const alert = new Alert({
      type: type.toLowerCase(),
      message,
      area: area || 'Station-Wide',
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedAlert = await alert.save();

    // Broadcast in real-time
    const io = req.app.get('io');
    if (io) {
      io.emit('newAlert', savedAlert);
      if (savedAlert.type === 'emergency') {
        io.emit('emergencyAlert', savedAlert);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Alert broadcasted successfully',
      data: savedAlert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create alert',
      error: error.message,
    });
  }
});

// @route   PUT /api/alerts/:id/deactivate
// @desc    Deactivate an active alert
// @access  Public
router.put('/:id/deactivate', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('alertDeactivated', alert);
    }

    res.json({
      success: true,
      message: 'Alert deactivated successfully',
      data: alert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to deactivate alert',
      error: error.message,
    });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete an alert
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    res.json({
      success: true,
      message: 'Alert deleted successfully',
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete alert',
      error: error.message,
    });
  }
});

module.exports = router;
