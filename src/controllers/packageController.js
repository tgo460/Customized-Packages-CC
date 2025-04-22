const axios = require('axios');
const logger = require('../utils/logger');

const FLIGHT_SERVICE_URL = process.env.FLIGHT_SERVICE_URL || 'http://localhost:3001';
const HOTEL_SERVICE_URL = process.env.HOTEL_SERVICE_URL || 'http://localhost:3002';
const BUS_SERVICE_URL = process.env.BUS_SERVICE_URL || 'http://localhost:3003';

class PackageController {
  async searchPackages(searchCriteria) {
    try {
      // Fetch options from all services in parallel
      const [flights, hotels, buses] = await Promise.all([
        this.searchFlights(searchCriteria),
        this.searchHotels(searchCriteria),
        this.searchBuses(searchCriteria)
      ]);

      // Combine options into packages
      return this.createPackages(flights, hotels, buses, searchCriteria.budget);
    } catch (error) {
      logger.error('Error in searchPackages:', error);
      throw error;
    }
  }

  async searchFlights(criteria) {
    try {
      const response = await axios.post(`${FLIGHT_SERVICE_URL}/flights/search`, {
        source: criteria.source,
        destination: criteria.destination,
        departureDate: criteria.departureDate,
        class: criteria.preferences?.flightClass
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching flights:', error);
      return [];
    }
  }

  async searchHotels(criteria) {
    try {
      const response = await axios.post(`${HOTEL_SERVICE_URL}/hotels/search`, {
        location: criteria.destination,
        checkInDate: criteria.departureDate,
        rating: criteria.preferences?.hotelRating
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching hotels:', error);
      return [];
    }
  }

  async searchBuses(criteria) {
    try {
      const response = await axios.post(`${BUS_SERVICE_URL}/buses/search`, {
        source: criteria.source,
        destination: criteria.destination,
        departureDate: criteria.departureDate,
        busType: criteria.preferences?.busType
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching buses:', error);
      return [];
    }
  }

  createPackages(flights, hotels, buses, budget) {
    const packages = [];
    
    // Create combinations that fit within budget
    for (const flight of flights) {
      for (const hotel of hotels) {
        for (const bus of buses) {
          const totalPrice = flight.price + hotel.price + bus.price;
          
          if (totalPrice <= budget) {
            packages.push({
              packageId: `PKG${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              totalPrice,
              flight,
              hotel,
              bus
            });
          }
        }
      }
    }

    // Sort packages by total price
    return packages.sort((a, b) => a.totalPrice - b.totalPrice);
  }

  async bookPackage(packageId) {
    try {
      // In a real implementation, this would:
      // 1. Fetch the package details
      // 2. Book each component (flight, hotel, bus)
      // 3. Handle failures using Saga pattern
      // 4. Send booking confirmation via Kafka
      
      return {
        bookingId: `BK${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        packageId,
        status: 'confirmed',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error in bookPackage:', error);
      throw error;
    }
  }
}

module.exports = new PackageController(); 