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

    // Try to get real airport data, fallback to mock data
    let airports = [];
    
    try {
      const response = await amadeusService.amadeus.referenceData.locations.get({
        keyword,
        subType: 'AIRPORT',
        view: 'LIGHT'
      });

      airports = response.data.map(airport => ({
        id: airport.id,
        name: airport.name,
        iataCode: airport.iataCode,
        city: airport.address?.cityName || 'Unknown',
        country: airport.address?.countryName || 'Unknown'
      }));
    } catch (amadeusError) {
      console.log('Amadeus API not available, using mock airport data');
      // Mock airport data for common search terms
      const mockAirports = [
        { id: 'JFK', name: 'John F Kennedy International Airport', iataCode: 'JFK', city: 'New York', country: 'United States' },
        { id: 'LAX', name: 'Los Angeles International Airport', iataCode: 'LAX', city: 'Los Angeles', country: 'United States' },
        { id: 'LHR', name: 'London Heathrow Airport', iataCode: 'LHR', city: 'London', country: 'United Kingdom' },
        { id: 'CDG', name: 'Charles de Gaulle Airport', iataCode: 'CDG', city: 'Paris', country: 'France' },
        { id: 'DXB', name: 'Dubai International Airport', iataCode: 'DXB', city: 'Dubai', country: 'United Arab Emirates' },
        { id: 'NRT', name: 'Narita International Airport', iataCode: 'NRT', city: 'Tokyo', country: 'Japan' },
        { id: 'SYD', name: 'Sydney Kingsford Smith Airport', iataCode: 'SYD', city: 'Sydney', country: 'Australia' },
        { id: 'FRA', name: 'Frankfurt Airport', iataCode: 'FRA', city: 'Frankfurt', country: 'Germany' }
      ];
      
      airports = mockAirports.filter(airport => 
        airport.name.toLowerCase().includes(keyword.toLowerCase()) ||
        airport.city.toLowerCase().includes(keyword.toLowerCase()) ||
        airport.iataCode.toLowerCase().includes(keyword.toLowerCase())
      );
    }

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