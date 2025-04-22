const mongoose = require('mongoose');
const Flight = require('../models/Flight');
require('dotenv').config();

const flights = [
  {
    airline: 'IndiGo',
    flightNumber: 'IN456',
    source: 'Delhi',
    destination: 'Mumbai',
    departureTime: new Date('2024-05-01T10:00:00Z'),
    arrivalTime: new Date('2024-05-01T12:00:00Z'),
    price: 5000,
    availableSeats: 100,
    class: 'economy',
    status: 'scheduled'
  },
  {
    airline: 'Air India',
    flightNumber: 'AI789',
    source: 'Mumbai',
    destination: 'Bangalore',
    departureTime: new Date('2024-05-01T14:00:00Z'),
    arrivalTime: new Date('2024-05-01T16:00:00Z'),
    price: 6000,
    availableSeats: 80,
    class: 'economy',
    status: 'scheduled'
  },
  {
    airline: 'Vistara',
    flightNumber: 'VS234',
    source: 'Bangalore',
    destination: 'Delhi',
    departureTime: new Date('2024-05-01T18:00:00Z'),
    arrivalTime: new Date('2024-05-01T20:00:00Z'),
    price: 7500,
    availableSeats: 60,
    class: 'business',
    status: 'scheduled'
  },
  {
    airline: 'SpiceJet',
    flightNumber: 'SJ567',
    source: 'Delhi',
    destination: 'Goa',
    departureTime: new Date('2024-05-01T08:00:00Z'),
    arrivalTime: new Date('2024-05-01T11:00:00Z'),
    price: 4500,
    availableSeats: 120,
    class: 'economy',
    status: 'scheduled'
  },
  {
    airline: 'Air India',
    flightNumber: 'AI999',
    source: 'Mumbai',
    destination: 'Goa',
    departureTime: new Date('2024-05-01T09:00:00Z'),
    arrivalTime: new Date('2024-05-01T10:30:00Z'),
    price: 8000,
    availableSeats: 40,
    class: 'first',
    status: 'scheduled'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flight-service');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Flight.deleteMany({});
    console.log('Cleared existing flights');

    // Insert new data
    const result = await Flight.insertMany(flights);
    console.log(`Added ${result.length} flights to the database`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 