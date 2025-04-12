const express = require('express');
const router = express.Router();
const { authenticateWithRefresh } = require('../middleware/jwt');
const { searchFlights } = require('../services/amadeusService');
const Flight = require('../models/Flight');

// Search flights via Amadeus
router.get('/search', authenticateWithRefresh, async (req, res) => {
  try {
    const { from, to, date, persons } = req.query;
    
    // Validate inputs
    if (!from || !to || !date) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    const flights = await searchFlights({ from, to, date, persons });
    
    // Save to database (optional)
    await Flight.insertMany(flights);
    
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;