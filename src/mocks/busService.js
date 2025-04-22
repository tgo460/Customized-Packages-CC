const express = require('express');
const router = express.Router();

const mockBuses = [
  {
    id: 'B301',
    operator: 'Volvo',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '20:00',
    arrivalTime: '08:00',
    price: 3500,
    type: 'AC',
    amenities: ['AC', 'Sleeper', 'Water']
  },
  {
    id: 'B302',
    operator: 'Sleeper',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '22:00',
    arrivalTime: '10:00',
    price: 2500,
    type: 'Non-AC',
    amenities: ['Sleeper', 'Water']
  },
  {
    id: 'B303',
    operator: 'Luxury',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '21:00',
    arrivalTime: '09:00',
    price: 4000,
    type: 'AC',
    amenities: ['AC', 'Sleeper', 'Water', 'Snacks']
  }
];

router.post('/search', (req, res) => {
  const { source, destination, departureDate, busType } = req.body;
  
  // Filter buses based on criteria
  let results = mockBuses.filter(bus => 
    bus.source === source && 
    bus.destination === destination
  );

  if (busType) {
    results = results.filter(bus => bus.type === busType);
  }

  res.json(results);
});

router.post('/book', (req, res) => {
  const { busId } = req.body;
  const bus = mockBuses.find(b => b.id === busId);

  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  res.json({
    bookingId: `BB${Date.now()}`,
    bus,
    status: 'confirmed',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 