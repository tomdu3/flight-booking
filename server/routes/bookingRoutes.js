const express = require('express');
const router = express.Router();
const { authenticateWithRefresh } = require('../middleware/jwt');
const Booking = require('../models/Booking');
const { searchFlights } = require('../services/amadeusService');

// Create booking with Amadeus flight data
router.post('/', authenticateWithRefresh, async (req, res) => {
  try {
    const { flightId, passengers } = req.body;
    
    // 1. Get flight details from Amadeus (or cache)
    const flights = await searchFlights({
      // You might need to store original search parameters
      // or implement a flight cache system
    });
    
    const flight = flights.find(f => f.id === flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // 2. Create booking
    const booking = new Booking({
      user: req.userId,
      flightId: flight.id,
      flightDetails: {
        airline: flight.airline,
        flightNumber: flight.flightNumber,
        departure: flight.departure,
        arrival: flight.arrival,
        class: flight.class
      },
      passengers,
      seats: assignSeats(passengers.length),
      totalPrice: flight.price * passengers.length,
      bookingReference: generateBookingRef(),
      status: 'confirmed'
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', authenticateWithRefresh, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper functions
const assignSeats = (count) => {
  const seats = [];
  for (let i = 1; i <= count; i++) {
    seats.push(`A${Math.floor(Math.random() * 30) + 1}`);
  }
  return seats;
};

const generateBookingRef = () => {
  return 'BK-' + Math.random().toString(36).substr(2, 8).toUpperCase();
};

module.exports = router;