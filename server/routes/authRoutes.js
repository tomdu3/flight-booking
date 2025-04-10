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

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set cookies
    setTokensCookies(res, accessToken, refreshToken);

    // Respond without password
    res.status(201).json({
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
    const { email, username, password } = req.body;
    const isEmailLogin = !!email;
    const userQuery = isEmailLogin
      ? { email: email.trim() }
      : { username: username.trim() };

    // Find user
    const user = await User.findOne(userQuery);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password using model method
    const isMatch = await user.comparePassword(password.trim());
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set cookies
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