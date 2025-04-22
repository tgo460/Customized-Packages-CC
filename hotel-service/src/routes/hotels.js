const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// Search hotels
router.post('/search', hotelController.searchHotels);

// Book a hotel room
router.post('/book', hotelController.bookHotel);

// Get hotel details by ID
router.get('/:id', hotelController.getHotelById);

module.exports = router; 