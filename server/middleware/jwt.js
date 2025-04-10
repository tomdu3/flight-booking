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

// Middleware to handle token refresh if access token is expired
const authenticateWithRefresh = async (req, res, next) => {
    try {
        // First try with the access token
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken && !refreshToken) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Verify access token
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (!err) {
                // Access token is valid, proceed
                req.userId = decoded.id;
                return next();
            }

            // Access token is invalid or expired, check refresh token
            if (err.name === 'TokenExpiredError' && refreshToken) {
                const { success, userId, error } = await verifyRefreshToken(refreshToken);
                
                if (success) {
                    // Generate new tokens
                    const newAccessToken = generateAccessToken(userId);
                    const newRefreshToken = generateRefreshToken(userId);

                    // Set new cookies
                    res.cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000 // 15 minutes
                    });
                    
                    res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                    });

                    // Set userId and proceed
                    req.userId = userId;
                    return next();
                } else {
                    // Refresh token is invalid
                    return res.status(401).json({ 
                        message: error.name === 'TokenExpiredError' ? 
                            'Session expired. Please log in again.' : 
                            'Invalid session. Please log in again.' 
                    });
                }
            }

            // Other errors with access token
            return res.status(401).json({ message: 'Invalid token' });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Authentication error' });
    }
};

const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15s'} // process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
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
    verifyRefreshToken,
    authenticateWithRefresh
};
