const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  departure: {
    airport: { type: String, required: true },
    time: { type: Date, required: true }
  },
  arrival: {
    airport: { type: String, required: true },
    time: { type: Date, required: true }
  },
  duration: { type: Number, required: true }, // in minutes
  price: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
  class: { type: String, enum: ['economy', 'business', 'first'], default: 'economy' }
}, { timestamps: true });

module.exports = mongoose.model('Flight', flightSchema);