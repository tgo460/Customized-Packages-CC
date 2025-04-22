const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['window', 'aisle', 'sleeper'],
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const busSchema = new mongoose.Schema({
  operator: {
    type: String,
    required: true
  },
  busNumber: {
    type: String,
    required: true,
    unique: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  busType: {
    type: String,
    enum: ['AC', 'Non-AC', 'Sleeper', 'Deluxe'],
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  seats: [seatSchema],
  amenities: [String],
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'cancelled', 'completed'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bus', busSchema); 