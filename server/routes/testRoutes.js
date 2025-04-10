const express = require('express');
const {authenticateToken} = require('../middleware/jwt');
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    res.json({ message: 'Test route' });
});

module.exports = router;