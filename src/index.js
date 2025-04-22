require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Kafka } = require('kafkajs');
const packageRoutes = require('./routes/packageRoutes');
const flightRoutes = require('./mocks/flightService');
const hotelRoutes = require('./mocks/hotelService');
const busRoutes = require('./mocks/busService');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/packages', packageRoutes);
app.use('/flights', flightRoutes);
app.use('/hotels', hotelRoutes);
app.use('/buses', busRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info('Mock services available at:');
  logger.info('- Flights: /flights');
  logger.info('- Hotels: /hotels');
  logger.info('- Buses: /buses');
}); 