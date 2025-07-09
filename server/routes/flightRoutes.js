const express = require('express');
const router = express.Router();
const { authenticateWithRefresh } = require('../middleware/jwt');
const amadeusService = require('../services/amadeusService');

// Flight search endpoint using Amadeus API
router.get('/search', authenticateWithRefresh, async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      children,
      infants,
      travelClass,
      nonStop,
      maxPrice,
      currency
    } = req.query;

    // Required parameters validation
    if (!origin || !destination || !departureDate) {
      return res.status(400).json({
        message: 'Origin, destination, and departure date are required'
      });
    }

    // Build Amadeus API parameters
    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      adults: adults || 1,
      currencyCode: currency || 'USD'
    };

    // Optional parameters
    if (returnDate) params.returnDate = returnDate;
    if (children) params.children = children;
    if (infants) params.infants = infants;
    if (travelClass) params.travelClass = travelClass.toUpperCase();
    if (nonStop) params.nonStop = nonStop === 'true';
    if (maxPrice) params.maxPrice = maxPrice;

    // Get flight offers from Amadeus
    const flights = await amadeusService.flightOffersSearch(params);

    res.json({
      success: true,
      count: flights.length,
      flights
    });

  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error searching flights',
      error: error.message
    });
  }
});

// Public airport and city search endpoint (no authentication required)
router.get('/airports', async (req, res) => {
  try {
    const { keyword, searchType = 'all' } = req.query;

    if (!keyword || keyword.length < 2) {
      return res.status(400).json({
        message: 'Keyword must be at least 2 characters long'
      });
    }

    // Enhanced search supporting both airports and cities
    const airports = await amadeusService.searchLocations(keyword, searchType);

    res.json({
      success: true,
      airports,
      count: airports.length
    });

  } catch (error) {
    console.error('Airport search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching airports',
      error: error.message
    });
  }
});

// Get comprehensive airport data for frontend preloading
router.get('/airports/popular', async (req, res) => {
  try {
    const popularAirports = await amadeusService.getPopularAirports();
    
    res.json({
      success: true,
      airports: popularAirports,
      count: popularAirports.length
    });

  } catch (error) {
    console.error('Popular airports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular airports',
      error: error.message
    });
  }
});

// Get best deals endpoint
router.get('/best-deals', authenticateWithRefresh, async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      duration,
      maxPrice,
      currency,
      adults
    } = req.query;

    if (!origin || !destination || !departureDate) {
      return res.status(400).json({
        message: 'Origin, destination, and departure date are required'
      });
    }

    const params = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate: departureDate,
      currencyCode: currency || 'USD',
      adults: adults || 1
    };

    if (duration) params.duration = duration;
    if (maxPrice) params.maxPrice = maxPrice;

    const deals = await amadeusService.flightOffersSearch(params);

    res.json({
      success: true,
      count: deals.length,
      deals
    });
  } catch (error) {
    console.error('Best deals search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching best deals',
      error: error.message
    });
  }
});

module.exports = router;