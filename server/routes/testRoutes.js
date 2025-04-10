const express = require('express');
const {authenticateWithRefresh} = require('../middleware/jwt');
const router = express.Router();

router.get('/', authenticateWithRefresh, (req, res) => {
    res.json({ message: 'Test route' });
});

module.exports = router;