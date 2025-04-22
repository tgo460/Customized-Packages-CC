const express = require('express');
const router = express.Router();

const mockHotels = [
  {
    id: 'H201',
    name: 'Taj Resort Goa',
    location: 'Goa',
    rating: 5,
    rooms: [{
      type: 'Deluxe',
      price: 15000,
      available: true
    }],
    checkInTime: '14:00',
    checkOutTime: '12:00'
  },
  {
    id: 'H202',
    name: 'Marriott Goa',
    location: 'Goa',
    rating: 4,
    rooms: [{
      type: 'Suite',
      price: 12000,
      available: true
    }],
    checkInTime: '15:00',
    checkOutTime: '11:00'
  },
  {
    id: 'H203',
    name: 'Holiday Inn Goa',
    location: 'Goa',
    rating: 3,
    rooms: [{
      type: 'Standard',
      price: 8000,
      available: true
    }],
    checkInTime: '14:00',
    checkOutTime: '12:00'
  }
];

router.post('/search', (req, res) => {
  const { location, checkInDate, rating } = req.body;
  console.log('Hotel search request:', req.body);
  
  // Filter hotels based on criteria
  let results = mockHotels.filter(hotel => 
    hotel.location.toLowerCase() === location.toLowerCase()
  );

  if (rating) {
    results = results.filter(hotel => hotel.rating >= rating);
  }

  console.log('Hotel search results:', results);
  res.json(results);
});

router.post('/book', (req, res) => {
  const { hotelId, roomType, numberOfRooms } = req.body;
  const hotel = mockHotels.find(h => h.id === hotelId);
  
  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found' });
  }

  const room = hotel.rooms.find(r => r.type === roomType);
  if (!room) {
    return res.status(404).json({ message: 'Room type not found' });
  }

  res.json({
    message: 'Hotel booked successfully',
    bookingDetails: {
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomType: room.type,
      numberOfRooms,
      totalPrice: room.price * numberOfRooms
    }
  });
});

module.exports = router; 