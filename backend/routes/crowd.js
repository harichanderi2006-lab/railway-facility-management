const express = require('express');
const router = express.Router();
const CrowdData = require('../models/CrowdData');

// Standard monitored station areas
const DEFAULT_AREAS = [
  'Platform 1',
  'Platform 2',
  'Platform 3',
  'Main Concourse',
  'Ticket Counter',
  'Waiting Hall',
  'Food Court',
  'Foot Overbridge',
];

// @route   GET /api/crowd
// @desc    Get latest crowd level reading for all areas
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Aggregate to get the latest record per area
    const latestCrowd = await CrowdData.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: '$area',
          latestId: { $first: '$_id' },
          area: { $first: '$area' },
          crowdLevel: { $first: '$crowdLevel' },
          count: { $first: '$count' },
          timestamp: { $first: '$timestamp' },
        },
      },
      { $sort: { area: 1 } },
    ]);

    // If no data exists yet, return default data structure
    if (latestCrowd.length === 0) {
      const fallback = DEFAULT_AREAS.map((area) => ({
        area,
        crowdLevel: 'low',
        count: 15,
        timestamp: new Date(),
      }));
      return res.json({
        success: true,
        count: fallback.length,
        data: fallback,
      });
    }

    res.json({
      success: true,
      count: latestCrowd.length,
      data: latestCrowd,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve crowd data',
      error: error.message,
    });
  }
});

// @route   GET /api/crowd/:area
// @desc    Get latest crowd reading and recent history for specific area
// @access  Public
router.get('/:area', async (req, res) => {
  try {
    const areaName = decodeURIComponent(req.params.area);
    const limit = parseInt(req.query.limit, 10) || 20;

    const history = await CrowdData.find({
      area: { $regex: new RegExp(`^${areaName}$`, 'i') },
    })
      .sort({ timestamp: -1 })
      .limit(limit);

    if (history.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No crowd data found for area: ${areaName}`,
      });
    }

    res.json({
      success: true,
      area: history[0].area,
      current: history[0],
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch crowd data for area ${req.params.area}`,
      error: error.message,
    });
  }
});

// @route   POST /api/crowd
// @desc    Record/Update crowd data for an area
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { area, crowdLevel, count } = req.body;

    if (!area || !crowdLevel) {
      return res.status(400).json({
        success: false,
        message: 'Area and crowdLevel (low, medium, high) are required',
      });
    }

    const crowd = new CrowdData({
      area,
      crowdLevel: crowdLevel.toLowerCase(),
      count: count !== undefined ? Number(count) : 0,
      timestamp: new Date(),
    });

    const savedData = await crowd.save();

    // Broadcast crowd update to WebSocket subscribers
    const io = req.app.get('io');
    if (io) {
      io.emit('crowdUpdate', savedData);
      io.to(`area_${area}`).emit('areaCrowdUpdate', savedData);
    }

    res.status(201).json({
      success: true,
      message: 'Crowd data recorded successfully',
      data: savedData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to record crowd data',
      error: error.message,
    });
  }
});

module.exports = router;
