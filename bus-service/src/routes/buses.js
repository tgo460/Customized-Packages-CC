const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');

// Search buses
router.post('/search', busController.searchBuses);

// Book bus seats
router.post('/book', busController.bookBus);

// Get bus details by ID
router.get('/:id', busController.getBusById);

module.exports = router; 