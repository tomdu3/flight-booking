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
    // trim the inputs
    username = username.trim();
    email = email.trim();

    console.log(username, email, password);

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ username, email, password });
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
    console.log(accessToken);
    
    res.status(201).json({ accessToken, user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
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

module.exports = router;