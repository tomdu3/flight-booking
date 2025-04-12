const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flightId: { type: String, required: true }, // Amadeus flight ID
  flightDetails: { // Store complete flight details
    airline: String,
    flightNumber: String,
    departure: {
      airport: String,
      time: Date
    },
    arrival: {
      airport: String,
      time: Date
    },
    class: String
  },
  passengers: [{
    name: { type: String, required: true },
    age: { type: Number, required: true },
    passport: { type: String }
  }],
  seats: [{ type: String }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  bookingReference: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);