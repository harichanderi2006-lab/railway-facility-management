const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Helper to generate JWT token
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkey_railway_accessibility_app_2026';
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    secret,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/users/register
// @desc    Register a new user (passenger, staff, etc.)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, accessibilityPreferences, phone, emergencyContact } =
      req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email is already registered',
      });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'passenger',
      accessibilityPreferences: accessibilityPreferences || {},
      phone: phone || '',
      emergencyContact: emergencyContact || {},
    });

    await user.save();
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get JWT token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get currently authenticated user's profile
// @access  Protected (Requires JWT)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message,
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile & accessibility preferences
// @access  Protected (Requires JWT)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, accessibilityPreferences, emergencyContact } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (accessibilityPreferences) {
      user.accessibilityPreferences = {
        ...user.accessibilityPreferences,
        ...accessibilityPreferences,
      };
    }
    if (emergencyContact) {
      user.emergencyContact = {
        ...user.emergencyContact,
        ...emergencyContact,
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toJSON(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
});

module.exports = router;
