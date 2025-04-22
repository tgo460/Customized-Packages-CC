const Bus = require('../models/Bus');

// Search buses based on criteria
exports.searchBuses = async (req, res) => {
  try {
    const { source, destination, departureDate, busType } = req.body;
    
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

    if (busType) {
      query.busType = busType;
    }

    const buses = await Bus.find(query)
      .sort({ departureTime: 1, price: 1 });

    res.json(buses);
  } catch (error) {
    console.error('Error searching buses:', error);
    res.status(500).json({ message: 'Error searching buses' });
  }
};

// Book bus seats
exports.bookBus = async (req, res) => {
  try {
    const { busId, seatNumbers } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    if (bus.availableSeats < seatNumbers.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Check if all requested seats are available
    const unavailableSeats = seatNumbers.filter(seatNumber => {
      const seat = bus.seats.find(s => s.number === seatNumber);
      return !seat || !seat.isAvailable;
    });

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are not available',
        unavailableSeats 
      });
    }

    // Mark seats as booked
    seatNumbers.forEach(seatNumber => {
      const seat = bus.seats.find(s => s.number === seatNumber);
      if (seat) {
        seat.isAvailable = false;
      }
    });

    bus.availableSeats -= seatNumbers.length;
    await bus.save();

    res.json({
      message: 'Bus seats booked successfully',
      bookingDetails: {
        busId: bus._id,
        busNumber: bus.busNumber,
        operator: bus.operator,
        seatsBooked: seatNumbers,
        totalPrice: bus.price * seatNumbers.length
      }
    });
  } catch (error) {
    console.error('Error booking bus:', error);
    res.status(500).json({ message: 'Error booking bus' });
  }
};

// Get bus details by ID
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    console.error('Error getting bus details:', error);
    res.status(500).json({ message: 'Error getting bus details' });
  }
}; 