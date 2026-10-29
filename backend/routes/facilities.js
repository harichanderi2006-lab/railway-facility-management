const express = require('express');
const router = express.Router();
const Facility = require('../models/Facility');

// @route   GET /api/facilities
// @desc    Get all facilities with optional filters (type, floor, isAccessible, isAvailable, crowdLevel)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, floor, isAccessible, isAvailable, crowdLevel, search } = req.query;
    let query = {};

    if (type) {
      query.type = type.toLowerCase();
    }
    if (floor !== undefined) {
      query.floor = Number(floor);
    }
    if (isAccessible !== undefined) {
      query.isAccessible = isAccessible === 'true';
    }
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }
    if (crowdLevel) {
      query.crowdLevel = crowdLevel.toLowerCase();
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
      ];
    }

    const facilities = await Facility.find(query).sort({ floor: 1, name: 1 });
    res.json({
      success: true,
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve facilities',
      error: error.message,
    });
  }
});

// @route   GET /api/facilities/nearby
// @desc    Find facilities nearest to given coordinates (x, y), with optional floor & type filter
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { x, y, maxDistance, floor, type, isAccessible } = req.query;

    if (x === undefined || y === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Query parameters x and y (current coordinates) are required',
      });
    }

    const originX = parseFloat(x);
    const originY = parseFloat(y);
    const maxDist = maxDistance ? parseFloat(maxDistance) : Infinity;

    if (isNaN(originX) || isNaN(originY)) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates x and y must be valid numbers',
      });
    }

    let filter = {};
    if (floor !== undefined) {
      filter.floor = Number(floor);
    }
    if (type) {
      filter.type = type.toLowerCase();
    }
    if (isAccessible !== undefined) {
      filter.isAccessible = isAccessible === 'true';
    }

    const facilities = await Facility.find(filter);

    // Compute Euclidean distance from origin point
    const facilitiesWithDistance = facilities
      .map((f) => {
        const dx = f.location.x - originX;
        const dy = f.location.y - originY;
        const distance = Math.round(Math.sqrt(dx * dx + dy * dy) * 100) / 100;
        return {
          ...f.toObject(),
          distance,
        };
      })
      .filter((f) => f.distance <= maxDist)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      origin: { x: originX, y: originY },
      count: facilitiesWithDistance.length,
      data: facilitiesWithDistance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to find nearby facilities',
      error: error.message,
    });
  }
});

// @route   GET /api/facilities/type/:type
// @desc    Get facilities by category type (toilet, atm, food, waiting, medical, wheelchair, elevator, ticket)
// @access  Public
router.get('/type/:type', async (req, res) => {
  try {
    const facilities = await Facility.find({ type: req.params.type.toLowerCase() });
    res.json({
      success: true,
      type: req.params.type,
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch facilities of type ${req.params.type}`,
      error: error.message,
    });
  }
});

// @route   GET /api/facilities/:id
// @desc    Get facility by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found',
      });
    }
    res.json({
      success: true,
      data: facility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve facility',
      error: error.message,
    });
  }
});

// @route   POST /api/facilities
// @desc    Create a new station facility
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, type, floor, location, isAvailable, crowdLevel, description, isAccessible } =
      req.body;

    if (!name || !type || !location || location.x === undefined || location.y === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, type, and location (x, y) are required fields',
      });
    }

    const facility = new Facility({
      name,
      type: type.toLowerCase(),
      floor: floor !== undefined ? floor : 0,
      location: {
        x: Number(location.x),
        y: Number(location.y),
      },
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      crowdLevel: crowdLevel || 'low',
      description: description || '',
      isAccessible: isAccessible !== undefined ? isAccessible : true,
    });

    const savedFacility = await facility.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('facilityCreated', savedFacility);
    }

    res.status(201).json({
      success: true,
      message: 'Facility created successfully',
      data: savedFacility,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create facility',
      error: error.message,
    });
  }
});

// @route   PUT /api/facilities/:id/availability
// @desc    Update facility availability and crowd level
// @access  Public
router.put('/:id/availability', async (req, res) => {
  try {
    const { isAvailable, crowdLevel } = req.body;
    const updateData = {};

    if (isAvailable !== undefined) updateData.isAvailable = Boolean(isAvailable);
    if (crowdLevel !== undefined) updateData.crowdLevel = crowdLevel;

    const facility = await Facility.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found',
      });
    }

    // Broadcast update via socket
    const io = req.app.get('io');
    if (io) {
      io.emit('facilityUpdate', facility);
    }

    res.json({
      success: true,
      message: 'Facility availability updated successfully',
      data: facility,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update facility availability',
      error: error.message,
    });
  }
});

// @route   PUT /api/facilities/:id
// @desc    Update full facility details
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found',
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('facilityUpdate', facility);
    }

    res.json({
      success: true,
      message: 'Facility updated successfully',
      data: facility,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update facility',
      error: error.message,
    });
  }
});

// @route   DELETE /api/facilities/:id
// @desc    Delete facility
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found',
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('facilityDeleted', { id: facility._id, name: facility.name });
    }

    res.json({
      success: true,
      message: 'Facility deleted successfully',
      data: facility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete facility',
      error: error.message,
    });
  }
});

module.exports = router;
