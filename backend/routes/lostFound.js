const express = require('express');
const router = express.Router();
const LostFound = require('../models/LostFound');

// @route   GET /api/lost-found
// @desc    Get all lost and found items (with optional status, category filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    let query = {};

    if (status) {
      query.status = status.toLowerCase();
    }
    if (category) {
      query.category = category;
    }

    const items = await LostFound.find(query).sort({ reportedAt: -1 });
    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve lost and found items',
      error: error.message,
    });
  }
});

// @route   GET /api/lost-found/search
// @desc    Search lost & found items by keyword
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, category, status } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter "q" is required',
      });
    }

    const regex = new RegExp(q.trim(), 'i');
    let query = {
      $or: [
        { itemName: { $regex: regex } },
        { description: { $regex: regex } },
        { foundAt: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    };

    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status.toLowerCase();
    }

    const items = await LostFound.find(query).sort({ reportedAt: -1 });

    res.json({
      success: true,
      query: q,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to execute search',
      error: error.message,
    });
  }
});

// @route   GET /api/lost-found/:id
// @desc    Get single lost & found item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve item',
      error: error.message,
    });
  }
});

// @route   POST /api/lost-found
// @desc    Report a lost or found item
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { itemName, description, foundAt, category, contactInfo, status, image } = req.body;

    if (!itemName || !description || !foundAt || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'Item name, description, location (foundAt), and contactInfo are required',
      });
    }

    const item = new LostFound({
      itemName,
      description,
      foundAt,
      category: category || 'Other',
      contactInfo,
      status: status || 'found',
      image: image || '',
    });

    const savedItem = await item.save();

    // Broadcast item report event
    const io = req.app.get('io');
    if (io) {
      io.emit('lostFoundReported', savedItem);
    }

    res.status(201).json({
      success: true,
      message: 'Lost & Found item reported successfully',
      data: savedItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to report item',
      error: error.message,
    });
  }
});

// @route   PUT /api/lost-found/:id/status
// @desc    Update item status (lost, found, claimed)
// @access  Public
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['lost', 'found', 'claimed'].includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required: lost, found, or claimed',
      });
    }

    const item = await LostFound.findByIdAndUpdate(
      req.params.id,
      { status: status.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('lostFoundStatusUpdated', item);
    }

    res.json({
      success: true,
      message: `Item status updated to ${status}`,
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update item status',
      error: error.message,
    });
  }
});

// @route   PUT /api/lost-found/:id
// @desc    Update item details
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const item = await LostFound.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update item',
      error: error.message,
    });
  }
});

// @route   DELETE /api/lost-found/:id
// @desc    Delete item
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const item = await LostFound.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message,
    });
  }
});

module.exports = router;
