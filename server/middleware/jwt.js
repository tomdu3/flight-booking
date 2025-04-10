const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
    // Get token from cookies instead of header
    const token = req.cookies.accessToken;
    
    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(500).json({ message: error.message || 'Server error' });
    }
};

const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15s' }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );
};

const verifyRefreshToken = async (token) => {
    try {
        const decoded = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return { success: true, userId: decoded.id };
    } catch (error) {
        return { success: false, error };
    }
};

module.exports = { 
    authenticateToken, 
    generateAccessToken, 
    generateRefreshToken,
    verifyRefreshToken
};