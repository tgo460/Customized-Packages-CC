const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

// Search flights
router.post('/search', flightController.searchFlights);

// Book a flight
router.post('/book', flightController.bookFlight);

// Get flight details by ID
router.get('/:id', flightController.getFlightById);

module.exports = router; 