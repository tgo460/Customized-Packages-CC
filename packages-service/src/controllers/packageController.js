const axios = require('axios');
const Package = require('../models/Package');
const services = require('../config/services');

// Search available packages
exports.searchPackages = async (req, res) => {
  try {
    const { source, destination, departureDate, budget, preferences } = req.body;
    console.log('Received search request:', { source, destination, departureDate, budget, preferences });

    // Search flights
    console.log('Searching flights...');
    const flightResponse = await axios.post(`${services.flight.baseUrl}${services.flight.endpoints.search}`, {
      source,
      destination,
      departureDate,
      class: preferences?.flightClass || 'economy'
    }).catch(error => {
      console.error('Flight service error:', error.message);
      return { data: [] };
    });

    // Search hotels
    console.log('Searching hotels...');
    const hotelResponse = await axios.post(`${services.hotel.baseUrl}${services.hotel.endpoints.search}`, {
      location: destination,
      checkInDate: departureDate,
      rating: preferences?.hotelRating || 3
    }).catch(error => {
      console.error('Hotel service error:', error.message);
      return { data: [] };
    });

    // Search buses
    console.log('Searching buses...');
    const busResponse = await axios.post(`${services.bus.baseUrl}${services.bus.endpoints.search}`, {
      source,
      destination,
      departureDate,
      busType: preferences?.busType || 'AC'
    }).catch(error => {
      console.error('Bus service error:', error.message);
      return { data: [] };
    });

    // Create package combinations
    const packages = [];
    const flights = flightResponse.data || [];
    const hotels = hotelResponse.data || [];
    const buses = busResponse.data || [];

    console.log('Service responses:', {
      flights: flights.length,
      hotels: hotels.length,
      buses: buses.length
    });

    // Generate combinations within budget
    for (const flight of flights) {
      for (const hotel of hotels) {
        for (const bus of buses) {
          const hotelPrice = hotel.rooms?.[0]?.price || hotel.price;
          const totalPrice = flight.price + hotelPrice + bus.price;
          
          console.log(`Checking combination - Flight: ${flight.airline} (₹${flight.price}), Hotel: ${hotel.name} (₹${hotelPrice}), Bus: ${bus.operator} (₹${bus.price}), Total: ₹${totalPrice}`);
          
          // If no budget specified or total price is within budget
          if (!budget || totalPrice <= parseFloat(budget)) {
            const package = {
              packageId: `PKG-${Date.now()}-${packages.length + 1}`,
              flight: {
                id: flight._id || flight.id,
                airline: flight.airline,
                flightNumber: flight.flightNumber,
                price: flight.price,
                departureTime: flight.departureTime,
                arrivalTime: flight.arrivalTime
              },
              hotel: {
                id: hotel._id || hotel.id,
                name: hotel.name,
                roomType: hotel.rooms?.[0]?.type || hotel.roomType,
                price: hotelPrice,
                checkInTime: hotel.checkInTime,
                checkOutTime: hotel.checkOutTime
              },
              bus: {
                id: bus._id || bus.id,
                operator: bus.operator,
                busNumber: bus.busNumber,
                price: bus.price,
                departureTime: bus.departureTime,
                arrivalTime: bus.arrivalTime
              },
              totalPrice
            };
            packages.push(package);
            console.log(`Added package with total price ₹${totalPrice}`);
          } else {
            console.log(`Skipping combination - exceeds budget of ₹${budget}`);
          }
        }
      }
    }

    // Sort packages by total price
    packages.sort((a, b) => a.totalPrice - b.totalPrice);
    console.log(`Found ${packages.length} matching packages within budget`);

    res.json(packages);
  } catch (error) {
    console.error('Error searching packages:', error);
    res.status(500).json({ message: `Error searching packages: ${error.message}` });
  }
};

// Book a package
exports.bookPackage = async (req, res) => {
  try {
    const { packageId, flightSeats, hotelRooms, busSeats } = req.body;

    // Book flight
    const flightBooking = await axios.post(`${services.flight.baseUrl}${services.flight.endpoints.book}`, {
      flightId: packageId.flight.id,
      numberOfSeats: flightSeats
    });

    // Book hotel
    const hotelBooking = await axios.post(`${services.hotel.baseUrl}${services.hotel.endpoints.book}`, {
      hotelId: packageId.hotel.id,
      roomType: packageId.hotel.roomType,
      numberOfRooms: hotelRooms
    });

    // Book bus
    const busBooking = await axios.post(`${services.bus.baseUrl}${services.bus.endpoints.book}`, {
      busId: packageId.bus.id,
      seatNumbers: busSeats
    });

    // Create package booking record
    const package = new Package({
      ...packageId,
      status: 'booked'
    });
    await package.save();

    res.json({
      message: 'Package booked successfully',
      bookingDetails: {
        packageId: package.packageId,
        flight: flightBooking.data.bookingDetails,
        hotel: hotelBooking.data.bookingDetails,
        bus: busBooking.data.bookingDetails,
        totalPrice: package.totalPrice
      }
    });
  } catch (error) {
    console.error('Error booking package:', error);
    res.status(500).json({ message: 'Error booking package' });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Package.find({ status: 'booked' });
        res.json(bookings);
    } catch (error) {
        console.error('Error getting bookings:', error);
        res.status(500).json({ message: 'Error getting bookings' });
    }
};

// Get package details by ID
exports.getPackageById = async (req, res) => {
    try {
        // Special case for fetching all bookings
        if (req.params.id === 'bookings') {
            return exports.getAllBookings(req, res);
        }

        const package = await Package.findById(req.params.id);
        if (!package) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(package);
    } catch (error) {
        console.error('Error getting package details:', error);
        res.status(500).json({ message: 'Error getting package details' });
    }
};

// Create a new package
exports.createPackage = async (req, res) => {
    try {
        const package = new Package(req.body);
        await package.save();
        res.status(201).json(package);
    } catch (error) {
        console.error('Error creating package:', error);
        res.status(500).json({ message: 'Error creating package' });
    }
};

// Get all packages
exports.getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (error) {
        console.error('Error getting packages:', error);
        res.status(500).json({ message: 'Error getting packages' });
    }
}; 