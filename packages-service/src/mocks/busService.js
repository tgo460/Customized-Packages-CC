const express = require('express');
const router = express.Router();

const mockBuses = [
  {
    id: 'B301',
    operator: 'Volvo',
    busNumber: 'VLV-123',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '2024-05-01T20:00:00Z',
    arrivalTime: '2024-05-02T08:00:00Z',
    price: 3500,
    type: 'AC',
    amenities: ['AC', 'Sleeper', 'Water']
  },
  {
    id: 'B302',
    operator: 'Orange Tours',
    busNumber: 'OT-456',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '2024-05-01T19:00:00Z',
    arrivalTime: '2024-05-02T07:00:00Z',
    price: 2500,
    type: 'NonAC',
    amenities: ['Sleeper', 'Water']
  },
  {
    id: 'B303',
    operator: 'Luxury Lines',
    busNumber: 'LL-789',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '2024-05-01T21:00:00Z',
    arrivalTime: '2024-05-02T09:00:00Z',
    price: 4000,
    type: 'AC',
    amenities: ['AC', 'Sleeper', 'Water', 'Snacks']
  }
];

router.post('/search', (req, res) => {
  const { source, destination, departureDate, busType } = req.body;
  console.log('Bus search request:', req.body);
  
  // Filter buses based on criteria
  let results = mockBuses.filter(bus => 
    bus.source.toLowerCase() === source.toLowerCase() && 
    bus.destination.toLowerCase() === destination.toLowerCase()
  );

  if (busType) {
    results = results.filter(bus => bus.type === busType);
  }

  console.log('Bus search results:', results);
  res.json(results);
});

router.post('/book', (req, res) => {
  const { busId, seatNumbers } = req.body;
  const bus = mockBuses.find(b => b.id === busId);
  
  if (!bus) {
    return res.status(404).json({ message: 'Bus not found' });
  }

  res.json({
    message: 'Bus booked successfully',
    bookingDetails: {
      busId: bus.id,
      busNumber: bus.busNumber,
      operator: bus.operator,
      seatsBooked: seatNumbers,
      totalPrice: bus.price * seatNumbers
    }
  });
});

module.exports = router; 