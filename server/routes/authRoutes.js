const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidator, loginValidator } = require('../middleware/authValidators'); // Assuming you saved the validator file in a 'middleware' folder

// Register
router.post('/register', registerValidator, async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Trim the inputs
    username = username.trim();
    email = email.trim();

    console.log('Registration attempt:', { username, email });

    // Check if email OR username already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { username }
      ]
    });

    console.log('Existing user check:', existingUser);

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const user = await User.create({ username, email, password });
    const accessToken = jwt.sign(
      { id: user._id }, 
      process.env.ACCESS_TOKEN_SECRET, 
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    console.log('New user created:', { id: user._id, username: user.username });

    res.status(201).json({ 
      accessToken, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email 
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Login
router.post('/login', loginValidator, async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Determine login method (email or userusername)
    const isEmailLogin = !!email;
    const userQuery = isEmailLogin 
      ? { email: email.trim() } 
      : { username: username.trim() };

    // Find user
    const user = await User.findOne(userQuery);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    // Send success response
    res.json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// logout
router.post('/logout', async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ message: 'Missing access token' });
    }
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid access token' });
      }
      res.json({ message: 'Logout successful' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;