const Flight = require('../models/Flight');

// Search flights based on criteria
exports.searchFlights = async (req, res) => {
  try {
    const { source, destination, departureDate, class: flightClass } = req.body;
    
    const query = {
      source: new RegExp(source, 'i'),
      destination: new RegExp(destination, 'i'),
      status: 'scheduled'
    };

    if (departureDate) {
      const startDate = new Date(departureDate);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(departureDate);
      endDate.setHours(23, 59, 59, 999);
      
      query.departureTime = {
        $gte: startDate,
        $lte: endDate
      };
    }

    if (flightClass) {
      query.class = flightClass;
    }

    const flights = await Flight.find(query)
      .sort({ departureTime: 1, price: 1 });

    res.json(flights);
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ message: 'Error searching flights' });
  }
};

// Book a flight
exports.bookFlight = async (req, res) => {
  try {
    const { flightId, numberOfSeats } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.availableSeats < numberOfSeats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    flight.availableSeats -= numberOfSeats;
    await flight.save();

    res.json({
      message: 'Flight booked successfully',
      bookingDetails: {
        flightId: flight._id,
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        seatsBooked: numberOfSeats,
        totalPrice: flight.price * numberOfSeats
      }
    });
  } catch (error) {
    console.error('Error booking flight:', error);
    res.status(500).json({ message: 'Error booking flight' });
  }
};

// Get flight details by ID
exports.getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    console.error('Error getting flight details:', error);
    res.status(500).json({ message: 'Error getting flight details' });
  }
}; 