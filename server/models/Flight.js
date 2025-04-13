const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true },
  airline: { type: String, required: true },
  departureAirport: { type: String, required: true },
  arrivalAirport: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  stops: { type: Number, default: 0 },
  aircraftType: { type: String },
  bookingClass: { 
    type: String, 
    enum: ['economy', 'premium_economy', 'business', 'first'],
    default: 'economy'
  },
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'departed', 'arrived', 'cancelled'],
    default: 'scheduled'
  }
}, { timestamps: true });

module.exports = mongoose.model('Flight', flightSchema);