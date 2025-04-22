const mongoose = require('mongoose');
const Bus = require('../models/Bus');
require('dotenv').config();

// Helper function to generate seat numbers
const generateSeats = (totalSeats) => {
  const seats = [];
  const rows = Math.ceil(totalSeats / 4); // 4 seats per row (2+2)
  
  for (let row = 1; row <= rows; row++) {
    for (let pos of ['A', 'B', 'C', 'D']) {
      if (seats.length < totalSeats) {
        seats.push({
          number: `${row}${pos}`,
          type: pos === 'A' || pos === 'D' ? 'window' : 'aisle',
          isAvailable: true
        });
      }
    }
  }
  return seats;
};

const buses = [
  {
    operator: 'VRL Travels',
    busNumber: 'VRL123',
    source: 'Delhi',
    destination: 'Mumbai',
    departureTime: new Date('2024-05-01T20:00:00Z'),
    arrivalTime: new Date('2024-05-02T10:00:00Z'),
    price: 1200,
    busType: 'AC',
    totalSeats: 40,
    availableSeats: 40,
    seats: generateSeats(40),
    amenities: ['WiFi', 'USB Charging', 'Blanket'],
    status: 'scheduled'
  },
  {
    operator: 'SRS Travels',
    busNumber: 'SRS456',
    source: 'Mumbai',
    destination: 'Bangalore',
    departureTime: new Date('2024-05-01T18:00:00Z'),
    arrivalTime: new Date('2024-05-02T08:00:00Z'),
    price: 1500,
    busType: 'AC',
    totalSeats: 36,
    availableSeats: 36,
    seats: generateSeats(36),
    amenities: ['WiFi', 'Entertainment System', 'Snacks'],
    status: 'scheduled'
  },
  {
    operator: 'Orange Travels',
    busNumber: 'OT789',
    source: 'Bangalore',
    destination: 'Goa',
    departureTime: new Date('2024-05-01T19:00:00Z'),
    arrivalTime: new Date('2024-05-02T06:00:00Z'),
    price: 1000,
    busType: 'Non-AC',
    totalSeats: 44,
    availableSeats: 44,
    seats: generateSeats(44),
    amenities: ['Water Bottle'],
    status: 'scheduled'
  },
  {
    operator: 'Volvo Express',
    busNumber: 'VE101',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: new Date('2024-05-01T16:00:00Z'),
    arrivalTime: new Date('2024-05-02T14:00:00Z'),
    price: 2000,
    busType: 'Sleeper',
    totalSeats: 30,
    availableSeats: 30,
    seats: generateSeats(30).map(seat => ({ ...seat, type: 'sleeper' })),
    amenities: ['WiFi', 'Blanket', 'Pillow', 'Charging Point'],
    status: 'scheduled'
  },
  {
    operator: 'Royal Cruiser',
    busNumber: 'RC202',
    source: 'Mumbai',
    destination: 'Goa',
    departureTime: new Date('2024-05-01T21:00:00Z'),
    arrivalTime: new Date('2024-05-02T05:00:00Z'),
    price: 1800,
    busType: 'Deluxe',
    totalSeats: 32,
    availableSeats: 32,
    seats: generateSeats(32),
    amenities: ['WiFi', 'Entertainment', 'Meal', 'Charging Point'],
    status: 'scheduled'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bus-service');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Bus.deleteMany({});
    console.log('Cleared existing buses');

    // Insert new data
    const result = await Bus.insertMany(buses);
    console.log(`Added ${result.length} buses to the database`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 