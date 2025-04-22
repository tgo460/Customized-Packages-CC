const Hotel = require('../models/Hotel');

// Search hotels based on criteria
exports.searchHotels = async (req, res) => {
  try {
    const { location, checkInDate, checkOutDate, rating, roomType } = req.body;
    
    const query = {
      location: new RegExp(location, 'i'),
      status: 'active'
    };

    if (rating) {
      query.rating = { $gte: rating };
    }

    const hotels = await Hotel.find(query);

    // Filter hotels based on room availability and type
    const availableHotels = hotels.filter(hotel => {
      const availableRooms = hotel.rooms.filter(room => {
        if (roomType && room.type !== roomType) return false;
        return room.availableRooms > 0;
      });
      return availableRooms.length > 0;
    });

    res.json(availableHotels);
  } catch (error) {
    console.error('Error searching hotels:', error);
    res.status(500).json({ message: 'Error searching hotels' });
  }
};

// Book a hotel room
exports.bookHotel = async (req, res) => {
  try {
    const { hotelId, roomType, checkInDate, checkOutDate, numberOfRooms } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const room = hotel.rooms.find(r => r.type === roomType);
    if (!room) {
      return res.status(404).json({ message: 'Room type not found' });
    }

    if (room.availableRooms < numberOfRooms) {
      return res.status(400).json({ message: 'Not enough rooms available' });
    }

    room.availableRooms -= numberOfRooms;
    await hotel.save();

    res.json({
      message: 'Hotel room booked successfully',
      bookingDetails: {
        hotelId: hotel._id,
        hotelName: hotel.name,
        roomType: room.type,
        numberOfRooms,
        checkInDate,
        checkOutDate,
        totalPrice: room.price * numberOfRooms
      }
    });
  } catch (error) {
    console.error('Error booking hotel:', error);
    res.status(500).json({ message: 'Error booking hotel' });
  }
};

// Get hotel details by ID
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    console.error('Error getting hotel details:', error);
    res.status(500).json({ message: 'Error getting hotel details' });
  }
}; 