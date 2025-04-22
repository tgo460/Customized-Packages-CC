const express = require('express');
const router = express.Router();

const mockHotels = [
  {
    id: 'H201',
    name: 'Beach Resort',
    location: 'Goa',
    rating: 4,
    price: 9000,
    amenities: ['Pool', 'Spa', 'Restaurant'],
    checkInTime: '14:00',
    checkOutTime: '12:00'
  },
  {
    id: 'H202',
    name: 'Luxury Hotel',
    location: 'Goa',
    rating: 5,
    price: 12000,
    amenities: ['Pool', 'Spa', 'Restaurant', 'Gym'],
    checkInTime: '14:00',
    checkOutTime: '12:00'
  },
  {
    id: 'H203',
    name: 'Budget Inn',
    location: 'Goa',
    rating: 3,
    price: 5000,
    amenities: ['Restaurant'],
    checkInTime: '14:00',
    checkOutTime: '12:00'
  }
];

router.post('/search', (req, res) => {
  const { location, checkInDate, rating } = req.body;
  
  // Filter hotels based on criteria
  let results = mockHotels.filter(hotel => 
    hotel.location === location
  );

  if (rating) {
    results = results.filter(hotel => hotel.rating >= rating);
  }

  res.json(results);
});

router.post('/book', (req, res) => {
  const { hotelId } = req.body;
  const hotel = mockHotels.find(h => h.id === hotelId);

  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' });
  }

  res.json({
    bookingId: `HB${Date.now()}`,
    hotel,
    status: 'confirmed',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 