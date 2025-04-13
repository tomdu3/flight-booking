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

// Airport autocomplete endpoint
router.get('/airports', authenticateWithRefresh, async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword || keyword.length < 2) {
      return res.status(400).json({ 
        message: 'Keyword must be at least 2 characters long' 
      });
    }

    const response = await amadeusService.amadeus.referenceData.locations.get({
      keyword,
      subType: 'AIRPORT',
      view: 'LIGHT'
    });

    const airports = response.data.map(airport => ({
      id: airport.id,
      name: airport.name,
      iataCode: airport.iataCode,
      city: airport.address.cityName,
      country: airport.address.countryName
    }));

    res.json({
      success: true,
      airports
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

module.exports = router;