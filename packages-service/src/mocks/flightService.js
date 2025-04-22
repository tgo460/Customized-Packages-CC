const express = require('express');
const router = express.Router();

const mockFlights = [
  {
    id: 'F101',
    airline: 'IndiGo',
    flightNumber: '6E-123',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '2024-05-01T08:00:00Z',
    arrivalTime: '2024-05-01T10:30:00Z',
    price: 6000,
    class: 'economy'
  },
  {
    id: 'F102',
    airline: 'Air India',
    flightNumber: 'AI-456',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '2024-05-01T14:00:00Z',
    arrivalTime: '2024-05-01T16:30:00Z',
    price: 7500,
    class: 'business'
  },
  {
    id: 'F103',
    airline: 'Vistara',
    flightNumber: 'UK-789',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: '2024-05-01T18:00:00Z',
    arrivalTime: '2024-05-01T20:30:00Z',
    price: 8500,
    class: 'first'
  }
];

router.post('/search', (req, res) => {
  const { source, destination, departureDate, class: flightClass } = req.body;
  console.log('Flight search request:', req.body);
  
  // Filter flights based on criteria
  let results = mockFlights.filter(flight => 
    flight.source.toLowerCase() === source.toLowerCase() && 
    flight.destination.toLowerCase() === destination.toLowerCase()
  );

  if (flightClass) {
    results = results.filter(flight => flight.class === flightClass);
  }

  console.log('Flight search results:', results);
  res.json(results);
});

router.post('/book', (req, res) => {
  const { flightId, numberOfSeats } = req.body;
  const flight = mockFlights.find(f => f.id === flightId);
  
  if (!flight) {
    return res.status(404).json({ message: 'Flight not found' });
  }

  res.json({
    message: 'Flight booked successfully',
    bookingDetails: {
      flightId: flight.id,
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      seatsBooked: numberOfSeats,
      totalPrice: flight.price * numberOfSeats
    }
  });
});

module.exports = router; 