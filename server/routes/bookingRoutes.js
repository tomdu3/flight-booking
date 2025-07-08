const express = require('express');
const router = express.Router();
const { authenticateWithRefresh } = require('../middleware/jwt');
const Booking = require('../models/Booking');
const User = require('../models/User');
const amadeusService = require('../services/amadeusService');

// Create a new booking
router.post('/', authenticateWithRefresh, async (req, res) => {
  try {
    const { flightOffer, passengers } = req.body;
    const userId = req.userId;

    // Validate input
    if (!flightOffer || !passengers || passengers.length === 0) {
      return res.status(400).json({ 
        message: 'Flight offer and passenger details are required' 
      });
    }

    // Validate and convert price to number
    const price = typeof flightOffer.price === 'string' ? parseFloat(flightOffer.price) : flightOffer.price;
    if (isNaN(price)) {
      return res.status(400).json({ 
        message: 'Invalid price format' 
      });
    }

    // Create booking in Amadeus
    const amadeusResponse = await amadeusService.createBooking(flightOffer, passengers);
    
    // Create booking in our database
    const booking = new Booking({
      user: userId,
      amadeusBookingId: amadeusResponse.id,
      flightOffer: {
        ...flightOffer,
        price: price // Ensure price is a number
      },
      passengers: passengers,
      totalPrice: price,
      currency: flightOffer.currency || 'USD',
      bookingReference: generateBookingReference(),
      status: 'confirmed',
      paymentStatus: 'paid' // Assuming immediate payment
    });

    await booking.save();

    // Add booking to user's bookings
    await User.findByIdAndUpdate(userId, {
      $push: { bookings: booking._id }
    });

    res.status(201).json({
      success: true,
      booking: {
        id: booking._id,
        reference: booking.bookingReference,
        status: booking.status,
        flight: {
          number: booking.flightOffer.flightNumber,
          departure: booking.flightOffer.departureTime,
          arrival: booking.flightOffer.arrivalTime,
          from: booking.flightOffer.departureAirport,
          to: booking.flightOffer.arrivalAirport,
          airline: booking.flightOffer.airline
        },
        passengers: booking.passengers.map(p => ({
          name: `${p.firstName} ${p.lastName}`,
          passport: p.passport?.number
        })),
        totalPrice: booking.totalPrice,
        currency: booking.currency
      }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
});

// Get all bookings for a user
router.get('/', authenticateWithRefresh, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings: bookings.map(booking => formatBookingResponse(booking))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve bookings'
    });
  }
});

// Get a specific booking
router.get('/:id', authenticateWithRefresh, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking: formatBookingResponse(booking)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve booking'
    });
  }
});

// Cancel a booking
router.delete('/:id', authenticateWithRefresh, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Cancel in Amadeus if it exists there
    if (booking.amadeusBookingId) {
      await amadeusService.cancelBooking(booking.amadeusBookingId);
    }

    // Update in our database
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel booking'
    });
  }
});

// Helper functions
function generateBookingReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function formatBookingResponse(booking) {
  return {
    id: booking._id,
    reference: booking.bookingReference,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    flight: {
      number: booking.flightOffer.flightNumber,
      airline: booking.flightOffer.airline,
      departure: {
        airport: booking.flightOffer.departureAirport,
        time: booking.flightOffer.departureTime
      },
      arrival: {
        airport: booking.flightOffer.arrivalAirport,
        time: booking.flightOffer.arrivalTime
      },
      duration: booking.flightOffer.duration,
      stops: booking.flightOffer.stops
    },
    passengers: booking.passengers.map(p => ({
      name: `${p.firstName} ${p.lastName}`,
      passport: p.passport?.number
    })),
    price: {
      total: booking.totalPrice,
      currency: booking.currency
    },
    createdAt: booking.createdAt
  };
}

module.exports = router;