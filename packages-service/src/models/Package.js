const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  packageId: {
    type: String,
    required: true,
    unique: true
  },
  flight: {
    id: String,
    airline: String,
    flightNumber: String,
    price: Number,
    departureTime: Date,
    arrivalTime: Date
  },
  hotel: {
    id: String,
    name: String,
    roomType: String,
    price: Number,
    checkInTime: String,
    checkOutTime: String
  },
  bus: {
    id: String,
    operator: String,
    busNumber: String,
    price: Number,
    departureTime: Date,
    arrivalTime: Date
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'cancelled'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Package', packageSchema); 