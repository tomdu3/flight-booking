const jwt = require('jsonwebtoken');


const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, usr) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.userId = usr.id;
            next();
        });    } catch (error) {
        return res.status(500).json({ message: error.message || 'Server error' });
    }
};


module.exports = authenticateToken;
