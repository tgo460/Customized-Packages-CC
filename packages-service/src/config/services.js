const services = {
  flight: {
    baseUrl: process.env.FLIGHT_SERVICE_URL || 'http://localhost:3000/api/flights',
    endpoints: {
      search: '/search',
      book: '/book',
      details: '/'
    }
  },
  hotel: {
    baseUrl: process.env.HOTEL_SERVICE_URL || 'http://localhost:3000/api/hotels',
    endpoints: {
      search: '/search',
      book: '/book',
      details: '/'
    }
  },
  bus: {
    baseUrl: process.env.BUS_SERVICE_URL || 'http://localhost:3000/api/buses',
    endpoints: {
      search: '/search',
      book: '/book',
      details: '/'
    }
  }
};

module.exports = services; 