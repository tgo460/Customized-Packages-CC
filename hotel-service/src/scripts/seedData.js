const mongoose = require('mongoose');
const Hotel = require('../models/Hotel');
require('dotenv').config();

const hotels = [
  {
    name: 'Taj Palace',
    location: 'Delhi',
    rating: 5,
    description: 'Luxury hotel in the heart of Delhi',
    rooms: [
      {
        type: 'standard',
        price: 5000,
        capacity: 2,
        availableRooms: 20,
        amenities: ['WiFi', 'TV', 'Air Conditioning']
      },
      {
        type: 'deluxe',
        price: 8000,
        capacity: 3,
        availableRooms: 15,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar']
      },
      {
        type: 'suite',
        price: 12000,
        capacity: 4,
        availableRooms: 10,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi']
      }
    ],
    amenities: ['Swimming Pool', 'Spa', 'Gym', 'Restaurant'],
    status: 'active'
  },
  {
    name: 'Marriott',
    location: 'Mumbai',
    rating: 5,
    description: 'Beachfront luxury hotel',
    rooms: [
      {
        type: 'standard',
        price: 6000,
        capacity: 2,
        availableRooms: 25,
        amenities: ['WiFi', 'TV', 'Air Conditioning']
      },
      {
        type: 'deluxe',
        price: 9000,
        capacity: 3,
        availableRooms: 20,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Ocean View']
      }
    ],
    amenities: ['Beach Access', 'Pool', 'Spa'],
    status: 'active'
  },
  {
    name: 'The Leela Palace',
    location: 'Bangalore',
    rating: 5,
    description: 'Luxury business hotel',
    rooms: [
      {
        type: 'deluxe',
        price: 7000,
        capacity: 2,
        availableRooms: 30,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Work Desk']
      },
      {
        type: 'suite',
        price: 15000,
        capacity: 4,
        availableRooms: 10,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'Living Room']
      }
    ],
    amenities: ['Business Center', 'Conference Rooms', 'Restaurant'],
    status: 'active'
  },
  {
    name: 'Resort Rio',
    location: 'Goa',
    rating: 4,
    description: 'Beachside resort with multiple activities',
    rooms: [
      {
        type: 'standard',
        price: 4000,
        capacity: 2,
        availableRooms: 40,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Balcony']
      },
      {
        type: 'deluxe',
        price: 6000,
        capacity: 3,
        availableRooms: 25,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Sea View']
      },
      {
        type: 'presidential',
        price: 20000,
        capacity: 6,
        availableRooms: 2,
        amenities: ['WiFi', 'TV', 'Air Conditioning', 'Private Pool', 'Butler Service']
      }
    ],
    amenities: ['Beach Access', 'Water Sports', 'Multiple Restaurants'],
    status: 'active'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-service');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Hotel.deleteMany({});
    console.log('Cleared existing hotels');

    // Insert new data
    const result = await Hotel.insertMany(hotels);
    console.log(`Added ${result.length} hotels to the database`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 