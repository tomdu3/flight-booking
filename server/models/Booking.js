const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  passengers: [{
    name: { type: String, required: true },
    age: { type: Number, required: true },
    passport: { type: String }
  }],
  seats: [{ type: String, required: true }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentMethod: { type: String },
  bookingReference: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);