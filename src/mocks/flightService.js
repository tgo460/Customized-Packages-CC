const express = require('express');
const router = express.Router();

const mockFlights = [
  {
    id: 'F101',
    airline: 'IndiGo',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '08:00',
    arrivalTime: '10:30',
    price: 6000,
    class: 'economy'
  },
  {
    id: 'F102',
    airline: 'Air India',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '14:00',
    arrivalTime: '16:30',
    price: 7500,
    class: 'business'
  },
  {
    id: 'F103',
    airline: 'Vistara',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '18:00',
    arrivalTime: '20:30',
    price: 8500,
    class: 'first'
  }
];

router.post('/search', (req, res) => {
  const { source, destination, departureDate, class: flightClass } = req.body;
  
  // Filter flights based on criteria
  let results = mockFlights.filter(flight => 
    flight.source === source && 
    flight.destination === destination
  );

  if (flightClass) {
    results = results.filter(flight => flight.class === flightClass);
  }

  res.json(results);
});

router.post('/book', (req, res) => {
  const { flightId } = req.body;
  const flight = mockFlights.find(f => f.id === flightId);

  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }

  res.json({
    bookingId: `FB${Date.now()}`,
    flight,
    status: 'confirmed',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 