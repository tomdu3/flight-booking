const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { registerValidator, loginValidator } = require('../middleware/authValidators');
const {
  generateAccessToken,
  generateRefreshToken
} = require('../middleware/jwt');

// Helper to set cookies
const setTokensCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });
  
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// Register
router.post('/register', registerValidator, async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Trim inputs
    username = username.trim();
    email = email.trim();

    console.log('Registration attempt:', { username, email });

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        console.log('Email already exists:', email);
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
          field: 'email'
        });
      }
      console.log('Username already exists:', username);
      return res.status(400).json({
        success: false,
        message: 'Username already taken',
        field: 'username'
      });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = new User({
      username,
      email,
      password
    });

    await user.save();
    console.log('User created successfully:', { id: user._id, username });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set cookies
    setTokensCookies(res, accessToken, refreshToken);

    // Respond without password
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login
router.post('/login', loginValidator, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for user:', email);

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setTokensCookies(res, accessToken, refreshToken);

    // Respond with user data
    res.json({
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


// Refresh token endpoint
router.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }

        const { success, userId, error } = await verifyRefreshToken(refreshToken);
        if (!success) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Refresh token expired' });
            }
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken(userId);
        const newRefreshToken = generateRefreshToken(userId);

        setTokensCookies(res, newAccessToken, newRefreshToken);

        res.json({ message: 'Tokens refreshed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server error' });
    }
});

module.exports = router;