const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateWithRefresh } = require('../middleware/jwt');
const { updateUserValidator } = require('../middleware/userValidators');

// Get current user
router.get('/profile', authenticateWithRefresh, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user
router.put('/profile', authenticateWithRefresh, updateUserValidator, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { username, email, currentPassword, newPassword, preferences } = req.body;

    // Update basic info
    if (username) user.username = username;
    if (email) user.email = email;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // This will trigger the pre-save hook to hash the password
      user.password = newPassword;
    }

    await user.save();

    // Return updated user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} is already in use` });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;