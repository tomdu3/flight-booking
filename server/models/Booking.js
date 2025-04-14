const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  passport: {
    number: String,
    expiryDate: Date,
    issuanceCountry: String
  }
});

const segmentSchema = new mongoose.Schema({
  departure: {
    airport: { type: String, required: true },
    terminal: String,
    time: { type: Date, required: true }
  },
  arrival: {
    airport: { type: String, required: true },
    terminal: String,
    time: { type: Date, required: true }
  },
  carrierCode: { type: String, required: true },
  flightNumber: { type: String, required: true },
  aircraft: String,
  duration: String
});

const flightOfferSchema = new mongoose.Schema({
  id: { type: String, required: true },
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  departureAirport: { type: String, required: true },
  arrivalAirport: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  duration: { type: String, required: true },
  stops: { type: Number, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  bookingClass: { type: String, required: true },
  segments: [segmentSchema]
});

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amadeusBookingId: { type: String }, // Amadeus booking reference
  flightOffer: { type: flightOfferSchema, required: true },
  passengers: [passengerSchema],
  totalPrice: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  bookingReference: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);